"use client"

import { useState } from "react"
import { Plus, Trash2, RefreshCw, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface RSSFeed {
  id: number
  name: string
  url: string
  company: string
  active: boolean
  lastUpdated: string
  itemCount: number
}

export function RSSManager() {
  const [feeds, setFeeds] = useState<RSSFeed[]>([
    {
      id: 1,
      name: "TechCorp News",
      url: "https://techcorp.com/rss",
      company: "TechCorp",
      active: true,
      lastUpdated: "2024-01-20",
      itemCount: 12,
    },
    {
      id: 2,
      name: "StartupXYZ Blog",
      url: "https://startupxyz.com/feed",
      company: "StartupXYZ",
      active: true,
      lastUpdated: "2024-01-19",
      itemCount: 8,
    },
    {
      id: 3,
      name: "BigTech Press Releases",
      url: "https://bigtech.com/press/rss",
      company: "BigTech Inc",
      active: false,
      lastUpdated: "2024-01-15",
      itemCount: 5,
    },
  ])

  const [newFeed, setNewFeed] = useState({
    name: "",
    url: "",
    company: "",
  })

  const handleAddFeed = () => {
    if (newFeed.name && newFeed.url && newFeed.company) {
      const feed: RSSFeed = {
        id: feeds.length + 1,
        ...newFeed,
        active: true,
        lastUpdated: new Date().toISOString().split("T")[0],
        itemCount: 0,
      }
      setFeeds([...feeds, feed])
      setNewFeed({ name: "", url: "", company: "" })
    }
  }

  const handleDeleteFeed = (id: number) => {
    setFeeds(feeds.filter((feed) => feed.id !== id))
  }

  const handleToggleFeed = (id: number) => {
    setFeeds(feeds.map((feed) => (feed.id === id ? { ...feed, active: !feed.active } : feed)))
  }

  const handleRefreshFeed = (id: number) => {
    console.log("Refreshing feed:", id)
    // Handle refresh logic
  }

  const handleRefreshAll = () => {
    console.log("Refreshing all active feeds")
    // Handle refresh all logic
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>RSS Feed Manager</CardTitle>
          <CardDescription>
            Manage RSS feeds and Google Alerts to automatically track company news and updates.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Active Feeds</h3>
            <Button onClick={handleRefreshAll} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh All
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>URL</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feeds.map((feed) => (
                  <TableRow key={feed.id}>
                    <TableCell className="font-medium">{feed.name}</TableCell>
                    <TableCell>{feed.company}</TableCell>
                    <TableCell>
                      <a
                        href={feed.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Feed
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch checked={feed.active} onCheckedChange={() => handleToggleFeed(feed.id)} />
                        <Badge variant={feed.active ? "default" : "secondary"}>
                          {feed.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{feed.lastUpdated}</TableCell>
                    <TableCell>{feed.itemCount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleRefreshFeed(feed.id)}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteFeed(feed.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add New Feed</CardTitle>
          <CardDescription>Add RSS feeds or Google Alert URLs to track company news automatically.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="feed-name">Feed Name</Label>
              <Input
                id="feed-name"
                value={newFeed.name}
                onChange={(e) => setNewFeed({ ...newFeed, name: e.target.value })}
                placeholder="e.g., TechCorp News"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feed-company">Company</Label>
              <Input
                id="feed-company"
                value={newFeed.company}
                onChange={(e) => setNewFeed({ ...newFeed, company: e.target.value })}
                placeholder="e.g., TechCorp"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feed-url">RSS/Alert URL</Label>
              <Input
                id="feed-url"
                value={newFeed.url}
                onChange={(e) => setNewFeed({ ...newFeed, url: e.target.value })}
                placeholder="https://example.com/rss"
              />
            </div>
          </div>
          <Button onClick={handleAddFeed}>
            <Plus className="mr-2 h-4 w-4" />
            Add Feed
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Google Alerts Setup</CardTitle>
          <CardDescription>Instructions for setting up Google Alerts for company monitoring.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">How to create Google Alerts RSS feeds:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>
                Go to{" "}
                <a
                  href="https://alerts.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google Alerts
                </a>
              </li>
              <li>Enter your search term (e.g., company name)</li>
              <li>Click "Show options" and set "Deliver to" to "RSS feed"</li>
              <li>Create the alert and copy the RSS feed URL</li>
              <li>Add the RSS URL to the form above</li>
            </ol>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm">
              <strong>Tip:</strong> Use specific search terms like "CompanyName hiring" or "CompanyName funding" to get
              more relevant alerts for your job search.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
