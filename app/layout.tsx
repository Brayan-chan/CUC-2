import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema Cultural UACAM - Archivo Histórico Digital",
  description: "Preservando la memoria histórica cultural de la Universidad Autónoma de Campeche",
  keywords: ["UACAM", "cultura", "archivo histórico", "eventos culturales", "universidad"],
  authors: [{ name: "Dirección General de Difusión Cultural UACAM" }],
  openGraph: {
    title: "Sistema Cultural UACAM",
    description: "Archivo Histórico Digital de Eventos Culturales",
    type: "website",
    locale: "es_MX",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script src="https://widget.cloudinary.com/v2.0/global/all.js" async />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "white",
                border: "1px solid #e5e7eb",
                color: "#374151",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
