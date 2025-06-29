import { Activity, Plus, Edit, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const recentActivities = [
  {
    id: 1,
    action: "새 회사 추가",
    target: "DataFlow Systems",
    time: "2시간 전",
    icon: Plus,
  },
  {
    id: 2,
    action: "포트폴리오 프로젝트 업데이트",
    target: "E-commerce Dashboard",
    time: "5시간 전",
    icon: Edit,
  },
  {
    id: 3,
    action: "회사 조사",
    target: "CloudTech Solutions",
    time: "1일 전",
    icon: Eye,
  },
  {
    id: 4,
    action: "면접 일정 잡기",
    target: "TechCorp - Technical Round",
    time: "2일 전",
    icon: Plus,
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          최근 활동
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivities.map((activity) => (
          <div key={activity.id} className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
              <activity.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">{activity.action}</span>{" "}
                <span className="text-muted-foreground">{activity.target}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
