'use client';

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { RecentActivityItem } from "@/lib/types";

// 타입 정의
interface AgentDefinition {
  id: number;
  role: string;
  goal: string;
  backstory: string;
  allow_delegation: boolean;
  instruction: string;
}

interface TaskDefinition {
  id: number;
  description: string;
  expected_output: string;
  agents: AgentDefinition[];
  async_execution?: boolean; // 선택적 속성으로 추가
}

interface CrewRequestPayload {
  objective: string;
  context: string;
  max_iterations: number;
  async_execution: boolean;
  tasks: TaskDefinition[];
}

export default function CrewAIPage() {
  console.debug("CrewAIPage: function entry");
  // State for AI Deep Research
  const [aiObjective, setAiObjective] = useState("");
  const [aiContext, setAiContext] = useState("");
  const [tasks, setTasks] = useState<TaskDefinition[]>([
    {
      id: 1,
      description: "",
      expected_output: "",
      agents: [
        {
          id: 1,
          role: "",
          goal: "",
          backstory: "",
          allow_delegation: false,
          instruction: "",
        },
      ],
    },
  ]);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [aiStatus, setAiStatus] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiLogs, setAiLogs] = useState<string[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Constants
  const PYTHON_API_BASE_URL = process.env.NEXT_PUBLIC_PYTHON_API_BASE_URL || "http://localhost:8000";

  useEffect(() => {
    console.debug("CrewAIPage: useEffect for logsEndRef entry");
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    console.debug("CrewAIPage: useEffect for logsEndRef exit");
  }, [aiLogs]);

  // Function to handle task changes
  const handleTaskChange = (taskIndex: number, field: keyof TaskDefinition, value: string) => {
    console.debug("handleTaskChange: function entry");
    setTasks(prevTasks => {
      const newTasks = [...prevTasks];
      (newTasks[taskIndex] as any)[field] = value;
      console.debug("handleTaskChange: newTasks", newTasks);
      return newTasks;
    });
    console.debug("handleTaskChange: function exit");
  };

  // Function to handle agent changes
  const handleAgentChange = (
    taskIndex: number,
    agentIndex: number,
    field: keyof AgentDefinition,
    value: string | boolean
  ) => {
    console.debug("handleAgentChange: function entry");
    setTasks(prevTasks => {
      const newTasks = [...prevTasks];
      (newTasks[taskIndex].agents[agentIndex] as any)[field] = value;
      console.debug("handleAgentChange: newTasks", newTasks);
      return newTasks;
    });
    console.debug("handleAgentChange: function exit");
  };

  // Function to add a new task
  const addTask = () => {
    console.debug("addTask: function entry");
    setTasks(prevTasks => {
      const newId = prevTasks.length ? Math.max(...prevTasks.map(t => t.id)) + 1 : 1;
      const newTasks = [
        ...prevTasks,
        {
          id: newId,
          description: "",
          expected_output: "",
          agents: [],
        },
      ];
      console.debug("addTask: newTasks", newTasks);
      return newTasks;
    });
    console.debug("addTask: function exit");
  };

  // Function to remove a task
  const removeTask = (taskIndex: number) => {
    console.debug("removeTask: function entry");
    setTasks(prevTasks => {
      const newTasks = prevTasks.filter((_, i) => i !== taskIndex);
      console.debug("removeTask: newTasks", newTasks);
      return newTasks;
    });
    console.debug("removeTask: function exit");
  };

  // Function to add a new agent to a specific task
  const addAgent = (taskIndex: number) => {
    console.debug("addAgent: function entry");
    setTasks(prevTasks => {
      const newTasks = [...prevTasks];
      const newAgentId = newTasks[taskIndex].agents.length
        ? Math.max(...newTasks[taskIndex].agents.map(a => a.id)) + 1
        : 1;
      newTasks[taskIndex].agents.push({
        id: newAgentId,
        role: "",
        goal: "",
        backstory: "",
        allow_delegation: false,
        instruction: "",
      });
      console.debug("addAgent: newTasks", newTasks);
      return newTasks;
    });
    console.debug("addAgent: function exit");
  };

  // Function to remove an agent from a specific task
  const removeAgent = (taskIndex: number, agentIndex: number) => {
    console.debug("removeAgent: function entry");
    setTasks(prevTasks => {
      const newTasks = [...prevTasks];
      newTasks[taskIndex].agents = newTasks[taskIndex].agents.filter(
        (_, i) => i !== agentIndex
      );
      console.debug("removeAgent: newTasks", newTasks);
      return newTasks;
    });
    console.debug("removeAgent: function exit");
  };

  // Function to load example data
  const loadExample = async () => {
    console.debug("loadExample: function entry");
    try {
      const response = await fetch("/data/default_crew_task.json");
      console.debug(`loadExample: fetch 응답 상태: ${response.status}`);
      const data: CrewRequestPayload = await response.json();
      setAiObjective(data.objective || "");
      setAiContext(data.context || "");
      setTasks(data.tasks || []);
      console.debug("loadExample: 예제 데이터 로드 완료", data);
    } catch (error) {
      console.error("loadExample: 예제 데이터 로드 중 에러 발생", error);
      setAiError("예제 데이터를 로드하는 데 실패했습니다.");
    }
    console.debug("loadExample: function exit");
  };

  // Function to start AI Deep Research
  const startDeepResearch = async (e: React.MouseEvent) => {
    console.debug("startDeepResearch: function entry");
    e.preventDefault();
    setAiLoading(true);
    setAiError(null);
    setAiStatus("시작 중...");
    setAiResult(null);
    setAiLogs([]);

    if (!aiObjective.trim()) {
      setAiError("리서치 목표를 입력해주세요.");
      setAiLoading(false);
      console.debug("startDeepResearch: 리서치 목표 누락");
      return;
    }

    // Construct CrewRequest payload from state
    const crewRequestPayload: CrewRequestPayload = {
      objective: aiObjective,
      context: aiContext,
      max_iterations: 3,
      async_execution: true,
      tasks: tasks.map(task => ({
        id: task.id,
        description: task.description,
        expected_output: task.expected_output,
        async_execution: false,
        agents: task.agents.map((agent, idx) => ({
          id: agent.id ?? idx,
          role: agent.role,
          goal: agent.goal,
          backstory: agent.backstory,
          allow_delegation: agent.allow_delegation,
          instruction: agent.instruction,
        })),
      })),
    };
    console.debug("startDeepResearch: crewRequestPayload", crewRequestPayload);

    try {
      const response = await fetch('/api/deep-research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(crewRequestPayload),
      });
      console.debug(`startDeepResearch: POST 응답 상태: ${response.status}`);

      const data = await response.json();
      if (response.ok) {
        setTaskId(data.task_id);
        setAiStatus("작업 시작됨");
        console.log("Deep Research 작업 시작됨, Task ID:", data.task_id);
        console.debug("startDeepResearch: POST 성공, Task ID 설정 완료");
      } else {
        setAiError(data.details ? data.details.map((d: any) => `${d.loc.join('.')}: ${d.msg}`).join('\n') : "알 수 없는 에러 발생");
        setAiStatus("실패");
        console.error("startDeepResearch: POST 실패", data);
      }
    } catch (error: any) {
      setAiError(error.message || "네트워크 에러 발생");
      setAiStatus("실패");
      console.error("startDeepResearch: API 호출 중 에러 발생", error);
    } finally {
      setAiLoading(false);
      console.debug("startDeepResearch: function exit");
    }
  };

  // Effect for real-time log streaming
  useEffect(() => {
    console.debug("useEffect for log streaming: function entry");
    if (taskId) {
      const eventSource = new EventSource(`${PYTHON_API_BASE_URL}/crew/tasks/${taskId}/logs`);
      console.debug(`useEffect for log streaming: EventSource created with URL: ${PYTHON_API_BASE_URL}/crew/tasks/${taskId}/logs`);

      eventSource.onmessage = (event) => {
        console.debug("EventSource onmessage: data received", event.data);
        const parsedData = JSON.parse(event.data);
        setAiLogs((prevLogs) => [...prevLogs, parsedData.log]);
      };

      eventSource.onerror = (error) => {
        console.error("EventSource error:", error);
        eventSource.close();
        console.debug("EventSource onerror: connection closed");
      };

      eventSource.onopen = () => {
        console.log("EventSource connection opened.");
        console.debug("EventSource onopen: connection opened");
      };

      return () => {
        eventSource.close();
        console.log("EventSource connection closed.");
        console.debug("useEffect for log streaming: cleanup - connection closed");
      };
    }
    console.debug("useEffect for log streaming: function exit");
  }, [taskId, PYTHON_API_BASE_URL]);

  // Function to check AI Deep Research status
  const checkResearchStatus = async (e: React.MouseEvent) => {
    console.debug("checkResearchStatus: function entry");
    e.preventDefault();
    if (!taskId) {
      setAiError("시작된 태스크가 없습니다.");
      console.debug("checkResearchStatus: 태스크 ID 없음");
      return;
    }

    setAiLoading(true);
    setAiError(null);
    setAiStatus("조사결과 확인 중...");
    setAiResult(null);

    try {
      const response = await fetch(`/api/deep-research?taskId=${taskId}`);
      console.debug(`checkResearchStatus: GET 응답 상태: ${response.status}`);

      const data = await response.json();
      if (response.ok) {
        setAiStatus(data.status);
        if (data.status === "completed") {
          setAiResult(data.result);
          console.debug("checkResearchStatus: 작업 완료, 결과 수신");

          // Save to localStorage
          console.debug("checkResearchStatus: localStorage에 결과 저장 시도");
          try {
            const existingActivities = JSON.parse(localStorage.getItem('recentActivities') || '[]');
            const newActivity: RecentActivityItem = {
              id: taskId,
              type: 'CrewAI Research',
              description: aiObjective,
              resultSummary: data.result.substring(0, 100) + '...', // 첫 100자만 저장
              timestamp: new Date().toISOString(),
            };
            const updatedActivities = [newActivity, ...existingActivities.slice(0, 9)]; // 최대 10개 유지
            localStorage.setItem('recentActivities', JSON.stringify(updatedActivities));
            console.debug("checkResearchStatus: localStorage에 결과 저장 완료", newActivity);
          } catch (storageError) {
            console.error("checkResearchStatus: localStorage 저장 중 오류 발생", storageError);
          }

        } else if (data.status === "failed") {
          setAiError(data.result || "작업 실패");
          console.debug("checkResearchStatus: 작업 실패");
        }
        console.log(`Task ID ${taskId} 상태: ${data.status}`);
      } else {
        setAiError(data.details || "알 수 없는 에러 발생");
        setAiStatus("조사결과 확인 실패");
        console.error("checkResearchStatus: GET 실패", data);
      }
    } catch (error: any) {
      setAiError(error.message || "네트워크 에러 발생");
      setAiStatus("실패");
      console.error("checkResearchStatus: API 호출 중 에러 발생", error);
    } finally {
      setAiLoading(false);
      console.debug("checkResearchStatus: function exit");
    }
  };

  // Function to export AI Deep Research result
  const exportResult = () => {
    console.debug("exportResult: function entry");
    if (aiResult) {
      const blob = new Blob([aiResult], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `crewai_research_result_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.debug("exportResult: 결과 파일 다운로드 시작");
    } else {
      console.debug("exportResult: 내보낼 결과가 없습니다.");
    }
    console.debug("exportResult: function exit");
  };

  console.debug("CrewAIPage: function exit");
  return (
    <div className="container mx-auto p-4 md:p-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">AI 딥 리서치</CardTitle>
          <CardDescription className="text-center">CrewAI를 활용하여 심층 리서치 작업을 수행합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold border-b pb-2">작업 정의</h2>
              <Button onClick={loadExample} className="mb-4 w-full">예제 데이터 로드</Button>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="aiObjective">리서치 목표</Label>
                  <Textarea
                    id="aiObjective"
                    value={aiObjective}
                    onChange={(e) => setAiObjective(e.target.value)}
                    placeholder="예: 회사의 최신 기술 스택 및 채용 동향 파악"
                    rows={4}
                    className="resize-y"
                  />
                </div>
                <div>
                  <Label htmlFor="aiContext">추가 상황/배경 (선택 사항)</Label>
                  <Textarea
                    id="aiContext"
                    value={aiContext}
                    onChange={(e) => setAiContext(e.target.value)}
                    placeholder="예: 특정 시장의 경쟁사 분석에 집중"
                    rows={3}
                    className="resize-y"
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <h3 className="text-xl font-semibold border-b pb-2">태스크 정의</h3>
              {tasks.map((task, taskIndex) => (
                <Card key={task.id} className="mb-4 p-4 space-y-4 shadow-sm">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium">태스크 #{taskIndex + 1}</h4>
                    {taskIndex > 0 && (
                      <Button variant="destructive" size="sm" onClick={() => removeTask(taskIndex)}>삭제</Button>
                    )}
                  </div>
                  <div>
                    <Label htmlFor={`task-description-${taskIndex}`}>설명</Label>
                    <Textarea
                      id={`task-description-${taskIndex}`}
                      value={task.description}
                      onChange={(e) => handleTaskChange(taskIndex, 'description', e.target.value)}
                      placeholder={`여기에 태스크 설명을 입력하세요. 예: '{objective}에 대한 심층 연구 수행', 여기서 {objective}는 CrewRequest의 objective로 채워집니다.`}
                      rows={5}
                      className="resize-y"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`task-expected-output-${taskIndex}`}>예상 출력</Label>
                    <Textarea
                      id={`task-expected-output-${taskIndex}`}
                      value={task.expected_output}
                      onChange={(e) => handleTaskChange(taskIndex, 'expected_output', e.target.value)}
                      placeholder="여기에 태스크의 예상 출력 형식을 입력하세요."
                      rows={3}
                      className="resize-y"
                    />
                  </div>

                  <Separator className="my-4" />

                  <h5 className="text-md font-semibold mb-2">에이전트 정의</h5>
                  {task.agents.map((agent, agentIndex) => (
                    <Card key={agent.id} className="mb-3 p-3 space-y-3 bg-gray-50 dark:bg-gray-800 shadow-inner">
                      <div className="flex justify-between items-center">
                        <h6 className="text-base font-medium">에이전트 #{agentIndex + 1}</h6>
                        <Button variant="destructive" size="sm" onClick={() => removeAgent(taskIndex, agentIndex)}>삭제</Button>
                      </div>
                      <div>
                        <Label htmlFor={`agent-role-${taskIndex}-${agentIndex}`}>역할</Label>
                        <Input
                          id={`agent-role-${taskIndex}-${agentIndex}`}
                          type="text"
                          value={agent.role}
                          onChange={(e) => handleAgentChange(taskIndex, agentIndex, 'role', e.target.value)}
                          placeholder="예: Researcher"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`agent-goal-${taskIndex}-${agentIndex}`}>목표</Label>
                        <Textarea
                          id={`agent-goal-${taskIndex}-${agentIndex}`}
                          value={agent.goal}
                          onChange={(e) => handleAgentChange(taskIndex, agentIndex, 'goal', e.target.value)}
                          placeholder="예: 특정 주제에 대한 심층 정보 검색 및 분석"
                          rows={3}
                          className="resize-y"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`agent-backstory-${taskIndex}-${agentIndex}`}>배경 이야기</Label>
                        <Textarea
                          id={`agent-backstory-${taskIndex}-${agentIndex}`}
                          value={agent.backstory}
                          onChange={(e) => handleAgentChange(taskIndex, agentIndex, 'backstory', e.target.value)}
                          placeholder="예: 정보 검색 및 분석에 탁월한 숙련된 연구원입니다."
                          rows={3}
                          className="resize-y"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`agent-instruction-${taskIndex}-${agentIndex}`}>지침 (선택 사항)</Label>
                        <Textarea
                          id={`agent-instruction-${taskIndex}-${agentIndex}`}
                          value={agent.instruction}
                          onChange={(e) => handleAgentChange(taskIndex, agentIndex, 'instruction', e.target.value)}
                          placeholder="예: 관련 데이터를 꼼꼼히 조사하고 종합하여 실행 가능한 통찰력을 제공합니다."
                          rows={3}
                          className="resize-y"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`allow-delegation-${taskIndex}-${agentIndex}`}
                          checked={agent.allow_delegation}
                          onCheckedChange={(checked) => handleAgentChange(taskIndex, agentIndex, 'allow_delegation', checked)}
                        />
                        <label
                          htmlFor={`allow-delegation-${taskIndex}-${agentIndex}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          다른 에이전트에 위임 허용
                        </label>
                      </div>
                    </Card>
                  ))}
                  <Button onClick={() => addAgent(taskIndex)} className="w-full mt-2">에이전트 추가</Button>
                </Card>
              ))}
              <Button onClick={addTask} className="w-full mt-4">새 태스크 추가</Button>
              
              <Separator className="my-6" />

              <div className="flex gap-2 justify-end">
                <Button onClick={startDeepResearch} disabled={aiLoading || !aiObjective.trim()}>
                  {aiLoading && !taskId ? "시작 중..." : "딥 리서치 시작"}
                </Button>
                <Button onClick={checkResearchStatus} disabled={aiLoading || !taskId}>
                  {aiLoading && taskId ? "조사결과 확인 중..." : "조사결과 확인"}
                </Button>
              </div>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold border-b pb-2">조사 결과</h2>
              {taskId && (
                <div className="space-y-4">
                  <div className="space-y-2 p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
                    <p className="text-sm font-medium"><strong>Task ID:</strong> <span className="font-normal break-all">{taskId}</span></p>
                    <p className="text-sm font-medium"><strong>현재 상태:</strong> <span className="font-normal">{aiStatus}</span></p>
                    {aiError && (
                      <p className="text-red-500 text-sm mt-2 font-medium">오류: <span className="font-normal">{aiError}</span></p>
                    )}
                    {aiResult && (
                      <div className="space-y-2 mt-4">
                        <p className="text-sm font-medium"><strong>최종 결과:</strong></p>
                        <ScrollArea className="h-64 w-full rounded-md border p-4 bg-white dark:bg-gray-950">
                          <p className="text-sm whitespace-pre-wrap font-mono text-gray-800 dark:text-gray-200">
                            {aiResult}
                          </p>
                        </ScrollArea>
                        <Button onClick={exportResult} className="w-full mt-4">조사 결과 내보내기</Button>
                      </div>
                    )}
                  </div>

                  {aiLogs.length > 0 && (
                    <div className="space-y-2 mt-4 p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
                      <p className="text-sm font-medium"><strong>로그:</strong></p>
                      <ScrollArea className="h-64 w-full rounded-md border p-4 bg-white dark:bg-gray-950">
                        {aiLogs.map((log, index) => (
                          <p key={index} className="text-sm whitespace-pre-wrap font-mono text-gray-800 dark:text-gray-200 leading-tight">
                            {log}
                          </p>
                        ))}
                        <div ref={logsEndRef} />
                      </ScrollArea>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 