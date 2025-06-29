import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/layout/top-bar"
import { Toaster } from "@/components/ui/toaster"
import { ClerkProvider } from "@clerk/nextjs";
import { headers } from "next/headers";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Job Application Manager",
  description: "Comprehensive job application tracking and management system",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode,
  params: { locale: string }
}) {
  // headers() 를 곧바로 순회하지 말고,
  // 필요한 헤더 키만 꺼내 쓰거나 완전히 없애 버리세요.
  // console.debug("RootLayout headers:", await headers().get("cookie"));
  // console.debug("RootLayout: function entry", { locale, hdrs_keys: Array.from(hdrs.keys()) });
  return (
    <ClerkProvider>
      <html lang={locale}>
        <body className={inter.className}>
          <SidebarProvider>
            <AppSidebar />
            <div className="flex-1 flex flex-col min-h-screen">
              <TopBar />
              <main className="flex-1 p-6">{children}</main>
            </div>
            <Toaster />
          </SidebarProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
