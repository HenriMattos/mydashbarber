"use client"

import * as React from "react"
import { Loader2, LogIn, UserPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AuthScreenProps {
  title: string
  description: string
  isLoading: boolean
  onLogin: (payload: { email: string; password: string }) => void
  onSignup: (payload: {
    fullName: string
    email: string
    phone: string
    password: string
    confirmPassword: string
  }) => void
}

export function AuthScreen({
  title,
  description,
  isLoading,
  onLogin,
  onSignup,
}: AuthScreenProps) {
  const [loginData, setLoginData] = React.useState({
    email: "",
    password: "",
  })
  const [signupData, setSignupData] = React.useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })

  return (
    <div className="flex min-h-full items-center p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Criar conta</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-4">
              <form
                className="space-y-3"
                onSubmit={(event) => {
                  event.preventDefault()
                  onLogin(loginData)
                }}
              >
                <div className="space-y-1.5">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    required
                    placeholder="você@email.com"
                    value={loginData.email}
                    onChange={(event) =>
                      setLoginData((current) => ({ ...current, email: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    required
                    placeholder="Digite sua senha"
                    value={loginData.password}
                    onChange={(event) =>
                      setLoginData((current) => ({ ...current, password: event.target.value }))
                    }
                  />
                </div>
                <Button className="w-full" type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 size-4" />
                      Entrar
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup" className="mt-4">
              <form
                className="space-y-3"
                onSubmit={(event) => {
                  event.preventDefault()
                  onSignup(signupData)
                }}
              >
                <div className="space-y-1.5">
                  <Label htmlFor="signup-name">Nome completo</Label>
                  <Input
                    id="signup-name"
                    required
                    placeholder="Seu nome completo"
                    value={signupData.fullName}
                    onChange={(event) =>
                      setSignupData((current) => ({ ...current, fullName: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    required
                    placeholder="você@email.com"
                    value={signupData.email}
                    onChange={(event) =>
                      setSignupData((current) => ({ ...current, email: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-phone">Telefone</Label>
                  <Input
                    id="signup-phone"
                    required
                    placeholder="(11) 98888-0000"
                    value={signupData.phone}
                    onChange={(event) =>
                      setSignupData((current) => ({ ...current, phone: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-password">Senha</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    required
                    placeholder="Crie uma senha"
                    value={signupData.password}
                    onChange={(event) =>
                      setSignupData((current) => ({ ...current, password: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="signup-confirm">Confirmar senha</Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    required
                    placeholder="Repita a senha"
                    value={signupData.confirmPassword}
                    onChange={(event) =>
                      setSignupData((current) => ({
                        ...current,
                        confirmPassword: event.target.value,
                      }))
                    }
                  />
                </div>
                <Button className="w-full" type="submit" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 size-4" />
                      Criar conta
                    </>
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

