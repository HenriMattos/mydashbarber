"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"

import { ActivePlanCard } from "@/components/client-portal/plans/active-plan-card"
import { PlanBenefitsDialog } from "@/components/client-portal/plans/plan-benefits-dialog"
import { PlanCard } from "@/components/client-portal/plans/plan-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { ActivePlan, Plan } from "@/types/client-portal"

interface PlansScreenProps {
  plans: Plan[]
  activePlan: ActivePlan | null
  isLoading: boolean
  onBuyPlan: (planId: string) => Promise<void>
}

export function PlansScreen({ plans, activePlan, isLoading, onBuyPlan }: PlansScreenProps) {
  const [selectedPlan, setSelectedPlan] = React.useState<Plan | null>(null)
  const [buyingPlanId, setBuyingPlanId] = React.useState<string | null>(null)
  const [gatewayMessage, setGatewayMessage] = React.useState<string | null>(null)

  const activePlanDetails = activePlan ? plans.find((plan) => plan.id === activePlan.planId) ?? null : null
  const otherPlans = activePlanDetails
    ? plans.filter((plan) => plan.id !== activePlanDetails.id)
    : plans

  async function handleBuy(planId: string) {
    setBuyingPlanId(planId)
    setGatewayMessage("Você sera redirecionado para o gateway de pagamento.")
    await onBuyPlan(planId)
    setTimeout(() => setGatewayMessage(null), 2200)
    setBuyingPlanId(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">Planos</h1>
        <p className="text-sm text-muted-foreground">
          Escolha e gerencie os benefícios da sua assinatura.
        </p>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Carregando planos...
          </CardContent>
        </Card>
      ) : (
        <>
          {activePlan && activePlanDetails ? (
            <ActivePlanCard
              plan={activePlanDetails}
              activePlan={activePlan}
              onManage={() => setSelectedPlan(activePlanDetails)}
            />
          ) : null}

          {activePlan && activePlanDetails ? (
            <h2 className="pt-2 text-sm font-semibold text-muted-foreground">
              Outros planos disponiveis
            </h2>
          ) : null}

          <div className="grid gap-3 lg:grid-cols-2">
            {otherPlans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={activePlan?.planId === plan.id}
                onOpenBenefits={() => setSelectedPlan(plan)}
                onBuy={() => void handleBuy(plan.id)}
              />
            ))}
          </div>

          {gatewayMessage ? (
            <div className="rounded-xl border bg-background p-3 text-sm text-muted-foreground">
              {gatewayMessage}
            </div>
          ) : null}

          {buyingPlanId ? (
            <Button disabled className="w-full md:w-auto">
              <Loader2 className="mr-2 size-4 animate-spin" />
              Processando...
            </Button>
          ) : null}
        </>
      )}

      <PlanBenefitsDialog
        open={Boolean(selectedPlan)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPlan(null)
          }
        }}
        plan={selectedPlan}
      />
    </div>
  )
}
