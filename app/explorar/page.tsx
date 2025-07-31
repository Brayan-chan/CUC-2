"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  Calendar,
  ImageIcon,
  Video,
  Heart,
  Share2,
  Eye,
  ArrowLeft,
  Download,
} from "lucide-react"
import Link from "next/link"

// Sample data
const sampleContent = [
  {
    id: '1',
    title: 'Festival de Danza Folklórica 2024',
    description: 'Celebración anual de las tradiciones culturales de nuestra región',
    contentType: 'event',
    category: 'cultural',
    imageUrl: '/placeholder.jpg',
    icon: Calendar,
    color: 'blue',
    type: 'Danza',
    views: 245,
    likes: 32
  },
  {
    id: '2',
    title: 'Concierto de Graduación',
    description: 'Presentación musical de estudiantes graduados',
    contentType: 'media',
    category: 'academico',
    imageUrl: '/placeholder.jpg',
    icon: Video,
    color: 'purple',
    type: 'video',
    views: 156,
    likes: 28
  },
  {
    id: '3',
    title: 'Exposición de Arte Estudiantil',
    description: 'Muestra de obras creadas por estudiantes de artes visuales',
    contentType: 'event',
    category: 'cultural',
    imageUrl: '/placeholder.jpg',
    icon: Calendar,
    color: 'blue',
    type: 'Arte',
    views: 189,
    likes: 41
  },
  {
    id: '4',
    title: 'Archivo Fotográfico Histórico',
    description: 'Colección de fotografías históricas de la universidad',
    contentType: 'media',
    category: 'social',
    imageUrl: '/placeholder.jpg',
    icon: ImageIcon,
    color: 'green',
    type: 'image',
    views: 423,
    likes: 67
  },
  {
    id: '5',
    title: 'Teatro Universitario 2023',
    description: 'Obra teatral presentada por el grupo de teatro estudiantil',
    contentType: 'event',
    category: 'cultural',
    imageUrl: '/placeholder.jpg',
    icon: Calendar,
    color: 'blue',
    type: 'Teatro',
    views: 312,
    likes: 54
  },
  {
    id: '6',
    title: 'Competencia Deportiva Inter-Facultades',
    description: 'Evento deportivo anual entre las diferentes facultades',
    contentType: 'media',
    category: 'deportivo',
    imageUrl: '/placeholder.jpg',
    icon: Video,
    color: 'purple',
    type: 'video',
    views: 278,
    likes: 38
  }
]

export default function ExplorarPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  
  // Filter content
  const filteredContent = sampleContent.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesType = selectedType === 'all' || item.contentType === selectedType
    
    return matchesSearch && matchesCategory && matchesType
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 hover:text-purple-600 transition-colors group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:block">Volver al inicio</span>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">CUC</span>
                </div>
                <span className="font-semibold text-gray-900 hidden sm:block">Explorar Archivo</span>
              </div>
            </div>
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="text-gray-700">
                Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2 text-center">
              Explorar Archivo Cultural
            </h1>
            <p className="text-gray-600 mb-6 text-center">
              Descubre eventos, galerías y contenido histórico de la universidad
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Buscar en el archivo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  <SelectItem value="cultural">Cultural</SelectItem>
                  <SelectItem value="academico">Académico</SelectItem>
                  <SelectItem value="deportivo">Deportivo</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todo</SelectItem>
                  <SelectItem value="event">Eventos</SelectItem>
                  <SelectItem value="media">Multimedia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-6xl mx-auto">
          {filteredContent.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600">
                  {filteredContent.length} resultado(s) encontrado(s)
                </p>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Filtros aplicados</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredContent.map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
                        <div className="relative">
                          {item.imageUrl ? (
                            <div className="h-48 bg-gray-100 overflow-hidden">
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className={`h-48 bg-gradient-to-br from-${item.color}-100 to-${item.color}-200 flex items-center justify-center`}>
                              <IconComponent className={`w-16 h-16 text-${item.color}-600`} />
                            </div>
                          )}
                          
                          <div className="absolute top-4 left-4">
                            <Badge variant="secondary" className="bg-white/90 text-gray-700">
                              {item.contentType === 'event' ? 'Evento' : 'Multimedia'}
                            </Badge>
                          </div>
                          
                          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex space-x-2">
                              <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white">
                                <Heart className="w-4 h-4" />
                              </Button>
                              <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white">
                                <Share2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
                              {item.title}
                            </h3>
                            <IconComponent className={`w-5 h-5 text-${item.color}-600 ml-2 flex-shrink-0`} />
                          </div>
                          
                          {item.description && (
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                              {item.description}
                            </p>
                          )}
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-3">
                              <span className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                {item.views}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {item.category}
                              </Badge>
                            </div>
                            
                            <Button size="sm" variant="ghost" className="h-auto p-1 text-gray-500 hover:text-gray-700">
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
              <p className="text-gray-600 mb-4">
                No hay contenido que coincida con tu búsqueda. Intenta con otros términos.
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setSelectedType("all")
                }}
                variant="outline"
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
