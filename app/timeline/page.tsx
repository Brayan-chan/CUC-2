"use client"

import { useState, useRef } from "react"
import { motion, useScroll } from "framer-motion"
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

export default function TimelinePage() {
  const [selectedYear, setSelectedYear] = useState("2024")
  const [selectedType, setSelectedType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ container: containerRef })

  const events = [
    {
      id: 1,
      year: "2024",
      date: "15 de Marzo",
      title: "Festival Internacional de Danza Contemporánea",
      type: "Danza",
      description:
        "Encuentro internacional que reúne a los mejores exponentes de la danza contemporánea, con talleres, presentaciones y intercambio cultural entre artistas de diferentes países.",
      location: "Teatro Principal UACAM",
      participants: 120,
      images: 45,
      videos: 8,
      views: 2847,
      likes: 456,
      image: "/placeholder.svg?height=300&width=400&text=Festival+Danza",
      gradient: "from-pink-500 via-purple-500 to-indigo-500",
      featured: true,
    },
    {
      id: 2,
      year: "2024",
      date: "22 de Abril",
      title: "Bienal de Arte Digital y Nuevas Tecnologías",
      type: "Arte Visual",
      description:
        "Exposición bienal que explora la intersección entre arte y tecnología, presentando obras de realidad virtual, arte generativo e instalaciones interactivas.",
      location: "Galería Universitaria",
      participants: 85,
      images: 67,
      videos: 12,
      views: 1923,
      likes: 342,
      image: "/placeholder.svg?height=300&width=400&text=Arte+Digital",
      gradient: "from-cyan-500 via-blue-500 to-purple-500",
      featured: true,
    },
    {
      id: 3,
      year: "2024",
      date: "8 de Mayo",
      title: "Concierto Sinfónico Universitario",
      type: "Música",
      description:
        "Presentación de la Orquesta Sinfónica UACAM con un repertorio que combina clásicos universales y composiciones contemporáneas de artistas locales.",
      location: "Auditorio Central",
      participants: 65,
      images: 32,
      videos: 5,
      views: 3156,
      likes: 578,
      image: "/placeholder.svg?height=300&width=400&text=Concierto+Sinfonico",
      gradient: "from-amber-500 via-orange-500 to-red-500",
      featured: false,
    },
    {
      id: 4,
      year: "2023",
      date: "12 de Diciembre",
      title: "Posada Navideña Universitaria",
      type: "Tradición",
      description:
        "Celebración tradicional que une a toda la comunidad universitaria con villancicos, pastorelas, gastronomía típica campechana y actividades culturales familiares.",
      location: "Plaza Central UACAM",
      participants: 200,
      images: 89,
      videos: 6,
      views: 4521,
      likes: 723,
      image: "/placeholder.svg?height=300&width=400&text=Posada+Navideña",
      gradient: "from-red-500 via-green-500 to-red-600",
      featured: false,
    },
    {
      id: 5,
      year: "2023",
      date: "25 de Octubre",
      title: "Día de Muertos - Altar Monumental",
      type: "Tradición",
      description:
        "Construcción del altar de muertos más grande de la universidad con participación interdisciplinaria, elementos culturales regionales y homenaje a personalidades destacadas.",
      location: "Explanada Principal",
      participants: 150,
      images: 156,
      videos: 10,
      views: 5234,
      likes: 892,
      image: "/placeholder.svg?height=300&width=400&text=Dia+Muertos",
      gradient: "from-orange-500 via-yellow-500 to-red-500",
      featured: true,
    },
  ]

  const filteredEvents = events.filter((event) => {
    const matchesYear = selectedYear === "all" || event.year === selectedYear
    const matchesType = selectedType === "all" || event.type === selectedType
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesYear && matchesType && matchesSearch
  })

  const years = [
    "all",
    ...Array.from(new Set(events.map((e) => e.year)))
      .sort()
      .reverse(),
  ]
  const types = ["all", ...Array.from(new Set(events.map((e) => e.type)))]

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
                {filteredEvents.length} Eventos
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
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32 bg-white/80 border-gray-200 focus:border-purple-300">
                  <SelectValue placeholder="Año" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200">
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year === "all" ? "Todos los años" : year}
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

      {/* Modern Timeline */}
      <div className="container mx-auto px-6 py-8" ref={containerRef}>
        <div className="relative max-w-6xl mx-auto">
          {/* Animated Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-pink-500 to-cyan-500 rounded-full shadow-lg" />

          {/* Events */}
          <div className="space-y-16">
            {filteredEvents.map((event, index) => (
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
                            src={event.image || "/placeholder.svg"}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-r ${event.gradient} opacity-60`} />

                          {/* Year Badge */}
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-white/90 text-gray-900 font-bold text-lg px-4 py-2 shadow-lg">
                              {event.year}
                            </Badge>
                          </div>

                          {/* Featured Badge */}
                          {event.featured && (
                            <div className="absolute top-4 right-4">
                              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white border-none shadow-lg">
                                <Star className="w-3 h-3 mr-1" />
                                Destacado
                              </Badge>
                            </div>
                          )}

                          {/* Stats Overlay */}
                          <div className="absolute bottom-4 left-4 flex space-x-2">
                            <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                              <Eye className="w-3 h-3 text-white" />
                              <span className="text-xs font-medium text-white">{event.views}</span>
                            </div>
                            <div className="bg-black/70 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                              <Heart className="w-3 h-3 text-red-400" />
                              <span className="text-xs font-medium text-white">{event.likes}</span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button size="sm" className="bg-white/90 text-gray-900 hover:bg-white shadow-lg">
                              <Play className="w-4 h-4" />
                            </Button>
                            <Button size="sm" className="bg-white/90 text-gray-900 hover:bg-white shadow-lg">
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
                                className={`bg-gradient-to-r ${event.gradient} text-white border-none font-medium px-4 py-2`}
                              >
                                {event.type}
                              </Badge>
                              <span className="text-gray-500 font-medium">{event.date}</span>
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
                                  <span className="font-medium">{event.participants} participantes</span>
                                </div>

                                <div className="flex items-center space-x-4 text-gray-500">
                                  <div className="flex items-center">
                                    <ImageIcon className="w-4 h-4 mr-2 text-green-500" />
                                    <span className="font-medium">{event.images}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Play className="w-4 h-4 mr-2 text-red-500" />
                                    <span className="font-medium">{event.videos}</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex items-center space-x-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-200 hover:border-purple-300 hover:bg-purple-50 bg-transparent"
                                >
                                  Ver Detalles
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-600">
                                  <Share2 className="w-4 h-4" />
                                </Button>
                              </div>
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                              >
                                Explorar Galería
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
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                        <Link href="/gestion">Contribuir Evento</Link>
                      </Button>
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
    </div>
  )
}
