"use client"

import { Calendar, Building2, FolderOpen, Home, Settings, Activity } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "대시보드",
    url: "/",
    icon: Home,
  },
  {
    title: "면접 일정",
    url: "/interviews",
    icon: Calendar,
  },
  {
    title: "회사 조사",
    url: "/companies",
    icon: Building2,
  },
  {
    title: "포트폴리오",
    url: "/portfolio",
    icon: FolderOpen,
  },
  {
    title: "AI 리서치",
    url: "/crewai",
    icon: Activity,
  },
  {
    title: "설정",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "구독 관리",
    url: "/settings/subscription",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Building2 className="size-4" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold">구직 추적기</span>
            <span className="text-xs">지원 관리자</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
