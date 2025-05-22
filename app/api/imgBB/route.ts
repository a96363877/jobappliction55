import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Create a new FormData instance for the ImgBB API
    const imgbbFormData = new FormData()
    imgbbFormData.append("key", process.env.IMGBB_API_KEY || "")
    imgbbFormData.append("image", image)

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: imgbbFormData,
    })

    const data = await response.json()

    if (!data.success) {
      return NextResponse.json({ error: data.error?.message || "Upload failed" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        url: data.data.url,
        delete_url: data.data.delete_url,
      },
    })
  } catch (error) {
    console.error("Error uploading to ImgBB:", error)
    return NextResponse.json({ error: "Failed to upload image" }, { status: 500 })
  }
}