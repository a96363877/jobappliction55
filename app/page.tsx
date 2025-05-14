import { JobApplicationForm } from "@/components/job-application-form"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto py-8 px-4">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="bg-blue-600 rounded-full p-2 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
                <path d="m9 16 2 2 4-4"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-blue-900">شركة التقنية المتقدمة</h1>
              <p className="text-sm text-gray-500">نظام التوظيف الإلكتروني</p>
            </div>
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              الرئيسية
            </a>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              الوظائف المتاحة
            </a>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              من نحن
            </a>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              اتصل بنا
            </a>
          </div>
        </header>

        <JobApplicationForm />

        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} شركة التقنية المتقدمة. جميع الحقوق محفوظة.</p>
        </footer>
      </div>
    </main>
  )
}
