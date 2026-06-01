"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"

interface AuthLayoutProps {
  children: ReactNode
  image?: string
  alt?: string
}

export function AuthLayout({ children, image, alt = "" }: AuthLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background lg:flex-row">
      {image && (
        <div
          className="relative hidden lg:block lg:w-1/2"
          aria-hidden="true"
        >
          <div
            className="size-full bg-cover bg-center"
            style={{ backgroundImage: `url(${image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          {alt && (
            <span className="sr-only">{alt}</span>
          )}
        </div>
      )}

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="w-full max-w-[420px]"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
