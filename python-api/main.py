import logging
import os
from contextlib import asynccontextmanager
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from starlette.responses import StreamingResponse
import json # Import json for sending structured logs

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Load environment variables from .env.local file in the script's directory
env_path = os.path.join(script_dir, '.env.local')
load_dotenv(dotenv_path=env_path)
logger.debug(f"Attempting to load .env.local from: {env_path}")
logger.debug(f"Environment variables loaded. LLM_PROVIDER: {os.getenv('LLM_PROVIDER')}")
logger.debug(f"Environment variables loaded. OPENAI_API_KEY: {os.getenv('OPENAI_API_KEY')}")
logger.debug(f"Environment variables loaded. OPENAI_API_BASE: {os.getenv('OPENAI_API_BASE')}")
logger.debug(f"Environment variables loaded. GOOGLE_API_KEY: {os.getenv('GOOGLE_API_KEY')}")
logger.debug(f"Environment variables loaded. LMSTUDIO_SERVER_URL: {os.getenv('LMSTUDIO_SERVER_URL')}")

from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
from crewai import Agent, Task, Crew
from typing import List, Optional, Literal
import asyncio
from functools import lru_cache

from langchain_openai import ChatOpenAI # For OpenAI and LM Studio
from langchain_google_genai import ChatGoogleGenerativeAI # For Google Generative AI

# Global storage for task-specific log queues
task_log_queues = {}

class QueueHandler(logging.Handler):
    def __init__(self, queue: asyncio.Queue):
        super().__init__()
        self.queue = queue
        self.formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

    def emit(self, record):
        try:
            msg = self.format(record)
            # Use put_nowait to avoid blocking the logging process
            # If the queue is full, logs might be dropped, which is acceptable for streaming
            self.queue.put_nowait(msg)
        except asyncio.QueueFull:
            # Handle full queue, e.g., log a warning or drop the message
            pass
        except Exception:
            self.handleError(record)

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("CrewAI API Service 시작 중")
    yield
    logger.info("CrewAI API Service 종료 중")

app = FastAPI(lifespan=lifespan) # Define app here, associating with lifespan
logger.debug("FastAPI app 인스턴스 초기화 완료")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            # 필요에 따라 허용할 출처 리스트로 제한하세요
    allow_credentials=True,
    allow_methods=["*"],            # GET, POST, OPTIONS 등
    allow_headers=["*"],            # Content-Type, Authorization 등
)

# Default expected output for tasks
DEFAULT_EXPECTED_OUTPUT = "Agent들이 생성한 분석 결과를 최종 요약 텍스트로 반환"

# Define Pydantic models for incoming agent and task configurations
class AgentConfig(BaseModel):
    role: str
    goal: str
    backstory: str
    allow_delegation: bool = False
    instruction: Optional[str] = None # Add instruction field for agent-specific prompts

# This model represents the full task structure sent from the frontend
class FullTaskSchema(BaseModel):
    id: Optional[int] = None # Assuming ID might be sent or generated
    description: str
    agents: List[AgentConfig]
    expected_output: str
    async_execution: bool = False # Default to false

class CrewRequest(BaseModel):
    objective: str
    context: Optional[str] = None
    max_iterations: Optional[int] = 3
    async_execution: Optional[bool] = True
    tasks: Optional[List[FullTaskSchema]] = None # Change from task_definitions to tasks

class CrewResponse(BaseModel):
    task_id: str
    status: str
    result: Optional[str] = None

# In-memory store for task results
task_results = {}

