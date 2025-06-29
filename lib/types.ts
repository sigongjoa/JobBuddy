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