"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Heart,
  Share2,
  Eye,
  ArrowRight,
  Sparkles,
  Star,
  BookOpen,
  Camera,
  Music,
  Palette,
  Theater,
  GraduationCap,
  Award,
  TrendingUp,
  Zap,
  Globe,
  Shield,
  Database,
  ChevronRight,
  Play,
  ExternalLink,
  Upload,
} from "lucide-react"
import Link from "next/link"
import { useEvents } from "@/hooks/useEvents"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("todos")
  const [selectedYear, setSelectedYear] = useState("todos")
  const { events, loading } = useEvents()
  const { user } = useAuth()

  const categories = [
    { id: "todos", name: "Todos", icon: Globe, color: "from-gray-500 to-slate-500" },
    { id: "musica", name: "Música", icon: Music, color: "from-purple-500 to-pink-500" },
    { id: "teatro", name: "Teatro", icon: Theater, color: "from-blue-500 to-cyan-500" },
    { id: "danza", name: "Danza", icon: Users, color: "from-green-500 to-emerald-500" },
    { id: "arte", name: "Arte", icon: Palette, color: "from-orange-500 to-red-500" },
    { id: "literatura", name: "Literatura", icon: BookOpen, color: "from-indigo-500 to-purple-500" },
    { id: "fotografia", name: "Fotografía", icon: Camera, color: "from-yellow-500 to-orange-500" },
  ]

  const years = ["todos", "2024", "2023", "2022", "2021", "2020"]

  const stats = [
    {
      title: "Eventos Documentados",
      value: "1,247",
      change: "+156 este año",
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Archivos Multimedia",
      value: "8,934",
      change: "+1,234 este mes",
      icon: Database,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      title: "Años de Historia",
      value: "25+",
      change: "desde 1999",
      icon: Award,
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Colaboradores",
      value: "89",
      change: "activos",
      icon: Users,
      gradient: "from-orange-500 to-red-500",
    },
  ]

  const featuredEvents = events?.filter((event) => event.featured && event.status === "approved").slice(0, 6) || []
  const recentEvents = events?.filter((event) => event.status === "approved").slice(0, 8) || []

  const filteredEvents = recentEvents.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "todos" || event.type === selectedCategory
    const matchesYear = selectedYear === "todos" || event.year === selectedYear

    return matchesSearch && matchesCategory && matchesYear
  })

  const handleLike = async (eventId: string) => {
    if (!user) {
      toast.error("Debes iniciar sesión para dar like")
      return
    }

    try {
      // Aquí implementarías la lógica para dar like
      toast.success("¡Like agregado!")
    } catch (error) {
      toast.error("Error al dar like")
    }
  }

  const handleShare = async (event: any) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        toast.success("Enlace copiado al portapapeles")
      }
    } catch (error) {
      toast.error("Error al compartir")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-20 blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="relative container mx-auto px-6 py-24">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-2xl">
                  <GraduationCap className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                Archivo Histórico
                <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Cultural UACAM
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-purple-100 mb-8 leading-relaxed">
                Preservando y compartiendo 25 años de memoria cultural universitaria. Un museo digital interactivo de
                nuestros eventos más significativos.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link href="/timeline">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-2xl text-lg px-8 py-4"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Explorar Timeline
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/galeria">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm text-lg px-8 py-4 bg-transparent"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Ver Galería
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-purple-200">{stat.title}</div>
                  <div className="text-xs text-purple-300">{stat.change}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-gray-900">Cultural UACAM</span>
              </Link>

              <div className="hidden md:flex items-center space-x-6">
                <Link href="/timeline" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                  Timeline
                </Link>
                <Link href="/galeria" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                  Galería
                </Link>
                <Link href="/archivo" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                  Archivo
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200">
                    <Shield className="w-3 h-3 mr-1" />
                    {user.displayName || user.email}
                  </Badge>
                  <Link href="/dashboard">
                    <Button variant="outline" size="sm">
                      Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <Link href="/login">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                    Iniciar Sesión
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        {/* Featured Events */}
        {featuredEvents.length > 0 && (
          <section className="mb-16">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
                Eventos Destacados
              </h2>
              <p className="text-xl text-gray-600">Los momentos más significativos de nuestra historia cultural</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
                    <div className="relative">
                      {event.images && event.images.length > 0 ? (
                        <img
                          src={event.images[0].url || "/placeholder.svg"}
                          alt={event.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div
                          className={`w-full h-48 bg-gradient-to-r ${event.gradient || "from-purple-500 to-pink-500"} flex items-center justify-center`}
                        >
                          <Calendar className="w-12 h-12 text-white" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-purple-700 border-0">
                          <Star className="w-3 h-3 mr-1" />
                          Destacado
                        </Badge>
                      </div>
                      {event.videos && event.videos.length > 0 && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                            <Play className="w-6 h-6 text-purple-600 ml-1" />
                          </div>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {event.type}
                        </Badge>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {event.date}
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {event.views || 0}
                          </div>
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {event.likes || 0}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {event.participants || 0}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(event.id!)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleShare(event)}
                            className="text-gray-500 hover:text-blue-500"
                          >
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Search and Filters */}
        <section className="mb-12">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Buscar eventos, artistas, fechas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/80 border-gray-200 focus:border-purple-300 focus:ring-purple-200 text-lg"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="min-w-[150px]">
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white/80 border border-gray-200 rounded-md focus:border-purple-300 focus:ring-purple-200"
                    >
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="min-w-[120px]">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full px-3 py-2 bg-white/80 border border-gray-200 rounded-md focus:border-purple-300 focus:ring-purple-200"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year === "todos" ? "Todos los años" : year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Categories */}
        <section className="mb-12">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-300 ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : "bg-white/80 text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span className="font-medium">{category.name}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Events Grid */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Eventos Recientes
            </h2>
            <div className="flex items-center text-sm text-gray-500">
              <TrendingUp className="w-4 h-4 mr-2" />
              {filteredEvents.length} eventos encontrados
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="bg-white border-0 shadow-lg">
                  <div className="w-full h-48 bg-gray-200 animate-pulse" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="relative">
                        {event.images && event.images.length > 0 ? (
                          <img
                            src={event.images[0].url || "/placeholder.svg"}
                            alt={event.title}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div
                            className={`w-full h-40 bg-gradient-to-r ${event.gradient || "from-gray-400 to-gray-600"} flex items-center justify-center`}
                          >
                            <Calendar className="w-8 h-8 text-white" />
                          </div>
                        )}

                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-white/90 text-xs">
                            {event.type}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="p-4">
                        <div className="flex items-center text-xs text-gray-500 mb-2">
                          <Calendar className="w-3 h-3 mr-1" />
                          {event.date}
                          {event.location && (
                            <>
                              <MapPin className="w-3 h-3 ml-2 mr-1" />
                              {event.location}
                            </>
                          )}
                        </div>

                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                          {event.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <div className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {event.views || 0}
                            </div>
                            <div className="flex items-center">
                              <Heart className="w-3 h-3 mr-1" />
                              {event.likes || 0}
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No se encontraron eventos</h3>
              <p className="text-gray-600 mb-6">Intenta ajustar los filtros o términos de búsqueda</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("todos")
                  setSelectedYear("todos")
                }}
                variant="outline"
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="mt-20 text-center">
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 border-0 text-white">
            <CardContent className="p-12">
              <div className="max-w-2xl mx-auto">
                <Zap className="w-16 h-16 mx-auto mb-6 text-purple-200" />
                <h2 className="text-3xl font-bold mb-4">¿Tienes eventos culturales para compartir?</h2>
                <p className="text-xl text-purple-100 mb-8">
                  Únete a nuestra comunidad y ayuda a preservar la memoria cultural de UACAM
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/login">
                    <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                      <Users className="w-5 h-5 mr-2" />
                      Unirse como Colaborador
                    </Button>
                  </Link>
                  <Link href="/upload">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white text-white hover:bg-white/10 bg-transparent"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Subir Contenido
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold">Cultural UACAM</span>
              </div>
              <p className="text-gray-400 mb-4">
                Preservando y compartiendo la rica historia cultural de la Universidad Autónoma de Campeche.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Explorar</h3>
              <div className="space-y-2">
                <Link href="/timeline" className="block text-gray-400 hover:text-white transition-colors">
                  Timeline Histórico
                </Link>
                <Link href="/galeria" className="block text-gray-400 hover:text-white transition-colors">
                  Galería Multimedia
                </Link>
                <Link href="/archivo" className="block text-gray-400 hover:text-white transition-colors">
                  Archivo Digital
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Participar</h3>
              <div className="space-y-2">
                <Link href="/login" className="block text-gray-400 hover:text-white transition-colors">
                  Iniciar Sesión
                </Link>
                <Link href="/upload" className="block text-gray-400 hover:text-white transition-colors">
                  Subir Contenido
                </Link>
                <Link href="/gestion" className="block text-gray-400 hover:text-white transition-colors">
                  Panel de Gestión
                </Link>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contacto</h3>
              <div className="space-y-2 text-gray-400">
                <p>Dirección General de Difusión Cultural</p>
                <p>Universidad Autónoma de Campeche</p>
                <p>Campeche, México</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Universidad Autónoma de Campeche. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
