import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/client-portal/utils"
import type { Plan } from "@/types/client-portal"

interface PlanCardProps {
  plan: Plan
  isCurrentPlan: boolean
  onOpenBenefits: () => void
  onBuy: () => void
}

export function PlanCard({ plan, isCurrentPlan, onOpenBenefits, onBuy }: PlanCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </div>
          {isCurrentPlan ? <Badge variant="secondary">Plano atual</Badge> : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="rounded-xl border bg-muted/20 p-3">
          <p className="text-lg font-semibold">{formatCurrency(plan.value)}</p>
          <p className="text-xs text-muted-foreground">
            Cobrança {plan.periodicity} - {plan.slotsAvailable} vagas disponiveis
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button type="button" variant="outline" onClick={onOpenBenefits}>
            Conferir benefícios
          </Button>
          <Button type="button" onClick={onBuy}>
            {isCurrentPlan ? "Gerenciar plano" : "Comprar plano"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
