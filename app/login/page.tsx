"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Shield, Users, GraduationCap, Sparkles, Star } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loginType, setLoginType] = useState("institucional")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simular autenticación
    setTimeout(() => {
      setIsLoading(false)
      // Redirigir al dashboard
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-10 blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-10 blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link href="/" className="flex items-center text-gray-600 hover:text-purple-600 transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al archivo
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-2xl">
            <CardHeader className="text-center pb-2">
              <div className="relative mx-auto mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse shadow-lg"></div>
              </div>
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Acceso al Sistema
              </CardTitle>
              <CardDescription className="text-gray-600 text-lg">Archivo Histórico Cultural UACAM</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <Tabs value={loginType} onValueChange={setLoginType} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100/80 backdrop-blur-sm rounded-2xl p-2">
                  <TabsTrigger
                    value="institucional"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Institucional
                  </TabsTrigger>
                  <TabsTrigger
                    value="externo"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Externo
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="institucional" className="space-y-6 mt-8">
                  <div className="space-y-2">
                    <Badge className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border-blue-200 px-4 py-2">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Acceso para personal y estudiantes UACAM
                    </Badge>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="matricula" className="text-gray-700 font-semibold text-lg">
                        Matrícula / ID Institucional
                      </Label>
                      <div className="relative">
                        <User className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <Input
                          id="matricula"
                          placeholder="Ingresa tu matrícula o ID"
                          className="pl-12 bg-gray-50/50 border-gray-200 focus:border-purple-300 focus:ring-purple-200 text-lg p-4 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="password-inst" className="text-gray-700 font-semibold text-lg">
                        Contraseña Institucional
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <Input
                          id="password-inst"
                          type={showPassword ? "text" : "password"}
                          placeholder="Tu contraseña institucional"
                          className="pl-12 pr-12 bg-gray-50/50 border-gray-200 focus:border-purple-300 focus:ring-purple-200 text-lg p-4 rounded-xl"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg text-lg py-4 rounded-xl"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Autenticando...
                        </div>
                      ) : (
                        "Acceder con Credenciales UACAM"
                      )}
                    </Button>
                  </form>

                  <div className="text-center bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-center text-blue-700 text-sm">
                      <Shield className="w-4 h-4 mr-2" />
                      Autenticación segura mediante el sistema institucional UACAM
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="externo" className="space-y-6 mt-8">
                  <div className="space-y-2">
                    <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200 px-4 py-2">
                      <Mail className="w-4 h-4 mr-2" />
                      Acceso para colaboradores externos
                    </Badge>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-gray-700 font-semibold text-lg">
                        Correo Electrónico
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          className="pl-12 bg-gray-50/50 border-gray-200 focus:border-blue-300 focus:ring-blue-200 text-lg p-4 rounded-xl"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="password-ext" className="text-gray-700 font-semibold text-lg">
                        Contraseña
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                        <Input
                          id="password-ext"
                          type={showPassword ? "text" : "password"}
                          placeholder="Tu contraseña"
                          className="pl-12 pr-12 bg-gray-50/50 border-gray-200 focus:border-blue-300 focus:ring-blue-200 text-lg p-4 rounded-xl"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold shadow-lg text-lg py-4 rounded-xl"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Iniciando sesión...
                        </div>
                      ) : (
                        "Iniciar Sesión"
                      )}
                    </Button>
                  </form>

                  <div className="space-y-4">
                    <Separator className="bg-gray-200" />
                    <div className="flex justify-between text-sm">
                      <Link
                        href="/recuperar-password"
                        className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                      <Link
                        href="/registro"
                        className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
                      >
                        Crear cuenta
                      </Link>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="text-center">
                <div className="text-sm text-gray-500">
                  Al acceder, aceptas los{" "}
                  <Link href="/terminos" className="text-purple-600 hover:text-purple-800 underline font-medium">
                    Términos de Uso
                  </Link>{" "}
                  y{" "}
                  <Link href="/privacidad" className="text-purple-600 hover:text-purple-800 underline font-medium">
                    Política de Privacidad
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Institutional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 text-center"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <p className="text-sm font-semibold text-gray-700">
                Sistema desarrollado por la Dirección General de Difusión Cultural
              </p>
            </div>
            <p className="text-xs text-gray-500">Universidad Autónoma de Campeche © 2024</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
