"use client"

import { motion } from "framer-motion"

interface Check {
  label: string
  test: (value: string) => boolean
}

interface PasswordStrengthProps {
  value: string
  checks: Check[]
}

export function PasswordStrength({ value, checks }: PasswordStrengthProps) {
  return (
    <ul className="mt-2 space-y-1">
      {checks.map((check, index) => {
        const passed = check.test(value)
        return (
          <motion.li
            key={check.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              passed ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <span className="font-bold">{passed ? "✓" : "○"}</span>
            {check.label}
          </motion.li>
        )
      })}
    </ul>
  )
}
