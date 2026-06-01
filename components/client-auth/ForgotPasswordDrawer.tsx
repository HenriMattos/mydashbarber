"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Send } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { usePortalTheme } from "@/lib/client-portal/use-portal-theme"

const forgotSchema = z.object({
  email: z.string().email("Digite um email válido"),
})

type ForgotData = z.infer<typeof forgotSchema>

interface ForgotPasswordDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ForgotPasswordDrawer({ open, onOpenChange }: ForgotPasswordDrawerProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const { themeStyle } = usePortalTheme()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotData>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  })

  React.useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  async function onSubmit(data: ForgotData) {
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    toast.success(`Instruções enviadas para ${data.email}`)
    setIsLoading(false)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent overlayClassName="bg-black/60" style={themeStyle}>
        <SheetHeader>
          <SheetTitle>Recuperar senha</SheetTitle>
          <SheetDescription>
            Informe seu email para receber as instruções de recuperação de acesso.
          </SheetDescription>
        </SheetHeader>

        <SheetBody>
          <form id="forgot-password-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                placeholder="seu@email.com"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>
          </form>
        </SheetBody>

        <SheetFooter className="flex flex-col gap-2">
          <Button
            form="forgot-password-form"
            type="submit"
            className="w-full h-14 text-base font-semibold rounded-2xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 size-4" />
                Enviar instruções
              </>
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
