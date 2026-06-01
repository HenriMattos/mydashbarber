"use client"

import { Check, Circle } from "lucide-react"

interface PasswordStrengthProps {
  value: string
}

export function PasswordStrength({ value }: PasswordStrengthProps) {
  const requirements = [
    { label: "Pelo menos 8 caracteres", test: (v: string) => v.length >= 8 },
    { label: "Uma letra maiúscula", test: (v: string) => /[A-Z]/.test(v) },
    { label: "Uma letra minúscula", test: (v: string) => /[a-z]/.test(v) },
    { label: "Um número", test: (v: string) => /[0-9]/.test(v) },
    { label: "Um caractere especial (@$!%*?&)", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
  ]

  return (
    <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground" aria-label="Requisitos de senha">
      {requirements.map((req, i) => {
        const isMet = req.test(value)
        return (
          <li key={i} className="flex items-center gap-1.5 transition-colors duration-200">
            {isMet ? (
              <Check className="size-3.5 text-primary shrink-0" aria-hidden="true" />
            ) : (
              <Circle className="size-3.5 text-muted-foreground/40 shrink-0" aria-hidden="true" />
            )}
            <span className={isMet ? "text-foreground font-medium" : "text-muted-foreground"}>
              {req.label}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
