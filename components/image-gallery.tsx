"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, ExternalLink, Trash2 } from "lucide-react"

interface ImageGalleryProps {
  uploads: any[]
}

export function ImageGallery({ uploads }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<any | null>(null)

  // Filter only image uploads
  const imageUploads = uploads.filter(
    (upload) => upload.fileType && upload.fileType.startsWith("image/") && upload.imageUrl,
  )

  if (imageUploads.length === 0) {
    return null
  }

  return (
    <div className="mb-8">
      <h3 className="text-lg font-medium mb-4">معرض الصور</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {imageUploads.map((image, index) => (
          <div
            key={index}
            className="relative group aspect-square rounded-md overflow-hidden border bg-muted cursor-pointer"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={image.imageUrl || "/placeholder.svg"}
              alt={image.fileName || `صورة ${index + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button variant="ghost" size="icon" className="text-white">
                <ExternalLink className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.fileName || "معاينة الصورة"}</DialogTitle>
          </DialogHeader>

          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            {selectedImage && (
              <Image
                src={selectedImage.imageUrl || "/placeholder.svg"}
                alt={selectedImage.fileName || "معاينة الصورة"}
                fill
                className="object-contain"
              />
            )}
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-muted-foreground">
              {selectedImage && (
                <>
                  <p>تاريخ الرفع: {new Date(selectedImage.timestamp).toLocaleString("ar-SA")}</p>
                  {selectedImage.fileSize && <p>الحجم: {(selectedImage.fileSize / 1024).toFixed(1)} KB</p>}
                </>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <a href={selectedImage?.imageUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  فتح
                </a>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={selectedImage?.imageUrl} download>
                  <Download className="h-4 w-4 mr-2" />
                  تنزيل
                </a>
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                حذف
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
