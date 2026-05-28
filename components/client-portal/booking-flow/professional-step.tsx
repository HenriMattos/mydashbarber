import type { Professional } from "@/types/client-portal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ProfessionalStepProps {
  professionals: Professional[]
  selectedProfessionalId?: string
  onSelect: (professionalId: string) => void
}

export function ProfessionalStep({
  professionals,
  selectedProfessionalId,
  onSelect,
}: ProfessionalStepProps) {
  return (
    <div className="space-y-3">
      {professionals.map((professional) => {
        const isSelected = selectedProfessionalId === professional.id
        return (
          <button
            key={professional.id}
            type="button"
            onClick={() => onSelect(professional.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors",
              isSelected ? "border-primary bg-primary/10" : "bg-background hover:bg-muted/40"
            )}
          >
            <Avatar className="size-11">
              <AvatarImage src={professional.avatarUrl} alt={professional.name} />
              <AvatarFallback>{professional.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{professional.name}</p>
              <p className="text-xs text-muted-foreground">{professional.role || "Profissional"}</p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

