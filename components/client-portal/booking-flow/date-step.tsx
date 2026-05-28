import { cn } from "@/lib/utils"

interface DateStepProps {
  availableDates: string[]
  selectedDate?: string
  onSelect: (date: string) => void
}

export function DateStep({ availableDates, selectedDate, onSelect }: DateStepProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-7">
        {availableDates.map((date) => {
          const isSelected = selectedDate === date
          const parsed = new Date(`${date}T00:00:00`)
          const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(parsed)
          const day = new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(parsed)
          return (
            <button
              key={date}
              type="button"
              onClick={() => onSelect(date)}
              className={cn(
                "min-h-16 rounded-2xl border px-2 py-2 text-center transition-colors",
                isSelected ? "border-primary bg-primary/10" : "bg-background hover:bg-muted/40"
              )}
            >
              <p className="text-xs text-muted-foreground">{weekday}</p>
              <p className="text-base font-semibold">{day}</p>
            </button>
          )
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Selecione um dia para ver os horarios disponiveis.
      </p>
    </div>
  )
}
