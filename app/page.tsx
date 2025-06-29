import { OverviewStats } from "@/components/dashboard/overview-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingInterviews } from "@/components/dashboard/upcoming-interviews"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground">환영합니다! 귀하의 입사 지원 진행 상황에 대한 개요입니다.</p>
      </div>

      <OverviewStats />

      <div className="grid gap-6 md:grid-cols-2">
        <UpcomingInterviews />
        <RecentActivity />
      </div>
    </div>
  )
}