def get_llm():
    logger.debug("get_llm 함수 시작")
    llm_provider = os.getenv("LLM_PROVIDER", "openai").lower() # Default to openai
    logger.debug(f"LLM_PROVIDER 환경 변수: {llm_provider}")
    
    if llm_provider == "openai":
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            logger.error("OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.")
            raise ValueError("OPENAI_API_KEY 환경 변수가 설정되지 않았습니다.")
        llm = ChatOpenAI(api_key=openai_api_key, temperature=0.7)
        logger.debug("OpenAI LLM 초기화 완료")
    elif llm_provider == "lmstudio":
        # LM Studio typically uses an OpenAI-compatible API
        openai_api_base = os.getenv("OPENAI_API_BASE", "http://localhost:1234/v1") # Use OPENAI_API_BASE for consistency with .env.local
        openai_api_key = os.getenv("OPENAI_API_KEY", "lm-studio") # LM Studio doesn't require a real key
        llm = ChatOpenAI(base_url=openai_api_base, api_key=openai_api_key, temperature=0.7)
        logger.debug(f"LM Studio LLM 초기화 완료 (base_url: {openai_api_base})")
    elif llm_provider == "google":
        google_api_key = os.getenv("GOOGLE_API_KEY")
        if not google_api_key:
            logger.error("GOOGLE_API_KEY 환경 변수가 설정되지 않았습니다.")
            raise ValueError("GOOGLE_API_KEY 환경 변수가 설정되지 않았습니다.")
        llm = ChatGoogleGenerativeAI(model="gemini-pro", google_api_key=google_api_key, temperature=0.7)
        logger.debug("Google Generative AI LLM 초기화 완료")
    else:
        logger.error(f"알 수 없는 LLM_PROVIDER: {llm_provider}")
        raise ValueError(f"지원되지 않는 LLM_PROVIDER: {llm_provider}. 'openai', 'lmstudio', 'google' 중 하나를 선택하세요.")
    
    logger.debug("get_llm 함수 종료")
    return llm

@lru_cache()
def get_agents(agent_definitions: Optional[List[AgentConfig]] = None):
    logger.debug("get_agents 함수 시작")
    llm = get_llm() # Get the configured LLM
    logger.debug("LLM 인스턴스 가져오기 완료")
    
    agents_to_return = []
    if agent_definitions:
        logger.debug("동적 에이전트 정의 사용")
        for agent_def in agent_definitions:
            try:
                agent = Agent(
                    role=agent_def.role,
                    goal=agent_def.goal,
                    backstory=agent_def.backstory,
                    allow_delegation=agent_def.allow_delegation,
                    llm=llm
                )
                agents_to_return.append(agent)
                logger.debug(f"동적 에이전트 추가: {agent_def.role}")
            except Exception as ex:
                logger.error(f"Error processing dynamic agent definition: {ex}. Skipping agent.")
    else:
        logger.debug("기본 에이전트 사용")
        researcher = Agent(
            role='Researcher',
            goal='Find and analyze relevant information',
            backstory='Expert at gathering and analyzing information',
            allow_delegation=False,
            llm=llm # Inject the LLM
        )
        logger.debug("Researcher 에이전트 초기화 완료")
        
        writer = Agent(
            role='Writer',
            goal='Create clear and concise content',
            backstory='Expert at creating engaging content',
            allow_delegation=False,
            llm=llm # Inject the LLM
        )
        logger.debug("Writer 에이전트 초기화 완료")
        agents_to_return = [researcher, writer]
    
    logger.debug("get_agents 함수 종료")
    return agents_to_return

