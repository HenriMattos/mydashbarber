"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { OnboardingSlide } from "@/types/client-portal"

interface OnboardingCarouselProps {
  onComplete: () => void
  barbershopName: string
  slides?: OnboardingSlide[]
}

export function OnboardingCarousel({ onComplete, barbershopName, slides: propSlides }: OnboardingCarouselProps) {
  const [currentSlide, setCurrentSlide] = React.useState(0)

  const defaultSlides = [
    {
      title: `Bem-vindo à ${barbershopName}`,
      description: "Agende serviços com facilidade, e aproveite um atendimento personalizado.",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Escolha seu profissional",
      description: "Visualize horários disponíveis e encontre o barbeiro ideal.",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Acompanhe seus agendamentos",
      description: "Gerencie horários, histórico e serviços em um único lugar.",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80",
    },
  ]

  const slides = React.useMemo(() => {
    if (!propSlides || propSlides.length === 0) return defaultSlides
    return propSlides.map(s => ({
      title: s.title,
      description: s.description,
      image: s.imageUrl
    }))
  }, [propSlides, barbershopName])

  function handleNext() {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1)
    } else {
      onComplete()
    }
  }

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-black select-none">
      {/* Imagem de Fundo com Fade Suave */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentSlide}
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="size-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* Overlay Gradiente Premium e Escuro */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.95) 100%)",
        }}
      />

      {/* Conteúdo Inferior e Controles */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col justify-end px-8 pb-[calc(2.5rem+env(safe-area-inset-bottom))] md:px-10 max-w-xl mx-auto h-3/5">
        {/* Indicador de Dots deitados e arredondados idênticos ao layout */}
        <div className="flex items-center gap-2.5 mb-6" aria-label="Indicador de página">
          {slides.map((_, index) => {
            const isActive = index === currentSlide
            return (
              <div
                key={index}
                className="h-1.5 w-10 rounded-full overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: isActive ? "var(--primary)" : "rgba(255, 255, 255, 0.4)",
                }}
              />
            )
          })}
        </div>

        {/* Textos com Animação de Entrada */}
        <div className="min-h-[140px] mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-3"
            >
              <h1 className="text-[1.85rem] font-black tracking-tight text-white sm:text-4xl leading-tight">
                {slides[currentSlide].title}
              </h1>
              <p className="text-sm sm:text-[0.95rem] text-white/80 leading-relaxed font-normal max-w-md">
                {slides[currentSlide].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Botão de Ação com Cantos Arredondados - Cores agora dinâmicas */}
        <Button
          size="lg"
          className="w-full h-14 text-base font-bold rounded-[1.25rem] bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 active:scale-[0.98] transition-all shadow-md border-0"
          onClick={handleNext}
        >
          Avançar
        </Button>
      </div>
    </div>
  )
}

