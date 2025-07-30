export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: "dmyejrbs7",
  UPLOAD_PRESET: "apuntes",
  API_KEY: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  API_SECRET: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
}

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

export const uploadToCloudinary = (file: File): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CONFIG.CLOUD_NAME,
        uploadPreset: CLOUDINARY_CONFIG.UPLOAD_PRESET,
        sources: ["local"],
        multiple: false,
        maxFileSize: 100000000, // 100MB
        resourceType: "auto",
        clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "mp4", "mov", "avi", "pdf", "doc", "docx"],
        maxVideoFileSize: 100000000,
        folder: "cultura-uacam",
        tags: ["cultura", "uacam", "eventos"],
      },
      (error: any, result: any) => {
        if (error) {
          reject(error)
          return
        }

        if (result.event === "success") {
          resolve(result.info)
        }
      },
    )

    // Create a file input and trigger upload
    const input = document.createElement("input")
    input.type = "file"
    input.accept = file.type

    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    input.files = dataTransfer.files

    widget.open()
  })
}

export const uploadMultipleToCloudinary = async (files: File[]): Promise<CloudinaryUploadResult[]> => {
  const uploadPromises = files.map((file) => uploadToCloudinary(file))
  return Promise.all(uploadPromises)
}
