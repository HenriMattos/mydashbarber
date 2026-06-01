"use client"

import type { ReactNode } from "react"

export function AuthCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={`premium-card motion-rise w-full max-w-[480px] mx-auto p-6 sm:p-8 ${className ?? ""}`}
    >
      {children}
    </div>
  )
}
