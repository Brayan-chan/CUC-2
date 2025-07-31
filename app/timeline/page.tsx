"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MapPin,
  Users,
  Play,
  ImageIcon,
  Filter,
  Search,
  ArrowLeft,
  Maximize2,
  Clock,
  Sparkles,
  Eye,
  Heart,
  Share2,
  Star,
  Award,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useTimelineYears, useTimelineEventsByYear } from "@/hooks/useFirebase"
import { TimelineService } from "@/lib/firebase-services"
import { TimelineEvent } from "@/types"
import { useAuth } from "@/contexts/AuthContext"

export default function TimelinePage() {
  const [selectedYear, setSelectedYear] = useState<string>("")
  const [selectedType, setSelectedType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isMounted, setIsMounted] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [likingEvents, setLikingEvents] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  
  // Firebase hooks - Simplificamos para evitar errores de índices
  const { years, loading: yearsLoading } = useTimelineYears()
  // Temporalmente usamos solo consultas por año para evitar problemas de índices
  const { events, loading: eventsLoading } = useTimelineEventsByYear(selectedYear ? parseInt(selectedYear) : new Date().getFullYear())
  const { user } = useAuth()

  // Ensure component is mounted (client-side hydration)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Set initial year when years are loaded
  useEffect(() => {
    if (years.length > 0 && !selectedYear) {
      setSelectedYear(years[0].toString())
    } else if (years.length === 0 && !selectedYear && !yearsLoading) {
      // Si no hay años disponibles, usar el año actual
      setSelectedYear(new Date().getFullYear().toString())
    }
  }, [years, selectedYear, yearsLoading])

  // Filter events based on search and type
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || event.type === selectedType
    return matchesSearch && matchesType
  })

  // Sort events by date (most recent first)
  const sortedEvents = filteredEvents.sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return dateB.getTime() - dateA.getTime()
  })

  const handleLike = async (eventId: string | undefined) => {
    try {
      if (eventId && user) {
        // Agregar al estado de "liking" para mostrar feedback visual
        setLikingEvents(prev => new Set(prev).add(eventId))
        
        await TimelineService.incrementLikes(eventId)
        
        // Simular actualización local del contador (opcional)
        // Esto es temporal hasta que los índices de Firebase estén configurados
        console.log("Like agregado por:", user.displayName || user.email)
        
        // Remover del estado de "liking" después de un delay
        setTimeout(() => {
          setLikingEvents(prev => {
            const newSet = new Set(prev)
            newSet.delete(eventId)
            return newSet
          })
        }, 1000)
        
      } else if (!user) {
        // Redirigir al login si no está autenticado
        window.location.href = '/login'
      }
    } catch (error) {
      console.error("Error liking event:", error)
      // Remover del estado de "liking" en caso de error
      if (eventId) {
        setLikingEvents(prev => {
          const newSet = new Set(prev)
          newSet.delete(eventId)
          return newSet
        })
      }
    }
  }

  const handleView = async (eventId: string | undefined) => {
    try {
      if (eventId) {
        await TimelineService.incrementViews(eventId)
      }
    } catch (error) {
      console.error("Error incrementing views:", error)
    }
  }

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc)
  }

  const handleShowDetails = (event: TimelineEvent) => {
    setSelectedEvent(event)
    setShowDetails(true)
  }

  const closeModal = () => {
    setSelectedImage(null)
    setSelectedEvent(null)
    setShowDetails(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const getEventGradient = (type: string) => {
    const gradients: Record<string, string> = {
      'Danza': 'from-pink-500 via-purple-500 to-indigo-500',
      'Música': 'from-amber-500 via-orange-500 to-red-500',
      'Teatro': 'from-emerald-500 via-teal-500 to-cyan-500',
      'Arte': 'from-cyan-500 via-blue-500 to-purple-500',
      'Literatura': 'from-indigo-500 via-purple-500 to-pink-500',
      'Otro': 'from-gray-500 via-slate-500 to-zinc-500'
    }
    return gradients[type] || gradients['Otro']
  }

  // Get unique types for filter dropdown
  const types = ["all", "Danza", "Música", "Teatro", "Arte", "Literatura", "Otro"]

  // Don't render until component is mounted (prevents hydration issues)
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="text-gray-600">Cargando cronología...</p>
        </div>
      </div>
    )
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
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Cronología Cultural
                  </h1>
                  <p className="text-sm text-gray-500">Historia Temporal Interactiva</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200 px-3 py-1">
                <Zap className="w-4 h-4 mr-2" />
                {sortedEvents.length} Eventos
              </Badge>
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
                  placeholder="Buscar eventos históricos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={selectedYear} onValueChange={setSelectedYear} disabled={yearsLoading}>
                <SelectTrigger className="w-32 bg-white/80 border-gray-200 focus:border-purple-300">
                  <SelectValue placeholder={yearsLoading ? "Cargando..." : "Año"} />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
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

      {/* Loading State */}
      {eventsLoading && (
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      )}

      {/* No Events State */}
      {!eventsLoading && sortedEvents.length === 0 && (
        <div className="container mx-auto px-6 py-8">
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay eventos</h3>
            <p className="text-gray-500">No se encontraron eventos para los filtros seleccionados.</p>
          </div>
        </div>
      )}

      {/* Modern Timeline */}
      {!eventsLoading && sortedEvents.length > 0 && (
        <div className="container mx-auto px-6 py-8" ref={containerRef}>
          <div className="relative max-w-6xl mx-auto">
            {/* Animated Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-cyan-500 rounded-full shadow-lg" />

            {/* Events */}
            <div className="space-y-16">
              {sortedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  {/* Animated Timeline Dot */}
                  <motion.div
                    className="absolute left-6 w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full border-4 border-white shadow-xl z-10 group-hover:scale-125 transition-transform duration-300"
                    whileHover={{ scale: 1.3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse opacity-50"></div>
                  </motion.div>

                  {/* Modern Event Card */}
                  <div className="ml-20">
                    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                      <Card className="bg-white border-0 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden group-hover:shadow-purple-200/50">
                        <div className="grid lg:grid-cols-2 gap-0">
                          {/* Image Section */}
                          <div className="relative aspect-[4/3] lg:aspect-auto overflow-hidden">
                            <img
                              src={event.images && event.images.length > 0 ? event.images[0] : "/placeholder.svg"}
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 cursor-pointer hover:brightness-110"
                              onClick={() => {
                                handleView(event.id)
                                handleImageClick(event.images && event.images.length > 0 ? event.images[0] : "/placeholder.svg")
                              }}
                            />
                            <div className={`absolute inset-0 bg-gradient-to-r ${getEventGradient(event.type)} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />

                            {/* Date Badge */}
                            <div className="absolute top-4 left-4">
                              <Badge className="bg-white/90 text-gray-900 font-bold text-lg px-4 py-2 shadow-lg">
                                {formatDate(event.date)}
                              </Badge>
                            </div>

                            {/* Stats Overlay */}
                            <div className="absolute bottom-4 left-4 flex space-x-2">
                              <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                                <Eye className="w-3 h-3 text-white" />
                                <span className="text-xs font-medium text-white">{event.views || 0}</span>
                              </div>
                              <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                                <Heart className="w-3 h-3 text-red-400" />
                                <span className="text-xs font-medium text-white">{event.likes || 0}</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {event.videos && event.videos.length > 0 && (
                                <Button 
                                  size="sm" 
                                  className="bg-white/90 text-gray-900 hover:bg-white shadow-lg"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    // Aquí puedes agregar lógica para reproducir video
                                    console.log("Play video:", event.videos?.[0])
                                  }}
                                >
                                  <Play className="w-4 h-4" />
                                </Button>
                              )}
                              <Button 
                                size="sm" 
                                className="bg-white/90 text-gray-900 hover:bg-white shadow-lg"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleImageClick(event.images && event.images.length > 0 ? event.images[0] : "/placeholder.svg")
                                }}
                              >
                                <Maximize2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Content Section */}
                          <CardContent className="p-8 flex flex-col justify-center">
                            <div className="space-y-6">
                              <div className="flex items-center justify-between">
                                <Badge
                                  variant="outline"
                                  className={`bg-gradient-to-r ${getEventGradient(event.type)} text-white border-none font-medium px-4 py-2`}
                                >
                                  {event.type}
                                </Badge>
                                <span className="text-gray-500 font-medium">{formatDate(event.date)}</span>
                              </div>

                              <div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-4 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                                  {event.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed text-lg">{event.description}</p>
                              </div>

                              <div className="space-y-4">
                                <div className="flex items-center text-gray-500">
                                  <MapPin className="w-5 h-5 mr-3 text-purple-500" />
                                  <span className="font-medium">{event.location}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="flex items-center text-gray-500">
                                    <Users className="w-5 h-5 mr-3 text-blue-500" />
                                    <span className="font-medium">{event.participants || 0} participantes</span>
                                  </div>

                                  <div className="flex items-center space-x-4 text-gray-500">
                                    <div className="flex items-center">
                                      <ImageIcon className="w-4 h-4 mr-2 text-green-500" />
                                      <span className="font-medium">{event.images?.length || 0}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Play className="w-4 h-4 mr-2 text-red-500" />
                                      <span className="font-medium">{event.videos?.length || 0}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="flex items-center space-x-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className={`border-gray-200 hover:border-red-300 hover:bg-red-50 bg-transparent transition-all duration-200 ${
                                      likingEvents.has(event.id || '') ? 'scale-110' : ''
                                    } ${!user ? 'hover:border-purple-300 hover:bg-purple-50' : ''}`}
                                    onClick={() => handleLike(event.id)}
                                    disabled={likingEvents.has(event.id || '')}
                                    title={!user ? 'Inicia sesión para dar me gusta' : 'Me gusta este evento'}
                                  >
                                    {likingEvents.has(event.id || '') ? (
                                      <div className="w-4 h-4 mr-2 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <Heart className={`w-4 h-4 mr-2 ${user ? 'hover:text-red-500' : 'hover:text-purple-500'} transition-colors`} />
                                    )}
                                    {!user ? 'Inicia sesión' : `Me gusta (${event.likes || 0})`}
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="border-gray-200 hover:border-purple-300 hover:bg-purple-50 bg-transparent"
                                    onClick={() => handleShowDetails(event)}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Ver Detalles
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-gray-400 hover:text-purple-600"
                                    onClick={() => {
                                      // Compartir funcionalidad
                                      if (navigator.share) {
                                        navigator.share({
                                          title: event.title,
                                          text: event.description,
                                          url: window.location.href
                                        })
                                      } else {
                                        // Fallback para navegadores sin soporte
                                        navigator.clipboard.writeText(window.location.href)
                                        console.log('URL copiada al portapapeles')
                                      }
                                    }}
                                  >
                                    <Share2 className="w-4 h-4" />
                                  </Button>
                                </div>
                                <Button
                                  size="sm"
                                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                                  onClick={() => {
                                    // Navegar a galería relacionada o mostrar más imágenes
                                    if (event.images && event.images.length > 1) {
                                      handleShowDetails(event)
                                    }
                                  }}
                                >
                                  Explorar Galería ({event.images?.length || 0})
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* End of Timeline */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative mt-16"
            >
              <div className="absolute left-6 w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full border-4 border-white shadow-lg" />
              <div className="ml-20">
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-dashed border-purple-200 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <div className="space-y-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                        <Sparkles className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                          Continuamos Escribiendo Historia
                        </h3>
                        <p className="text-gray-600 text-lg mb-6 max-w-md mx-auto">
                          La rica tradición cultural de UACAM sigue creciendo cada día con nuevos eventos y experiencias
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/dashboard">
                          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                            Contribuir Evento
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="border-purple-200 text-purple-600 hover:bg-purple-50 bg-transparent"
                        >
                          <Award className="w-4 h-4 mr-2" />
                          Ver Estadísticas
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </div>
      )}

      {/* Modal para visualización de imagen */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Vista ampliada"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Modal para detalles del evento */}
      {showDetails && selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              {/* Header del modal */}
              <div className="p-6 border-b border-gray-200">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-900 pr-8">{selectedEvent.title}</h2>
                <p className="text-gray-600 mt-2">{formatDate(selectedEvent.date)} • {selectedEvent.location}</p>
              </div>

              {/* Contenido del modal */}
              <div className="p-6 space-y-6">
                {/* Imagen principal */}
                {selectedEvent.images && selectedEvent.images.length > 0 && (
                  <div className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={selectedEvent.images[0]}
                      alt={selectedEvent.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Descripción */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                  <p className="text-gray-700 leading-relaxed">{selectedEvent.description}</p>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-blue-500" />
                      <span className="text-gray-700">{selectedEvent.participants || 0} participantes</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-5 h-5 text-green-500" />
                      <span className="text-gray-700">{selectedEvent.views || 0} visualizaciones</span>
                    </div>
                  </div>
                </div>

                {/* Galería de imágenes adicionales */}
                {selectedEvent.images && selectedEvent.images.length > 1 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Galería ({selectedEvent.images.length} imágenes)
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedEvent.images.slice(1, 7).map((image, index) => (
                        <div 
                          key={index}
                          className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => handleImageClick(image)}
                        >
                          <img
                            src={image}
                            alt={`${selectedEvent.title} - ${index + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {selectedEvent.images.length > 7 && (
                        <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                          +{selectedEvent.images.length - 6} más
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => handleLike(selectedEvent.id)}
                    disabled={likingEvents.has(selectedEvent.id || '')}
                    className="flex items-center space-x-2"
                  >
                    {likingEvents.has(selectedEvent.id || '') ? (
                      <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Heart className="w-4 h-4" />
                    )}
                    <span>Me gusta ({selectedEvent.likes || 0})</span>
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    onClick={() => {
                      // Aquí puedes agregar navegación a la galería completa
                      console.log("Navegar a galería completa")
                    }}
                  >
                    Ver galería completa
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
