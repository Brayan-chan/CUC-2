"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, FileText, ImageIcon, Video } from "lucide-react"
import type { CloudinaryUploadResult } from "@/lib/cloudinary"

interface CloudinaryUploadWidgetProps {
  onUpload: (results: CloudinaryUploadResult[]) => void
  multiple?: boolean
  accept?: string
  maxFiles?: number
  children?: React.ReactNode
}

export const CloudinaryUploadWidget: React.FC<CloudinaryUploadWidgetProps> = ({
  onUpload,
  multiple = true,
  accept = "image/*,video/*,.pdf,.doc,.docx",
  maxFiles = 10,
  children,
}) => {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<CloudinaryUploadResult[]>([])

  useEffect(() => {
    // Check if Cloudinary script is already loaded
    if ((window as any).cloudinary) {
      setIsScriptLoaded(true)
      return
    }

    // Load Cloudinary script
    const script = document.createElement("script")
    script.src = "https://upload-widget.cloudinary.com/global/all.js"
    script.async = true
    script.onload = () => setIsScriptLoaded(true)
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  const openWidget = () => {
    if (!isScriptLoaded || !(window as any).cloudinary) {
      console.error("Cloudinary script not loaded")
      return
    }

    const widget = (window as any).cloudinary.createUploadWidget(
      {
        cloudName: "dmyejrbs7",
        uploadPreset: "apuntes",
        sources: ["local", "camera"],
        multiple,
        maxFiles,
        maxFileSize: 100000000, // 100MB
        resourceType: "auto",
        clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "mp4", "mov", "avi", "pdf", "doc", "docx"],
        maxVideoFileSize: 100000000,
        folder: "cultura-uacam",
        tags: ["cultura", "uacam", "eventos"],
        cropping: false,
        showAdvancedOptions: true,
        showUploadMoreButton: multiple,
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#90A0B3",
            tabIcon: "#8B5CF6",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#8B5CF6",
            action: "#8B5CF6",
            inactiveTabIcon: "#0E2F5A",
            error: "#F44235",
            inProgress: "#0078FF",
            complete: "#20B832",
            sourceBg: "#E4EBF1",
          },
        },
      },
      (error: any, result: any) => {
        if (error) {
          console.error("Upload error:", error)
          return
        }

        if (result.event === "success") {
          const newFile: CloudinaryUploadResult = {
            public_id: result.info.public_id,
            secure_url: result.info.secure_url,
            format: result.info.format,
            resource_type: result.info.resource_type,
            bytes: result.info.bytes,
            width: result.info.width,
            height: result.info.height,
            duration: result.info.duration,
          }

          setUploadedFiles((prev) => {
            const updated = [...prev, newFile]
            onUpload(updated)
            return updated
          })
        }

        if (result.event === "close") {
          widget.close()
        }
      },
    )

    widget.open()
  }

  const removeFile = (publicId: string) => {
    setUploadedFiles((prev) => {
      const updated = prev.filter((file) => file.public_id !== publicId)
      onUpload(updated)
      return updated
    })
  }

  const getFileIcon = (resourceType: string, format: string) => {
    if (resourceType === "image") return <ImageIcon className="w-5 h-5" />
    if (resourceType === "video") return <Video className="w-5 h-5" />
    return <FileText className="w-5 h-5" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-4">
      {children ? (
        <div onClick={openWidget} className="cursor-pointer">
          {children}
        </div>
      ) : (
        <Button
          type="button"
          onClick={openWidget}
          disabled={!isScriptLoaded}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
        >
          <Upload className="w-4 h-4 mr-2" />
          {isScriptLoaded ? "Subir Archivos" : "Cargando..."}
        </Button>
      )}

      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-semibold text-gray-900">Archivos Subidos ({uploadedFiles.length})</h4>
          {uploadedFiles.map((file, index) => (
            <div key={file.public_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center space-x-3">
                <div className="text-purple-600">{getFileIcon(file.resource_type, file.format)}</div>
                <div>
                  <p className="font-medium text-gray-900">
                    {file.public_id.split("/").pop()}.{file.format}
                  </p>
                  <p className="text-sm text-gray-600">
                    {formatFileSize(file.bytes)} • {file.resource_type}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(file.public_id)}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
