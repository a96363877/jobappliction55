"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileImage, Users, BarChart3, Settings, HelpCircle, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

export function DashboardNav() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      title: "لوحة التحكم",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      title: "الملفات المرفوعة",
      href: "/dashboard/uploads",
      icon: <FileImage className="h-5 w-5" />,
    },
    {
      title: "طلبات التوظيف",
      href: "/dashboard/applications",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: "التحليلات",
      href: "/dashboard/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "الإعدادات",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: "المساعدة",
      href: "/dashboard/help",
      icon: <HelpCircle className="h-5 w-5" />,
    },
  ]

  return (
    <div className="group flex w-16 flex-col border-l bg-background p-2 md:w-60 md:p-4">
      <div className="flex h-16 items-center justify-center md:justify-start">
        <Link href="/dashboard" className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-lg font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <span className="hidden md:inline-flex">نفاذ</span>
        </Link>
      </div>

      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {navItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground",
              pathname === item.href && "bg-muted text-foreground",
            )}
          >
            {item.icon}
            <span className="hidden md:inline-flex">{item.title}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline-flex">تسجيل الخروج</span>
        </Button>
      </div>
    </div>
  )
}
