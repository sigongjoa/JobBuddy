"use client"

import { Calendar, Building2, FolderOpen, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"

// Map icon names to actual Lucide React components
const iconComponents: { [key: string]: React.ComponentType<any> } = {
  Calendar: Calendar,
  Building2: Building2,
  FolderOpen: FolderOpen,
  TrendingUp: TrendingUp,
};

interface Stat {
  title: string;
  value: string;
  description: string;
  icon: string; // Changed to string to store icon name
  color: string;
}

const defaultStats: Stat[] = [
  {
    title: "예정된 면접",
    value: "3",
    description: "다음 7일",
    icon: "Calendar", // Changed to string
    color: "text-blue-600",
  },
  {
    title: "조사된 회사",
    value: "12",
    description: "활성 조사",
    icon: "Building2", // Changed to string
    color: "text-green-600",
  },
  {
    title: "포트폴리오 프로젝트",
    value: "8",
    description: "2개 업데이트 필요",
    icon: "FolderOpen", // Changed to string
    color: "text-purple-600",
  },
  {
    title: "지원율",
    value: "85%",
    description: "응답률",
    icon: "TrendingUp", // Changed to string
    color: "text-orange-600",
  },
]

export function OverviewStats() {
  console.debug("OverviewStats: function entry");
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    console.debug("OverviewStats: useEffect entry");
    try {
      const storedStats = localStorage.getItem("dashboardStats");
      if (storedStats) {
        console.debug("OverviewStats: Loading stats from localStorage.");
        setStats(JSON.parse(storedStats));
      } else {
        console.debug("OverviewStats: No stats found in localStorage, initializing with empty array.");
        setStats([]); // Initialize with an empty array if no data in localStorage
        // No need to set defaultStats to localStorage here if we want it to be empty initially
      }
    } catch (error) {
      console.error("OverviewStats: Error loading stats from localStorage", error);
      // Fallback to empty stats if localStorage operations fail
      setStats([]);
    }
    console.debug("OverviewStats: useEffect exit");
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const IconComponent = iconComponents[stat.icon]; // Get the actual icon component
        return (
          <Card key={stat.title} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {IconComponent && <IconComponent className={`h-4 w-4 ${stat.color}`} />} {/* Render the icon component */}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  )
}
