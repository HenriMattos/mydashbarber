"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AuthHeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
}

export function AuthHeader({ title, subtitle, onBack }: AuthHeaderProps) {
  return (
    <div className="mb-8">
      {onBack && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="mb-6 rounded-full"
          onClick={onBack}
          aria-label="Voltar"
        >
          <ArrowLeft className="size-5" />
        </Button>
      )}
      <h1 className="text-xl font-extrabold text-foreground">{title}</h1>
      {subtitle && (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  )
}
