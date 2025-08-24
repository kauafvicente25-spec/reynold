"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Unlock } from "lucide-react"
import * as QRCode from "qrcode"

export default function Dashboard() {
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [armarioAberto, setArmarioAberto] = useState(false)
  const [horarioAbertura, setHorarioAbertura] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Verificar se está logado
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/")
      return
    }

    const armarioParam = searchParams.get("armario")
    const horarioParam = searchParams.get("horario")

    if (armarioParam === "aberto" && horarioParam) {
      localStorage.setItem("armarioAberto", "true")
      localStorage.setItem("horarioAbertura", decodeURIComponent(horarioParam))
      setArmarioAberto(true)
      setHorarioAbertura(decodeURIComponent(horarioParam))

      window.history.replaceState({}, "", "/dashboard")
    }

    const checkArmarioStatus = () => {
      const armarioStatus = localStorage.getItem("armarioAberto")
      const horario = localStorage.getItem("horarioAbertura")

      if (armarioStatus === "true" && !armarioAberto) {
        setArmarioAberto(true)
        setHorarioAbertura(horario || new Date().toLocaleString("pt-BR"))
      }
    }

    // Verificar imediatamente e depois a cada 2 segundos
    checkArmarioStatus()
    const interval = setInterval(checkArmarioStatus, 2000)

    // Gerar QR Code
    const generateQRCode = async () => {
      try {
        const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
        const url = `${baseUrl}/armario-aberto`
        console.log("[v0] Gerando QR code para URL:", url)

        const qrCodeDataUrl = await QRCode.toDataURL(url, {
          width: 256,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
          errorCorrectionLevel: "M",
        })
        console.log("[v0] QR code gerado com sucesso")
        setQrCodeUrl(qrCodeDataUrl)
      } catch (error) {
        console.error("[v0] Erro ao gerar QR Code:", error)
        setQrCodeUrl("/qr-code-error.png")
      } finally {
        setIsLoading(false)
      }
    }

    generateQRCode()

    return () => clearInterval(interval)
  }, [router, armarioAberto, searchParams])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("armarioAberto")
    localStorage.removeItem("horarioAbertura")
    router.push("/")
  }

  const resetarArmario = () => {
    localStorage.removeItem("armarioAberto")
    localStorage.removeItem("horarioAbertura")
    setArmarioAberto(false)
    setHorarioAbertura("")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Gerando QR Code...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Painel de Controle</h1>
          <Button onClick={handleLogout} variant="outline">
            Sair
          </Button>
        </div>

        {armarioAberto && (
          <Card className="mb-6 border-green-500 bg-green-50 shadow-lg animate-pulse">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center space-x-3">
                <Unlock className="h-8 w-8 text-green-600 animate-bounce" />
                <div className="text-center">
                  <h3 className="text-xl font-bold text-green-700">🔓 ARMÁRIO ABERTO!</h3>
                  <p className="text-green-600">Aberto em: {horarioAbertura}</p>
                  <p className="text-blue-500 text-sm">📱 Aberto via QR Code</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-4 text-center">
                <Button onClick={resetarArmario} variant="outline" size="sm">
                  Resetar Status
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="text-center shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-green-700">QR Code do Armário</CardTitle>
            <CardDescription>Escaneie o código abaixo para abrir o armário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-green-200">
                {qrCodeUrl && (
                  <img
                    src={qrCodeUrl || "/placeholder.svg"}
                    alt="QR Code para abrir armário"
                    className="mx-auto"
                    width={256}
                    height={256}
                  />
                )}
              </div>
            </div>
            <div className="text-sm text-muted-foreground space-y-2">
              <p className="font-semibold text-green-700">📱 Escaneie com seu celular</p>
              <p className="text-gray-600">🔓 O armário será aberto automaticamente</p>
              <p className="text-blue-600">📺 O status aparecerá aqui no PC em tempo real</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
