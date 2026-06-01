"use client"

import { Eye, EyeOff } from "lucide-react"
import { forwardRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const PasswordInput = forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { showToggle?: boolean }
>(({ showToggle = true, className, ...props }, ref) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={visible ? "text" : "password"}
        className={`pr-10 ${className ?? ""}`}
        {...props}
      />
      {showToggle && (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          tabIndex={-1}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </Button>
      )}
    </div>
  )
})
PasswordInput.displayName = "PasswordInput"
