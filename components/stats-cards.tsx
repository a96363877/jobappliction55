"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileImage, Users, Clock, BarChart3 } from "lucide-react"

interface StatsCardsProps {
  stats: {
    totalUploads: number
    totalApplications: number
    pendingApplications: number
    recentUploads: number
  }
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">إجمالي الملفات</CardTitle>
          <FileImage className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUploads}</div>
          <p className="text-xs text-muted-foreground">+{stats.recentUploads} في الأسبوع الماضي</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">طلبات التوظيف</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalApplications}</div>
          <p className="text-xs text-muted-foreground">{stats.pendingApplications} طلب قيد الانتظار</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">معدل الاستجابة</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2.4 ساعة</div>
          <p className="text-xs text-muted-foreground">-0.5 ساعة من الشهر الماضي</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">معدل القبول</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">42%</div>
          <p className="text-xs text-muted-foreground">+8% من الشهر الماضي</p>
        </CardContent>
      </Card>
    </div>
  )
}
