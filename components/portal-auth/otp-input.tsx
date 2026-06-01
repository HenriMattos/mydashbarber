"use client"

import { useCallback, useEffect, useRef } from "react"

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
}: OTPInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const digits = value.split("").slice(0, length)
  while (digits.length < length) digits.push("")

  const focusInput = useCallback(
    (index: number) => {
      if (index >= 0 && index < length) {
        inputsRef.current[index]?.focus()
      }
    },
    [length]
  )

  const handleChange = (index: number, char: string) => {
    if (!/^\d$/.test(char)) return
    const next = value.split("")
    next[index] = char
    const joined = next.join("").slice(0, length)
    onChange(joined)
    if (index < length - 1) focusInput(index + 1)
  }

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault()
      const next = value.split("")
      next[index] = ""
      const joined = next.join("")
      onChange(joined)
      if (index > 0 && !value[index]) focusInput(index - 1)
    }
    if (event.key === "ArrowLeft") focusInput(index - 1)
    if (event.key === "ArrowRight") focusInput(index + 1)
  }

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault()
    const text = event.clipboardData.getData("text").replace(/\D/g, "")
    onChange(text.slice(0, length))
    focusInput(Math.min(text.length, length - 1))
  }

  useEffect(() => {
    focusInput(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex justify-center gap-2" role="group" aria-label="Código de verificação">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          aria-label={`Digito ${index + 1}`}
          className="grid size-12 place-items-center rounded-xl border bg-background text-center text-lg font-bold shadow-sm transition-all duration-200 selection:bg-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none aria-[invalid=true]:border-destructive disabled:opacity-50"
          onFocus={(event) => event.target.select()}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
        />
      ))}
    </div>
  )
}
