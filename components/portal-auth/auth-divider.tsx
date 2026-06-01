"use client"

interface AuthDividerProps {
  text?: string
}

export function AuthDivider({ text = "ou" }: AuthDividerProps) {
  return (
    <div className="relative my-6" role="separator" aria-orientation="horizontal">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-card px-3 text-xs text-muted-foreground uppercase">
          {text}
        </span>
      </div>
    </div>
  )
}
