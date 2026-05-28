import { cn } from "@/lib/utils"

interface TimeStepProps {
  times: string[]
  selectedTime?: string
  onSelect: (time: string) => void
}

export function TimeStep({ times, selectedTime, onSelect }: TimeStepProps) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {times.map((time) => {
        const isSelected = selectedTime === time
        return (
          <button
            key={time}
            type="button"
            onClick={() => onSelect(time)}
            className={cn(
              "rounded-xl border py-2 text-sm font-semibold transition-colors",
              isSelected ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted/40"
            )}
          >
            {time}
          </button>
        )
      })}
    </div>
  )
}

