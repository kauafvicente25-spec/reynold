"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Lock, Unlock } from "lucide-react"

export default function ArmarioAberto() {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    const horarioAtual = new Date().toLocaleString("pt-BR")

    localStorage.setItem("armarioAberto", "true")
    localStorage.setItem("horarioAbertura", horarioAtual)

    const timer = setTimeout(() => {
      const baseUrl = window.location.origin
      const dashboardUrl = `${baseUrl}/dashboard?armario=aberto&horario=${encodeURIComponent(horarioAtual)}`

      // Se estiver no celular, abrir em nova aba para não perder a página atual
      if (window.innerWidth <= 768) {
        window.open(dashboardUrl, "_blank")
      } else {
        window.location.href = dashboardUrl
      }
    }, 3000) // 3 segundos para mostrar a animação

    // Iniciar animação após um pequeno delay
    const animationTimer = setTimeout(() => {
      setShowAnimation(true)
    }, 500)

    return () => {
      clearTimeout(timer)
      clearTimeout(animationTimer)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4">
            {showAnimation ? (
              <div className="relative">
                <Unlock className="h-20 w-20 text-green-600 mx-auto animate-bounce" />
                <div className="absolute -top-2 -right-2">
                  <CheckCircle className="h-8 w-8 text-green-500 animate-pulse" />
                </div>
              </div>
            ) : (
              <Lock className="h-20 w-20 text-gray-400 mx-auto" />
            )}
          </div>
          <CardTitle
            className={`text-3xl font-bold transition-all duration-1000 ${
              showAnimation ? "text-green-700 scale-110" : "text-gray-600"
            }`}
          >
            {showAnimation ? "ARMÁRIO ABERTO!" : "Abrindo armário..."}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div
            className={`transition-all duration-1000 ${
              showAnimation ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-semibold text-lg">✅ Acesso autorizado</p>
              <p className="text-green-600 text-sm mt-1">O armário foi desbloqueado com sucesso</p>
              <p className="text-blue-600 text-sm mt-2">📺 Redirecionando para o painel principal...</p>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p>
                🔓 Status: <span className="font-semibold text-green-600">Desbloqueado</span>
              </p>
              <p>
                ⏰ Horário: <span className="font-semibold">{new Date().toLocaleTimeString("pt-BR")}</span>
              </p>
              <p>
                📅 Data: <span className="font-semibold">{new Date().toLocaleDateString("pt-BR")}</span>
              </p>
            </div>
          </div>

          <Button onClick={() => (window.location.href = "/dashboard")} className="w-full" variant="outline">
            Ir para o Painel Agora
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
