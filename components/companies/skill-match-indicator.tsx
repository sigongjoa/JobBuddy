"use client"

import { CheckCircle, AlertCircle, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface SkillMatchIndicatorProps {
  percentage: number
}

export function SkillMatchIndicator({ percentage }: SkillMatchIndicatorProps) {
  const getMatchColor = (percent: number) => {
    if (percent >= 80) return "text-green-600"
    if (percent >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getMatchIcon = (percent: number) => {
    if (percent >= 80) return CheckCircle
    if (percent >= 60) return AlertCircle
    return XCircle
  }

  const MatchIcon = getMatchIcon(percentage)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">Skill Match</p>
        <div className="flex items-center gap-1">
          <MatchIcon className={`h-4 w-4 ${getMatchColor(percentage)}`} />
          <span className={`text-sm font-medium ${getMatchColor(percentage)}`}>{percentage}%</span>
        </div>
      </div>
      <Progress value={percentage} className="h-2" />
      <p className="text-xs text-muted-foreground">
        {percentage >= 80 && "Excellent match! You meet most requirements."}
        {percentage >= 60 && percentage < 80 && "Good match with some skill gaps to address."}
        {percentage < 60 && "Consider developing additional skills for this role."}
      </p>
    </div>
  )
}
