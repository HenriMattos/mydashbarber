"use client"

import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const slides = [
  {
    id: 1,
    title: "Agende seus horários facilmente",
    description: "Escolha serviços e horários em poucos segundos.",
  },
  {
    id: 2,
    title: "Acompanhe seus agendamentos",
    description: "Visualize horários futuros e histórico completo.",
  },
  {
    id: 3,
    title: "Ganhe benefícios exclusivos",
    description: "Acompanhe pontos, fidelidade e promoções.",
  },
]

interface OnboardingCarouselProps {
  onComplete: () => void
  onSkip: () => void
}

export function OnboardingCarousel({
  onComplete,
  onSkip,
}: OnboardingCarouselProps) {
  const [current, setCurrent] = useState(0)

  const next = useCallback(() => {
    if (current < slides.length - 1) {
      setCurrent((c) => c + 1)
    } else {
      onComplete()
    }
  }, [current, onComplete])

  const prev = useCallback(() => {
    if (current > 0) setCurrent((c) => c - 1)
  }, [current])

  const slide = slides[current]

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") next()
      if (event.key === "ArrowLeft") prev()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [next, prev])

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <div className="premium-card motion-rise mb-8 grid size-28 place-items-center rounded-[2rem] border bg-card shadow-lg">
          <span className="text-5xl font-bold text-primary">
            {slide.id}
          </span>
        </div>

        <h1 className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
          {slide.title}
        </h1>
        <p className="mt-3 max-w-xs text-sm text-muted-foreground sm:text-base">
          {slide.description}
        </p>
      </div>

      <div className="flex items-center justify-between px-6 pb-12">
        <Button variant="ghost" onClick={onSkip} aria-label="Pular onboarding">
          Pular
        </Button>

        <div className="flex gap-2" role="tablist" aria-label="Indicador de progresso">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === current}
              aria-label={`Slide ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === current
                  ? "w-8 bg-primary"
                  : "w-2 bg-border"
              }`}
              onClick={() => setCurrent(index)}
            />
          ))}
        </div>

        <Button onClick={next} aria-label={current < slides.length - 1 ? "Próximo" : "Começar"}>
          {current < slides.length - 1 ? (
            <>
              Próximo
              <ChevronRight className="ml-1 size-4" />
            </>
          ) : (
            "Começar"
          )}
        </Button>
      </div>
    </div>
  )
}
