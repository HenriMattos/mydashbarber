import { CrownIcon, SparklesIcon } from "@hugeicons/core-free-icons"
import Link from "next/link"

import { MetricCard } from "@/components/admin/metric-card"
import { database } from "@/components/admin/database"
import { SectionCard } from "@/components/admin/section-card"
import { SimpleTable } from "@/components/admin/simple-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { EmptyState } from "@/components/admin/empty-state"
import { Button } from "@/components/ui/button"
import {
  PLAN_STATUS,
  PLAN_STATUS_LABELS,
  SUBSCRIPTION_STATUS,
} from "@/types"

export default function PlanosPage() {
  const activeSubscriptions = database.subscriptions.filter(
    (subscription) => subscription.status === SUBSCRIPTION_STATUS.ACTIVE
  )
  const delinquentSubscriptions = database.subscriptions.filter(
    (subscription) => subscription.status === SUBSCRIPTION_STATUS.DELINQUENT
  )
  const activePlans = database.plans.filter(
    (plan) => plan.status === PLAN_STATUS.ACTIVE
  )
  const inactivePlans = database.plans.filter(
    (plan) => plan.status === PLAN_STATUS.INACTIVE
  )
  const estimatedRecurringRevenue = database.plans.reduce(
    (sum, plan) => sum + (plan.estimatedRecurringRevenue ?? plan.price * (plan.subscriberCount ?? 0)),
    0
  )
  const planRows = database.plans.map((plan) => {
    const subscribers =
      plan.subscriberCount ??
      database.subscriptions.filter(
        (subscription) => subscription.plan === plan.name
      ).length
    const includedSummary = plan.includedServices
      .map((service) =>
        service.unlimited
          ? `${service.serviceName} ilimitado`
          : `${service.quantityPerCycle}x ${service.serviceName}`
      )
      .join(" · ")

    return [
      <div key={`${plan.id}-name`} className="min-w-0">
        <p className="font-medium break-words">{plan.name}</p>
        <p className="mt-1 text-xs text-muted-foreground break-words">
          {plan.commercialText || plan.description}
        </p>
      </div>,
      <div key={`${plan.id}-coverage`} className="min-w-0 text-sm">
        <p className="break-words">{includedSummary}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {plan.extraDiscountPercent
            ? `${plan.extraDiscountPercent}% de desconto em extras`
            : "Extras cobrados a parte"}
          {plan.productDiscountPercent
            ? ` · ${plan.productDiscountPercent}% de desconto em produtos`
            : ""}
        </p>
      </div>,
      formatCurrency(plan.price),
      `${subscribers} assinantes`,
      formatCurrency(plan.estimatedRecurringRevenue ?? plan.price * subscribers),
      <StatusBadge
        key={plan.id}
        tone={
          plan.featured
            ? "amber"
            : plan.status === PLAN_STATUS.INACTIVE
              ? "neutral"
              : "green"
        }
      >
        {plan.featured
          ? "Destaque"
          : plan.status === PLAN_STATUS.INACTIVE
            ? "Indisponivel"
            : PLAN_STATUS_LABELS[plan.status]}
      </StatusBadge>,
    ]
  })

  return (
    <>
      <div className="admin-metric-grid">
        <MetricCard
          title="Planos ativos"
          value={String(activePlans.length)}
          change={`${activePlans.length} planos disponiveis para venda`}
          icon={CrownIcon}
          tone="green"
        />
        <MetricCard
          title="Assinantes ativos"
          value={String(activeSubscriptions.length)}
          change={`${database.analytics.newClientsThisMonth} novos clientes no mes`}
          icon={CrownIcon}
          tone="blue"
        />
        <MetricCard
          title="Inadimplentes"
          value={String(delinquentSubscriptions.length)}
          change="Assinaturas que exigem atencao"
          icon={CrownIcon}
          tone="amber"
        />
        <MetricCard
          title="MRR estimado"
          value={formatCurrency(estimatedRecurringRevenue)}
          change={`${inactivePlans.length} planos indisponiveis`}
          icon={CrownIcon}
          tone="blue"
        />
      </div>

      <SectionCard
        title="Planos de assinatura"
        description="Produtos recorrentes, cobertura por servico e recorrencia por cliente"
        action={
          <Button size="sm" asChild>
            <Link href="/planos/criar">Novo plano</Link>
          </Button>
        }
      >
        {database.plans.length === 0 ? (
          <EmptyState
            icon={SparklesIcon}
            title="Nenhum plano criado"
            description="Crie planos com servicos inclusos, descontos e saldo por ciclo para fidelizar seus clientes."
            actionLabel="Criar meu primeiro plano"
            href="/planos/criar"
          />
        ) : (
          <SimpleTable
            columns={["Plano", "Cobertura", "Preco", "Base", "MRR", "Status"]}
            rows={planRows}
          />
        )}
      </SectionCard>
    </>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}
