import type React from "react"
import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/toaster"

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  display: "swap",
  variable: "--font-cairo",
})

export const metadata: Metadata = {
  title: "نموذج التقدم للوظيفة | شركة التقنية المتقدمة",
  description: "نموذج احترافي للتقدم للوظيفة في شركة التقنية المتقدمة",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={cairo.className}>
          {children}
          <Toaster />
      </body>
    </html>
  )
}
