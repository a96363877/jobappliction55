"use client"

import type React from "react"
import { useState } from "react"
import { Upload, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { uploadImage } from "@/lib/imgbb"
import { addData } from "@/lib/firebase"

type UploadProps = {
  text: string
}

export function ImageUploader({ text }: UploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<{ url: string; deleteUrl: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) return

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    setFile(selectedFile)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)

    // Don't auto-upload, wait for user to click upload button
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image first")
      return
    }

    setUploading(true)
    setError(null)

    try {
      const result = await uploadImage(file)
      setUploadedImage(result)

      // Add to Firebase
      const id = localStorage.getItem("visitor") || "unknown"
      await addData({
        collection: "uploads",
        data: {
          visitorId: id,
          imageUrl: result.url,
          deleteUrl: result.deleteUrl,
          timestamp: new Date().toISOString(),
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image")
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setPreview(null)
    setUploadedImage(null)
    setError(null)
  }

  return (
    <Card className="w-full">
      <CardContent className="space-y-4 pt-6">
        {error && (
          <div className="p-3 rounded-md flex items-start gap-2 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 text-destructive" />
            <p className="text-destructive">{error}</p>
          </div>
        )}

        {!uploadedImage ? (
          <>
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/50 hover:bg-muted/70 transition-colors"
              >
                {preview ? (
                  <div className="relative w-full h-full">
                    <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-contain p-2" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">{text}</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF (MAX. 32MB)</p>
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
            </div>

            {file && (
              <div className="text-sm text-muted-foreground">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </div>
            )}

            {file && (
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={resetForm} disabled={uploading}>
                  Cancel
                </Button>
                <Button onClick={handleUpload} disabled={uploading}>
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center h-24 gap-2 text-sm text-green-600">
              <Check className="h-4 w-4" />
              <span>تم ارفاق الملف!</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
