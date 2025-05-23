"use client"

import { useState } from "react"
import { Bell, LogOut, Menu, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DashboardNav } from "./dashboard-nav"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface DashboardHeaderProps {
  userData: any
  onLogout: () => void
}

export function DashboardHeader({ userData, onLogout }: DashboardHeaderProps) {
  const [open, setOpen] = useState(false)

  const getUserInitials = () => {
    if (userData?.displayName) {
      return userData.displayName
        .split(" ")
        .map((name: string) => name[0])
        .join("")
        .toUpperCase()
    }

    if (userData?.email) {
      return userData.email[0].toUpperCase()
    }

    return "U"
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="pr-0">
          <div className="px-7">
            <DashboardNav />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex-1">
        <h1 className="text-xl font-bold md:text-2xl">نظام إدارة البيانات</h1>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            3
          </span>
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar>
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>حسابي</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>الملف الشخصي</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>الإعدادات</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2 text-destructive focus:text-destructive"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              <span>تسجيل الخروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
