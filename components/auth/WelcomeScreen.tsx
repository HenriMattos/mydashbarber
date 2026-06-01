"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { PortalLogo } from "@/components/portal-auth/portal-logo"
import { LoginDialog } from "@/components/auth/LoginDialog"
import { RegisterDialog } from "@/components/auth/RegisterDialog"

interface WelcomeScreenProps {
  redirect?: string
}

export function WelcomeScreen({ redirect }: WelcomeScreenProps) {
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const redirectTo = redirect || "/portal"

  useEffect(() => {
    function handleOpenLogin() {
      setLoginOpen(true)
    }
    function handleOpenRegister() {
      setRegisterOpen(true)
    }
    window.addEventListener("bigood:open-login", handleOpenLogin)
    window.addEventListener("bigood:open-register", handleOpenRegister)
    return () => {
      window.removeEventListener("bigood:open-login", handleOpenLogin)
      window.removeEventListener("bigood:open-register", handleOpenRegister)
    }
  }, [])

  return (
    <>
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
        <PortalLogo className="mb-8" />

        <h1 className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
          Bem-vindo
        </h1>
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Entre na sua conta ou crie um cadastro para agendar seus horários.
        </p>

        <div className="mt-10 flex w-full max-w-xs flex-col gap-3">
          <Button
            size="lg"
            className="w-full h-14 text-base"
            onClick={() => setLoginOpen(true)}
          >
            Já tenho conta
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full h-14 text-base"
            onClick={() => setRegisterOpen(true)}
          >
            Ainda não tenho conta
          </Button>
        </div>
      </div>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} redirectTo={redirectTo} />
      <RegisterDialog open={registerOpen} onOpenChange={setRegisterOpen} redirectTo={redirectTo} />
    </>
  )
}
