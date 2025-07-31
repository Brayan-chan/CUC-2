"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, FileImage, FileVideo, FileText, CheckCircle } from "lucide-react"
import { toast } from "sonner"

declare global {
  interface Window {
    cloudinary: any
  }
}

interface CloudinaryUploadWidgetProps {
  onUpload: (results: any[]) => void
  folder?: string
  maxFiles?: number
  resourceTypes?: string[]
  className?: string
}

interface UploadedFile {
  public_id: string
  secure_url: string
  format: string
  resource_type: string
  bytes: number
  width?: number
  height?: number
  duration?: number
  original_filename: string
}

export default function CloudinaryUploadWidget({
  onUpload,
  folder = "cultura-uacam",
  maxFiles = 10,
  resourceTypes = ["image", "video", "raw"],
  className = "",
}: CloudinaryUploadWidgetProps) {
  const cloudinaryRef = useRef<any>()
  const widgetRef = useRef<any>()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    if (typeof window !== "undefined" && window.cloudinary) {
      cloudinaryRef.current = window.cloudinary

      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: "cultura-uacam",
          folder: folder,
          multiple: true,
          maxFiles: maxFiles,
          resourceType: "auto",
          clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "mp4", "mov", "avi", "pdf", "doc", "docx"],
          maxFileSize: 50000000, // 50MB
          sources: ["local", "url", "camera"],
          showAdvancedOptions: false,
          cropping: false,
          theme: "minimal",
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#E5E7EB",
              tabIcon: "#8B5CF6",
              menuIcons: "#6B7280",
              textDark: "#1F2937",
              textLight: "#6B7280",
              link: "#8B5CF6",
              action: "#8B5CF6",
              inactiveTabIcon: "#9CA3AF",
              error: "#EF4444",
              inProgress: "#8B5CF6",
              complete: "#10B981",
              sourceBg: "#F9FAFB",
            },
          },
        },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            const newFile: UploadedFile = {
              public_id: result.info.public_id,
              secure_url: result.info.secure_url,
              format: result.info.format,
              resource_type: result.info.resource_type,
              bytes: result.info.bytes,
              width: result.info.width,
              height: result.info.height,
              duration: result.info.duration,
              original_filename: result.info.original_filename || result.info.public_id,
            }

            setUploadedFiles((prev) => {
              const updated = [...prev, newFile]
              onUpload(updated)
              return updated
            })

            toast.success(`Archivo subido: ${newFile.original_filename}`)
          }

          if (result && result.event === "upload-added") {
            setIsUploading(true)
            setUploadProgress(0)
          }

          if (result && result.event === "progress") {
            setUploadProgress(result.info.progress || 0)
          }

          if (result && result.event === "close") {
            setIsUploading(false)
            setUploadProgress(0)
          }

          if (error) {
            console.error("Upload error:", error)
            toast.error("Error al subir archivo: " + error.message)
            setIsUploading(false)
          }
        },
      )
    }
  }, [folder, maxFiles, onUpload])

  const openWidget = () => {
    if (widgetRef.current) {
      widgetRef.current.open()
    }
  }

  const removeFile = (publicId: string) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((file) => file.public_id !== publicId)
      onUpload(updated)
      return updated
    })
    toast.success("Archivo eliminado")
  }

  const getFileIcon = (resourceType: string, format: string) => {
    if (resourceType === "image") return <FileImage className="w-4 h-4" />
    if (resourceType === "video") return <FileVideo className="w-4 h-4" />
    return <FileText className="w-4 h-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Button */}
      <div className="flex flex-col items-center">
        <Button
          onClick={openWidget}
          disabled={isUploading}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isUploading ? "Subiendo..." : "Seleccionar Archivos"}
        </Button>

        {isUploading && (
          <div className="w-full max-w-xs mt-4">
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-gray-600 text-center mt-2">Subiendo... {Math.round(uploadProgress)}%</p>
          </div>
        )}
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">Archivos Subidos ({uploadedFiles.length})</h4>
          <div className="grid gap-2 max-h-60 overflow-y-auto">
            {uploadedFiles.map((file) => (
              <Card key={file.public_id} className="border border-gray-200">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">{getFileIcon(file.resource_type, file.format)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.original_filename}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {file.format.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-gray-500">{formatFileSize(file.bytes)}</span>
                          {file.resource_type === "image" && file.width && file.height && (
                            <span className="text-xs text-gray-500">
                              {file.width}×{file.height}
                            </span>
                          )}
                          {file.resource_type === "video" && file.duration && (
                            <span className="text-xs text-gray-500">{Math.round(file.duration)}s</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.public_id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Upload Instructions */}
      <div className="text-center text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
        <p>Formatos soportados: JPG, PNG, GIF, MP4, MOV, AVI, PDF, DOC, DOCX</p>
        <p>Tamaño máximo: 50MB por archivo • Máximo {maxFiles} archivos</p>
      </div>

      {/* Cloudinary Script */}
      <script src="https://widget.cloudinary.com/v2.0/global/all.js" async />
    </div>
  )
}
