"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const mockEvents = [
  {
    id: 1,
    title: "테크코프 - 기술 면접",
    date: new Date(2024, 0, 28),
    time: "2:00 PM",
  },
  {
    id: 2,
    title: "스타트업XYZ - 행동 면접",
    date: new Date(2024, 0, 25),
    time: "10:00 AM",
  },
]

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getEventsForDate = (date: Date | null) => {
    if (!date) return []
    return mockEvents.filter((event) => event.date.toDateString() === date.toDateString())
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const days = getDaysInMonth(currentDate)
  const monthYear = currentDate.toLocaleDateString("ko-KR", {
    month: "long",
    year: "numeric",
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{monthYear}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, index) => {
            const events = getEventsForDate(date)
            return (
              <div
                key={index}
                className={`min-h-[80px] p-2 border rounded-lg ${date ? "hover:bg-muted/50 cursor-pointer" : ""}`}
              >
                {date && (
                  <>
                    <div className="text-sm font-medium mb-1">{date.getDate()}</div>
                    {events.map((event) => (
                      <div key={event.id} className="text-xs bg-blue-100 text-blue-800 p-1 rounded mb-1 truncate">
                        {event.title}
                      </div>
                    ))}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
