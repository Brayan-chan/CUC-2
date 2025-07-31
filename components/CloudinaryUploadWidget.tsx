"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon, Video, FileText } from "lucide-react"

interface CloudinaryUploadWidgetProps {
  onUpload: (result: any) => void
  folder?: string
  resourceType?: "image" | "video" | "raw" | "auto"
  multiple?: boolean
  maxFiles?: number
  className?: string
  children?: React.ReactNode
}

declare global {
  interface Window {
    cloudinary: any
  }
}

export default function CloudinaryUploadWidget({
  onUpload,
  folder = "cultura-uacam",
  resourceType = "auto",
  multiple = true,
  maxFiles = 10,
  className,
  children,
}: CloudinaryUploadWidgetProps) {
  const widgetRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.cloudinary) {
      widgetRef.current = window.cloudinary.createUploadWidget(
        {
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          uploadPreset: "cultura_preset", // You need to create this preset in Cloudinary
          folder: folder,
          resourceType: resourceType,
          multiple: multiple,
          maxFiles: maxFiles,
          clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp", "mp4", "mov", "avi", "pdf", "doc", "docx"],
          maxFileSize: 10000000, // 10MB
          sources: ["local", "url", "camera"],
          showAdvancedOptions: false,
          cropping: false,
          theme: "minimal",
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#E5E7EB",
              tabIcon: "#6B7280",
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
            onUpload(result.info)
          }
          if (error) {
            console.error("Cloudinary upload error:", error)
          }
        },
      )
    }
  }, [onUpload, folder, resourceType, multiple, maxFiles])

  const openWidget = () => {
    if (widgetRef.current) {
      widgetRef.current.open()
    }
  }

  const getIcon = () => {
    switch (resourceType) {
      case "image":
        return <ImageIcon className="w-4 h-4 mr-2" />
      case "video":
        return <Video className="w-4 h-4 mr-2" />
      case "raw":
        return <FileText className="w-4 h-4 mr-2" />
      default:
        return <Upload className="w-4 h-4 mr-2" />
    }
  }

  if (children) {
    return (
      <div onClick={openWidget} className={className}>
        {children}
      </div>
    )
  }

  return (
    <Button type="button" variant="outline" onClick={openWidget} className={className}>
      {getIcon()}
      Subir {resourceType === "image" ? "Imágenes" : resourceType === "video" ? "Videos" : "Archivos"}
    </Button>
  )
}
