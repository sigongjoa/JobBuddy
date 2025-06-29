"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ReminderSettings } from "@/components/settings/reminder-settings"
import { RSSManager } from "@/components/settings/rss-manager"
import { NotificationSettings } from "@/components/settings/notification-settings"
import { ProfileSettings } from "@/components/settings/profile-settings"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">설정</h1>
        <p className="text-muted-foreground">애플리케이션 환경설정 및 통합을 관리합니다.</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">프로필</TabsTrigger>
          <TabsTrigger value="notifications">알림</TabsTrigger>
          <TabsTrigger value="reminders">알림</TabsTrigger>
          <TabsTrigger value="rss">RSS 피드</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="reminders" className="space-y-4">
          <ReminderSettings />
        </TabsContent>

        <TabsContent value="rss" className="space-y-4">
          <RSSManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
