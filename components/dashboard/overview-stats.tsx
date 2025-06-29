"use client"

import { Calendar, Building2, FolderOpen, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  {
    title: "예정된 면접",
    value: "3",
    description: "다음 7일",
    icon: Calendar,
    color: "text-blue-600",
  },
  {
    title: "조사된 회사",
    value: "12",
    description: "활성 조사",
    icon: Building2,
    color: "text-green-600",
  },
  {
    title: "포트폴리오 프로젝트",
    value: "8",
    description: "2개 업데이트 필요",
    icon: FolderOpen,
    color: "text-purple-600",
  },
  {
    title: "지원율",
    value: "85%",
    description: "응답률",
    icon: TrendingUp,
    color: "text-orange-600",
  },
]

export function OverviewStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
