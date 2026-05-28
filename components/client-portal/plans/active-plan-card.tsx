import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/client-portal/mock-data"
import type { ActivePlan, Plan } from "@/types/client-portal"

interface ActivePlanCardProps {
  plan: Plan
  activePlan: ActivePlan
  onManage: () => void
}

export function ActivePlanCard({ plan, activePlan, onManage }: ActivePlanCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Plano ativo</CardTitle>
            <CardDescription>Seu plano atual e beneficios restantes.</CardDescription>
          </div>
          <Badge>Ativo</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="rounded-xl border bg-muted/25 p-3">
            <p className="font-semibold">{plan.name}</p>
            <p className="text-muted-foreground">
              {formatCurrency(plan.value)} / {plan.periodicity}
            </p>
            <p className="text-muted-foreground">
              Proxima cobranca: {formatDate(activePlan.nextChargeDate)}
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {activePlan.remainingBenefits.map((benefit) => (
            <article key={benefit.serviceName} className="rounded-xl border p-3">
              <p className="font-medium">{benefit.serviceName}</p>
              <p className="text-xs text-muted-foreground">
                {benefit.available} disponivel, {benefit.reserved} reservado, {benefit.consumed} consumido
              </p>
            </article>
          ))}
          </div>
        </div>
        <Button type="button" variant="outline" className="w-full md:w-auto" onClick={onManage}>
          Gerenciar
        </Button>
      </CardContent>
    </Card>
  )
}
