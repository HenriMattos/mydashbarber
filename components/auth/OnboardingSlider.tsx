"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

interface Slide {
  image?: string
  gradient?: string
  title: string
  description: string
}

interface OnboardingSliderProps {
  slides: Slide[]
  redirect?: string
}

const slideVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
}

export function OnboardingSlider({ slides, redirect }: OnboardingSliderProps) {
  const router = useRouter()
  const [current, setCurrent] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const slide = slides[current]
  const isLast = current === slides.length - 1

  const resetInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => {
        if (prev < slides.length - 1) return prev + 1
        return prev
      })
    }, 5000)
  }, [slides.length])

  useEffect(() => {
    resetInterval()
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [current, resetInterval])

  const goNext = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (!isLast) {
      setCurrent((c) => c + 1)
    } else {
      localStorage.setItem("bigood.onboarding.concluded", "true")
      const dest = redirect ? `/portal/welcome?redirect=${encodeURIComponent(redirect)}` : "/portal/welcome"
      router.replace(dest)
    }
  }, [isLast, router, redirect])

  const goTo = useCallback((index: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setCurrent(index)
  }, [])

  const skip = useCallback(() => {
    localStorage.setItem("bigood.onboarding.concluded", "true")
    const dest = redirect ? `/portal/welcome?redirect=${encodeURIComponent(redirect)}` : "/portal/welcome"
    router.replace(dest)
  }, [router, redirect])

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: slide.image
              ? `url(${slide.image})`
              : slide.gradient || "none",
          }}
        />
      </AnimatePresence>

      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.85) 100%)",
        }}
      />

      <div className="relative z-20 flex justify-end p-4">
        <button
          type="button"
          onClick={skip}
          className="px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
        >
          Pular
        </button>
      </div>

      <div className="relative z-20 mt-auto flex flex-col gap-8 px-6 pb-12 sm:px-8 sm:pb-16">
        <div className="flex gap-2" role="tablist" aria-label="Indicador de páginas">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={index === current}
              aria-label={`Slide ${index + 1}`}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor:
                  index === current ? "#fff" : "rgba(255,255,255,0.35)",
                width: index === current ? "24px" : "8px",
              }}
              onClick={() => goTo(index)}
            />
          ))}
        </div>

        <div key={current}>
          <h1 className="text-4xl font-black leading-tight text-white">
            {slide.title}
          </h1>
          {slide.description && (
            <p className="mt-3 max-w-sm text-base leading-relaxed text-white/80">
              {slide.description}
            </p>
          )}
        </div>

        <Button
          size="lg"
          className="w-full h-14 rounded-lg text-base font-semibold"
          onClick={goNext}
        >
          {isLast ? "Começar" : "Avançar"}
        </Button>
      </div>
    </div>
  )
}
