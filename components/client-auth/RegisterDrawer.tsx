"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, UserPlus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { SocialLogin } from "@/components/auth/SocialLogin"
import { PasswordStrength } from "@/components/client-auth/PasswordStrength"
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

const registerSchema = z
  .object({
    fullName: z.string().min(3, "Nome completo é obrigatório"),
    email: z.string().email("Email inválido"),
    phone: z
      .string()
      .min(10, "Telefone inválido")
      .regex(/^\d{10,11}$/, "Telefone deve conter apenas números (DDD + número)"),
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

interface RegisterDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSwitchToLogin: () => void
  onSuccess: () => void
}

export function RegisterDrawer({ open, onOpenChange, onSwitchToLogin, onSuccess }: RegisterDrawerProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const { themeStyle } = usePortalTheme()

  const {
    register,
    handleSubmit,
    watch,
    reset,
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

  React.useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  async function onSubmit(data: RegisterData) {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Simula a persistência e autenticação
    setPortalAuth({
      name: data.fullName,
      email: data.email,
      phone: data.phone,
    })

    toast.success("Conta criada com sucesso!")
    setIsLoading(false)
    onOpenChange(false)
    onSuccess()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        overlayClassName="bg-black/60"
        className="h-[95dvh] max-h-[95dvh] sm:max-w-[450px]"
        style={themeStyle}
      >
        <SheetHeader>
          <SheetTitle>Criar Conta</SheetTitle>
          <SheetDescription>
            Cadastre-se para começar a agendar seus serviços.
          </SheetDescription>
        </SheetHeader>

        <SheetBody className="space-y-6">
          <form id="register-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
            <div className="space-y-1">
              <Label htmlFor="reg-fullName">Nome completo</Label>
              <Input
                id="reg-fullName"
                placeholder="Seu nome completo"
                aria-invalid={!!errors.fullName}
                {...register("fullName")}
                className="h-11 rounded-xl"
              />
              {errors.fullName && (
                <p className="text-xs text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="reg-email">Email</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="seu@email.com"
                aria-invalid={!!errors.email}
                {...register("email")}
                className="h-11 rounded-xl"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="reg-phone">Celular</Label>
              <Input
                id="reg-phone"
                type="tel"
                inputMode="numeric"
                placeholder="11988880000"
                aria-invalid={!!errors.phone}
                {...register("phone")}
                className="h-11 rounded-xl"
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="reg-password">Senha</Label>
              <PasswordInput
                id="reg-password"
                placeholder="Crie uma senha"
                aria-invalid={!!errors.password}
                {...register("password")}
                className="h-11 rounded-xl"
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
              <PasswordStrength value={passwordValue} />
            </div>

            <div className="space-y-1">
              <Label htmlFor="reg-confirmPassword">Confirmar senha</Label>
              <PasswordInput
                id="reg-confirmPassword"
                placeholder="Repita a senha"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
                className="h-11 rounded-xl"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
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
            Já possui conta?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-semibold text-primary underline-offset-2 hover:underline bg-transparent border-0 p-0 cursor-pointer"
            >
              Entrar
            </button>
          </p>
        </SheetBody>

        <SheetFooter>
          <Button
            form="register-form"
            type="submit"
            className="w-full h-14 text-base font-semibold rounded-2xl"
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
                Criar Conta
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
