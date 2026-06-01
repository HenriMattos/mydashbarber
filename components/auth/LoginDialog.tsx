"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { SocialLogin } from "@/components/auth/SocialLogin"
import { setPortalAuth } from "@/lib/client-portal/portal-auth"

const loginSchema = z.object({
  login: z.string().min(1, "Email ou celular é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
  remember: z.boolean().optional(),
})

type LoginData = z.infer<typeof loginSchema>

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  redirectTo?: string
}

export function LoginDialog({ open, onOpenChange, redirectTo = "/portal" }: LoginDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: "", password: "", remember: false },
  })

  async function onSubmit(data: LoginData) {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))

    if (data.login === "admin@admin.com" && data.password === "Admin@123") {
      setPortalAuth({ name: "Admin", email: data.login, phone: "" })
      toast.success("Login realizado com sucesso!")
      onOpenChange(false)
      router.push(redirectTo)
    } else {
      toast.error("Email ou senha inválidos.")
    }
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold">Entre com seus dados</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Faça login para acessar seus agendamentos.
          </p>
        </DialogHeader>

        <DialogBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-dialog">Email ou Celular</Label>
              <Input
                id="login-dialog"
                type="text"
                placeholder="seu@email.com"
                aria-invalid={!!errors.login}
                {...register("login")}
              />
              {errors.login && (
                <p className="text-xs text-destructive">{errors.login.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password-dialog">Senha</Label>
                <button
                  type="button"
                  onClick={() => {
                    onOpenChange(false)
                    router.push("/portal/forgot-password")
                  }}
                  className="text-xs text-primary underline-offset-2 hover:underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  Esqueci minha senha
                </button>
              </div>
              <PasswordInput
                id="password-dialog"
                placeholder="Digite sua senha"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox id="remember-dialog" {...register("remember")} />
              <Label htmlFor="remember-dialog" className="text-sm font-normal">
                Lembrar-me
              </Label>
            </div>

            <Button
              className="w-full h-12 rounded-lg text-base font-semibold"
              type="submit"
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
          </form>

          <div className="relative my-6">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-card px-3 text-xs text-muted-foreground uppercase">
                ou continue com
              </span>
            </div>
          </div>

          <SocialLogin />

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Não possui conta?{" "}
            <button
              type="button"
              onClick={() => {
                onOpenChange(false)
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent("bigood:open-register"))
                }, 300)
              }}
              className="font-semibold text-primary underline-offset-2 hover:underline bg-transparent border-0 p-0 cursor-pointer"
            >
              Cadastrar
            </button>
          </p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
