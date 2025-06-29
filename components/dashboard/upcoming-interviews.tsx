import { Calendar, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const upcomingInterviews = [
  {
    id: 1,
    company: "TechCorp",
    role: "Senior Frontend Developer",
    date: "내일",
    time: "2:00 PM",
    type: "기술",
    location: "화상 통화",
  },
  {
    id: 2,
    company: "StartupXYZ",
    role: "Full Stack Engineer",
    date: "금요일",
    time: "10:00 AM",
    type: "행동",
    location: "현장",
  },
  {
    id: 3,
    company: "BigTech Inc",
    role: "React Developer",
    date: "다음 주 월요일",
    time: "3:30 PM",
    type: "시스템 설계",
    location: "화상 통화",
  },
]

export function UpcomingInterviews() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          예정된 면접
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {upcomingInterviews.map((interview) => (
          <div key={interview.id} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-1">
              <p className="font-medium">{interview.company}</p>
              <p className="text-sm text-muted-foreground">{interview.role}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {interview.date} {interview.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {interview.location}
                </span>
              </div>
            </div>
            <Badge variant="outline">{interview.type}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
