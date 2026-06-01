"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { PasswordStrength } from "@/components/auth/PasswordStrength"
import { setPortalAuth } from "@/lib/client-portal/portal-auth"

const registerSchema = z
  .object({
    fullName: z.string().min(3, "Nome completo é obrigatório"),
    email: z.string().email("Email inválido"),
    phone: z
      .string()
      .min(10, "Telefone inválido")
      .regex(/^\d{10,11}$/, "Telefone deve conter apenas números"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(/[A-Z]/, "Deve conter letra maiúscula")
      .regex(/[a-z]/, "Deve conter letra minúscula")
      .regex(/[0-9]/, "Deve conter número")
      .regex(/[^A-Za-z0-9]/, "Deve conter caractere especial"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  })

type RegisterData = z.infer<typeof registerSchema>

const passwordChecks = [
  { label: "Pelo menos 8 caracteres", test: (v: string) => v.length >= 8 },
  { label: "Uma letra maiúscula", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Uma letra minúscula", test: (v: string) => /[a-z]/.test(v) },
  { label: "Um número", test: (v: string) => /[0-9]/.test(v) },
  { label: "Um caractere especial", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
]

interface RegisterDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  redirectTo?: string
}

export function RegisterDialog({ open, onOpenChange, redirectTo = "/portal" }: RegisterDialogProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  })

  const passwordValue = watch("password", "")

  async function onSubmit(data: RegisterData) {
    setIsLoading(true)
    await new Promise((r) => setTimeout(r, 1500))
    setPortalAuth({ name: data.fullName, email: data.email, phone: data.phone })
    toast.success("Conta criada com sucesso!")
    onOpenChange(false)
    router.push(redirectTo)
    setIsLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold">Criar conta</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Cadastre-se para começar a agendar serviços.
          </p>
        </DialogHeader>

        <DialogBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName-dialog">Nome completo</Label>
              <Input
                id="fullName-dialog"
                placeholder="Seu nome completo"
                aria-invalid={!!errors.fullName}
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="text-xs text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email-dialog">Email</Label>
              <Input
                id="email-dialog"
                type="email"
                placeholder="seu@email.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone-dialog">Celular</Label>
              <Input
                id="phone-dialog"
                type="tel"
                inputMode="numeric"
                placeholder="11988880000"
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password-dialog">Senha</Label>
              <PasswordInput
                id="password-dialog"
                placeholder="Crie uma senha"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
              <PasswordStrength value={passwordValue} checks={passwordChecks} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword-dialog">Confirmar senha</Label>
              <PasswordInput
                id="confirmPassword-dialog"
                placeholder="Repita a senha"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              className="w-full h-12 rounded-lg text-base font-semibold"
              type="submit"
              disabled={isLoading}
            >
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
            Já possui conta?{" "}
            <button
              type="button"
              onClick={() => {
                onOpenChange(false)
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent("bigood:open-login"))
                }, 300)
              }}
              className="font-semibold text-primary underline-offset-2 hover:underline bg-transparent border-0 p-0 cursor-pointer"
            >
              Entrar
            </button>
          </p>
        </DialogBody>
      </DialogContent>
    </Dialog>
  )
}
