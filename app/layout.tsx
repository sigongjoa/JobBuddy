import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TopBar } from "@/components/layout/top-bar"
import { Toaster } from "@/components/ui/toaster"
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Job Application Manager",
  description: "Comprehensive job application tracking and management system",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode,
  params: { locale: string }
}) {
  console.debug("RootLayout: function entry", { locale });
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
