"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    interviewReminders: true,
    applicationDeadlines: true,
    companyNews: false,
    weeklyDigest: true,
    reminderTiming: "1-day",
    digestDay: "sunday",
  })

  const handleSave = () => {
    console.log("Saving notification settings:", settings)
    // Handle save logic
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>Choose how and when you want to receive notifications.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notification Types</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
            </div>
            <Switch
              id="push-notifications"
              checked={settings.pushNotifications}
              onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Content Preferences</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="interview-reminders">Interview Reminders</Label>
              <p className="text-sm text-muted-foreground">Get reminded before scheduled interviews</p>
            </div>
            <Switch
              id="interview-reminders"
              checked={settings.interviewReminders}
              onCheckedChange={(checked) => setSettings({ ...settings, interviewReminders: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="application-deadlines">Application Deadlines</Label>
              <p className="text-sm text-muted-foreground">Alerts for upcoming application deadlines</p>
            </div>
            <Switch
              id="application-deadlines"
              checked={settings.applicationDeadlines}
              onCheckedChange={(checked) => setSettings({ ...settings, applicationDeadlines: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="company-news">Company News Updates</Label>
              <p className="text-sm text-muted-foreground">News about companies you're tracking</p>
            </div>
            <Switch
              id="company-news"
              checked={settings.companyNews}
              onCheckedChange={(checked) => setSettings({ ...settings, companyNews: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-digest">Weekly Digest</Label>
              <p className="text-sm text-muted-foreground">Summary of your job search activity</p>
            </div>
            <Switch
              id="weekly-digest"
              checked={settings.weeklyDigest}
              onCheckedChange={(checked) => setSettings({ ...settings, weeklyDigest: checked })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Timing Preferences</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reminder-timing">Interview Reminder Timing</Label>
              <Select
                value={settings.reminderTiming}
                onValueChange={(value) => setSettings({ ...settings, reminderTiming: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-hour">1 hour before</SelectItem>
                  <SelectItem value="2-hours">2 hours before</SelectItem>
                  <SelectItem value="1-day">1 day before</SelectItem>
                  <SelectItem value="2-days">2 days before</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="digest-day">Weekly Digest Day</Label>
              <Select
                value={settings.digestDay}
                onValueChange={(value) => setSettings({ ...settings, digestDay: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunday">Sunday</SelectItem>
                  <SelectItem value="monday">Monday</SelectItem>
                  <SelectItem value="friday">Friday</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button onClick={handleSave}>Save Preferences</Button>
      </CardContent>
    </Card>
  )
}
