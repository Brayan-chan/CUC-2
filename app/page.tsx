"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Calendar,
  MapPin,
  Eye,
  Heart,
  Archive,
  Camera,
  Video,
  FileText,
  Star,
  TrendingUp,
  Clock,
  Tag,
} from "lucide-react"
import Link from "next/link"
import { useEvents } from "@/hooks/useEvents"
import { useAuth } from "@/hooks/useAuth"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")

  const { events, loading } = useEvents({
    status: "approved",
    limit: 50,
  })

  const { user } = useAuth()

  // Filter events based on search and filters
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory

    const eventYear = new Date(event.date).getFullYear().toString()
    const matchesYear = selectedYear === "all" || eventYear === selectedYear

    return matchesSearch && matchesCategory && matchesYear
  })

  // Get unique categories and years
  const categories = Array.from(new Set(events.map((event) => event.category)))
  const years = Array.from(new Set(events.map((event) => new Date(event.date).getFullYear().toString())))
    .sort()
    .reverse()

  // Featured events (most viewed/liked)
  const featuredEvents = events
    .filter((event) => event.status === "approved")
    .sort((a, b) => (b.views || 0) + (b.likes || 0) - ((a.views || 0) + (a.likes || 0)))
    .slice(0, 3)

  // Recent events
  const recentEvents = events
    .filter((event) => event.status === "approved")
    .sort((a, b) => new Date(b.createdAt?.toDate() || 0).getTime() - new Date(a.createdAt?.toDate() || 0).getTime())
    .slice(0, 6)

  // Statistics
  const stats = {
    totalEvents: events.filter((e) => e.status === "approved").length,
    totalImages: events.reduce((acc, event) => acc + (event.images?.length || 0), 0),
    totalVideos: events.reduce((acc, event) => acc + (event.videos?.length || 0), 0),
    totalDocuments: events.reduce((acc, event) => acc + (event.documents?.length || 0), 0),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-20 blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Archivo Histórico Cultural
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 leading-relaxed">Universidad Autónoma de Campeche</p>
            <p className="text-lg mb-12 text-gray-300 max-w-2xl mx-auto">
              Preservando la memoria cultural de nuestra institución. Explora eventos históricos, documentos,
              fotografías y testimonios que forman parte de nuestro legado universitario.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 font-semibold px-8 py-4 text-lg">
                <Archive className="w-5 h-5 mr-2" />
                Explorar Archivo
              </Button>
              {user && (
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-purple-900 font-semibold px-8 py-4 text-lg bg-transparent"
                  asChild
                >
                  <Link href="/upload">
                    <Camera className="w-5 h-5 mr-2" />
                    Contribuir
                  </Link>
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Archive className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalEvents}</h3>
              <p className="text-gray-600">Eventos Históricos</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalImages}</h3>
              <p className="text-gray-600">Fotografías</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Video className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalVideos}</h3>
              <p className="text-gray-600">Videos</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalDocuments}</h3>
              <p className="text-gray-600">Documentos</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Buscar en el Archivo</h2>

              <div className="space-y-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Buscar eventos, personas, lugares..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 bg-gray-50 border-gray-200 focus:border-purple-300 focus:ring-purple-200 text-lg p-4 rounded-xl"
                  />
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:border-purple-300 focus:ring-purple-200"
                    >
                      <option value="all">Todas las categorías</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:border-purple-300 focus:ring-purple-200"
                    >
                      <option value="all">Todos los años</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Eventos Destacados</h2>
                  <p className="text-gray-600">Los eventos más populares de nuestro archivo</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * index }}
                  >
                    <Card className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                      <div className="relative">
                        {event.images && event.images.length > 0 ? (
                          <img
                            src={event.images[0] || "/placeholder.svg"}
                            alt={event.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
                            <Archive className="w-12 h-12 text-white" />
                          </div>
                        )}
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-yellow-500 text-white">
                            <Star className="w-3 h-3 mr-1" />
                            Destacado
                          </Badge>
                        </div>
                      </div>

                      <CardHeader>
                        <CardTitle className="line-clamp-2 group-hover:text-purple-600 transition-colors">
                          {event.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {format(new Date(event.date), "dd 'de' MMMM, yyyy", { locale: es })}
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {event.views || 0}
                              </span>
                              <span className="flex items-center">
                                <Heart className="w-4 h-4 mr-1" />
                                {event.likes || 0}
                              </span>
                            </div>
                            <Badge variant="secondary">{event.category}</Badge>
                          </div>

                          <Button className="w-full mt-4" asChild>
                            <Link href={`/evento/${event.id}`}>Ver Detalles</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Events Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {searchTerm || selectedCategory !== "all" || selectedYear !== "all"
                    ? "Resultados de Búsqueda"
                    : "Eventos Recientes"}
                </h2>
                <p className="text-gray-600">
                  {filteredEvents.length} evento{filteredEvents.length !== 1 ? "s" : ""} encontrado
                  {filteredEvents.length !== 1 ? "s" : ""}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="w-full h-48 bg-gray-200"></div>
                    <CardHeader>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-16">
                <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No se encontraron eventos</h3>
                <p className="text-gray-600 mb-6">Intenta ajustar tus filtros de búsqueda</p>
                <Button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedCategory("all")
                    setSelectedYear("all")
                  }}
                  variant="outline"
                >
                  Limpiar Filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * (index % 6) }}
                  >
                    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden h-full">
                      <div className="relative">
                        {event.images && event.images.length > 0 ? (
                          <img
                            src={event.images[0] || "/placeholder.svg"}
                            alt={event.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-r from-gray-400 to-gray-600 flex items-center justify-center">
                            <Archive className="w-12 h-12 text-white" />
                          </div>
                        )}

                        {/* Media indicators */}
                        <div className="absolute top-4 right-4 flex space-x-2">
                          {event.images && event.images.length > 0 && (
                            <Badge className="bg-blue-500 text-white text-xs">
                              <Camera className="w-3 h-3 mr-1" />
                              {event.images.length}
                            </Badge>
                          )}
                          {event.videos && event.videos.length > 0 && (
                            <Badge className="bg-red-500 text-white text-xs">
                              <Video className="w-3 h-3 mr-1" />
                              {event.videos.length}
                            </Badge>
                          )}
                          {event.documents && event.documents.length > 0 && (
                            <Badge className="bg-green-500 text-white text-xs">
                              <FileText className="w-3 h-3 mr-1" />
                              {event.documents.length}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <CardHeader className="pb-3">
                        <CardTitle className="line-clamp-2 group-hover:text-purple-600 transition-colors text-lg">
                          {event.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                      </CardHeader>

                      <CardContent className="pt-0 flex-1 flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2" />
                            {format(new Date(event.date), "dd 'de' MMMM, yyyy", { locale: es })}
                          </div>

                          {event.location && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2" />
                              {event.location}
                            </div>
                          )}

                          {event.tags && event.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {event.tags.slice(0, 3).map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="outline" className="text-xs">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                              {event.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{event.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="flex items-center justify-between text-sm text-gray-500 pt-2">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {event.views || 0}
                              </span>
                              <span className="flex items-center">
                                <Heart className="w-4 h-4 mr-1" />
                                {event.likes || 0}
                              </span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {event.category}
                            </Badge>
                          </div>
                        </div>

                        <Button className="w-full mt-4" asChild>
                          <Link href={`/evento/${event.id}`}>Ver Detalles</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      {user && (
        <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4">¿Tienes contenido histórico para compartir?</h2>
              <p className="text-xl mb-8 text-purple-100">Ayúdanos a preservar la memoria cultural de la UACAM</p>
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8 py-4" asChild>
                <Link href="/upload">
                  <Camera className="w-5 h-5 mr-2" />
                  Contribuir al Archivo
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Archivo Histórico Cultural</h3>
              <p className="text-gray-400">Preservando la memoria de la Universidad Autónoma de Campeche</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/galeria" className="hover:text-white transition-colors">
                    Galería
                  </Link>
                </li>
                <li>
                  <Link href="/timeline" className="hover:text-white transition-colors">
                    Línea de Tiempo
                  </Link>
                </li>
                <li>
                  <Link href="/archivo" className="hover:text-white transition-colors">
                    Archivo
                  </Link>
                </li>
                {user && (
                  <li>
                    <Link href="/upload" className="hover:text-white transition-colors">
                      Contribuir
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Contacto</h4>
              <p className="text-gray-400">
                Dirección General de Difusión Cultural
                <br />
                Universidad Autónoma de Campeche
                <br />© 2024 Todos los derechos reservados
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
