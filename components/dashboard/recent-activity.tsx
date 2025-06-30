import { Activity, Plus, Edit, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { RecentActivityItem } from "@/lib/types"; // RecentActivityItem 임포트

// Map icon names to actual Lucide React components
const iconComponents: { [key: string]: React.ComponentType<any> } = {
  Plus: Plus,
  Edit: Edit,
  Eye: Eye,
  Activity: Activity,
};

export function RecentActivity() {
  console.debug("RecentActivity: function entry");
  const [recentActivities, setRecentActivities] = useState<RecentActivityItem[]>([]); // RecentActivityItem[] 타입 사용

  // Function to load activities from localStorage
  const loadActivities = () => {
    console.debug("RecentActivity: loadActivities function entry");
    try {
      const storedActivities = localStorage.getItem("recentActivities");
      if (storedActivities) {
        console.debug("RecentActivity: Loading activities from localStorage.");
        const parsedActivities: RecentActivityItem[] = JSON.parse(storedActivities);
        setRecentActivities(parsedActivities);
      } else {
        console.debug("RecentActivity: No activities found in localStorage, initializing with empty array.");
        setRecentActivities([]);
      }
    } catch (error) {
      console.error("RecentActivity: Error loading activities from localStorage", error);
      setRecentActivities([]);
    }
    console.debug("RecentActivity: loadActivities function exit");
  };

  useEffect(() => {
    console.debug("RecentActivity: useEffect entry - initial load and event listener setup.");
    loadActivities();

    // Event listener for localStorage changes (e.g., from CrewAI page)
    // A custom event is dispatched in app/crewai/page.tsx after saving to localStorage
    const handleStorageChange = () => {
      console.debug("RecentActivity: 'storage' event detected, reloading activities.");
      loadActivities();
    };
    window.addEventListener('storage', handleStorageChange); // Listen for storage events

    // You might also want a custom event if localStorage is updated within the same app instance
    // without a full page reload, as 'storage' event fires across documents.
    // If you need it to react to changes in the same tab, you'd dispatch a custom event from app/crewai/page.tsx
    // and listen here.
    // Example: window.addEventListener('crewaiActivityUpdate', loadActivities);

    return () => {
      console.debug("RecentActivity: useEffect cleanup - removing 'storage' event listener.");
      window.removeEventListener('storage', handleStorageChange);
      // Example: window.removeEventListener('crewaiActivityUpdate', loadActivities);
    };
  }, []);

  console.debug("RecentActivity: function exit");
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          최근 활동
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivities.length === 0 ? (
          <p className="text-muted-foreground text-center">최근 활동이 없습니다.</p>
        ) : (
          recentActivities.map((activity) => {
            // Determine icon based on activity type
            let IconComponent: React.ComponentType<any> = Activity; // Default to generic Activity icon
            if (activity.type === 'CrewAI Research') {
              IconComponent = Activity;
            } else if (activity.type === 'Interview') {
              IconComponent = Eye; // Example, could be a specific Interview icon
            } else if (activity.type === 'Company Research') {
              IconComponent = Eye; // Example, could be a specific Company Research icon
            }

            return (
              <div key={activity.id} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                  {IconComponent && <IconComponent className="h-4 w-4" />} {/* Render the icon component */}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.type}</span>:{" "}
                    <span className="text-muted-foreground">{activity.description}</span>
                  </p>
                  {activity.resultSummary && (
                    <p className="text-xs text-muted-foreground">결과 요약: {activity.resultSummary}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{new Date(activity.timestamp).toLocaleString()}</p>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
