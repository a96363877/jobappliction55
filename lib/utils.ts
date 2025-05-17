import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export async function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as ArrayBuffer)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

/**
 * Formats a date string to a localized format
 */
export function formatDate(dateString: string, locale = "ar-SA"): string {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Gets a status badge color based on application status
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "approved":
      return "bg-green-100 text-green-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

/**
 * Gets a localized status text based on application status
 */
export function getStatusText(status: string): string {
  switch (status) {
    case "pending":
      return "قيد المراجعة"
    case "approved":
      return "مقبول"
    case "rejected":
      return "مرفوض"
    default:
      return "غير معروف"
  }
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
