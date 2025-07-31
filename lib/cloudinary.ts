export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  resource_type: string
  format: string
  width?: number
  height?: number
  bytes: number
  created_at: string
}

export const uploadToCloudinary = async (file: File, folder = "cultura-uacam"): Promise<CloudinaryUploadResult> => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "cultura_preset") // You need to create this in Cloudinary
  formData.append("folder", folder)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
    {
      method: "POST",
      body: formData,
    },
  )

  if (!response.ok) {
    throw new Error("Failed to upload to Cloudinary")
  }

  return response.json()
}

export const deleteFromCloudinary = async (publicId: string) => {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = generateSignature(publicId, timestamp)

  const formData = new FormData()
  formData.append("public_id", publicId)
  formData.append("signature", signature)
  formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!)
  formData.append("timestamp", timestamp.toString())

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
    {
      method: "POST",
      body: formData,
    },
  )

  return response.json()
}

// Helper function to generate signature (you'll need to implement this server-side)
const generateSignature = (publicId: string, timestamp: number): string => {
  // This should be done server-side for security
  // For now, we'll return empty string
  return ""
}

export const getCloudinaryUrl = (publicId: string, transformations?: string): string => {
  const baseUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}`
  const transformation = transformations ? `/${transformations}` : ""
  return `${baseUrl}${transformation}/${publicId}`
}
