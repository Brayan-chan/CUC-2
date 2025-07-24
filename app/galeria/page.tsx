"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Grid3X3,
  List,
  ArrowLeft,
  Heart,
  Share2,
  Download,
  Play,
  Eye,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Sparkles,
  Star,
  Calendar,
  ImageIcon,
} from "lucide-react"
import Link from "next/link"

export default function GaleriaPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  const galleryItems = [
    {
      id: 1,
      title: "Festival Internacional de Danza 2024",
      type: "Danza",
      date: "15 de Marzo, 2024",
      location: "Teatro Principal UACAM",
      images: [
        "/placeholder.svg?height=400&width=600&text=Danza+1",
        "/placeholder.svg?height=400&width=600&text=Danza+2",
        "/placeholder.svg?height=400&width=600&text=Danza+3",
      ],
      thumbnail: "/placeholder.svg?height=300&width=400&text=Festival+Danza",
      likes: 245,
      views: 1834,
      isVideo: false,
      gradient: "from-pink-500 to-rose-500",
      featured: true,
    },
    {
      id: 2,
      title: "Concierto de Jazz Universitario",
      type: "Música",
      date: "22 de Febrero, 2024",
      location: "Auditorio Central",
      images: [
        "/placeholder.svg?height=400&width=600&text=Jazz+1",
        "/placeholder.svg?height=400&width=600&text=Jazz+2",
      ],
      thumbnail: "/placeholder.svg?height=300&width=400&text=Jazz+Concert",
      likes: 189,
      views: 1245,
      isVideo: true,
      gradient: "from-blue-500 to-cyan-500",
      featured: false,
    },
    {
      id: 3,
      title: "Exposición de Arte Digital",
      type: "Arte Visual",
      date: "8 de Abril, 2024",
      location: "Galería Universitaria",
      images: [
        "/placeholder.svg?height=400&width=600&text=Arte+1",
        "/placeholder.svg?height=400&width=600&text=Arte+2",
        "/placeholder.svg?height=400&width=600&text=Arte+3",
        "/placeholder.svg?height=400&width=600&text=Arte+4",
      ],
      thumbnail: "/placeholder.svg?height=300&width=400&text=Arte+Digital",
      likes: 156,
      views: 987,
      isVideo: false,
      gradient: "from-purple-500 to-indigo-500",
      featured: true,
    },
    {
      id: 4,
      title: "Día de Muertos - Altar Monumental",
      type: "Tradición",
      date: "25 de Octubre, 2023",
      location: "Explanada Principal",
      images: [
        "/placeholder.svg?height=400&width=600&text=Altar+1",
        "/placeholder.svg?height=400&width=600&text=Altar+2",
        "/placeholder.svg?height=400&width=600&text=Altar+3",
      ],
      thumbnail: "/placeholder.svg?height=300&width=400&text=Dia+Muertos",
      likes: 312,
      views: 2156,
      isVideo: false,
      gradient: "from-orange-500 to-red-500",
      featured: true,
    },
    {
      id: 5,
      title: "Taller de Fotografía Artística",
      type: "Fotografía",
      date: "10 de Marzo, 2024",
      location: "Laboratorio de Medios",
      images: [
        "/placeholder.svg?height=400&width=600&text=Foto+1",
        "/placeholder.svg?height=400&width=600&text=Foto+2",
      ],
      thumbnail: "/placeholder.svg?height=300&width=400&text=Fotografia",
      likes: 98,
      views: 567,
      isVideo: true,
      gradient: "from-green-500 to-emerald-500",
      featured: false,
    },
    {
      id: 6,
      title: "Recital de Poesía Estudiantil",
      type: "Literatura",
      date: "5 de Mayo, 2024",
      location: "Biblioteca Central",
      images: ["/placeholder.svg?height=400&width=600&text=Poesia"],
      thumbnail: "/placeholder.svg?height=300&width=400&text=Recital+Poesia",
      likes: 87,
      views: 423,
      isVideo: false,
      gradient: "from-indigo-500 to-purple-500",
      featured: false,
    },
  ]

  const filteredItems = galleryItems.filter((item) => {
    const matchesFilter = selectedFilter === "all" || item.type === selectedFilter
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const types = ["all", ...Array.from(new Set(galleryItems.map((item) => item.type)))]

  const openLightbox = (itemId: number, imageIndex = 0) => {
    setSelectedImage(itemId * 1000 + imageIndex)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const getCurrentItem = () => {
    if (!selectedImage) return null
    const itemId = Math.floor(selectedImage / 1000)
    const imageIndex = selectedImage % 1000
    const item = galleryItems.find((i) => i.id === itemId)
    return item ? { item, imageIndex } : null
  }

  const navigateLightbox = (direction: "prev" | "next") => {
    const current = getCurrentItem()
    if (!current) return

    const { item, imageIndex } = current
    let newIndex = imageIndex

    if (direction === "next") {
      newIndex = imageIndex + 1 >= item.images.length ? 0 : imageIndex + 1
    } else {
      newIndex = imageIndex - 1 < 0 ? item.images.length - 1 : imageIndex - 1
    }

    setSelectedImage(item.id * 1000 + newIndex)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 hover:text-purple-600 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Inicio
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Galería Cultural
                  </h1>
                  <p className="text-sm text-gray-500">Archivo Visual Interactivo</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gray-100 rounded-full p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`rounded-full ${viewMode === "grid" ? "bg-white shadow-sm" : ""}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`rounded-full ${viewMode === "list" ? "bg-white shadow-sm" : ""}`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Filters */}
      <div className="bg-white/60 backdrop-blur-xl border-b border-gray-200/50 sticky top-20 z-30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center space-x-2 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar en la galería..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-40 bg-white/80 border-gray-200 focus:border-purple-300">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "Todas las categorías" : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 hover:border-purple-300 hover:bg-purple-50 bg-white/80"
              >
                <Filter className="w-4 h-4 mr-2" />
                Más filtros
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery Content */}
      <div className="container mx-auto px-6 py-8">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Card className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:scale-105">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={item.thumbnail || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} opacity-40`} />

                    {/* Featured Badge */}
                    {item.featured && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-none shadow-lg">
                          <Star className="w-3 h-3 mr-1" />
                          Destacado
                        </Badge>
                      </div>
                    )}

                    {/* Video indicator */}
                    {item.isVideo && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-red-500/90 text-white border-none shadow-lg">
                          <Play className="w-3 h-3 mr-1" />
                          Video
                        </Badge>
                      </div>
                    )}

                    {/* Image count */}
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-black/70 text-white border-none backdrop-blur-sm">
                        <ImageIcon className="w-3 h-3 mr-1" />
                        {item.images.length}
                      </Badge>
                    </div>

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex space-x-3">
                        <Button
                          size="sm"
                          className="bg-white/90 text-gray-900 hover:bg-white shadow-lg"
                          onClick={() => openLightbox(item.id, 0)}
                        >
                          <Maximize2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" className="bg-white/90 text-gray-900 hover:bg-white shadow-lg">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Stats Overlay */}
                    <div className="absolute bottom-3 right-3 flex space-x-2">
                      <div className="bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                        <Eye className="w-3 h-3 text-white" />
                        <span className="text-xs font-medium text-white">{item.views}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant="outline"
                        className={`bg-gradient-to-r ${item.gradient} text-white border-none text-xs`}
                      >
                        {item.type}
                      </Badge>
                      <span className="text-gray-500 text-xs">{item.date}</span>
                    </div>

                    <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {item.title}
                    </h3>

                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{item.location}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-gray-500 text-sm">
                        <div className="flex items-center">
                          <Eye className="w-3 h-3 mr-1" />
                          {item.views}
                        </div>
                        <div className="flex items-center">
                          <Heart className="w-3 h-3 mr-1 text-red-500" />
                          {item.likes}
                        </div>
                      </div>

                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-500">
                        <Heart className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="grid md:grid-cols-3 gap-0">
                    <div className="relative aspect-[4/3] md:aspect-auto">
                      <img
                        src={item.thumbnail || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-30`} />

                      {item.featured && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-none">
                            <Star className="w-3 h-3 mr-1" />
                            Destacado
                          </Badge>
                        </div>
                      )}

                      {item.isVideo && (
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-red-500/90 text-white border-none">
                            <Play className="w-3 h-3 mr-1" />
                            Video
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="md:col-span-2 p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className={`bg-gradient-to-r ${item.gradient} text-white border-none`}>
                          {item.type}
                        </Badge>
                        <span className="text-gray-500 text-sm">{item.date}</span>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-purple-600 transition-colors">
                        {item.title}
                      </h3>

                      <div className="flex items-center text-gray-500 mb-4">
                        <MapPin className="w-4 h-4 mr-2" />
                        {item.location}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-gray-500">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-2" />
                            {item.views} visualizaciones
                          </div>
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-2 text-red-500" />
                            {item.likes} me gusta
                          </div>
                          <div className="text-sm">
                            <ImageIcon className="w-4 h-4 mr-1 inline" />
                            {item.images.length} imágenes
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-200 hover:border-purple-300 hover:bg-purple-50 bg-transparent"
                            onClick={() => openLightbox(item.id, 0)}
                          >
                            Ver Galería
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-600">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-green-600">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modern Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Close button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-white hover:bg-white/20 z-10 rounded-full"
                onClick={closeLightbox}
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Navigation buttons */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10 rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateLightbox("prev")
                }}
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10 rounded-full"
                onClick={(e) => {
                  e.stopPropagation()
                  navigateLightbox("next")
                }}
              >
                <ChevronRight className="w-8 h-8" />
              </Button>

              {/* Image */}
              {(() => {
                const current = getCurrentItem()
                if (!current) return null

                return (
                  <motion.img
                    key={selectedImage}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    src={current.item.images[current.imageIndex]}
                    alt={current.item.title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                )
              })()}

              {/* Image info */}
              {(() => {
                const current = getCurrentItem()
                if (!current) return null

                return (
                  <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{current.item.title}</h3>
                        <p className="text-gray-300 text-sm mb-2">
                          Imagen {current.imageIndex + 1} de {current.item.images.length}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-300">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {current.item.date}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {current.item.location}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 bg-white/20 rounded-full px-3 py-1">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{current.item.views}</span>
                        </div>
                        <div className="flex items-center space-x-1 bg-white/20 rounded-full px-3 py-1">
                          <Heart className="w-4 h-4 text-red-400" />
                          <span className="text-sm">{current.item.likes}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
