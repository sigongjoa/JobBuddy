import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    console.debug('POST /api/deep-research 호출 시작');

    try {
        const { objective, context } = await request.json();
        console.debug(`요청 본문 수신: objective=${objective}, context=${context}`);

        // TODO: Replace with your deployed Python FastAPI service URL
        const PYTHON_API_BASE_URL = process.env.PYTHON_API_BASE_URL || 'http://localhost:8000';
        const CREATE_TASK_URL = `${PYTHON_API_BASE_URL}/crew/tasks`;

        console.debug(`Python API 호출 URL: ${CREATE_TASK_URL}`);

        const response = await fetch(CREATE_TASK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ objective, context, async_execution: true }), // 비동기 실행 요청
        });
        console.debug(`Python API 응답 상태: ${response.status}`);

        if (!response.ok) {
            const errorData = await response.text();
            console.error(`Python API 호출 실패: ${response.status} - ${errorData}`);
            return NextResponse.json({ error: 'Failed to initiate CrewAI task', details: errorData }, { status: response.status });
        }

        const data = await response.json();
        console.debug(`Python API 응답 데이터 수신: ${JSON.stringify(data)}`);

        // Python API에서 반환된 task_id를 클라이언트에 반환
        console.debug(`POST /api/deep-research 호출 종료 (성공), task_id: ${data.task_id}`);
        return NextResponse.json(data, { status: 202 }); // 202 Accepted
    } catch (error: any) {
        console.error(`API Route 에러 발생: ${error.message}`);
        console.debug(`POST /api/deep-research 호출 종료 (실패)`);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
}

export async function GET(request: Request) {
    console.debug('GET /api/deep-research 호출 시작');
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    console.debug(`태스크 ID 수신: ${taskId}`);

    if (!taskId) {
        console.debug('태스크 ID 누락, 400 Bad Request 반환');
        return NextResponse.json({ error: 'Task ID is required' }, { status: 400 });
    }

    try {
        // TODO: Replace with your deployed Python FastAPI service URL
        const PYTHON_API_BASE_URL = process.env.PYTHON_API_BASE_URL || 'http://localhost:8000';
        const GET_TASK_STATUS_URL = `${PYTHON_API_BASE_URL}/crew/tasks/${taskId}`;

        console.debug(`Python API 상태 확인 호출 URL: ${GET_TASK_STATUS_URL}`);
        const response = await fetch(GET_TASK_STATUS_URL);
        console.debug(`Python API 응답 상태: ${response.status}`);

        if (!response.ok) {
            const errorData = await response.text();
            console.error(`Python API 상태 확인 실패: ${response.status} - ${errorData}`);
            return NextResponse.json({ error: 'Failed to fetch CrewAI task status', details: errorData }, { status: response.status });
        }

        const data = await response.json();
        console.debug(`Python API 상태 응답 데이터 수신: ${JSON.stringify(data)}`);
        console.debug(`GET /api/deep-research 호출 종료 (성공), task_id: ${taskId}, 상태: ${data.status}`);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error(`API Route 에러 발생: ${error.message}`);
        console.debug(`GET /api/deep-research 호출 종료 (실패)`);
        return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
    }
} 