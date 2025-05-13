"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { ChevronDown, ChevronUp, Menu } from "lucide-react"

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-right" dir="rtl">
      {/* Header */}
      <header className="bg-white p-4 shadow-sm flex justify-between items-center">
        <button className="text-black">
          <Menu size={24} />
        </button>
        <div className="text-teal-500 text-3xl font-bold">نفاذ</div>
      </header>

      {/* Main Title */}
      <div className="bg-white p-6 text-center">
        <h1 className="text-2xl text-teal-500 font-bold">الدخول على النظام</h1>
      </div>

      {/* Accordion */}
      <div className="bg-teal-500 text-white p-4 flex justify-between items-center">
        <span className="text-xl">تطبيق نفاذ</span>
        <span>-</span>
      </div>

      {/* Login Form */}
      <div className="bg-white p-6 m-4 rounded-md shadow-sm">
        <div className="mb-4 text-gray-600 text-center">رقم بطاقة الأحوال/الإقامة</div>
        <input
          type="text"
          placeholder="ادخل رقم الأحوال/الإقامة الخاص بك هنا"
          className="w-full border rounded-md p-3 mb-4 text-right"
        />
        <button className="w-full bg-teal-500 text-white p-3 rounded-md mb-4">تسجيل الدخول</button>

        <div className="text-center text-gray-600 mb-4">لتحميل تطبيق نفاذ</div>

        <div className="flex justify-center gap-2 mb-4">
          <Link href="#">
            <Image src="/placeholder.svg?height=40&width=120" alt="App Store" width={120} height={40} />
          </Link>
          <Link href="#">
            <Image src="/placeholder.svg?height=40&width=120" alt="Google Play" width={120} height={40} />
          </Link>
          <Link href="#">
            <Image src="/placeholder.svg?height=40&width=120" alt="App Gallery" width={120} height={40} />
          </Link>
        </div>
      </div>

      {/* Username and Password Accordion */}
      <div
        className="bg-gray-300 p-4 flex justify-between items-center cursor-pointer mx-0"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span>{isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</span>
        <span className="text-gray-700">اسم المستخدم وكلمة المرور</span>
      </div>

      {/* New Platform Promo */}
      <div className="bg-teal-500 text-white p-6 m-4 rounded-md text-center">
        <h2 className="text-2xl font-bold mb-4">منصة النفاذ الجديدة</h2>
        <p className="mb-6">لتجربة أكثر سهولة استخدم النسخة المحدثة من منصة النفاذ الوطني الموحد</p>
        <button className="bg-white text-teal-500 px-6 py-2 rounded-md font-medium">ابدأ الآن</button>
      </div>

      {/* Footer */}
      <div className="mt-auto bg-gray-100 p-6 text-center">
        <div className="flex justify-center items-center mb-4">
          <Image src="/placeholder.svg?height=40&width=120" alt="NIC Logo" width={120} height={40} />
          <div className="text-right mr-2">
            <div>تطوير وتشغيل</div>
            <div className="font-bold">مركز المعلومات الوطني</div>
          </div>
        </div>

        <div className="text-gray-600 mb-4">النفاذ الوطني الموحد جميع الحقوق محفوظة © 2025</div>

        <div className="flex justify-center gap-4 text-gray-600 text-sm mb-4">
          <Link href="#" className="hover:underline">
            الرئيسية
          </Link>
          <Link href="#" className="hover:underline">
            حول
          </Link>
          <Link href="#" className="hover:underline">
            اتصل بنا
          </Link>
          <Link href="#" className="hover:underline">
            الشروط والأحكام
          </Link>
        </div>

        <div className="flex justify-center gap-4 text-gray-600 text-sm mb-4">
          <Link href="#" className="hover:underline">
            المساعدة والدعم
          </Link>
          <Link href="#" className="hover:underline">
            سياسة الخصوصية
          </Link>
        </div>

        <div className="flex justify-center">
          <Image src="/placeholder.svg?height=40&width=120" alt="Digital Stamp" width={120} height={40} />
        </div>
      </div>
    </div>
  )
}
