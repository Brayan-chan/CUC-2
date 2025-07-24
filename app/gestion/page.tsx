"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import {
  Upload,
  FolderOpen,
  Users,
  Settings,
  BarChart3,
  Calendar,
  Video,
  Archive,
  Shield,
  Database,
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Sparkles,
  Star,
  Zap,
  Award,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

export default function GestionPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const stats = [
    {
      title: "Eventos Gestionados",
      value: "156",
      change: "+12 este mes",
      icon: Calendar,
      gradient: "from-blue-500 to-cyan-500",
      trend: "up",
    },
    {
      title: "Archivos Subidos",
      value: "2,847",
      change: "+89 esta semana",
      icon: Upload,
      gradient: "from-green-500 to-emerald-500",
      trend: "up",
    },
    {
      title: "Almacenamiento",
      value: "45.2 GB",
      change: "de 100 GB",
      icon: Database,
      gradient: "from-purple-500 to-pink-500",
      trend: "stable",
    },
    {
      title: "Usuarios Activos",
      value: "23",
      change: "colaboradores",
      icon: Users,
      gradient: "from-orange-500 to-red-500",
      trend: "up",
    },
  ]

  const recentUploads = [
    {
      id: 1,
      name: "Festival_Primavera_2024.zip",
      type: "Archivo",
      size: "245 MB",
      status: "Completado",
      date: "2024-03-15",
      user: "Dr. María González",
      files: 45,
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: 2,
      name: "Concierto_Jazz_Video.mp4",
      type: "Video",
      size: "1.2 GB",
      status: "Procesando",
      date: "2024-03-14",
      user: "Prof. Carlos Hernández",
      files: 1,
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: 3,
      name: "Exposicion_Arte_Digital",
      type: "Galería",
      size: "156 MB",
      status: "Revisión",
      date: "2024-03-13",
      user: "Lic. Ana Pérez",
      files: 28,
      gradient: "from-purple-500 to-pink-500",
    },
  ]

  const pendingApprovals = [
    {
      id: 1,
      title: "Certamen Nacional de Poesía 2024",
      submitter: "Prof. Luis Martínez",
      date: "2024-03-15",
      files: 23,
      status: "pending",
      type: "Literatura",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      id: 2,
      title: "Taller de Danza Contemporánea",
      submitter: "Mtra. Carmen López",
      date: "2024-03-14",
      files: 15,
      status: "pending",
      type: "Danza",
      gradient: "from-pink-500 to-rose-500",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completado":
        return "bg-green-100 text-green-800 border-green-200"
      case "Procesando":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Revisión":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Error":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completado":
        return <CheckCircle className="w-4 h-4" />
      case "Procesando":
        return <Clock className="w-4 h-4" />
      case "Revisión":
        return <AlertCircle className="w-4 h-4" />
      case "Error":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
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
                Volver al sitio
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Panel de Gestión Cultural
                  </h1>
                  <p className="text-sm text-gray-500">Administración del Archivo Histórico</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 px-3 py-1">
                <Shield className="w-4 h-4 mr-2" />
                Administrador
              </Badge>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Evento
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-2xl p-2">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <Upload className="w-4 h-4 mr-2" />
              Subir
            </TabsTrigger>
            <TabsTrigger
              value="archive"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <Archive className="w-4 h-4 mr-2" />
              Archivo
            </TabsTrigger>
            <TabsTrigger
              value="approvals"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-600 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Aprobaciones
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <Users className="w-4 h-4 mr-2" />
              Usuarios
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-600 data-[state=active]:to-slate-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              <Settings className="w-4 h-4 mr-2" />
              Config
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-8">
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
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
                            className={`flex items-center text-sm ${stat.trend === "up" ? "text-green-600" : "text-gray-600"}`}
                          >
                            {stat.trend === "up" && <TrendingUp className="w-3 h-3 mr-1" />}
                            {stat.change}
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm font-medium mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Recent Uploads */}
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                        <Zap className="w-5 h-5 mr-2 text-purple-600" />
                        Subidas Recientes
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        Últimos archivos procesados en el sistema
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-200 bg-transparent">
                      Ver todos
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentUploads.map((upload, index) => (
                    <motion.div
                      key={upload.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:from-purple-50 hover:to-pink-50 transition-all duration-300 border border-gray-100 hover:border-purple-200">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 bg-gradient-to-r ${upload.gradient} rounded-xl shadow-lg`}>
                            {upload.type === "Video" ? (
                              <Video className="w-5 h-5 text-white" />
                            ) : upload.type === "Archivo" ? (
                              <Archive className="w-5 h-5 text-white" />
                            ) : (
                              <FolderOpen className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                              {upload.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {upload.size} • {upload.files} archivos • {upload.user}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={`${getStatusColor(upload.status)} text-xs`}>
                            {getStatusIcon(upload.status)}
                            <span className="ml-1">{upload.status}</span>
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>

              {/* Storage Usage */}
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-600" />
                    Uso de Almacenamiento
                  </CardTitle>
                  <CardDescription className="text-gray-600">Distribución del espacio utilizado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Usado</span>
                      <span className="font-semibold">45.2 GB de 100 GB</span>
                    </div>
                    <Progress value={45} className="h-3" />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Videos</span>
                      </div>
                      <span className="text-sm font-medium">28.4 GB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Imágenes</span>
                      </div>
                      <span className="text-sm font-medium">14.2 GB</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Documentos</span>
                      </div>
                      <span className="text-sm font-medium">2.6 GB</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-gray-200 hover:border-purple-300 hover:bg-purple-50 bg-transparent"
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Gestionar Almacenamiento
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent flex items-center">
                  <Upload className="w-6 h-6 mr-3 text-blue-600" />
                  Subir Nuevo Contenido Cultural
                </CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  Sube fotografías, videos y documentos de eventos culturales para preservar en el archivo histórico
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-purple-300 rounded-2xl p-16 text-center hover:border-purple-400 hover:bg-purple-50/50 transition-all duration-300 group">
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Upload className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Arrastra archivos aquí o haz clic para seleccionar
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    Soporta: JPG, PNG, MP4, MOV, PDF, DOC • Máximo 500MB por archivo
                  </p>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg text-lg px-8 py-3">
                    Seleccionar Archivos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Archive Tab */}
          <TabsContent value="archive" className="space-y-6">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center">
                      <Archive className="w-6 h-6 mr-3 text-green-600" />
                      Archivo Digital
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-lg">
                      Gestión completa del contenido histórico cultural
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Buscar archivos..."
                        className="pl-10 w-64 bg-gray-50/50 border-gray-200 focus:border-green-300 focus:ring-green-200"
                      />
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-200 bg-transparent">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtros
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Festival de Danza 2024",
                      files: 45,
                      size: "234 MB",
                      date: "2024-03-15",
                      type: "Evento",
                      gradient: "from-pink-500 to-rose-500",
                    },
                    {
                      name: "Concierto de Jazz",
                      files: 28,
                      size: "1.2 GB",
                      date: "2024-03-10",
                      type: "Evento",
                      gradient: "from-blue-500 to-cyan-500",
                    },
                    {
                      name: "Exposición Arte Digital",
                      files: 67,
                      size: "456 MB",
                      date: "2024-03-05",
                      type: "Evento",
                      gradient: "from-purple-500 to-indigo-500",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:from-green-50 hover:to-emerald-50 transition-all duration-300 border border-gray-100 hover:border-green-200">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 bg-gradient-to-r ${item.gradient} rounded-xl shadow-lg`}>
                            <FolderOpen className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                              {item.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.files} archivos • {item.size} • {item.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-6">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent flex items-center">
                  <CheckCircle className="w-6 h-6 mr-3 text-yellow-600" />
                  Contenido Pendiente de Aprobación
                </CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  Revisa y aprueba el contenido enviado por colaboradores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingApprovals.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-white to-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 bg-gradient-to-r ${item.gradient} rounded-full`}></div>
                          <h3 className="font-bold text-gray-900 text-lg">{item.title}</h3>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                          <Clock className="w-3 h-3 mr-1" />
                          Pendiente
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            <span className="font-medium">Enviado por:</span> {item.submitter}
                          </p>
                          <p>
                            <span className="font-medium">Tipo:</span> {item.type}
                          </p>
                          <p>
                            <span className="font-medium">Archivos:</span> {item.files} • {item.date}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="border-gray-200 bg-transparent">
                            <Eye className="w-4 h-4 mr-2" />
                            Revisar
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Rechazar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                  <Users className="w-6 h-6 mr-3 text-indigo-600" />
                  Gestión de Usuarios
                </CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  Administra los permisos y roles de los colaboradores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Gestión de Usuarios</h3>
                  <p className="text-gray-600 mb-6 text-lg">Funcionalidad en desarrollo</p>
                  <Button variant="outline" className="border-gray-200 bg-transparent">
                    <Star className="w-4 h-4 mr-2" />
                    Próximamente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-600 to-slate-600 bg-clip-text text-transparent flex items-center">
                  <Settings className="w-6 h-6 mr-3 text-gray-600" />
                  Configuración del Sistema
                </CardTitle>
                <CardDescription className="text-gray-600 text-lg">
                  Ajustes generales del archivo cultural
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-r from-gray-500 to-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Settings className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Configuración</h3>
                  <p className="text-gray-600 mb-6 text-lg">Panel de configuración en desarrollo</p>
                  <Button variant="outline" className="border-gray-200 bg-transparent">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Próximamente
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
