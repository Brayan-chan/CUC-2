"use client"

import React, { useState, useEffect } from "react"
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
import { Switch } from "@/components/ui/switch"
import {
  Upload,
  ImageIcon,
  Video,
  X,
  Calendar,
  ArrowLeft,
  Check,
  AlertCircle,
  Plus,
  Trash2,
  Sparkles,
  Star,
  MapPin,
  Users,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useEvents, useGallery, useTimeline } from "@/hooks/useFirebase"
import { uploadToCloudinary, openCloudinaryWidget } from "@/lib/cloudinary"
import { Timestamp } from "firebase/firestore"

export default function UploadPage() {
  const { user, userProfile } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("event")

  // Hooks para Firebase
  const { createEvent } = useEvents()
  const { createGalleryItem } = useGallery()
  const { createTimelineEvent } = useTimeline(new Date().getFullYear())

  // Event form state
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    type: "Danza" as const,
    category: "",
    participants: "",
    isFeatured: false,
    isHighlighted: false,
    gradient: "from-purple-500 via-pink-500 to-red-500",
  })

  // Gallery form state
  const [galleryData, setGalleryData] = useState({
    title: "",
    description: "",
    tags: "",
    year: new Date().getFullYear(),
    isHighlighted: false,
    eventId: "",
  })

  // Timeline form state
  const [timelineData, setTimelineData] = useState({
    year: new Date().getFullYear(),
    date: "",
    title: "",
    description: "",
    type: "Danza" as const,
    location: "",
    participants: "",
    isHighlighted: false,
    eventId: "",
  })

  // Images state
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  // Check authentication
  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (userProfile && !["admin", "editor"].includes(userProfile.role)) {
      toast.error("No tienes permisos para acceder a esta página")
      router.push("/")
      return
    }
  }, [user, userProfile, router])

  const handleImageUpload = () => {
    openCloudinaryWidget(
      (url: string) => {
        setUploadedImages(prev => [...prev, url])
        toast.success("Imagen subida exitosamente")
      },
      (error: any) => {
        console.error("Error uploading image:", error)
        toast.error("Error al subir la imagen")
      }
    )
  }

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!eventData.title || !eventData.description || !eventData.date || !eventData.location) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    if (uploadedImages.length === 0) {
      toast.error("Por favor sube al menos una imagen")
      return
    }

    setIsLoading(true)
    try {
      const eventToCreate = {
        title: eventData.title,
        description: eventData.description,
        type: eventData.type,
        category: eventData.category || eventData.type,
        date: Timestamp.fromDate(new Date(eventData.date)),
        location: eventData.location,
        participants: eventData.participants ? parseInt(eventData.participants) : undefined,
        images: uploadedImages,
        isHighlighted: eventData.isHighlighted,
        isFeatured: eventData.isFeatured,
        gradient: eventData.gradient,
        createdBy: user!.uid,
      }

      const eventId = await createEvent(eventToCreate)
      toast.success("Evento creado exitosamente")
      
      // Reset form
      setEventData({
        title: "",
        description: "",
        date: "",
        location: "",
        type: "Danza",
        category: "",
        participants: "",
        isFeatured: false,
        isHighlighted: false,
        gradient: "from-purple-500 via-pink-500 to-red-500",
      })
      setUploadedImages([])
      
      router.push(`/dashboard`)
    } catch (error) {
      console.error("Error creating event:", error)
      toast.error("Error al crear el evento")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitGallery = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!galleryData.title || uploadedImages.length === 0) {
      toast.error("Por favor completa el título y sube al menos una imagen")
      return
    }

    setIsLoading(true)
    try {
      for (const imageUrl of uploadedImages) {
        const galleryItem = {
          title: galleryData.title,
          description: galleryData.description,
          type: "image" as const,
          url: imageUrl,
          eventId: galleryData.eventId || undefined,
          tags: galleryData.tags ? galleryData.tags.split(",").map(tag => tag.trim()) : [],
          year: galleryData.year,
          isHighlighted: galleryData.isHighlighted,
          uploadedBy: user!.uid,
        }

        await createGalleryItem(galleryItem)
      }

      toast.success(`${uploadedImages.length} imagen(es) agregada(s) a la galería`)
      
      // Reset form
      setGalleryData({
        title: "",
        description: "",
        tags: "",
        year: new Date().getFullYear(),
        isHighlighted: false,
        eventId: "",
      })
      setUploadedImages([])
    } catch (error) {
      console.error("Error creating gallery items:", error)
      toast.error("Error al subir las imágenes a la galería")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitTimeline = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!timelineData.title || !timelineData.description || !timelineData.date) {
      toast.error("Por favor completa todos los campos requeridos")
      return
    }

    setIsLoading(true)
    try {
      const timelineEvent = {
        year: timelineData.year,
        date: timelineData.date,
        title: timelineData.title,
        description: timelineData.description,
        type: timelineData.type,
        location: timelineData.location,
        participants: timelineData.participants ? parseInt(timelineData.participants) : undefined,
        images: uploadedImages.length,
        isHighlighted: timelineData.isHighlighted,
        eventId: timelineData.eventId || undefined,
        createdBy: user!.uid,
      }

      await createTimelineEvent(timelineEvent)
      toast.success("Evento de línea del tiempo creado exitosamente")
      
      // Reset form
      setTimelineData({
        year: new Date().getFullYear(),
        date: "",
        title: "",
        description: "",
        type: "Danza",
        location: "",
        participants: "",
        isHighlighted: false,
        eventId: "",
      })
      setUploadedImages([])
    } catch (error) {
      console.error("Error creating timeline event:", error)
      toast.error("Error al crear el evento de línea del tiempo")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || !userProfile || !["admin", "editor"].includes(userProfile.role)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-uacam-navy"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <Link href="/dashboard" className="flex items-center text-gray-600 hover:text-purple-600 transition-colors group">
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver al Dashboard
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Subir Contenido
            </h1>
            <p className="text-gray-600 text-lg">
              Añade nuevos eventos, imágenes y momentos históricos al archivo cultural
            </p>
          </div>
        </motion.div>

        {/* Upload Interface */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                Crear Nuevo Contenido
              </CardTitle>
              <CardDescription>
                Selecciona el tipo de contenido que deseas crear y completa la información
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100/80 backdrop-blur-sm rounded-2xl p-2">
                  <TabsTrigger
                    value="event"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Evento
                  </TabsTrigger>
                  <TabsTrigger
                    value="gallery"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Galería
                  </TabsTrigger>
                  <TabsTrigger
                    value="timeline"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    Timeline
                  </TabsTrigger>
                </TabsList>

                {/* Upload Images Section */}
                <div className="my-6">
                  <Label className="text-lg font-semibold text-gray-700 mb-4 block">
                    Imágenes
                  </Label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Upload Button */}
                    <Button
                      type="button"
                      onClick={handleImageUpload}
                      className="h-32 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-700 border-2 border-dashed border-purple-300 rounded-xl transition-all duration-300"
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="w-8 h-8" />
                        <span className="font-medium">Subir Imagen</span>
                        <span className="text-sm opacity-75">Cloudinary Widget</span>
                      </div>
                    </Button>

                    {/* Uploaded Images Preview */}
                    {uploadedImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <div className="h-32 bg-gray-100 rounded-xl overflow-hidden">
                          <img
                            src={imageUrl}
                            alt={`Uploaded ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Event Form */}
                <TabsContent value="event" className="space-y-6">
                  <form onSubmit={handleSubmitEvent} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="event-title">Título del Evento *</Label>
                        <Input
                          id="event-title"
                          value={eventData.title}
                          onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Nombre del evento"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="event-type">Tipo de Evento *</Label>
                        <Select
                          value={eventData.type}
                          onValueChange={(value) => setEventData(prev => ({ ...prev, type: value as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Danza">Danza</SelectItem>
                            <SelectItem value="Música">Música</SelectItem>
                            <SelectItem value="Teatro">Teatro</SelectItem>
                            <SelectItem value="Arte">Arte</SelectItem>
                            <SelectItem value="Literatura">Literatura</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="event-date">Fecha del Evento *</Label>
                        <Input
                          id="event-date"
                          type="datetime-local"
                          value={eventData.date}
                          onChange={(e) => setEventData(prev => ({ ...prev, date: e.target.value }))}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="event-location">Ubicación *</Label>
                        <Input
                          id="event-location"
                          value={eventData.location}
                          onChange={(e) => setEventData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Lugar del evento"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="event-participants">Participantes</Label>
                        <Input
                          id="event-participants"
                          type="number"
                          value={eventData.participants}
                          onChange={(e) => setEventData(prev => ({ ...prev, participants: e.target.value }))}
                          placeholder="Número de participantes"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="event-category">Categoría</Label>
                        <Input
                          id="event-category"
                          value={eventData.category}
                          onChange={(e) => setEventData(prev => ({ ...prev, category: e.target.value }))}
                          placeholder="Categoría específica"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="event-description">Descripción *</Label>
                      <Textarea
                        id="event-description"
                        value={eventData.description}
                        onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe el evento..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="event-featured"
                            checked={eventData.isFeatured}
                            onCheckedChange={(checked) => setEventData(prev => ({ ...prev, isFeatured: checked }))}
                          />
                          <Label htmlFor="event-featured">Destacado</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="event-highlighted"
                            checked={eventData.isHighlighted}
                            onCheckedChange={(checked) => setEventData(prev => ({ ...prev, isHighlighted: checked }))}
                          />
                          <Label htmlFor="event-highlighted">Resaltado</Label>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading || uploadedImages.length === 0}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            <span>Creando...</span>
                          </div>
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Crear Evento
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                {/* Gallery Form */}
                <TabsContent value="gallery" className="space-y-6">
                  <form onSubmit={handleSubmitGallery} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="gallery-title">Título *</Label>
                        <Input
                          id="gallery-title"
                          value={galleryData.title}
                          onChange={(e) => setGalleryData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Título de la imagen/colección"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gallery-year">Año</Label>
                        <Input
                          id="gallery-year"
                          type="number"
                          value={galleryData.year}
                          onChange={(e) => setGalleryData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                          min="1950"
                          max={new Date().getFullYear()}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gallery-tags">Tags (separados por comas)</Label>
                        <Input
                          id="gallery-tags"
                          value={galleryData.tags}
                          onChange={(e) => setGalleryData(prev => ({ ...prev, tags: e.target.value }))}
                          placeholder="danza, festival, cultura"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gallery-event">ID del Evento (opcional)</Label>
                        <Input
                          id="gallery-event"
                          value={galleryData.eventId}
                          onChange={(e) => setGalleryData(prev => ({ ...prev, eventId: e.target.value }))}
                          placeholder="Vincular con un evento existente"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gallery-description">Descripción</Label>
                      <Textarea
                        id="gallery-description"
                        value={galleryData.description}
                        onChange={(e) => setGalleryData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descripción de las imágenes..."
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="gallery-highlighted"
                          checked={galleryData.isHighlighted}
                          onCheckedChange={(checked) => setGalleryData(prev => ({ ...prev, isHighlighted: checked }))}
                        />
                        <Label htmlFor="gallery-highlighted">Resaltado</Label>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading || uploadedImages.length === 0}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            <span>Subiendo...</span>
                          </div>
                        ) : (
                          <>
                            <ImageIcon className="w-4 h-4 mr-2" />
                            Agregar a Galería
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                {/* Timeline Form */}
                <TabsContent value="timeline" className="space-y-6">
                  <form onSubmit={handleSubmitTimeline} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="timeline-title">Título *</Label>
                        <Input
                          id="timeline-title"
                          value={timelineData.title}
                          onChange={(e) => setTimelineData(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="Título del evento histórico"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeline-year">Año *</Label>
                        <Input
                          id="timeline-year"
                          type="number"
                          value={timelineData.year}
                          onChange={(e) => setTimelineData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                          min="1950"
                          max={new Date().getFullYear()}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeline-date">Fecha específica *</Label>
                        <Input
                          id="timeline-date"
                          value={timelineData.date}
                          onChange={(e) => setTimelineData(prev => ({ ...prev, date: e.target.value }))}
                          placeholder="15 de Marzo"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeline-type">Tipo *</Label>
                        <Select
                          value={timelineData.type}
                          onValueChange={(value) => setTimelineData(prev => ({ ...prev, type: value as any }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Danza">Danza</SelectItem>
                            <SelectItem value="Música">Música</SelectItem>
                            <SelectItem value="Teatro">Teatro</SelectItem>
                            <SelectItem value="Arte">Arte</SelectItem>
                            <SelectItem value="Literatura">Literatura</SelectItem>
                            <SelectItem value="Otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeline-location">Ubicación</Label>
                        <Input
                          id="timeline-location"
                          value={timelineData.location}
                          onChange={(e) => setTimelineData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="Lugar del evento"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="timeline-participants">Participantes</Label>
                        <Input
                          id="timeline-participants"
                          type="number"
                          value={timelineData.participants}
                          onChange={(e) => setTimelineData(prev => ({ ...prev, participants: e.target.value }))}
                          placeholder="Número de participantes"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeline-description">Descripción *</Label>
                      <Textarea
                        id="timeline-description"
                        value={timelineData.description}
                        onChange={(e) => setTimelineData(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Descripción del evento histórico..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="timeline-highlighted"
                          checked={timelineData.isHighlighted}
                          onCheckedChange={(checked) => setTimelineData(prev => ({ ...prev, isHighlighted: checked }))}
                        />
                        <Label htmlFor="timeline-highlighted">Resaltado</Label>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            <span>Creando...</span>
                          </div>
                        ) : (
                          <>
                            <Clock className="w-4 h-4 mr-2" />
                            Agregar a Timeline
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
