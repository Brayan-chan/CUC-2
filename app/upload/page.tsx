"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Upload,
  ImageIcon,
  Video,
  FileText,
  Calendar,
  MapPin,
  Users,
  Tag,
  Save,
  Send,
  Eye,
  ArrowLeft,
  Plus,
  X,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/useAuth"
import { useEvents } from "@/hooks/useEvents"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import CloudinaryUploadWidget from "@/components/CloudinaryUploadWidget"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const categories = [
  "Ceremonia de Graduación",
  "Evento Académico",
  "Evento Cultural",
  "Evento Deportivo",
  "Conferencia",
  "Taller",
  "Exposición",
  "Concierto",
  "Teatro",
  "Investigación",
  "Intercambio Estudiantil",
  "Celebración Institucional",
  "Otro",
]

export default function UploadPage() {
  const { user, userData } = useAuth()
  const { addEvent } = useEvents()
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    category: "",
    location: "",
    participants: "",
    significance: "",
    sources: "",
    tags: [] as string[],
    images: [] as string[],
    videos: [] as string[],
    documents: [] as string[],
  })

  const [currentTag, setCurrentTag] = useState("")
  const [currentSource, setCurrentSource] = useState("")
  const [sourcesList, setSourcesList] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  // Redirect if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Acceso Requerido</CardTitle>
            <CardDescription>Necesitas iniciar sesión para contribuir al archivo</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()],
      }))
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const addSource = () => {
    if (currentSource.trim() && !sourcesList.includes(currentSource.trim())) {
      setSourcesList((prev) => [...prev, currentSource.trim()])
      setCurrentSource("")
    }
  }

  const removeSource = (sourceToRemove: string) => {
    setSourcesList((prev) => prev.filter((source) => source !== sourceToRemove))
  }

  const handleMediaUpload = (result: any, type: "images" | "videos" | "documents") => {
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], result.secure_url],
    }))
    toast.success(`${type === "images" ? "Imagen" : type === "videos" ? "Video" : "Documento"} subido exitosamente`)
  }

  const removeMedia = (url: string, type: "images" | "videos" | "documents") => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item !== url),
    }))
  }

  const handleSubmit = async (status: "draft" | "pending") => {
    if (!formData.title || !formData.description || !formData.date || !formData.category) {
      toast.error("Por favor completa todos los campos obligatorios")
      return
    }

    setLoading(true)

    try {
      const eventData = {
        ...formData,
        sources: sourcesList,
        participants: formData.participants
          .split(",")
          .map((p) => p.trim())
          .filter((p) => p),
        status,
        createdBy: user.uid,
      }

      await addEvent(eventData)

      toast.success(status === "draft" ? "Borrador guardado exitosamente" : "Evento enviado para revisión")

      router.push("/dashboard")
    } catch (error: any) {
      toast.error("Error al guardar el evento: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = formData.title && formData.description && formData.date && formData.category

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Volver
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Contribuir al Archivo</h1>
                <p className="text-gray-600">Comparte eventos históricos de la UACAM</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant={userData?.role === "admin" ? "default" : "secondary"}>
                {userData?.role === "admin"
                  ? "Administrador"
                  : userData?.role === "moderator"
                    ? "Moderador"
                    : "Colaborador"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-xl p-2">
              <TabsTrigger
                value="basic"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <FileText className="w-4 h-4 mr-2" />
                Información Básica
              </TabsTrigger>
              <TabsTrigger
                value="media"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <Upload className="w-4 h-4 mr-2" />
                Multimedia
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <Tag className="w-4 h-4 mr-2" />
                Detalles
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="data-[state=active]:bg-purple-600 data-[state=active]:text-white rounded-lg transition-all duration-200"
              >
                <Eye className="w-4 h-4 mr-2" />
                Vista Previa
              </TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-purple-600" />
                      Información Básica del Evento
                    </CardTitle>
                    <CardDescription>Proporciona los datos fundamentales del evento histórico</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-base font-semibold">
                        Título del Evento *
                      </Label>
                      <Input
                        id="title"
                        placeholder="Ej: Ceremonia de Graduación 2020"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        className="text-lg p-4"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-base font-semibold">
                        Descripción *
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe el evento, su contexto e importancia histórica..."
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        className="min-h-32 text-base"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="date" className="text-base font-semibold">
                          Fecha del Evento *
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleInputChange("date", e.target.value)}
                            className="pl-12 p-4"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="category" className="text-base font-semibold">
                          Categoría *
                        </Label>
                        <select
                          id="category"
                          value={formData.category}
                          onChange={(e) => handleInputChange("category", e.target.value)}
                          className="w-full p-4 border border-gray-200 rounded-lg bg-white focus:border-purple-300 focus:ring-purple-200"
                        >
                          <option value="">Selecciona una categoría</option>
                          {categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-base font-semibold">
                        Ubicación
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                        <Input
                          id="location"
                          placeholder="Ej: Auditorio Principal, Campus I"
                          value={formData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          className="pl-12 p-4"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="participants" className="text-base font-semibold">
                        Participantes Principales
                      </Label>
                      <div className="relative">
                        <Users className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                        <Input
                          id="participants"
                          placeholder="Nombres separados por comas"
                          value={formData.participants}
                          onChange={(e) => handleInputChange("participants", e.target.value)}
                          className="pl-12 p-4"
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        Separa los nombres con comas (Ej: Dr. Juan Pérez, Lic. María García)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Images */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <ImageIcon className="w-5 h-5 mr-2 text-blue-600" />
                      Fotografías
                    </CardTitle>
                    <CardDescription>Sube imágenes relacionadas con el evento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <CloudinaryUploadWidget
                        onUpload={(result) => handleMediaUpload(result, "images")}
                        resourceType="image"
                        folder="cultura-uacam/images"
                        className="w-full"
                      />

                      {formData.images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {formData.images.map((url, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={url || "/placeholder.svg"}
                                alt={`Imagen ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                onClick={() => removeMedia(url, "images")}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Videos */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Video className="w-5 h-5 mr-2 text-red-600" />
                      Videos
                    </CardTitle>
                    <CardDescription>Sube videos del evento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <CloudinaryUploadWidget
                        onUpload={(result) => handleMediaUpload(result, "videos")}
                        resourceType="video"
                        folder="cultura-uacam/videos"
                        className="w-full"
                      />

                      {formData.videos.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {formData.videos.map((url, index) => (
                            <div key={index} className="relative group">
                              <video src={url} className="w-full h-32 object-cover rounded-lg" controls />
                              <button
                                onClick={() => removeMedia(url, "videos")}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Documents */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-green-600" />
                      Documentos
                    </CardTitle>
                    <CardDescription>Sube documentos relacionados (PDFs, Word, etc.)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <CloudinaryUploadWidget
                        onUpload={(result) => handleMediaUpload(result, "documents")}
                        resourceType="raw"
                        folder="cultura-uacam/documents"
                        className="w-full"
                      />

                      {formData.documents.length > 0 && (
                        <div className="space-y-2">
                          {formData.documents.map((url, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-green-600" />
                                <span className="text-sm">Documento {index + 1}</span>
                              </div>
                              <button
                                onClick={() => removeMedia(url, "documents")}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Tag className="w-5 h-5 mr-2 text-purple-600" />
                      Etiquetas y Detalles Adicionales
                    </CardTitle>
                    <CardDescription>Agrega información adicional para mejorar la búsqueda y contexto</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Tags */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Etiquetas</Label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Agregar etiqueta"
                          value={currentTag}
                          onChange={(e) => setCurrentTag(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                          className="flex-1"
                        />
                        <Button onClick={addTag} type="button" variant="outline">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {formData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-500">
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Historical Significance */}
                    <div className="space-y-2">
                      <Label htmlFor="significance" className="text-base font-semibold">
                        Importancia Histórica
                      </Label>
                      <Textarea
                        id="significance"
                        placeholder="Explica por qué este evento es importante para la historia de la UACAM..."
                        value={formData.significance}
                        onChange={(e) => handleInputChange("significance", e.target.value)}
                        className="min-h-24"
                      />
                    </div>

                    {/* Sources */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Fuentes y Referencias</Label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Agregar fuente o referencia"
                          value={currentSource}
                          onChange={(e) => setCurrentSource(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSource())}
                          className="flex-1"
                        />
                        <Button onClick={addSource} type="button" variant="outline">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      {sourcesList.length > 0 && (
                        <div className="space-y-2">
                          {sourcesList.map((source, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm">{source}</span>
                              <button onClick={() => removeSource(source)} className="text-red-500 hover:text-red-700">
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Preview Tab */}
            <TabsContent value="preview" className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Eye className="w-5 h-5 mr-2 text-green-600" />
                      Vista Previa del Evento
                    </CardTitle>
                    <CardDescription>Revisa cómo se verá tu evento antes de enviarlo</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!isFormValid ? (
                      <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Información Incompleta</h3>
                        <p className="text-gray-600">Completa los campos obligatorios para ver la vista previa</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Event Preview Card */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                          {formData.images.length > 0 && (
                            <img
                              src={formData.images[0] || "/placeholder.svg"}
                              alt={formData.title}
                              className="w-full h-48 object-cover"
                            />
                          )}

                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <Badge variant="secondary">{formData.category}</Badge>
                              <span className="text-sm text-gray-500">
                                {formData.date && format(new Date(formData.date), "dd 'de' MMMM, yyyy", { locale: es })}
                              </span>
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900 mb-3">{formData.title}</h2>

                            <p className="text-gray-600 mb-4">{formData.description}</p>

                            {formData.location && (
                              <div className="flex items-center text-sm text-gray-600 mb-2">
                                <MapPin className="w-4 h-4 mr-2" />
                                {formData.location}
                              </div>
                            )}

                            {formData.participants && (
                              <div className="flex items-center text-sm text-gray-600 mb-4">
                                <Users className="w-4 h-4 mr-2" />
                                {formData.participants}
                              </div>
                            )}

                            {formData.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {formData.tags.map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center space-x-4">
                                {formData.images.length > 0 && (
                                  <span className="flex items-center">
                                    <ImageIcon className="w-4 h-4 mr-1" />
                                    {formData.images.length}
                                  </span>
                                )}
                                {formData.videos.length > 0 && (
                                  <span className="flex items-center">
                                    <Video className="w-4 h-4 mr-1" />
                                    {formData.videos.length}
                                  </span>
                                )}
                                {formData.documents.length > 0 && (
                                  <span className="flex items-center">
                                    <FileText className="w-4 h-4 mr-1" />
                                    {formData.documents.length}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Additional Details */}
                        {formData.significance && (
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-blue-900 mb-2">Importancia Histórica</h4>
                            <p className="text-blue-800">{formData.significance}</p>
                          </div>
                        )}

                        {sourcesList.length > 0 && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-900 mb-2">Fuentes y Referencias</h4>
                            <ul className="list-disc list-inside text-green-800 space-y-1">
                              {sourcesList.map((source, index) => (
                                <li key={index}>{source}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
            <Button
              onClick={() => handleSubmit("draft")}
              disabled={loading || !isFormValid}
              variant="outline"
              size="lg"
              className="flex items-center"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Guardar Borrador
            </Button>

            <Button
              onClick={() => handleSubmit("pending")}
              disabled={loading || !isFormValid}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Enviar para Revisión
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Información Importante</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Los campos marcados con (*) son obligatorios</li>
              <li>• Los eventos enviados serán revisados por moderadores antes de ser publicados</li>
              <li>• Puedes guardar borradores y editarlos más tarde</li>
              <li>• Asegúrate de que tienes los derechos para compartir el contenido multimedia</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Cloudinary Script */}
      <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript"></script>
    </div>
  )
}
