"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Calendar,
  ImageIcon,
  Users,
  Eye,
  TrendingUp,
  Bell,
  Search,
  Plus,
  Upload,
  Clock,
  CheckCircle,
  Star,
  LogOut,
  BarChart3,
  Heart,
  Menu,
  X,
  Home,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useFeaturedEvents, useHighlightedGallery } from "@/hooks/useFirebase"
import { TimelineService, EventsService, GalleryService } from "@/lib/firebase-services"
import { Timestamp } from "firebase/firestore"

export default function DashboardPage() {
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [activeTab, setActiveTab] = useState("evento")
  
  // Form data for different content types
  const [eventFormData, setEventFormData] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    categoria: "",
    location: "",
    type: "Otro" as const
  })
  
  const [timelineFormData, setTimelineFormData] = useState({
    titulo: "",
    descripcion: "",
    fecha: "",
    tipo: "",
    location: ""
  })
  
  const [galleryFormData, setGalleryFormData] = useState({
    titulo: "",
    descripcion: ""
  })
  
  // Firebase hooks
  const { featuredEvents, loading: eventsLoading } = useFeaturedEvents()
  const { highlightedItems, loading: galleryLoading } = useHighlightedGallery()
  
  // Auth
  const { user, logout, loading } = useAuth()
  const router = useRouter()

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await logout()
      toast.success("Sesión cerrada correctamente")
      router.push("/")
    } catch (error) {
      console.error("Error logging out:", error)
      toast.error("Error al cerrar sesión")
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      setSelectedFiles(Array.from(files))
    }
  }

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'apuntes')
    formData.append('cloud_name', 'dmyejrbs7')

    try {
      const response = await fetch('https://api.cloudinary.com/v1_1/dmyejrbs7/auto/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error)
      throw error
    }
  }

  const handleFileUpload = async () => {
    if (selectedFiles.length === 0 && activeTab !== "evento") {
      toast.error("Por favor selecciona archivos")
      return
    }

    // Validar campos requeridos según el tipo
    if (activeTab === "evento") {
      if (!eventFormData.titulo || !eventFormData.descripcion || !eventFormData.fecha) {
        toast.error("Por favor completa todos los campos requeridos")
        return
      }
    } else if (activeTab === "timeline") {
      if (!timelineFormData.titulo || !timelineFormData.descripcion || !timelineFormData.fecha) {
        toast.error("Por favor completa todos los campos requeridos")
        return
      }
    } else if (activeTab === "galeria") {
      if (!galleryFormData.titulo || selectedFiles.length === 0) {
        toast.error("Por favor completa el título y selecciona archivos")
        return
      }
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Subir archivos a Cloudinary
      const uploadedFiles = []
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const url = await uploadToCloudinary(file)
        uploadedFiles.push({ name: file.name, url, type: file.type })
        setUploadProgress(((i + 1) / selectedFiles.length) * 80) // 80% para upload
      }

      // Crear el contenido según el tipo
      if (activeTab === "evento") {
        await EventsService.create({
          title: eventFormData.titulo,
          description: eventFormData.descripcion,
          date: Timestamp.fromDate(new Date(eventFormData.fecha)),
          location: eventFormData.location || "UACAM",
          category: eventFormData.categoria,
          type: eventFormData.type,
          images: uploadedFiles.filter(f => f.type.startsWith('image')).map(f => f.url),
          videos: uploadedFiles.filter(f => f.type.startsWith('video')).map(f => f.url),
          isHighlighted: false,
          isFeatured: false,
          createdBy: user?.uid || ""
        })
        toast.success("Evento creado exitosamente")
        setEventFormData({ titulo: "", descripcion: "", fecha: "", categoria: "", location: "", type: "Otro" })
      } else if (activeTab === "timeline") {
        await TimelineService.create({
          title: timelineFormData.titulo,
          description: timelineFormData.descripcion,
          date: timelineFormData.fecha,
          location: timelineFormData.location || "UACAM",
          type: (timelineFormData.tipo as any) || "Otro",
          images: uploadedFiles.filter(f => f.type.startsWith('image')).map(f => f.url),
          videos: uploadedFiles.filter(f => f.type.startsWith('video')).map(f => f.url),
          isHighlighted: false,
          createdBy: user?.uid || ""
        })
        toast.success("Evento agregado al timeline exitosamente")
        setTimelineFormData({ titulo: "", descripcion: "", fecha: "", tipo: "", location: "" })
      } else if (activeTab === "galeria") {
        // Crear múltiples items de galería si hay múltiples archivos
        for (const file of uploadedFiles) {
          await GalleryService.create({
            title: galleryFormData.titulo,
            description: galleryFormData.descripcion,
            type: file.type.startsWith('video') ? 'video' : 'image',
            url: file.url,
            tags: [eventFormData.categoria || "general"],
            year: new Date().getFullYear(),
            isHighlighted: false,
            uploadedBy: user?.uid || ""
          })
        }
        toast.success(`${uploadedFiles.length} archivo(s) agregado(s) a la galería`)
        setGalleryFormData({ titulo: "", descripcion: "" })
      }
      
      setUploadProgress(100)
      setSelectedFiles([])
      setIsEventDialogOpen(false)
      
      // Reset progress after a short delay
      setTimeout(() => setUploadProgress(0), 1000)
    } catch (error) {
      console.error("Error creating content:", error)
      toast.error("Error al crear el contenido")
    } finally {
      setIsUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const stats = [
    {
      title: "Eventos Totales",
      value: featuredEvents?.length?.toString() || "0",
      change: "+12%",
      trend: "up",
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-500",
      description: "Este mes",
    },
    {
      title: "Archivos Multimedia",
      value: highlightedItems?.length?.toString() || "0",
      change: "+8%",
      trend: "up",
      icon: ImageIcon,
      gradient: "from-green-500 to-emerald-500",
      description: "Total",
    },
    {
      title: "Visualizaciones",
      value: "1.2K",
      change: "+23%",
      trend: "up",
      icon: Eye,
      gradient: "from-purple-500 to-pink-500",
      description: "Esta semana",
    },
    {
      title: "Usuarios Activos",
      value: "245",
      change: "+5%",
      trend: "up",
      icon: Users,
      gradient: "from-orange-500 to-red-500",
      description: "Último mes",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CUC</span>
                </div>
                <span className="font-semibold text-gray-900 hidden sm:block">Dashboard</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Buscar..."
                  className="pl-9 w-64 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
                />
              </div>
              
              <Button variant="outline" size="icon">
                <Bell className="w-4 h-4" />
              </Button>

              <div className="flex items-center space-x-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/placeholder-user.jpg" />
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    {user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:block">
                  <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                  <p className="text-xs text-gray-500">Administrador</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-purple-100 text-purple-600">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 border-t border-gray-200"
            >
              <div className="space-y-3 pt-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Buscar..."
                    className="pl-9 w-full bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                    <p className="text-xs text-gray-500">Administrador</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon">
                      <Bell className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleLogout}>
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <Link href="/archivo" className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Archivo</span>
                  </Link>
                  <Link href="/galeria" className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <ImageIcon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Galería</span>
                  </Link>
                  <Link href="/timeline" className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Timeline</span>
                  </Link>
                  <Link href="/gestion" className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <Users className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Gestión</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ¡Bienvenido de vuelta!
              </h1>
              <p className="text-gray-600">
                Gestiona el archivo cultural de la universidad desde un solo lugar
              </p>
            </div>
            
            {/* Unified Action Button */}
            <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold">
                  <Plus className="w-5 h-5 mr-2" />
                  Nuevo Evento
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Gestión de Contenido</DialogTitle>
                  <DialogDescription className="text-gray-600">
                    Crea y gestiona eventos, galería y contenido del timeline
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                    <TabsTrigger value="evento" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600">
                      Evento
                    </TabsTrigger>
                    <TabsTrigger value="galeria" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600">
                      Galería
                    </TabsTrigger>
                    <TabsTrigger value="timeline" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600">
                      Timeline
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="evento" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="titulo" className="text-gray-700 font-medium">Título del Evento</Label>
                        <Input 
                          id="titulo" 
                          placeholder="Nombre del evento" 
                          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                          value={eventFormData.titulo}
                          onChange={(e) => setEventFormData(prev => ({...prev, titulo: e.target.value}))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fecha" className="text-gray-700 font-medium">Fecha</Label>
                        <Input 
                          id="fecha" 
                          type="date" 
                          className="bg-white border-gray-300 text-gray-900"
                          value={eventFormData.fecha}
                          onChange={(e) => setEventFormData(prev => ({...prev, fecha: e.target.value}))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descripcion" className="text-gray-700 font-medium">Descripción</Label>
                      <Textarea 
                        id="descripcion" 
                        placeholder="Describe el evento..." 
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 min-h-[100px]"
                        value={eventFormData.descripcion}
                        onChange={(e) => setEventFormData(prev => ({...prev, descripcion: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoria" className="text-gray-700 font-medium">Categoría</Label>
                      <Select value={eventFormData.categoria} onValueChange={(value) => setEventFormData(prev => ({...prev, categoria: value}))}>
                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                          <SelectValue placeholder="Selecciona una categoría" className="text-gray-500" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          <SelectItem value="cultural" className="text-gray-900">Cultural</SelectItem>
                          <SelectItem value="academico" className="text-gray-900">Académico</SelectItem>
                          <SelectItem value="deportivo" className="text-gray-900">Deportivo</SelectItem>
                          <SelectItem value="social" className="text-gray-900">Social</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* File Upload for Event */}
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-medium">Imágenes del Evento</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-2">Arrastra archivos aquí o haz clic para seleccionar</p>
                        <p className="text-xs text-gray-500 mb-3">JPG, PNG, MP4, MOV hasta 50MB</p>
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="event-file-upload"
                        />
                        <label htmlFor="event-file-upload">
                          <Button variant="outline" className="cursor-pointer text-gray-700" asChild>
                            <span>Seleccionar Archivos</span>
                          </Button>
                        </label>
                      </div>
                      
                      {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Archivos seleccionados:</p>
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                              <span className="text-sm text-gray-900 truncate">{file.name}</span>
                              <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                          ))}
                          {isUploading && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                      onClick={handleFileUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? "Creando Evento..." : "Crear Evento"}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="galeria" className="space-y-4 mt-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-2">Arrastra archivos aquí o haz clic para seleccionar</p>
                      <p className="text-xs text-gray-500 mb-3">JPG, PNG, MP4, MOV hasta 50MB por archivo</p>
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="gallery-file-upload"
                      />
                      <label htmlFor="gallery-file-upload">
                        <Button variant="outline" className="cursor-pointer text-gray-700" asChild>
                          <span>Seleccionar Archivos</span>
                        </Button>
                      </label>
                    </div>
                    
                    {selectedFiles.length > 0 && (
                      <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">Archivos seleccionados:</p>
                        <div className="max-h-32 overflow-y-auto space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                              <span className="text-sm text-gray-900 truncate">{file.name}</span>
                              <span className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                          ))}
                        </div>
                        {isUploading && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="titulo-galeria" className="text-gray-700 font-medium">Título</Label>
                      <Input 
                        id="titulo-galeria" 
                        placeholder="Título del archivo" 
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                        value={galleryFormData.titulo}
                        onChange={(e) => setGalleryFormData(prev => ({...prev, titulo: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descripcion-galeria" className="text-gray-700 font-medium">Descripción</Label>
                      <Textarea 
                        id="descripcion-galeria" 
                        placeholder="Descripción del archivo..." 
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 min-h-[80px]"
                        value={galleryFormData.descripcion}
                        onChange={(e) => setGalleryFormData(prev => ({...prev, descripcion: e.target.value}))}
                      />
                    </div>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                      onClick={handleFileUpload}
                      disabled={isUploading || selectedFiles.length === 0}
                    >
                      {isUploading ? "Subiendo..." : "Subir a Galería"}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="timeline" className="space-y-4 mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fecha-timeline" className="text-gray-700 font-medium">Fecha del Hito</Label>
                        <Input 
                          id="fecha-timeline" 
                          type="date" 
                          className="bg-white border-gray-300 text-gray-900"
                          value={timelineFormData.fecha}
                          onChange={(e) => setTimelineFormData(prev => ({...prev, fecha: e.target.value}))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tipo" className="text-gray-700 font-medium">Tipo de Evento</Label>
                        <Select value={timelineFormData.tipo} onValueChange={(value) => setTimelineFormData(prev => ({...prev, tipo: value}))}>
                          <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                            <SelectValue placeholder="Tipo de evento" className="text-gray-500" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="Danza" className="text-gray-900">Danza</SelectItem>
                            <SelectItem value="Música" className="text-gray-900">Música</SelectItem>
                            <SelectItem value="Teatro" className="text-gray-900">Teatro</SelectItem>
                            <SelectItem value="Arte" className="text-gray-900">Arte</SelectItem>
                            <SelectItem value="Literatura" className="text-gray-900">Literatura</SelectItem>
                            <SelectItem value="Otro" className="text-gray-900">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="titulo-timeline" className="text-gray-700 font-medium">Título del Hito</Label>
                      <Input 
                        id="titulo-timeline" 
                        placeholder="Título del evento histórico" 
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                        value={timelineFormData.titulo}
                        onChange={(e) => setTimelineFormData(prev => ({...prev, titulo: e.target.value}))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descripcion-timeline" className="text-gray-700 font-medium">Descripción</Label>
                      <Textarea 
                        id="descripcion-timeline" 
                        placeholder="Descripción del hito histórico..." 
                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 min-h-[100px]"
                        value={timelineFormData.descripcion}
                        onChange={(e) => setTimelineFormData(prev => ({...prev, descripcion: e.target.value}))}
                      />
                    </div>
                    
                    {/* File Upload for Timeline */}
                    <div className="space-y-3">
                      <Label className="text-gray-700 font-medium">Imágenes del Hito Histórico</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                        <Upload className="w-8 h-8 mx-auto text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600 mb-2">Agrega imágenes históricas</p>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="timeline-file-upload"
                        />
                        <label htmlFor="timeline-file-upload">
                          <Button variant="outline" size="sm" className="cursor-pointer text-gray-700" asChild>
                            <span>Seleccionar Imágenes</span>
                          </Button>
                        </label>
                      </div>
                      
                      {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Imágenes seleccionadas:</p>
                          {selectedFiles.slice(0, 3).map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded text-sm">
                              <span className="text-gray-900 truncate">{file.name}</span>
                              <span className="text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                          ))}
                          {selectedFiles.length > 3 && (
                            <p className="text-xs text-gray-500">+ {selectedFiles.length - 3} archivo(s) más</p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={handleFileUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? "Agregando..." : "Agregar al Timeline"}
                    </Button>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
                  <div className={`absolute top-0 right-0 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-3xl`} />
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} text-white`}>
                        <IconComponent className="w-4 h-4 lg:w-5 lg:h-5" />
                      </div>
                      <Badge variant={stat.trend === "up" ? "default" : "secondary"} className="text-xs">
                        {stat.change}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <h3 className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</h3>
                      <p className="text-xs lg:text-sm font-medium text-gray-600 leading-tight">{stat.title}</p>
                      <p className="text-xs text-gray-500">{stat.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Recent Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Recent Events */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-gray-900">
                  <Calendar className="w-5 h-5" />
                  <span>Eventos Recientes</span>
                </CardTitle>
                <Link href="/timeline">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    Ver todos
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {eventsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : featuredEvents && featuredEvents.length > 0 ? (
                <div className="space-y-4">
                  {featuredEvents.slice(0, 3).map((event, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {event.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {(() => {
                            try {
                              if (event.date && typeof event.date.toDate === 'function') {
                                return event.date.toDate().toLocaleDateString('es-ES')
                              } else if (event.date) {
                                return new Date(event.date.toString()).toLocaleDateString('es-ES')
                              }
                              return 'Fecha no disponible'
                            } catch (error) {
                              return 'Fecha no disponible'
                            }
                          })()}
                        </p>
                      </div>
                      <Badge variant="outline" className="flex-shrink-0 text-gray-700 border-gray-300">
                        {event.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600">No hay eventos recientes</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Gallery */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-gray-900">
                  <ImageIcon className="w-5 h-5" />
                  <span>Galería Reciente</span>
                </CardTitle>
                <Link href="/galeria">
                  <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                    Ver todos
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {galleryLoading ? (
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : highlightedItems && highlightedItems.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {highlightedItems.slice(0, 3).map((item, index) => (
                    <div key={index} className="group relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={item.url || "/placeholder.jpg"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600">No hay archivos recientes</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="mt-6 lg:mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-900">Accesos Rápidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-4">
                <Link href="/archivo" className="group">
                  <div className="p-3 lg:p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                    <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600 mb-2" />
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 group-hover:text-blue-700">Archivo</h3>
                    <p className="text-xs lg:text-sm text-gray-500">Explorar archivo</p>
                  </div>
                </Link>
                
                <Link href="/galeria" className="group">
                  <div className="p-3 lg:p-4 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                    <ImageIcon className="w-6 h-6 lg:w-8 lg:h-8 text-green-600 mb-2" />
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 group-hover:text-green-700">Galería</h3>
                    <p className="text-xs lg:text-sm text-gray-500">Ver multimedia</p>
                  </div>
                </Link>
                
                <Link href="/timeline" className="group">
                  <div className="p-3 lg:p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                    <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600 mb-2" />
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 group-hover:text-purple-700">Timeline</h3>
                    <p className="text-xs lg:text-sm text-gray-500">Historia CUC</p>
                  </div>
                </Link>
                
                <Link href="/gestion" className="group">
                  <div className="p-3 lg:p-4 rounded-lg border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-colors">
                    <Users className="w-6 h-6 lg:w-8 lg:h-8 text-orange-600 mb-2" />
                    <h3 className="text-sm lg:text-base font-medium text-gray-900 group-hover:text-orange-700">Gestión</h3>
                    <p className="text-xs lg:text-sm text-gray-500">Administrar</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
