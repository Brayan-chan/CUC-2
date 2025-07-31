"use client"

import { useState, useEffect } from "react"
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
import { useGallery } from "@/hooks/useFirebase"
import { useAuth } from "@/contexts/AuthContext"
import { GalleryService } from "@/lib/firebase-services"
import { GalleryItem } from "@/types"
import { toast } from "sonner"

export default function GaleriaPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

  // Firebase hooks
  const { galleryItems, loading, createGalleryItem } = useGallery()
  const { user } = useAuth()

  // Filtered gallery items
  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.tags || []).some(tag => tag?.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = selectedFilter === "all" || 
                         (item.tags || []).some(tag => tag?.toLowerCase() === selectedFilter.toLowerCase())
    
    const matchesYear = !item.year || item.year === selectedYear
    
    return matchesSearch && matchesFilter && matchesYear
  })

  // Handle like functionality
  const handleLike = async (itemId: string) => {
    if (!user) {
      toast.error("Debes iniciar sesión para dar me gusta")
      return
    }

    try {
      await GalleryService.incrementLikes(itemId)
      toast.success("¡Te gusta esta imagen!")
    } catch (error) {
      console.error("Error liking item:", error)
      toast.error("Error al dar me gusta")
    }
  }

  // Handle view increment
  const handleViewImage = async (itemId: string, index: number) => {
    try {
      await GalleryService.incrementViews(itemId)
      setSelectedImage(index)
    } catch (error) {
      console.error("Error incrementing views:", error)
      setSelectedImage(index)
    }
  }

  const getCurrentItem = () => {
    if (selectedImage === null || !filteredItems[selectedImage]) return null
    return {
      item: filteredItems[selectedImage],
      imageIndex: 0 // Since each gallery item has one main image
    }
  }

  const navigateImage = (direction: "prev" | "next") => {
    if (selectedImage === null) return
    
    if (direction === "prev") {
      setSelectedImage(selectedImage > 0 ? selectedImage - 1 : filteredItems.length - 1)
    } else {
      setSelectedImage(selectedImage < filteredItems.length - 1 ? selectedImage + 1 : 0)
    }
  }

  // Get unique years from gallery items
  const availableYears = [...new Set(galleryItems
    .map(item => item.year)
    .filter(year => year !== undefined && year !== null)
  )].sort((a, b) => b - a)

  // Get unique tags for filtering
  const availableTags = [...new Set(galleryItems.flatMap(item => item.tags || []))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Cargando galería...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center text-gray-600 hover:text-purple-600 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Volver al archivo
              </Link>
              <div className="hidden sm:block w-px h-6 bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-purple-600" />
                <h1 className="text-xl font-semibold text-gray-900">Galería Cultural</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="search"
                  placeholder="Buscar en galería..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-64 bg-gray-50 border-gray-200 focus:border-purple-400 focus:ring-purple-400/20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Search */}
        <div className="md:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="search"
              placeholder="Buscar en galería..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full bg-white border-gray-200 focus:border-purple-400 focus:ring-purple-400/20"
            />
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filtrar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {availableTags.filter(tag => tag != null && tag.trim() !== '').map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.filter(year => year != null).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Badge variant="outline" className="bg-purple-50 border-purple-200 text-purple-700">
              {filteredItems.length} elementos
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`h-8 w-8 p-0 ${
                  viewMode === "grid" 
                    ? "bg-white shadow-sm text-purple-600" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={`h-8 w-8 p-0 ${
                  viewMode === "list" 
                    ? "bg-white shadow-sm text-purple-600" 
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Gallery Content */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron elementos</h3>
            <p className="text-gray-500">
              {galleryItems.length === 0 
                ? "La galería está vacía. ¡Sube algunas imágenes para comenzar!"
                : "Intenta ajustar los filtros o términos de búsqueda."
              }
            </p>
          </div>
        ) : (
          <motion.div
            layout
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-6"
            }
          >
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {viewMode === "grid" ? (
                  <Card className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-md">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={item.url || "/placeholder.svg?height=300&width=400&text=Imagen"}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        onClick={() => handleViewImage(item.id!, index)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Action buttons */}
                      <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-gray-700"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            handleViewImage(item.id!, index)
                          }}
                        >
                          <Maximize2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="h-8 w-8 p-0 bg-white/90 hover:bg-white text-gray-700"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation()
                            handleLike(item.id!)
                          }}
                        >
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Overlay info */}
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center justify-between text-white text-sm">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Eye className="w-4 h-4" />
                              <span>{item.views}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{item.likes}</span>
                            </div>
                          </div>
                          {item.isHighlighted && (
                            <div className="flex items-center space-x-1 bg-amber-500 rounded-full px-2 py-1">
                              <Star className="w-3 h-3" />
                              <span className="text-xs font-medium">Destacado</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-200 line-clamp-2">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-700 transition-colors cursor-pointer"
                              onClick={() => setSelectedFilter(tag)}
                            >
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                              +{item.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-md">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative md:w-80 aspect-[4/3] md:aspect-[4/3] overflow-hidden">
                        <img
                          src={item.url || "/placeholder.svg?height=300&width=400&text=Imagen"}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onClick={() => handleViewImage(item.id!, index)}
                        />
                        {item.type === "video" && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Play className="w-12 h-12 text-white opacity-80" />
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="flex-1 p-6">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-200">
                              {item.title}
                            </h3>
                            {item.description && (
                              <p className="text-gray-600 mt-2">
                                {item.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {item.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-700 transition-colors cursor-pointer"
                                onClick={() => setSelectedFilter(tag)}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Eye className="w-4 h-4" />
                                <span className="text-sm">{item.views}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Heart className="w-4 h-4" />
                                <span className="text-sm">{item.likes}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">{item.year}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              {item.isHighlighted && (
                                <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                                  <Star className="w-3 h-3 mr-1" />
                                  Destacado
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleLike(item.id!)}
                                className="text-gray-600 hover:text-red-500"
                              >
                                <Heart className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewImage(item.id!, index)}
                                className="text-gray-600 hover:text-purple-600"
                              >
                                <Maximize2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="relative max-w-7xl mx-auto w-full h-full flex items-center justify-center"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white border-0 rounded-full h-12 w-12"
              >
                <X className="w-6 h-6" />
              </Button>

              {/* Navigation buttons */}
              {filteredItems.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateImage("prev")}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-0 rounded-full h-12 w-12 z-10"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigateImage("next")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white border-0 rounded-full h-12 w-12 z-10"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </Button>
                </>
              )}

              {/* Image */}
              {(() => {
                const current = getCurrentItem()
                if (!current) return null

                return (
                  <img
                    src={current.item.url || "/placeholder.svg?height=600&width=800&text=Imagen"}
                    alt={current.item.title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
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
                        {current.item.description && (
                          <p className="text-gray-300 text-sm mb-2">
                            {current.item.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-300">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {current.item.year}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {current.item.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs bg-white/20 text-white border-0">
                                {tag}
                              </Badge>
                            ))}
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(current.item.id!)}
                          className="bg-white/20 hover:bg-white/30 text-white border-0 h-8"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          Me gusta
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
