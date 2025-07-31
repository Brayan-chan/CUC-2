export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  format: string
  resource_type: string
  bytes: number
  width?: number
  height?: number
  duration?: number
}

export interface CloudinaryConfig {
  cloudName: string
  apiKey: string
  apiSecret: string
}

export const cloudinaryConfig: CloudinaryConfig = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "",
  apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "",
  apiSecret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET || "",
}

export const uploadToCloudinary = async (file: File, folder = "cultura-uacam"): Promise<CloudinaryUploadResult> => {
  const formData = new FormData()
  formData.append("file", file)
  formData.append("upload_preset", "cultura-uacam")
  formData.append("folder", folder)

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error("Error uploading to Cloudinary")
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    throw error
  }
}

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    const response = await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ publicId }),
    })

    if (!response.ok) {
      throw new Error("Error deleting from Cloudinary")
    }
  } catch (error) {
    console.error("Cloudinary delete error:", error)
    throw error
  }
}

export const getCloudinaryUrl = (publicId: string, transformations?: string): string => {
  const baseUrl = `https://res.cloudinary.com/${cloudinaryConfig.cloudName}`
  const transforms = transformations ? `/${transformations}` : ""
  return `${baseUrl}${transforms}/${publicId}`
}
