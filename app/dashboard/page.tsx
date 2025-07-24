"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Calendar,
  ImageIcon,
  Video,
  Users,
  Eye,
  Heart,
  Share2,
  TrendingUp,
  FileText,
  Bell,
  Search,
  Plus,
  BarChart3,
  Upload,
  Filter,
  MoreHorizontal,
  Sparkles,
  Award,
  Clock,
  CheckCircle,
  Star,
  Zap,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedPeriod, setSelectedPeriod] = useState("week")

  const stats = [
    {
      title: "Eventos Creados",
      value: "24",
      change: "+12%",
      trend: "up",
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-500",
      description: "Este mes",
    },
    {
      title: "Archivos Subidos",
      value: "156",
      change: "+8%",
      trend: "up",
      icon: Upload,
      gradient: "from-green-500 to-emerald-500",
      description: "Esta semana",
    },
    {
      title: "Visualizaciones",
      value: "2.4K",
      change: "+25%",
      trend: "up",
      icon: Eye,
      gradient: "from-purple-500 to-pink-500",
      description: "Total",
    },
    {
      title: "Engagement",
      value: "89%",
      change: "+5%",
      trend: "up",
      icon: Heart,
      gradient: "from-orange-500 to-red-500",
      description: "Promedio",
    },
  ]

  const recentEvents = [
    {
      id: 1,
      title: "Festival de Danza Contemporánea",
      date: "2024-03-15",
      status: "Publicado",
      views: 1234,
      likes: 89,
      comments: 23,
      type: "Danza",
      image: "/placeholder.svg?height=80&width=120&text=Danza",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      id: 2,
      title: "Exposición de Arte Digital",
      date: "2024-03-12",
      status: "En revisión",
      views: 0,
      likes: 0,
      comments: 0,
      type: "Arte Visual",
      image: "/placeholder.svg?height=80&width=120&text=Arte",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      id: 3,
      title: "Concierto de Jazz Universitario",
      date: "2024-03-10",
      status: "Publicado",
      views: 2156,
      likes: 145,
      comments: 67,
      type: "Música",
      image: "/placeholder.svg?height=80&width=120&text=Jazz",
      gradient: "from-blue-500 to-cyan-500",
    },
  ]

  const quickActions = [
    {
      title: "Nuevo Evento",
      icon: Plus,
      gradient: "from-blue-500 to-cyan-500",
      href: "/upload",
      description: "Crear evento cultural",
    },
    {
      title: "Subir Archivos",
      icon: Upload,
      gradient: "from-green-500 to-emerald-500",
      href: "/upload",
      description: "Multimedia y documentos",
    },
    {
      title: "Ver Estadísticas",
      icon: BarChart3,
      gradient: "from-purple-500 to-pink-500",
      href: "/analytics",
      description: "Análisis detallado",
    },
    {
      title: "Gestionar Archivos",
      icon: FileText,
      gradient: "from-orange-500 to-red-500",
      href: "/files",
      description: "Organizar contenido",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Publicado":
        return "bg-green-100 text-green-800 border-green-200"
      case "En revisión":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Borrador":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Dashboard Cultural
                  </h1>
                  <p className="text-sm text-gray-500">Panel de Control Creativo</p>
                </div>
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
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </Button>
              <Avatar className="ring-2 ring-purple-200">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2">
                ¡Bienvenido de vuelta, Juan! 👋
              </h2>
              <p className="text-gray-600">Gestiona y comparte la memoria cultural de UACAM</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 px-3 py-1">
                <CheckCircle className="w-4 h-4 mr-2" />
                Cuenta Verificada
              </Badge>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Evento
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${stat.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-right">
                      <div
                        className={`flex items-center text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                      >
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {stat.change}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Events */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Events */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-purple-600" />
                        Eventos Recientes
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Tus últimas contribuciones al archivo cultural
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filtrar
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-200 bg-transparent">
                        Ver todos
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <div className="flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border border-gray-100 hover:border-purple-200">
                        <div className="relative">
                          <img
                            src={event.image || "/placeholder.svg"}
                            alt={event.title}
                            className="w-20 h-16 object-cover rounded-xl shadow-md"
                          />
                          <div
                            className={`absolute inset-0 bg-gradient-to-r ${event.gradient} opacity-20 rounded-xl`}
                          ></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                              {event.title}
                            </h4>
                            <Badge className={`text-xs ${getStatusColor(event.status)}`}>{event.status}</Badge>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {event.type}
                            </Badge>
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {event.views}
                            </div>
                            <div className="flex items-center">
                              <Heart className="w-3 h-3 mr-1 text-red-500" />
                              {event.likes}
                            </div>
                            <div className="flex items-center">
                              <Share2 className="w-3 h-3 mr-1" />
                              {event.comments}
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Analytics Preview */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                    Rendimiento Semanal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Visualizaciones</span>
                      <span className="font-semibold">+25% vs semana anterior</span>
                    </div>
                    <Progress value={75} className="h-3" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Interacciones</span>
                      <span className="font-semibold">+18% vs semana anterior</span>
                    </div>
                    <Progress value={68} className="h-3" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Nuevos seguidores</span>
                      <span className="font-semibold">+12% vs semana anterior</span>
                    </div>
                    <Progress value={45} className="h-3" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-500" />
                    Acciones Rápidas
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  {quickActions.map((action, index) => (
                    <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        className="h-24 flex-col space-y-2 border-gray-200 hover:border-purple-300 hover:bg-gradient-to-br hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group bg-transparent"
                        asChild
                      >
                        <Link href={action.href}>
                          <div
                            className={`p-2 rounded-xl bg-gradient-to-r ${action.gradient} group-hover:scale-110 transition-transform duration-300`}
                          >
                            <action.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-medium text-gray-900">{action.title}</div>
                            <div className="text-xs text-gray-500">{action.description}</div>
                          </div>
                        </Link>
                      </Button>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Storage Usage */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-600" />
                    Almacenamiento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Usado</span>
                      <span className="font-semibold">2.4 GB de 10 GB</span>
                    </div>
                    <Progress value={24} className="h-3" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Videos</span>
                      </div>
                      <span className="text-sm font-medium">1.2 GB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Imágenes</span>
                      </div>
                      <span className="text-sm font-medium">1.0 GB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Documentos</span>
                      </div>
                      <span className="text-sm font-medium">0.2 GB</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-gray-200 hover:border-purple-300 hover:bg-purple-50 bg-transparent"
                  >
                    Gestionar Archivos
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Activity Feed */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-orange-600" />
                    Actividad Reciente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { action: "Nuevo evento publicado", time: "Hace 2 horas", icon: Calendar, color: "text-blue-600" },
                    { action: "25 fotos subidas", time: "Hace 4 horas", icon: ImageIcon, color: "text-green-600" },
                    { action: "Video procesado", time: "Hace 1 día", icon: Video, color: "text-purple-600" },
                    { action: "Perfil actualizado", time: "Hace 2 días", icon: Users, color: "text-orange-600" },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`p-2 rounded-lg bg-gray-100`}>
                        <activity.icon className={`w-4 h-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
