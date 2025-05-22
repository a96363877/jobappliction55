"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Upload, X, Check, AlertCircle, FileText, ImageIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { addData } from "@/lib/firebase"
import { cn } from "@/lib/utils"

type FileUpload = {
  file: File
  preview: string
  uploading: boolean
  uploaded: boolean
  url?: string
  deleteUrl?: string
  error?: string
}

type MultipleImageUploaderProps = {
  fieldName: string
  label: string
  description?: string
  maxFiles?: number
  acceptedFileTypes?: string
  maxFileSize?: number
  onChange: (urls: string[]) => void
  value?: string[]
}

export function MultipleImageUploader({
  fieldName,
  label,
  description = "PNG, JPG, GIF (MAX. 5MB)",
  maxFiles = 5,
  acceptedFileTypes = "image/*",
  maxFileSize = 5 * 1024 * 1024, // 5MB
  onChange,
  value = [],
}: MultipleImageUploaderProps) {
  const [files, setFiles] = useState<FileUpload[]>([])
  const [error, setError] = useState<string | null>(null)
  const [visitorId, setVisitorId] = useState<string | null>(null)

  // Initialize from existing values
  useEffect(() => {
    if (value && value.length > 0 && files.length === 0) {
      const initialFiles = value.map((url) => ({
        file: new File([], "existing-file"),
        preview: url,
        uploading: false,
        uploaded: true,
        url,
      }))
      setFiles(initialFiles)
    }
  }, [value, files.length])

  // Get visitor ID from localStorage
  useEffect(() => {
    const id = localStorage.getItem("visitor") || `visitor_${Date.now()}`
    setVisitorId(id)
    if (!localStorage.getItem("visitor")) {
      localStorage.setItem("visitor", id)
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const selectedFiles = e.target.files
uploadImage(selectedFiles as  any)
    if (!selectedFiles || selectedFiles.length === 0) return

    // Check if adding these files would exceed the max
    if (files.length + selectedFiles.length > maxFiles) {
      setError(`يمكنك تحميل ${maxFiles} ملفات كحد أقصى`)
      return
    }

    // Process each file
    Array.from(selectedFiles).forEach((file) => {
      // Check file type
      if (acceptedFileTypes !== "image/*" && !acceptedFileTypes.split(",").some((type) => file.type === type)) {
        setError(`نوع الملف ${file.type} غير مدعوم`)
        return
      }

      // Check file size
      if (file.size > maxFileSize) {
        setError(`حجم الملف ${file.name} يتجاوز الحد المسموح (${maxFileSize / 1024 / 1024}MB)`)
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        const newFile: FileUpload = {
          file,
          preview: e.target?.result as string,
          uploading: false,
          uploaded: false,
        }

        setFiles((prev) => [...prev, newFile])

        // We need to handle the upload after the file is added to state
        setTimeout(() => {
          setFiles((prev) => {
            const index = prev.findIndex((f) => f.file === file && !f.uploading && !f.uploaded)
            if (index !== -1) {
              handleUpload(file, index)
            }
            return prev
          })
        }, 0)
      }
      reader.readAsDataURL(file)
    })

    // Reset the input
    e.target.value = ""
  }

  // Mock upload function (replace with actual upload in production)
  const uploadImage = async (file: File): Promise<{ url: string; deleteUrl: string }> => {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        // Create a fake URL based on the file name
        const randomId = Math.random().toString(36).substring(2, 15)
        const url = `https://i.ibb.co/${randomId}/${file.name}`
        const deleteUrl = `https://ibb.co/delete/${randomId}`

        resolve({ url, deleteUrl })
      }, 1500)
    })
  }

  const handleUpload = async (file: File, index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      if (newFiles[index]) {
        newFiles[index] = { ...newFiles[index], uploading: true }
      }
      return newFiles
    })

    try {
      const result = await uploadImage(file)

      // Store the uploaded image data in Firebase
      if (visitorId) {
        await addData({
          collection: "uploads",
          data: {
            visitorId,
            fieldName,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            imageUrl: result.url,
            deleteUrl: result.deleteUrl,
            timestamp: new Date().toISOString(),
          },
        })
      }

      // Update file status
      setFiles((prev) => {
        const newFiles = [...prev]
        const fileIndex = newFiles.findIndex((f) => f.file === file)
        if (fileIndex !== -1) {
          newFiles[fileIndex] = {
            ...newFiles[fileIndex],
            uploading: false,
            uploaded: true,
            url: result.url,
            deleteUrl: result.deleteUrl,
          }
        }
        return newFiles
      })

      // Update form value with all uploaded URLs
      updateFormValue()
    } catch (err) {
      console.error("Upload error:", err)
      setFiles((prev) => {
        const newFiles = [...prev]
        const fileIndex = newFiles.findIndex((f) => f.file === file)
        if (fileIndex !== -1) {
          newFiles[fileIndex] = {
            ...newFiles[fileIndex],
            uploading: false,
            error: "فشل تحميل الملف",
          }
        }
        return newFiles
      })
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      newFiles.splice(index, 1)
      return newFiles
    })

    // Update form value after removal
    setTimeout(updateFormValue, 0)
  }

  const updateFormValue = () => {
    // Get all successfully uploaded URLs
    const urls = files.filter((f) => f.uploaded && f.url).map((f) => f.url as string)
    onChange(urls)
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-6 w-6 text-blue-500" />
    }
    return <FileText className="h-6 w-6 text-blue-500" />
  }

  return (
    <Card className="w-full">
      <CardContent className="space-y-4 pt-6">
        {error && (
          <div className="p-3 bg-red-50 rounded-md flex items-start gap-2 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 text-red-500" />
            <p className="text-red-500">{error}</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="font-medium text-sm">{label}</div>

          {/* File list */}
          {files.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {files.map((file, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative flex items-center p-3 border rounded-md bg-gray-50",
                    file.error && "border-red-300 bg-red-50",
                    file.uploaded && "border-green-300 bg-green-50",
                  )}
                >
                  <div className="flex-shrink-0 mr-3">
                    {file.preview && file.file.type.startsWith("image/") ? (
                      <div className="relative h-12 w-12 rounded-md overflow-hidden border">
                        <Image
                          src={file.preview || "/placeholder.svg"}
                          alt={file.file.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      getFileIcon(file.file.type)
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.file.name}</p>
                    <p className="text-xs text-gray-500">{(file.file.size / 1024).toFixed(1)} KB</p>
                  </div>

                  <div className="flex-shrink-0 ml-2">
                    {file.uploading ? (
                      <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    ) : file.error ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : file.uploaded ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload area */}
          {files.length < maxFiles && (
            <label
              htmlFor={`file-upload-${fieldName}`}
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">اضغط لتحميل</span> أو اسحب وأفلت
                </p>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
              <input
                id={`file-upload-${fieldName}`}
                type="file"
                className="hidden"
                accept={acceptedFileTypes}
                onChange={handleFileChange}
                multiple
              />
            </label>
          )}

          <div className="text-xs text-gray-500 mt-1">
            {files.length} من {maxFiles} ملفات
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
