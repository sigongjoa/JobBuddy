"use client"

export const dynamic = "force-dynamic";

import { OverviewStats } from "@/components/dashboard/overview-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UpcomingInterviews } from "@/components/dashboard/upcoming-interviews"
import { useAuth, SignInButton } from "@clerk/nextjs";

export default function DashboardPage() {
  console.debug("DashboardPage: function entry");
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    console.debug("DashboardPage: Clerk not loaded, showing loading state.");
    return <p className="text-muted-foreground mt-4 text-center">인증 정보를 불러오는 중...</p>;
  }

  if (!isSignedIn) {
    console.debug("DashboardPage: User not signed in, showing login prompt.");
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h2 className="text-2xl font-bold mb-4">로그인이 필요합니다</h2>
        <p className="text-muted-foreground mb-6">대시보드에 접근하려면 로그인해주세요.</p>
        <SignInButton mode="modal">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">로그인</button>
        </SignInButton>
      </div>
    );
  }

  console.debug("DashboardPage: User signed in, rendering dashboard content.");
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
