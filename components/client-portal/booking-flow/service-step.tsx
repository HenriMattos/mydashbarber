import type { Service } from "@/types/client-portal"
import { formatCurrency } from "@/lib/client-portal/mock-data"
import { cn } from "@/lib/utils"

interface ServiceStepProps {
  services: Service[]
  selectedServiceId?: string
  onSelect: (serviceId: string) => void
}

export function ServiceStep({ services, selectedServiceId, onSelect }: ServiceStepProps) {
  return (
    <div className="space-y-3">
      {services.map((service) => {
        const isSelected = selectedServiceId === service.id
        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onSelect(service.id)}
            className={cn(
              "w-full rounded-2xl border p-3 text-left transition-colors",
              isSelected ? "border-primary bg-primary/10" : "bg-background hover:bg-muted/40"
            )}
          >
            <p className="font-semibold">{service.name}</p>
            <p className="text-xs text-muted-foreground">{service.durationMinutes} min</p>
            <p className="mt-0.5 text-sm">{formatCurrency(service.price)}</p>
            {service.description ? (
              <p className="mt-1 text-xs text-muted-foreground">{service.description}</p>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}

