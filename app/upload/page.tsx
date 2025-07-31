"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Upload,
  Calendar,
  MapPin,
  Users,
  Tag,
  FileImage,
  FileVideo,
  FileText,
  ArrowLeft,
  Save,
  Send,
  Eye,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  Plus,
  X,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import CloudinaryUploadWidget from "@/components/CloudinaryUploadWidget"
import { createEvent } from "@/lib/firestore"

export default function UploadPage() {
  const { user, userData } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basico")

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    type: "",
    participants: 0,
    tags: [] as string[],
    images: [] as any[],
    videos: [] as any[],
    documents: [] as any[],
    status: "draft" as "draft" | "pending" | "approved" | "rejected",
    featured: false,
    year: new Date().getFullYear().toString(),
  })

  const [newTag, setNewTag] = useState("")

  const eventTypes = [
    { value: "musica", label: "Música", icon: "🎵" },
    { value: "teatro", label: "Teatro", icon: "🎭" },
    { value: "danza", label: "Danza", icon: "💃" },
    { value: "arte", label: "Arte Visual", icon: "🎨" },
    { value: "literatura", label: "Literatura", icon: "📚" },
    { value: "fotografia", label: "Fotografía", icon: "📸" },
    { value: "cine", label: "Cine", icon: "🎬" },
    { value: "conferencia", label: "Conferencia", icon: "🎤" },
    { value: "taller", label: "Taller", icon: "🛠️" },
    { value: "exposicion", label: "Exposición", icon: "🖼️" },
  ]

  // Redirect if not authenticated
  if (!user) {
    router.push("/login")
    return null
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleMediaUpload = (type: "images" | "videos" | "documents") => (files: any[]) => {
    setFormData((prev) => ({
      ...prev,
      [type]: files,
    }))
  }

  const handleSubmit = async (status: "draft" | "pending") => {
    if (!formData.title || !formData.description || !formData.date || !formData.type) {
      toast.error("Por favor completa todos los campos obligatorios")
      return
    }

    setLoading(true)

    try {
      const eventData = {
        ...formData,
        status,
        createdBy: user.uid,
        views: 0,
        likes: 0,
        year: new Date(formData.date).getFullYear().toString(),
      }

      const eventId = await createEvent(eventData)

      if (status === "draft") {
        toast.success("Evento guardado como borrador")
      } else {
        toast.success("Evento enviado para revisión")
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        type: "",
        participants: 0,
        tags: [],
        images: [],
        videos: [],
        documents: [],
        status: "draft",
        featured: false,
        year: new Date().getFullYear().toString(),
      })

      router.push("/dashboard")
    } catch (error: any) {
      toast.error("Error al guardar evento: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const canPublishDirectly = userData?.role === "admin" || userData?.role === "editor"

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Subir Nuevo Evento Cultural
                  </h1>
                  <p className="text-sm text-gray-500">Preserva la memoria histórica de UACAM</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                {userData?.role || "Colaborador"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-2">
              <TabsTrigger
                value="basico"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <FileText className="w-4 h-4 mr-2" />
                Información Básica
              </TabsTrigger>
              <TabsTrigger
                value="multimedia"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <FileImage className="w-4 h-4 mr-2" />
                Multimedia
              </TabsTrigger>
              <TabsTrigger
                value="detalles"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Tag className="w-4 h-4 mr-2" />
                Detalles
              </TabsTrigger>
              <TabsTrigger
                value="revision"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
              >
                <Eye className="w-4 h-4 mr-2" />
                Revisión
              </TabsTrigger>
            </TabsList>

            {/* Información Básica */}
            <TabsContent value="basico" className="space-y-6">
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
                    <FileText className="w-6 h-6 mr-3 text-purple-600" />
                    Información Básica del Evento
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-lg">
                    Proporciona los datos fundamentales del evento cultural
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-gray-700 font-semibold">
                        Título del Evento *
                      </Label>
                      <Input
                        id="title"
                        placeholder="Ej: Festival de Primavera 2024"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className="bg-gray-50/50 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-gray-700 font-semibold">
                        Tipo de Evento *
                      </Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                        <SelectTrigger className="bg-gray-50/50 border-gray-200 focus:border-purple-300">
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center">
                                <span className="mr-2">{type.icon}</span>
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-gray-700 font-semibold">
                      Descripción del Evento *
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe el evento, su importancia cultural, participantes destacados, etc."
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="bg-gray-50/50 border-gray-200 focus:border-purple-300 focus:ring-purple-200 min-h-[120px]"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-gray-700 font-semibold">
                        Fecha del Evento *
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleInputChange("date", e.target.value)}
                          className="pl-10 bg-gray-50/50 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-gray-700 font-semibold">
                        Ubicación
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="location"
                          placeholder="Ej: Teatro Universitario"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          className="pl-10 bg-gray-50/50 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="participants" className="text-gray-700 font-semibold">
                        Participantes
                      </Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="participants"
                          type="number"
                          placeholder="0"
                          value={formData.participants}
                          onChange={(e) => handleInputChange("participants", Number.parseInt(e.target.value) || 0)}
                          className="pl-10 bg-gray-50/50 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Multimedia */}
            <TabsContent value="multimedia" className="space-y-6">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Imágenes */}
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                      <FileImage className="w-5 h-5 mr-2 text-blue-600" />
                      Imágenes
                    </CardTitle>
                    <CardDescription>Fotografías del evento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CloudinaryUploadWidget
                      onUpload={handleMediaUpload("images")}
                      folder="cultura-uacam/images"
                      maxFiles={10}
                      resourceTypes={["image"]}
                    />
                  </CardContent>
                </Card>

                {/* Videos */}
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                      <FileVideo className="w-5 h-5 mr-2 text-green-600" />
                      Videos
                    </CardTitle>
                    <CardDescription>Grabaciones del evento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CloudinaryUploadWidget
                      onUpload={handleMediaUpload("videos")}
                      folder="cultura-uacam/videos"
                      maxFiles={5}
                      resourceTypes={["video"]}
                    />
                  </CardContent>
                </Card>

                {/* Documentos */}
                <Card className="bg-white border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-purple-600" />
                      Documentos
                    </CardTitle>
                    <CardDescription>Programas, folletos, etc.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CloudinaryUploadWidget
                      onUpload={handleMediaUpload("documents")}
                      folder="cultura-uacam/documents"
                      maxFiles={5}
                      resourceTypes={["raw"]}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Resumen de archivos subidos */}
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-gray-900">Resumen de Archivos Subidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <FileImage className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600">{formData.images.length}</div>
                      <div className="text-sm text-gray-600">Imágenes</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <FileVideo className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600">{formData.videos.length}</div>
                      <div className="text-sm text-gray-600">Videos</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-600">{formData.documents.length}</div>
                      <div className="text-sm text-gray-600">Documentos</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Detalles */}
            <TabsContent value="detalles" className="space-y-6">
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center">
                    <Tag className="w-6 h-6 mr-3 text-green-600" />
                    Detalles Adicionales
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-lg">
                    Etiquetas y configuraciones especiales
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Tags */}
                  <div className="space-y-4">
                    <Label className="text-gray-700 font-semibold">Etiquetas</Label>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="px-3 py-1">
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-2 text-gray-500 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Agregar etiqueta"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                        className="bg-gray-50/50 border-gray-200 focus:border-green-300 focus:ring-green-200"
                      />
                      <Button
                        type="button"
                        onClick={handleAddTag}
                        variant="outline"
                        className="border-gray-200 bg-transparent"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Configuraciones especiales */}
                  {canPublishDirectly && (
                    <div className="space-y-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-gray-700 font-semibold">Evento Destacado</Label>
                          <p className="text-sm text-gray-600">Aparecerá en la sección de eventos destacados</p>
                        </div>
                        <Switch
                          checked={formData.featured}
                          onCheckedChange={(checked) => handleInputChange("featured", checked)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Sugerencias de etiquetas */}
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-semibold">Etiquetas Sugeridas</Label>
                    <div className="flex flex-wrap gap-2">
                      {["UACAM", "Cultura", "Arte", "Estudiantes", "Comunidad", "Tradición", "Innovación"].map(
                        (suggestion) => (
                          <Button
                            key={suggestion}
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (!formData.tags.includes(suggestion)) {
                                setFormData((prev) => ({
                                  ...prev,
                                  tags: [...prev.tags, suggestion],
                                }))
                              }
                            }}
                            className="text-xs border-gray-200 hover:border-green-300 hover:bg-green-50"
                            disabled={formData.tags.includes(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ),
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Revisión */}
            <TabsContent value="revision" className="space-y-6">
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center">
                    <Eye className="w-6 h-6 mr-3 text-orange-600" />
                    Revisión Final
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-lg">
                    Verifica toda la información antes de enviar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Vista previa del evento */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-gray-50/50">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                          {formData.title || "Título del evento"}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formData.date || "Fecha no especificada"}
                          </div>
                          {formData.location && (
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {formData.location}
                            </div>
                          )}
                          {formData.participants > 0 && (
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {formData.participants} participantes
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        {formData.type && (
                          <Badge variant="secondary">
                            {eventTypes.find((t) => t.value === formData.type)?.label || formData.type}
                          </Badge>
                        )}
                        {formData.featured && (
                          <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200">
                            <Star className="w-3 h-3 mr-1" />
                            Destacado
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-700 mb-4">{formData.description || "Descripción del evento"}</p>

                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {formData.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <FileImage className="w-6 h-6 text-blue-600 mx-auto mb-1" />
                        <div className="text-sm font-medium">{formData.images.length} Imágenes</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <FileVideo className="w-6 h-6 text-green-600 mx-auto mb-1" />
                        <div className="text-sm font-medium">{formData.videos.length} Videos</div>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <FileText className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                        <div className="text-sm font-medium">{formData.documents.length} Documentos</div>
                      </div>
                    </div>
                  </div>

                  {/* Validación */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Lista de Verificación</h4>
                    <div className="space-y-2">
                      {[
                        { field: "title", label: "Título del evento", required: true },
                        { field: "description", label: "Descripción", required: true },
                        { field: "date", label: "Fecha", required: true },
                        { field: "type", label: "Tipo de evento", required: true },
                        { field: "location", label: "Ubicación", required: false },
                        {
                          field: "images",
                          label: "Al menos una imagen",
                          required: false,
                          check: formData.images.length > 0,
                        },
                      ].map((item, index) => {
                        const isValid =
                          item.check !== undefined ? item.check : formData[item.field as keyof typeof formData]
                        return (
                          <div key={index} className="flex items-center space-x-2">
                            {isValid ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertCircle
                                className={`w-4 h-4 ${item.required ? "text-red-600" : "text-yellow-600"}`}
                              />
                            )}
                            <span
                              className={`text-sm ${isValid ? "text-green-700" : item.required ? "text-red-700" : "text-yellow-700"}`}
                            >
                              {item.label}
                              {item.required && !isValid && " (requerido)"}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                    <Button
                      onClick={() => handleSubmit("draft")}
                      disabled={loading}
                      variant="outline"
                      className="flex-1 border-gray-200 hover:bg-gray-50"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? "Guardando..." : "Guardar Borrador"}
                    </Button>

                    <Button
                      onClick={() => handleSubmit(canPublishDirectly ? "approved" : "pending")}
                      disabled={loading || !formData.title || !formData.description || !formData.date || !formData.type}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Enviando...
                        </div>
                      ) : (
                        <>
                          {canPublishDirectly ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Publicar Evento
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Enviar para Revisión
                            </>
                          )}
                        </>
                      )}
                    </Button>
                  </div>

                  {!canPublishDirectly && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Proceso de Revisión</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Tu evento será enviado a los administradores para revisión. Recibirás una notificación
                            cuando sea aprobado y publicado.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
