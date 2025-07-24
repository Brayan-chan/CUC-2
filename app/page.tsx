"use client"

import { useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  Users,
  ImageIcon,
  Video,
  Search,
  ArrowRight,
  Play,
  MapPin,
  Sparkles,
  Award,
  Camera,
  Music,
  Palette,
  BookOpen,
  Eye,
  Heart,
  Share2,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const y2 = useTransform(scrollY, [0, 300], [0, -100])

  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeCategory, setActiveCategory] = useState("all")

  const featuredEvents = [
    {
      id: 1,
      title: "Festival Internacional de Danza",
      date: "15 de Marzo, 2025",
      type: "Danza",
      category: "dance",
      image: "/placeholder.svg?height=400&width=600&text=Festival+Danza",
      description: "Encuentro internacional de danza contemporánea y folklórica",
      participants: 120,
      location: "Teatro Principal UACAM",
      gradient: "from-pink-500 via-purple-500 to-indigo-500",
      views: 2847,
      likes: 456,
    },
    {
      id: 2,
      title: "Bienal de Arte Digital",
      date: "22 de Abril, 2025",
      type: "Arte Digital",
      category: "art",
      image: "/placeholder.svg?height=400&width=600&text=Arte+Digital",
      description: "Exposición de arte digital y nuevas tecnologías creativas",
      participants: 85,
      location: "Galería Universitaria",
      gradient: "from-cyan-500 via-blue-500 to-purple-500",
      views: 1923,
      likes: 342,
    },
    {
      id: 3,
      title: "Concierto Sinfónico Universitario",
      date: "8 de Mayo, 2025",
      type: "Música",
      category: "music",
      image: "/placeholder.svg?height=400&width=600&text=Concierto+Sinfonico",
      description: "Presentación de la Orquesta Sinfónica con repertorio clásico y contemporáneo",
      participants: 65,
      location: "Auditorio Central",
      gradient: "from-amber-500 via-orange-500 to-red-500",
      views: 3156,
      likes: 578,
    },
  ]

  const categories = [
    { id: "all", name: "Todos", icon: Sparkles, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
    { id: "music", name: "Música", icon: Music, color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
    { id: "art", name: "Arte", icon: Palette, color: "bg-gradient-to-r from-green-500 to-emerald-500" },
    { id: "dance", name: "Danza", icon: Users, color: "bg-gradient-to-r from-pink-500 to-rose-500" },
    { id: "literature", name: "Literatura", icon: BookOpen, color: "bg-gradient-to-r from-indigo-500 to-purple-500" },
    { id: "photography", name: "Fotografía", icon: Camera, color: "bg-gradient-to-r from-orange-500 to-red-500" },
  ]

  const stats = [
    { number: "2,847", label: "Eventos Preservados", icon: Calendar, gradient: "from-blue-500 to-cyan-500" },
    { number: "15,392", label: "Archivos Multimedia", icon: ImageIcon, gradient: "from-green-500 to-emerald-500" },
    { number: "1,284", label: "Horas de Video", icon: Video, gradient: "from-purple-500 to-pink-500" },
    { number: "8,756", label: "Participantes", icon: Users, gradient: "from-orange-500 to-red-500" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredEvents.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const filteredEvents = featuredEvents.filter((event) => activeCategory === "all" || event.category === activeCategory)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Modern Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Cultura UACAM
                </h1>
                <p className="text-sm text-gray-500">Archivo Digital Interactivo</p>
              </div>
            </div>

            <div className="hidden lg:flex items-center space-x-8">
              <Link href="/archivo" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                Archivo
              </Link>
              <Link href="/timeline" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                Cronología
              </Link>
              <Link href="/galeria" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                Galería
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-purple-600 transition-colors font-medium">
                Dashboard
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar eventos..."
                  className="pl-10 w-64 bg-gray-50/50 border-gray-200 focus:border-purple-300 focus:ring-purple-200"
                />
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                <Link href="/login">Acceder</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Modern Design */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-cyan-50"></div>
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-10 blur-3xl"
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-6">
                <Badge className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border-purple-200 px-4 py-2">
                  <Award className="w-4 h-4 mr-2" />
                  Museo Digital Interactivo
                </Badge>

                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-gray-900 via-purple-900 to-pink-900 bg-clip-text text-transparent">
                    Preservando la
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 bg-clip-text text-transparent">
                    Memoria Cultural
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                  Explora décadas de historia cultural universitaria a través de una experiencia digital inmersiva. Cada
                  momento, cada arte, cada tradición preservada para las futuras generaciones.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300"
                >
                  <Link href="/explorar" className="flex items-center">
                    Explorar Archivo
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 bg-transparent"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Ver Demo
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Featured Card */}
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="relative overflow-hidden rounded-3xl shadow-2xl bg-white"
                >
                  <div className="aspect-[4/3] relative">
                    <img
                      src={featuredEvents[currentSlide].image || "/placeholder.svg"}
                      alt={featuredEvents[currentSlide].title}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${featuredEvents[currentSlide].gradient} opacity-60`}
                    />

                    {/* Floating Stats */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                        <Eye className="w-3 h-3 text-gray-600" />
                        <span className="text-xs font-medium text-gray-700">{featuredEvents[currentSlide].views}</span>
                      </div>
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                        <Heart className="w-3 h-3 text-red-500" />
                        <span className="text-xs font-medium text-gray-700">{featuredEvents[currentSlide].likes}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <Badge
                      className={`mb-3 bg-gradient-to-r ${featuredEvents[currentSlide].gradient} text-white border-none`}
                    >
                      {featuredEvents[currentSlide].type}
                    </Badge>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{featuredEvents[currentSlide].title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{featuredEvents[currentSlide].description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {featuredEvents[currentSlide].date}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {featuredEvents[currentSlide].participants}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Slide Indicators */}
                <div className="flex justify-center mt-6 space-x-2">
                  {featuredEvents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 scale-125"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Modern Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              Nuestro Impacto Cultural
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Décadas de historia preservada digitalmente con tecnología de vanguardia
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <Card className="bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <CardContent className="p-8 text-center">
                    <div
                      className={`w-16 h-16 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}
                    >
                      <stat.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
              Explora por Categorías
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre la diversidad cultural de UACAM organizada por disciplinas artísticas
            </p>
          </motion.div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? `${category.color} text-white shadow-lg`
                    : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
                }`}
              >
                <category.icon className="w-4 h-4" />
                <span>{category.name}</span>
              </motion.button>
            ))}
          </div>

          {/* Events Grid */}
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Card className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-105 overflow-hidden">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={event.image || "/placeholder.svg"}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${event.gradient} opacity-60`} />

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="flex space-x-3">
                        <Button size="sm" className="bg-white/90 text-gray-900 hover:bg-white">
                          <Play className="w-4 h-4" />
                        </Button>
                        <Button size="sm" className="bg-white/90 text-gray-900 hover:bg-white">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Stats Overlay */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
                        <Eye className="w-3 h-3 text-gray-600" />
                        <span className="text-xs font-medium text-gray-700">{event.views}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <Badge className={`mb-3 bg-gradient-to-r ${event.gradient} text-white border-none`}>
                      {event.type}
                    </Badge>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-1 text-red-500" />
                          {event.likes}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">Únete a la Revolución Cultural Digital</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Contribuye con tus recuerdos, fotografías y experiencias para enriquecer nuestro archivo histórico
              cultural
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Link href="/contribuir">Contribuir Contenido</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-purple-600 transition-all duration-300 bg-transparent"
              >
                <Link href="/dashboard">Acceder al Dashboard</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">Cultura UACAM</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Preservando y compartiendo la riqueza cultural de la Universidad Autónoma de Campeche a través de
                tecnología innovadora.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Explorar</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/archivo" className="hover:text-purple-400 transition-colors">
                    Archivo Digital
                  </Link>
                </li>
                <li>
                  <Link href="/timeline" className="hover:text-purple-400 transition-colors">
                    Cronología
                  </Link>
                </li>
                <li>
                  <Link href="/galeria" className="hover:text-purple-400 transition-colors">
                    Galería
                  </Link>
                </li>
                <li>
                  <Link href="/buscar" className="hover:text-purple-400 transition-colors">
                    Búsqueda Avanzada
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Participar</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <Link href="/contribuir" className="hover:text-purple-400 transition-colors">
                    Contribuir
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-purple-400 transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/comunidad" className="hover:text-purple-400 transition-colors">
                    Comunidad
                  </Link>
                </li>
                <li>
                  <Link href="/eventos" className="hover:text-purple-400 transition-colors">
                    Próximos Eventos
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-lg">Contacto</h4>
              <ul className="space-y-3 text-gray-400">
                <li>Dirección General de Difusión Cultural</li>
                <li>cultura@uacam.mx</li>
                <li>+52 (981) 811-9800</li>
                <li>Ciudad Universitaria, Campeche</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Universidad Autónoma de Campeche. Desarrollado con ❤️ por el equipo de Difusión Cultural.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
