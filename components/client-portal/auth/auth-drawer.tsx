"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setPortalAuth } from "@/lib/client-portal/portal-auth"
import { usePortalTheme } from "@/lib/client-portal/use-portal-theme"

interface AuthDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type AuthStep = "login" | "register"

export function AuthDrawer({ open, onOpenChange }: AuthDrawerProps) {
  const [step, setStep] = React.useState<AuthStep>("login")
  const { themeStyle } = usePortalTheme()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [name, setName] = React.useState("")
  const [phone, setPhone] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  // Reset state when drawer opens
  React.useEffect(() => {
    if (open) {
      setStep("login")
      setEmail("")
      setPassword("")
      setName("")
      setPhone("")
      setIsLoading(false)
    }
  }, [open])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800))

    setPortalAuth({
      name: step === "register" ? name : "Cliente Teste",
      email,
      phone: step === "register" ? phone : "(11) 99999-9999",
    })

    setIsLoading(false)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="fixed inset-x-0 bottom-0 z-50 mt-24 flex max-h-[90dvh] flex-col rounded-t-[32px] border-none bg-background px-6 pb-8 pt-6 shadow-2xl sm:left-1/2 sm:right-auto sm:w-full sm:max-w-[440px] sm:-translate-x-1/2"
        style={themeStyle}
      >
        <div className="mx-auto mb-6 h-1.5 w-12 shrink-0 rounded-full bg-muted/60" />
        
        <SheetHeader className="mb-6 px-0 text-left">
          <SheetTitle className="text-2xl font-extrabold tracking-tight">
            {step === "login" ? "Acesse sua conta" : "Crie sua conta"}
          </SheetTitle>
          <SheetDescription className="text-base text-muted-foreground">
            {step === "login" 
              ? "Bem-vindo de volta! Faça login para continuar." 
              : "Preencha os dados abaixo para começar a agendar."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-col gap-4 overflow-y-auto">
          {step === "register" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  required
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Celular</Label>
                <Input
                  id="phone"
                  required
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-12 rounded-xl"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              {step === "login" && (
                <button type="button" className="text-sm font-semibold text-[var(--primary)] hover:underline">
                  Esqueceu a senha?
                </button>
              )}
            </div>
            <Input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl"
            />
          </div>

          <Button 
            type="submit" 
            size="lg" 
            disabled={isLoading}
            className="mt-4 h-14 w-full rounded-xl bg-[var(--primary)] text-[17px] font-bold text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90"
          >
            {isLoading 
              ? "Aguarde..." 
              : step === "login" 
                ? "Entrar" 
                : "Criar conta"
            }
          </Button>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            {step === "login" ? "Ainda não tem conta? " : "Já tem uma conta? "}
            <button
              type="button"
              onClick={() => setStep(step === "login" ? "register" : "login")}
              className="font-semibold text-[var(--primary)] hover:underline"
            >
              {step === "login" ? "Cadastre-se" : "Faça login"}
            </button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
