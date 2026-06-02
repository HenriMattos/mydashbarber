"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, LogIn } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { SocialLogin } from "@/components/auth/SocialLogin"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { setPortalAuth } from "@/lib/client-portal/portal-auth"
import { usePortalTheme } from "@/lib/client-portal/use-portal-theme"

const loginSchema = z.object({
  login: z.string().min(1, "Email ou celular é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
  remember: z.boolean().optional(),
})

type LoginData = z.infer<typeof loginSchema>

interface LoginDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToRegister: () => void
  onForgotPassword: () => void
  onSuccess: () => void
}

export function LoginDrawer({
  open,
  onOpenChange,
  onSwitchToRegister,
  onForgotPassword,
  onSuccess,
}: LoginDrawerProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const { themeStyle } = usePortalTheme()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: "", password: "", remember: false },
  })

  React.useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  async function onSubmit(data: LoginData) {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const { database } = require("@/components/admin/database")
    const demoClient = database.clients.find((c: any) => c.email === data.login)

    setPortalAuth({
      name: demoClient?.name || data.login.split("@")[0] || "Cliente",
      email: data.login,
      phone: demoClient?.phone || "(11) 98888-0101",
    })
    toast.success("Login realizado com sucesso!")
    setIsLoading(false)
    onOpenChange(false)
    onSuccess()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        overlayClassName="bg-black/60"
        className="h-[90dvh] max-h-[90dvh] sm:max-w-[450px]"
        style={themeStyle}
      >
        <SheetHeader>
          <SheetTitle>Entrar</SheetTitle>
          <SheetDescription>
            Acesse sua conta para visualizar seus agendamentos.
          </SheetDescription>
        </SheetHeader>

        <SheetBody className="space-y-6">
          <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="login-email">Email ou Celular</Label>
              <Input
                id="login-email"
                type="text"
                placeholder="seu@email.com"
                aria-invalid={!!errors.login}
                {...register("login")}
                className="h-11 rounded-xl"
              />
              {errors.login && (
                <p className="text-xs text-destructive">{errors.login.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Senha</Label>
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs text-primary underline-offset-2 hover:underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  Esqueci minha senha
                </button>
              </div>
              <PasswordInput
                id="login-password"
                placeholder="Digite sua senha"
                aria-invalid={!!errors.password}
                {...register("password")}
                className="h-11 rounded-xl"
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="login-remember" {...register("remember")} />
              <Label htmlFor="login-remember" className="text-sm font-normal cursor-pointer select-none">
                Lembrar-me
              </Label>
            </div>
          </form>

          <div className="relative my-8">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-3 text-2xs text-muted-foreground uppercase font-bold tracking-widest">
                ou continue com
              </span>
            </div>
          </div>

          <SocialLogin />

          <p className="text-center text-sm text-muted-foreground pt-2">
            Não possui conta?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="font-semibold text-primary underline-offset-2 hover:underline bg-transparent border-0 p-0 cursor-pointer"
            >
              Cadastrar
            </button>
          </p>
        </SheetBody>

        <SheetFooter>
          <Button
            form="login-form"
            type="submit"
            className="w-full h-14 text-base font-semibold rounded-2xl"
            disabled={isLoading}
          >
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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
