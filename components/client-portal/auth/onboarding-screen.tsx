"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import type { Barbershop } from "@/types/client-portal"

interface OnboardingScreenProps {
  barbershop: Barbershop
  onNext: () => void
}

export function OnboardingScreen({ barbershop, onNext }: OnboardingScreenProps) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col justify-end bg-black text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={barbershop.bannerUrl}
          alt={barbershop.name}
          className="size-full object-cover opacity-75"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Content Area */}
      <div className="relative z-10 flex flex-col px-6 pb-12">
        {/* Indicators */}
        <div className="mb-6 flex gap-2">
          <div className="h-1.5 w-10 rounded-full bg-[var(--primary)]" />
          <div className="h-1.5 w-6 rounded-full bg-white/50" />
          <div className="h-1.5 w-6 rounded-full bg-white/50" />
        </div>

        {/* Text */}
        <h1 className="mb-3 text-[32px] font-extrabold leading-[1.1] tracking-tight">
          Bem-vindo à {barbershop.name}
        </h1>
        <p className="mb-10 text-base leading-relaxed text-zinc-300">
          Agende serviços com facilidade, e aproveite um atendimento personalizado.
        </p>

        {/* Button */}
        <Button
          onClick={onNext}
          size="lg"
          className="h-14 rounded-xl bg-[var(--primary)] text-[17px] font-bold text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90"
        >
          Avançar
        </Button>
      </div>
    </div>
  )
}
