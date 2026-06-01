"use client"

import * as React from "react"
import { getPortalAuth, clearPortalAuth, type PortalClientData } from "@/lib/client-portal/portal-auth"
import { LoginDrawer } from "@/components/client-auth/LoginDrawer"
import { RegisterDrawer } from "@/components/client-auth/RegisterDrawer"
import { ForgotPasswordDrawer } from "@/components/client-auth/ForgotPasswordDrawer"
import { OnboardingCarousel } from "@/components/client-auth/OnboardingCarousel"
import { WelcomeScreen } from "@/components/client-auth/WelcomeScreen"
import { readPortalSettings } from "@/lib/client-portal/settings"

interface AuthContextType {
  isAuthenticated: boolean
  client: PortalClientData | null
  logout: () => void
  openLogin: () => void
  openRegister: () => void
  openForgotPassword: () => void
  closeDrawer: () => void
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [client, setClient] = React.useState<PortalClientData | null>(null)
  const [authChecked, setAuthChecked] = React.useState(false)

  // Controle de Telas do fluxo não-autenticado
  const [showOnboarding, setShowOnboarding] = React.useState(true)
  const [showWelcome, setShowWelcome] = React.useState(false)

  // Controle de Drawers
  const [activeDrawer, setActiveDrawer] = React.useState<"login" | "register" | "forgot-password" | null>(null)

  // Carregamento de Estado Inicial
  React.useEffect(() => {
    function checkAuth() {
      const auth = getPortalAuth()
      if (auth) {
        setIsAuthenticated(true)
        setClient(auth)
        setShowOnboarding(false)
        setShowWelcome(false)
      } else {
        setIsAuthenticated(false)
        setClient(null)

        // Verifica se o onboarding já foi concluído
        const onboardingDone = localStorage.getItem("bigood.onboarding.concluded")
        if (onboardingDone === "true") {
          setShowOnboarding(false)
          setShowWelcome(true)
        } else {
          setShowOnboarding(true)
          setShowWelcome(false)
        }
      }
      setAuthChecked(true)
    }

    checkAuth()

    window.addEventListener("bigood_portal_auth_sync", checkAuth)
    return () => {
      window.removeEventListener("bigood_portal_auth_sync", checkAuth)
    }
  }, [])

  function openLogin() {
    setActiveDrawer("login")
  }

  function openRegister() {
    setActiveDrawer("register")
  }

  function openForgotPassword() {
    setActiveDrawer("forgot-password")
  }

  function closeDrawer() {
    setActiveDrawer(null)
  }

  function handleSuccess() {
    const auth = getPortalAuth()
    if (auth) {
      setIsAuthenticated(true)
      setClient(auth)
      setShowOnboarding(false)
      setShowWelcome(false)
      setActiveDrawer(null)
    }
  }

  function handleCompleteOnboarding() {
    localStorage.setItem("bigood.onboarding.concluded", "true")
    setShowOnboarding(false)
    setShowWelcome(true)
  }

  function logout() {
    clearPortalAuth()
    setIsAuthenticated(false)
    setClient(null)
    setShowWelcome(true)
    setShowOnboarding(false)
  }

  // Previne oscilações de hidratação (hydration flashes)
  if (!authChecked) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        client,
        logout,
        openLogin,
        openRegister,
        openForgotPassword,
        closeDrawer,
      }}
    >
      {isAuthenticated ? (
        // Usuário Autenticado - Renderiza o Dashboard do Cliente
        children
      ) : showOnboarding ? (
        // Onboarding ativo (100% fullscreen sem headers)
        <OnboardingCarousel
          barbershopName={readPortalSettings().name}
          slides={readPortalSettings().onboardingSlides}
          onComplete={handleCompleteOnboarding}
        />
      ) : (
        // Tela de Boas-vindas para decidir Login ou Cadastro
        <WelcomeScreen onOpenLogin={openLogin} onOpenRegister={openRegister} />
      )}

      {/* Drawers unificados integrados na renderização do Provedor */}
      <LoginDrawer
        open={activeDrawer === "login"}
        onOpenChange={(open) => setActiveDrawer(open ? "login" : null)}
        onSwitchToRegister={openRegister}
        onForgotPassword={openForgotPassword}
        onSuccess={handleSuccess}
      />

      <RegisterDrawer
        open={activeDrawer === "register"}
        onOpenChange={(open) => setActiveDrawer(open ? "register" : null)}
        onSwitchToLogin={openLogin}
        onSuccess={handleSuccess}
      />

      <ForgotPasswordDrawer
        open={activeDrawer === "forgot-password"}
        onOpenChange={(open) => setActiveDrawer(open ? "forgot-password" : null)}
      />
    </AuthContext.Provider>
  )
}
