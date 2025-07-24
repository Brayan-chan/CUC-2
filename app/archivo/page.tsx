"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Grid3X3, List, ArrowLeft, Calendar, MapPin, Users, Eye, Heart, Share2, Download, Play, Sparkles, Star, Clock, ImageIcon, Video, FileText, Zap, Award, TrendingUp, Archive } from 'lucide-react'
import Link from "next/link"

export default function ArchivoPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  const archiveItems = [
    {
      id: 1,
      title: "Festival Internacional de Danza Contemporánea 2024",
      type: "Danza",
      year: "2024",
      date: "15 de Marzo, 2024",
      location: "Teatro Principal UACAM",
      description: "Encuentro internacional que reúne a los mejores exponentes de la danza contemporánea con talleres y presentaciones.",
      participants: 120,
      images: 45,
      videos: 8,
      documents: 12,
      views: 2847,
      likes: 456,
      downloads: 89,
      thumbnail: "/placeholder.svg?height=300&width=400&text=Festival+Danza",
      gradient: "from-pink-500 via-purple-500 to-indigo-500",
      featured: true,
      status: "Completo",
    },
    {
      id: 2,
      title: "Bienal de Arte Digital y Nuevas Tecnologías",
      type: "Arte Visual",
      year: "2024",
      date: "22 de Abril, 2024",
      location: "Galería Universitaria",
      description: "Exposición bienal que explora la intersección entre arte y tecnología con obras de realidad virtual.",
      participants: 85,
      images: 67,
      videos: 12,
      documents: 8,
      views: 1923,
      likes: 342,
      downloads: 67,
      thumbnail: "/placeholder.svg?height=300&width=400&text=Arte+Digital",
      gradient: "from-cyan-500 via-blue-500 to-purple-500",
      featured: true,
      status: "Completo",
    },
    {
      id: 3,
      title: "Concierto Sinfónico Universitario",
      type: "Música",
      year: "2024",
      date: "8 de Mayo, 2024",
      location: "Auditorio Central",
      description: "Presentación de la Orquesta Sinfónica UACAM con repertorio clásico y contemporáneo.",
      participants: 65,
      images: 32,
      videos: 5,
      documents: 15,
      views: 3156,
      likes: 578,
      downloads: 123,
      thumbnail: "/placeholder.svg?height=300&width=400&text=Concierto+Sinfonico",
      gradient: "from-amber-500 via-orange-500 to-red-500",
      featured: false,
      status: "Completo",
    },
    {
      id: 4,
      title: "Taller de Fotografía Artística",
      type: "Fotografía",
      year: "2024",
      date: "10 de Marzo, 2024",
      location: "Laboratorio de Medios",
      description: "Taller intensivo de técnicas avanzadas de fotografía artística y composición visual.",
      participants: 25,
      images: 89,
      videos: 3,
      documents: 5,
      views: 1456,
      likes: 234,
      downloads: 45,
      thumbnail: "/placeholder.svg?height=300&width=400&text=Fotografia",
      gradient: "from-green-500 via-emerald-500 to-teal-500",
      featured: false,
      status: "Completo",
    },
    {
      id: 5,
      title: "Recital de Poesía Estudiantil",
      type: "Literatura",
      year: "2024",
      date: "5 de Mayo, 2024",
      location: "Biblioteca Central",
      description: "Recital de poesía con participación de estudiantes de diferentes facultades.",
      participants: 45,
      images: 23,
      videos: 2,
      documents: 20,
      views: 987,
      likes: 156,
      downloads: 34,
      thumbnail: "/placeholder.svg?height=300&width=400&text=Recital+Poesia",
      gradient: "from-indigo-500 via-purple-500 to-pink-500",
      featured: false,
      status: "En proceso",
    },
    {
      id: 6,
      title: "Día de Muertos - Altar Monumental 2023",
      type: "Tradición",
      year: "2023",
      date: "25 de Octubre, 2023",
      location: "Explanada Principal",
      description: "Construcción del altar de muertos más grande de la universidad con elementos culturales regionales.",
      participants: 150,
      images: 156,
      videos: 10,
      documents: 8,
      views: 5234,
      likes: 892,
      downloads: 234,
      thumbnail: "/placeholder.svg?height=300&width=400&text=Dia+Muertos",
      gradient: "from-orange-500 via-yellow-500 to-red-500",
      featured: true,
      status: "Completo",
    },
  ]

  const filteredItems = archiveItems.filter((item) => {
    const matchesFilter = selectedFilter === "all" || item.type === selectedFilter
    const matchesYear = selectedYear === "all" || item.year === selectedYear
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesYear && matchesSearch
  })

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case "popular":
        return b.views - a.views
      case "liked":
        return b.likes - a.likes
      case "alphabetical":
        return a.title.localeCompare(b.title)
      default:
        return 0
    }
  })

  const types = ["all", ...Array.from(new Set(archiveItems.map((item) => item.type)))]
  const years = ["all", ...Array.from(new Set(archiveItems.map((item) => item.year))).sort().reverse()]

  const stats = [
    { label: "Total Eventos", value: archiveItems.length, icon: Calendar, gradient: "from-blue-500 to-cyan-500" },
    { label: "Archivos Multimedia", value: archiveItems.reduce((acc, item) => acc + item.images + item.videos, 0), icon: ImageIcon, gradient: "from-green-500 to-emerald-500" },
    { label: "Visualizaciones", value: archiveItems.reduce((acc, item) => acc + item.views, 0).toLocaleString(), icon: Eye, gradient: "from-purple-500 to-pink-500" },
    { label: "Descargas", value: archiveItems.reduce((acc, item) => acc + item.downloads, 0), icon: Download, gradient: "from-orange-500 to-red-500" },
  ]

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
                  <Archive className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Archivo Cultural Digital
                  </h1>
                  <p className="text-sm text-gray-500">Explorar Colección Histórica</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200 px-3 py-1">
                <Zap className="w-4 h-4 mr-2" />
                {filteredItems.length} Resultados
              </Badge>
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

      {/* Stats Section */}
      <div className="bg-white/60 backdrop-blur-xl border-b border-gray-200/50">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className="bg-white/80 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Modern Filters */}
      <div className="bg-white/60 backdrop-blur-xl border-b border-gray-200/50 sticky top-20 z-30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex items-center space-x-2 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar en el archivo..."
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

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32 bg-white/80 border-gray-200 focus:border-purple-300">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year === "all" ? "Todos" : year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-white/80 border-gray-200 focus:border-purple-300">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  <SelectItem value="recent">Más recientes</SelectItem>
                  <SelectItem value="popular">Más populares</SelectItem>
                  <SelectItem value="liked">Más gustados</SelectItem>
                  <SelectItem value="alphabetical">Alfabético</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 hover:border-purple-300 hover:bg-purple-50 bg-white/80"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Archive Content */}
      <div className="container mx-auto px-6 py-8">
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedItems.map((item, index) => (
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

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3">
                      <Badge className={`${item.status === "Completo" ? "bg-green-500/90" : "bg-yellow-500/90"} text-white border-none shadow-lg`}>
                        {item.status === "Completo" ? <Award className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                        {item.status}
                      </Badge>
                    </div>

                    {/* File Count */}
                    <div className="absolute bottom-3 left-3 flex space-x-2">
                      <Badge className="bg-black/70 text-white border-none backdrop-blur-sm text-xs">
                        <ImageIcon className="w-3 h-3 mr-1" />
                        {item.images}
                      </Badge>
                      <Badge className="bg-black/70 text-white border-none backdrop-blur-sm text-xs">
                        <Video className="w-3 h-3 mr-1" />
                        {item.videos}
                      </Badge>
                      <Badge className="bg-black/70 text-white border-none backdrop-blur-sm text-xs">
                        <FileText className="w-3 h-3 mr-1" />
                        {item.documents}
                      </Badge>
                    </div>

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex space-x-3">
                        <Button size="sm" className="bg-white/90 text-gray-900 hover:bg-white shadow-lg">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" className="bg-white/90 text-gray-900 hover:bg-white shadow-lg">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" className="bg-white/90 text-gray-900 hover:bg-white shadow-lg">
                          <Download className="w-4 h-4" />
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
                      <span className="text-gray-500 text-xs">{item.year}</span>
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
            {sortedItems.map((item, index) => (
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
                    </div>

                    <CardContent className="md:col-span-2 p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className={`bg-gradient-to-r ${item.gradient} text-white border-none`}>
                          {item.type}
                        </Badge>
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 text-sm">{item.date}</span>
                          <Badge className={`${item.status === "Completo" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"} text-xs`}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-purple-600 transition-colors">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>

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
                          <div className="flex items-center space-x-3 text-sm">
                            <div className="flex items-center">
                              <ImageIcon className="w-4 h-4 mr-1" />
                              {item.images}
                            </div>
                            <div className="flex items-center">
                              <Video className="w-4 h-4 mr-1" />
                              {item.videos}
                            </div>
                            <div className="flex items-center">
                              <FileText className="w-4 h-4 mr-1" />
                              {item.documents}
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gray-200 hover:border-purple-300 hover:bg-purple-50 bg-transparent"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver
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

        {/* Empty State */}
        {sortedItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Archive className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No se encontraron resultados</h3>
            <p className="text-gray-600 mb-6">Intenta ajustar los filtros o términos de búsqueda</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedFilter("all")
                setSelectedYear("all")
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
            >
              Limpiar Filtros
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