async def process_crew_task(task_id: str, crew_request: CrewRequest):
    logger.debug(f"process_crew_task 함수 시작, task_id: {task_id}")
    log_queue = asyncio.Queue()
    task_log_queues[task_id] = log_queue
    queue_handler = QueueHandler(log_queue)
    logger.addHandler(queue_handler)
    try:
        # Initialize agents and tasks based on dynamic definitions if provided
        all_agents = []
        tasks_to_run = []

        if crew_request.tasks:
            logger.debug("동적 FullTaskSchema 정의 사용")
            for full_task_def in crew_request.tasks:
                # Create agents for this specific full task definition
                current_task_agents = []
                llm = get_llm() # Get LLM once per task if needed, or outside this loop
                for agent_def in full_task_def.agents:
                    try:
                        agent = Agent(
                            role=agent_def.role,
                            goal=agent_def.goal,
                            backstory=agent_def.backstory,
                            allow_delegation=agent_def.allow_delegation,
                            llm=llm,
                            # CrewAI Agent does not directly accept 'instruction' as a parameter
                            # The instruction is typically part of the Task description or overall prompt
                        )
                        current_task_agents.append(agent)
                        # Add to all_agents to ensure they are available for the crew
                        # Avoid duplicates if roles are reused across tasks
                        if not any(a.role == agent.role for a in all_agents):
                            all_agents.append(agent)
                        logger.debug(f"동적 에이전트 생성 및 추가: {agent_def.role}")
                    except Exception as ex:
                        logger.error(f"Error processing agent definition within FullTaskSchema: {ex}. Skipping agent.")

                if not current_task_agents:
                    logger.warning(f"No agents defined for task: {full_task_def.description}. Skipping task.")
                    continue

                # Create a single Task for the full task definition
                # The description can incorporate the agent's instruction if needed
                main_task_description = full_task_def.description.format(objective=crew_request.objective)
                # For now, we'll assign the first agent created for this task, 
                # but CrewAI often manages delegation across a list of agents for a single task.
                # More complex delegation within a single task might require custom tools or agents.
                
                # To apply instruction, we might need to include it in task description or define custom tools/tasks
                # For now, we use the main task description.
                task = Task(
                    description=main_task_description,
                    agent=current_task_agents[0], # Assign the first agent. Delegation handles others.
                    expected_output=full_task_def.expected_output,
                    async_execution=full_task_def.async_execution
                )
                tasks_to_run.append(task)
                logger.debug(f"동적 태스크 생성: {full_task_def.description}")
        else:
            logger.debug("기본 에이전트 및 태스크 사용 (FullTaskSchema 없음)")
            # Fallback to default agents and tasks if no task_definitions provided
            all_agents = get_agents() # Use agent_definitions from CrewRequest if available
            if not all_agents:
                all_agents = get_agents() # Fallback to hardcoded defaults

            # Create default tasks
            research_task = Task(
                description=f"Research: {crew_request.objective}",
                agent=all_agents[0] if all_agents else None, # Assign if agents exist
                expected_output=DEFAULT_EXPECTED_OUTPUT
            )
            writing_task = Task(
                description=f"Write content about: {crew_request.objective}",
                agent=all_agents[1] if len(all_agents) > 1 else None, # Assign if second agent exists
                expected_output=DEFAULT_EXPECTED_OUTPUT
            )
            tasks_to_run = [research_task, writing_task]
            
            # Ensure valid agents for default tasks
            if any(t.agent is None for t in tasks_to_run):
                logger.error("Default tasks could not be assigned agents. Check get_agents().")
                raise ValueError("Default tasks could not be assigned agents.")

        if not all_agents and tasks_to_run: # If no agents were collected but tasks exist from FullTaskSchema
            logger.error("No agents were successfully created for the provided task definitions.")
            raise ValueError("No agents could be initialized for the tasks.")

        # Initialize crew with all distinct agents collected and the prepared tasks
        crew = Crew(
            agents=all_agents, # Use all distinct agents collected
            tasks=tasks_to_run,
            max_iterations=crew_request.max_iterations
        )
        logger.debug("Crew 초기화 완료")
        
        # Execute crew tasks (kickoff()는 동기 함수입니다)
        output_obj = crew.kickoff()
        output_str = str(output_obj) # CrewOutput 객체를 문자열로 변환
        logger.debug("Crew 작업 실행 완료")
        
        # Store result
        task_results[task_id] = {
            "status": "completed",
            "result": output_str
        }
        logger.debug(f"process_crew_task 함수 종료 (성공), task_id: {task_id}, 결과: {output_str[:50]}...") # 결과의 일부만 로깅
        
    except Exception as e:
        logger.error(f"Error processing task {task_id}: {str(e)}")
        task_results[task_id] = {
            "status": "failed",
            "result": str(e)
        }
        logger.debug(f"process_crew_task 함수 종료 (실패), task_id: {task_id}, 에러: {str(e)}")
    finally:
        logger.removeHandler(queue_handler)

