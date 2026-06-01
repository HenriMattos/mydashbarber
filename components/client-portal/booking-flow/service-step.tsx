import { Check } from "lucide-react"

import type { ActivePlan, Plan, Service } from "@/types/client-portal"
import { formatCurrency, getServicePlanDiscount } from "@/lib/client-portal/utils"
import { cn } from "@/lib/utils"

interface ServiceStepProps {
  services: Service[]
  selectedServiceIds: string[]
  onToggle: (serviceId: string) => void
  plans: Plan[]
  activePlan: ActivePlan | null
}

export function ServiceStep({
  services,
  selectedServiceIds,
  onToggle,
  plans,
  activePlan,
}: ServiceStepProps) {
  return (
    <div className="space-y-3">
      {services.map((service) => {
        const isSelected = selectedServiceIds.includes(service.id)
        const discountPercent = getServicePlanDiscount(service.name, plans, activePlan)

        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onToggle(service.id)}
            className={cn(
              "flex w-full flex-col rounded-2xl border p-3 text-left transition-colors",
              isSelected
                ? "border-primary bg-primary/10"
                : "bg-background hover:bg-muted/40"
            )}
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold">{service.name}</p>
              {isSelected ? <Check className="size-4 text-primary" /> : null}
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="text-sm">{formatCurrency(service.price)}</span>
              {discountPercent !== null ? (
                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  {discountPercent}% do plano
                </span>
              ) : null}
            </div>
          </button>
        )
      })}
    </div>
  )
}
