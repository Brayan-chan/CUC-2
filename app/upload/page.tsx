"use client"

import type React from "react"
import { Eye } from "lucide-react" // Import the Eye component

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  ImageIcon,
  Video,
  FileText,
  X,
  Calendar,
  Tag,
  ArrowLeft,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  Star,
  Zap,
  Award,
  Clock,
  MapPin,
  Users,
} from "lucide-react"
import Link from "next/link"

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    type: "",
    participants: "",
    tags: [] as string[],
    newTag: "",
  })

  const eventTypes = [
    { value: "musica", label: "Música", gradient: "from-blue-500 to-cyan-500" },
    { value: "danza", label: "Danza", gradient: "from-pink-500 to-rose-500" },
    { value: "teatro", label: "Teatro", gradient: "from-purple-500 to-indigo-500" },
    { value: "arte", label: "Arte Visual", gradient: "from-green-500 to-emerald-500" },
    { value: "literatura", label: "Literatura", gradient: "from-indigo-500 to-purple-500" },
    { value: "tradicion", label: "Tradición", gradient: "from-orange-500 to-red-500" },
    { value: "civico", label: "Cívico", gradient: "from-gray-500 to-slate-500" },
    { value: "academico", label: "Académico", gradient: "from-teal-500 to-cyan-500" },
    { value: "deportivo", label: "Deportivo", gradient: "from-yellow-500 to-orange-500" },
    { value: "otro", label: "Otro", gradient: "from-gray-400 to-gray-600" },
  ]

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...newFiles])

      newFiles.forEach((file) => {
        simulateUpload(file.name)
      })
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])

      newFiles.forEach((file) => {
        simulateUpload(file.name)
      })
    }
  }

  const simulateUpload = (fileName: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
      }
      setUploadProgress((prev) => ({ ...prev, [fileName]: progress }))
    }, 200)
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const addTag = () => {
    if (eventData.newTag.trim() && !eventData.tags.includes(eventData.newTag.trim())) {
      setEventData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: "",
      }))
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEventData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="w-5 h-5" />
    if (file.type.startsWith("video/")) return <Video className="w-5 h-5" />
    return <FileText className="w-5 h-5" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const selectedEventType = eventTypes.find((type) => type.value === eventData.type)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Subir Evento Cultural
                  </h1>
                  <p className="text-sm text-gray-500">Contribuye al archivo histórico</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200 px-3 py-1">
                <Sparkles className="w-4 h-4 mr-2" />
                Nuevo Contenido
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="files" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-2">
              <TabsTrigger
                value="files"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Upload className="w-4 h-4 mr-2" />
                Archivos
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Detalles
              </TabsTrigger>
              <TabsTrigger
                value="metadata"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Tag className="w-4 h-4 mr-2" />
                Metadatos
              </TabsTrigger>
            </TabsList>

            {/* Files Tab */}
            <TabsContent value="files" className="space-y-6">
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
                    <Upload className="w-6 h-6 mr-3 text-purple-600" />
                    Subir Archivos Multimedia
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-lg">
                    Arrastra y suelta archivos o haz clic para seleccionar. Soporta imágenes, videos y documentos.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Modern Drop Zone */}
                  <div
                    className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-300 group ${
                      dragActive
                        ? "border-purple-400 bg-purple-50"
                        : "border-gray-300 hover:border-purple-300 hover:bg-purple-50/50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*,.pdf,.doc,.docx"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <Upload className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Arrastra archivos aquí o haz clic para seleccionar
                    </h3>
                    <p className="text-gray-600 mb-8 text-lg">
                      Máximo 100MB por archivo. Formatos: JPG, PNG, MP4, MOV, PDF, DOC
                    </p>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg text-lg px-8 py-3">
                      Seleccionar Archivos
                    </Button>
                  </div>

                  {/* Modern File List */}
                  {files.length > 0 && (
                    <div className="mt-8 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xl font-bold text-gray-900 flex items-center">
                          <Star className="w-5 h-5 mr-2 text-yellow-500" />
                          Archivos Seleccionados ({files.length})
                        </h4>
                        <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 px-3 py-1">
                          <Check className="w-4 h-4 mr-2" />
                          Listos para subir
                        </Badge>
                      </div>
                      {files.map((file, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group"
                        >
                          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border border-gray-100 hover:border-purple-200 shadow-sm">
                            <div className="flex items-center space-x-3">
                              <div className="text-purple-600 p-2 bg-purple-100 rounded-xl">{getFileIcon(file)}</div>
                              <div>
                                <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                  {file.name}
                                </p>
                                <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-3">
                              {uploadProgress[file.name] !== undefined && (
                                <div className="flex items-center space-x-2">
                                  {uploadProgress[file.name] === 100 ? (
                                    <div className="flex items-center space-x-2 text-green-600">
                                      <Check className="w-4 h-4" />
                                      <span className="text-sm font-medium">Completado</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-2">
                                      <div className="w-24">
                                        <Progress value={uploadProgress[file.name]} className="h-2" />
                                      </div>
                                      <span className="text-sm text-gray-600 font-medium">
                                        {Math.round(uploadProgress[file.name] || 0)}%
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center">
                    <Calendar className="w-6 h-6 mr-3 text-blue-600" />
                    Información del Evento
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-lg">
                    Proporciona los detalles básicos del evento cultural
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="title" className="text-gray-700 font-semibold text-lg">
                        Título del Evento *
                      </Label>
                      <Input
                        id="title"
                        placeholder="Ej: Festival de Danza Folklórica 2024"
                        value={eventData.title}
                        onChange={(e) => setEventData((prev) => ({ ...prev, title: e.target.value }))}
                        className="bg-gray-50/50 border-gray-200 focus:border-blue-300 focus:ring-blue-200 text-lg p-4"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="type" className="text-gray-700 font-semibold text-lg">
                        Tipo de Evento *
                      </Label>
                      <Select
                        value={eventData.type}
                        onValueChange={(value) => setEventData((prev) => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger className="bg-gray-50/50 border-gray-200 focus:border-blue-300 text-lg p-4">
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-200">
                          {eventTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 bg-gradient-to-r ${type.gradient} rounded-full`}></div>
                                <span>{type.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="date" className="text-gray-700 font-semibold text-lg">
                        Fecha del Evento *
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={eventData.date}
                        onChange={(e) => setEventData((prev) => ({ ...prev, date: e.target.value }))}
                        className="bg-gray-50/50 border-gray-200 focus:border-blue-300 focus:ring-blue-200 text-lg p-4"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="location" className="text-gray-700 font-semibold text-lg">
                        Ubicación *
                      </Label>
                      <Input
                        id="location"
                        placeholder="Ej: Teatro Principal UACAM"
                        value={eventData.location}
                        onChange={(e) => setEventData((prev) => ({ ...prev, location: e.target.value }))}
                        className="bg-gray-50/50 border-gray-200 focus:border-blue-300 focus:ring-blue-200 text-lg p-4"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="participants" className="text-gray-700 font-semibold text-lg">
                        Número de Participantes
                      </Label>
                      <Input
                        id="participants"
                        type="number"
                        placeholder="Ej: 45"
                        value={eventData.participants}
                        onChange={(e) => setEventData((prev) => ({ ...prev, participants: e.target.value }))}
                        className="bg-gray-50/50 border-gray-200 focus:border-blue-300 focus:ring-blue-200 text-lg p-4"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="description" className="text-gray-700 font-semibold text-lg">
                      Descripción del Evento *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe el evento, su importancia cultural, participantes destacados, etc."
                      value={eventData.description}
                      onChange={(e) => setEventData((prev) => ({ ...prev, description: e.target.value }))}
                      className="bg-gray-50/50 border-gray-200 focus:border-blue-300 focus:ring-blue-200 min-h-[150px] text-lg p-4"
                      required
                    />
                  </div>

                  {/* Event Preview */}
                  {(eventData.title || eventData.type) && (
                    <div className="mt-8">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Eye className="w-5 h-5 mr-2 text-purple-600" />
                        Vista Previa
                      </h4>
                      <Card className="bg-gradient-to-r from-gray-50 to-white border border-gray-200">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            {selectedEventType && (
                              <Badge
                                className={`bg-gradient-to-r ${selectedEventType.gradient} text-white border-none`}
                              >
                                {selectedEventType.label}
                              </Badge>
                            )}
                            {eventData.date && <span className="text-gray-500 font-medium">{eventData.date}</span>}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {eventData.title || "Título del evento"}
                          </h3>
                          {eventData.description && <p className="text-gray-600 mb-3">{eventData.description}</p>}
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            {eventData.location && (
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {eventData.location}
                              </div>
                            )}
                            {eventData.participants && (
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {eventData.participants} participantes
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Metadata Tab */}
            <TabsContent value="metadata" className="space-y-6">
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center">
                    <Tag className="w-6 h-6 mr-3 text-green-600" />
                    Etiquetas y Metadatos
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-lg">
                    Añade etiquetas para facilitar la búsqueda y organización
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Añadir etiqueta (ej: folklore, tradición, campeche)"
                        value={eventData.newTag}
                        onChange={(e) => setEventData((prev) => ({ ...prev, newTag: e.target.value }))}
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        className="bg-gray-50/50 border-gray-200 focus:border-green-300 focus:ring-green-200 text-lg p-4"
                      />
                      <Button
                        onClick={addTag}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg px-6"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    {eventData.tags.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 flex items-center">
                          <Zap className="w-4 h-4 mr-2 text-green-600" />
                          Etiquetas Añadidas ({eventData.tags.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {eventData.tags.map((tag, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Badge
                                variant="secondary"
                                className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 hover:from-green-200 hover:to-emerald-200 transition-all duration-300 px-3 py-2 text-sm"
                              >
                                {tag}
                                <button
                                  onClick={() => removeTag(tag)}
                                  className="ml-2 hover:text-red-500 transition-colors"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <AlertCircle className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-blue-900 mb-2">Sugerencias para etiquetas</h4>
                        <ul className="text-blue-700 space-y-1">
                          <li>• Usa palabras clave específicas (nombres de artistas, géneros musicales)</li>
                          <li>• Incluye términos geográficos (Campeche, Yucatán, Maya)</li>
                          <li>• Añade el año o década del evento</li>
                          <li>• Menciona instrumentos, técnicas o estilos específicos</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Section */}
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                          ¿Listo para publicar?
                        </h3>
                        <p className="text-gray-600 text-lg">Tu evento será revisado antes de aparecer públicamente</p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-3">
                      <Button
                        variant="outline"
                        className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent px-6 py-3"
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Guardar Borrador
                      </Button>
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg px-6 py-3">
                        <Check className="w-4 h-4 mr-2" />
                        Enviar para Revisión
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
