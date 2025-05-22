
'use server'
export async function uploadImage(file: File) {
  // You need to add your ImgBB API key as an environment variable
  const apiKey ="e48d86b3d203c8918720a8ad1f25064c"

  if (!apiKey) {
    throw new Error("ImgBB API key is not configured")
  }

  // Convert file to base64
  const base64 = await fileToBase64(file)
  const base64Data = base64.split(",")[1]

  // Create form data
  const formData = new FormData()
  formData.append("key", apiKey)
  formData.append("image", base64Data)

  // Upload to ImgBB
  const response = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`)
  }

  const data = await response.json()

  if (!data.success) {
    throw new Error(data.error?.message || "Upload failed")
  }

  return {
    url: data.data.url,
    deleteUrl: data.data.delete_url,
  }
}

// Helper function to convert File to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}
