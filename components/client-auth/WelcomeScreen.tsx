"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { readPortalSettings } from "@/lib/client-portal/settings"

interface WelcomeScreenProps {
  onOpenLogin: () => void
  onOpenRegister: () => void
}

export function WelcomeScreen({ onOpenLogin, onOpenRegister }: WelcomeScreenProps) {
  const [barbershop, setBarbershop] = React.useState(() => readPortalSettings())

  React.useEffect(() => {
    setBarbershop(readPortalSettings())
  }, [])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center select-none">
      <div className="flex flex-col items-center gap-4 mb-8">
        <Avatar className="size-24 border shadow-md hover:scale-105 transition-transform duration-300">
          <AvatarImage
            src={barbershop.logoUrl}
            alt={barbershop.name}
            style={{
              objectPosition: `${barbershop.logoPlacement?.x ?? 50}% ${barbershop.logoPlacement?.y ?? 50}%`,
              transform: `scale(${barbershop.logoPlacement?.zoom ?? 1})`,
            }}
          />
          <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
            {barbershop.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-lg font-bold text-muted-foreground">{barbershop.name}</h2>
          {barbershop.slogan && (
            <p className="text-xs text-muted-foreground/80 italic">{barbershop.slogan}</p>
          )}
        </div>
      </div>

      <h1 className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl max-w-sm">
        Bem-vindo à {barbershop.name}
      </h1>
      <p className="mt-3 max-w-sm text-sm text-muted-foreground">
        Entre na sua conta ou crie um cadastro para começar a agendar seus serviços.
      </p>

      <div className="mt-10 flex w-full max-w-xs flex-col gap-3">
        <Button
          size="lg"
          className="w-full h-14 text-base font-semibold rounded-2xl shadow-sm hover:opacity-90 active:scale-[0.98] transition-all"
          onClick={onOpenLogin}
        >
          Já tenho conta
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="w-full h-14 text-base font-semibold rounded-2xl hover:bg-muted active:scale-[0.98] transition-all"
          onClick={onOpenRegister}
        >
          Ainda não tenho conta
        </Button>
      </div>
    </div>
  )
}
