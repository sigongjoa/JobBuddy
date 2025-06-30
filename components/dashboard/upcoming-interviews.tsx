import { Calendar, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

interface Interview {
  id: number;
  company: string;
  role: string;
  date: string;
  time: string;
  type: string;
  location: string;
}

const defaultUpcomingInterviews: Interview[] = [
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
  console.debug("UpcomingInterviews: function entry");
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    console.debug("UpcomingInterviews: useEffect entry");
    try {
      const storedInterviews = localStorage.getItem("upcomingInterviews");
      if (storedInterviews) {
        console.debug("UpcomingInterviews: Loading interviews from localStorage.");
        setUpcomingInterviews(JSON.parse(storedInterviews));
      } else {
        console.debug("UpcomingInterviews: No interviews found in localStorage, initializing with empty array.");
        setUpcomingInterviews([]);
      }
    } catch (error) {
      console.error("UpcomingInterviews: Error loading interviews from localStorage", error);
      // Fallback to empty interviews if localStorage operations fail
      setUpcomingInterviews([]);
    }
    console.debug("UpcomingInterviews: useEffect exit");
  }, []);

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
