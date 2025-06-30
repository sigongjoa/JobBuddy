export interface Interview {
  id: number;
  company: string;
  role: string;
  applicationDate: string;
  interviewDate: string;
  interviewTime?: string; // 면접 시간은 선택적일 수 있습니다.
  type: string;
  status: string;
  notes?: string; // 메모는 선택적일 수 있습니다.
  nextAction?: string; // 다음 조치도 선택적일 수 있습니다.
  feedback?: string; // 피드백도 선택적일 수 있습니다.
}

export interface RecentActivityItem {
  id: string; // 고유 ID
  type: 'CrewAI Research' | 'Interview' | 'Company Research'; // 활동 유형
  description: string; // 활동에 대한 간략한 설명 (예: AI 목표)
  resultSummary?: string; // 활동 결과 요약 (선택 사항)
  timestamp: string; // 활동 시간 (ISO 문자열)
} 