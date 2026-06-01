import type { ActivePlan, Plan } from "@/types/client-portal"

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDate(value: string) {
  if (!value) return ""
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(`${value}T00:00:00`))
}

export function formatDateTimeLabel(date: string, time: string) {
  const dateLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(new Date(`${date}T00:00:00`))
  return `${dateLabel} as ${time}`
}

export function getServicePlanDiscount(
  serviceName: string,
  plans: Plan[],
  plan: ActivePlan | null
): number | null {
  if (!plan) return null
  const matchedPlan = plans.find((p) => p.id === plan.planId)
  if (!matchedPlan) return null
  const benefit = matchedPlan.benefits.find((b) => b.serviceName === serviceName)
  if (!benefit) return null
  const remaining = plan.remainingBenefits.find((r) => r.serviceName === serviceName)
  if (!remaining || remaining.available <= 0) return null
  return benefit.discountPercent
}