@app.post("/crew/tasks", response_model=CrewResponse)
async def create_crew_task(
    crew_request: CrewRequest,
    background_tasks: BackgroundTasks
):
    logger.debug("create_crew_task 함수 시작")
    task_id = str(len(task_results) + 1)  # Simple ID generation
    logger.debug(f"새 태스크 ID 생성: {task_id}")
    
    if crew_request.async_execution:
        logger.debug(f"비동기 실행 시작, task_id: {task_id}")
        # Initialize task status
        task_results[task_id] = {
            "status": "processing",
            "result": None
        }
        
        # Schedule task execution
        background_tasks.add_task(
            process_crew_task,
            task_id,
            crew_request
        )
        logger.debug(f"백그라운드 태스크 스케줄링 완료, task_id: {task_id}")
        logger.debug("create_crew_task 함수 종료 (비동기)")
        return CrewResponse(
            task_id=task_id,
            status="processing"
        )
    else:
        logger.debug(f"동기 실행 시작, task_id: {task_id}")
        # Synchronous execution
        await process_crew_task(task_id, crew_request)
        result = task_results[task_id]
        logger.debug(f"동기 실행 완료, task_id: {task_id}, 상태: {result['status']}")
        logger.debug("create_crew_task 함수 종료 (동기)")
        return CrewResponse(
            task_id=task_id,
            status=result["status"],
            result=result["result"]
        )

@app.get("/crew/tasks/{task_id}", response_model=CrewResponse)
async def get_task_status(task_id: str):
    logger.debug(f"태스크 상태 요청됨: {task_id}")
    status = task_results.get(task_id)
    if not status:
        raise HTTPException(status_code=404, detail="Task not found")
    logger.debug(f"태스크 상태 반환: {task_id}, 상태: {status['status']}")
    return CrewResponse(task_id=task_id, status=status['status'], result=status.get("result"))

@app.get("/crew/tasks/{task_id}/logs")
async def get_task_logs(task_id: str):
    logger.debug(f"태스크 로그 스트림 요청됨: {task_id}")
    if task_id not in task_log_queues:
        logger.warning(f"로그 큐를 찾을 수 없음: {task_id}")
        raise HTTPException(status_code=404, detail="Task logs not found")

    async def log_stream_generator():
        log_queue = task_log_queues[task_id]
        while True:
            try:
                log_message = await log_queue.get()
                # Ensure the message is JSON serializable
                yield f"data: {json.dumps({'log': log_message})}\n\n"
            except asyncio.CancelledError:
                logger.info(f"태스크 {task_id} 로그 스트리밍 종료.")
                break
            except Exception as e:
                logger.error(f"로그 스트림 중 오류 발생 (task_id: {task_id}): {e}")
                break

    return StreamingResponse(log_stream_generator(), media_type="text/event-stream")

logger.debug(f"Attempting to load .env.local from: {env_path}")

logger.debug(f"Environment variables loaded. LLM_PROVIDER: {os.getenv('LLM_PROVIDER')}")
logger.debug(f"Environment variables loaded. OPENAI_API_KEY: {os.getenv('OPENAI_API_KEY')}")
logger.debug(f"Environment variables loaded. OPENAI_API_BASE: {os.getenv('OPENAI_API_BASE')}")
logger.debug(f"Environment variables loaded. GOOGLE_API_KEY: {os.getenv('GOOGLE_API_KEY')}")
logger.debug(f"Environment variables loaded. LMSTUDIO_SERVER_URL: {os.getenv('LMSTUDIO_SERVER_URL')}") 