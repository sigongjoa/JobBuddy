"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ReminderSettings() {
  const [settings, setSettings] = useState({
    googleCalendarIntegration: false,
    calendarId: "",
    weeklyReviewReminder: true,
    reviewDay: "sunday",
    reviewTime: "18:00",
    portfolioUpdateReminder: true,
    updateFrequency: "monthly",
    applicationFollowUp: true,
    followUpDays: "7",
  })

  const handleSave = () => {
    console.log("Saving reminder settings:", settings)
    // Handle save logic
  }

  const handleGoogleCalendarConnect = () => {
    console.log("Connecting to Google Calendar...")
    // Handle Google Calendar OAuth
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reminder & Integration Settings</CardTitle>
        <CardDescription>Configure reminders and integrate with external calendar services.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Calendar Integration</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="google-calendar">Google Calendar Integration</Label>
              <p className="text-sm text-muted-foreground">Sync interviews with your Google Calendar</p>
            </div>
            <Switch
              id="google-calendar"
              checked={settings.googleCalendarIntegration}
              onCheckedChange={(checked) => setSettings({ ...settings, googleCalendarIntegration: checked })}
            />
          </div>

          {settings.googleCalendarIntegration && (
            <div className="space-y-2">
              <Label htmlFor="calendar-id">Calendar ID</Label>
              <div className="flex gap-2">
                <Input
                  id="calendar-id"
                  value={settings.calendarId}
                  onChange={(e) => setSettings({ ...settings, calendarId: e.target.value })}
                  placeholder="your-calendar@gmail.com"
                  className="flex-1"
                />
                <Button onClick={handleGoogleCalendarConnect}>Connect</Button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Weekly Review</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="weekly-review">Weekly Review Reminder</Label>
              <p className="text-sm text-muted-foreground">Get reminded to review your job search progress</p>
            </div>
            <Switch
              id="weekly-review"
              checked={settings.weeklyReviewReminder}
              onCheckedChange={(checked) => setSettings({ ...settings, weeklyReviewReminder: checked })}
            />
          </div>

          {settings.weeklyReviewReminder && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="review-day">Review Day</Label>
                <Select
                  value={settings.reviewDay}
                  onValueChange={(value) => setSettings({ ...settings, reviewDay: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sunday">Sunday</SelectItem>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="saturday">Saturday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="review-time">Review Time</Label>
                <Input
                  id="review-time"
                  type="time"
                  value={settings.reviewTime}
                  onChange={(e) => setSettings({ ...settings, reviewTime: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Portfolio Updates</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="portfolio-reminder">Portfolio Update Reminder</Label>
              <p className="text-sm text-muted-foreground">Regular reminders to update your portfolio projects</p>
            </div>
            <Switch
              id="portfolio-reminder"
              checked={settings.portfolioUpdateReminder}
              onCheckedChange={(checked) => setSettings({ ...settings, portfolioUpdateReminder: checked })}
            />
          </div>

          {settings.portfolioUpdateReminder && (
            <div className="space-y-2">
              <Label htmlFor="update-frequency">Update Frequency</Label>
              <Select
                value={settings.updateFrequency}
                onValueChange={(value) => setSettings({ ...settings, updateFrequency: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Application Follow-up</h3>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="follow-up">Application Follow-up Reminder</Label>
              <p className="text-sm text-muted-foreground">Remind you to follow up on applications</p>
            </div>
            <Switch
              id="follow-up"
              checked={settings.applicationFollowUp}
              onCheckedChange={(checked) => setSettings({ ...settings, applicationFollowUp: checked })}
            />
          </div>

          {settings.applicationFollowUp && (
            <div className="space-y-2">
              <Label htmlFor="follow-up-days">Follow-up After (days)</Label>
              <Input
                id="follow-up-days"
                type="number"
                value={settings.followUpDays}
                onChange={(e) => setSettings({ ...settings, followUpDays: e.target.value })}
                min="1"
                max="30"
              />
            </div>
          )}
        </div>

        <Button onClick={handleSave}>Save Settings</Button>
      </CardContent>
    </Card>
  )
}
