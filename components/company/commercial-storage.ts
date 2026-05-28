import { readStorage, writeStorage } from "@/services/company"
import type { Plan, Subscription } from "@/types"

const COMMERCIAL_PLANS_STORAGE_KEY = "mydashbarber.v1.commercial.plans"
const COMMERCIAL_SUBSCRIPTIONS_STORAGE_KEY =
  "mydashbarber.v1.commercial.subscriptions"

export function getStoredCommercialPlans<T extends Plan>(fallback: T[]) {
  const stored = readStorage<T[] | null>(COMMERCIAL_PLANS_STORAGE_KEY, null)
  if (!stored || stored.length === 0) return fallback
  if (fallback.length > 0 && stored[0].name !== fallback[0].name) return fallback
  if (stored.some((plan) => !Array.isArray(plan.includedServices)))
    return fallback
  return stored.map((plan) => ({
    ...plan,
    commercialText: plan.commercialText ?? plan.description,
    subscriberCount: plan.subscriberCount ?? 0,
    estimatedRecurringRevenue:
      plan.estimatedRecurringRevenue ??
      plan.price * (plan.subscriberCount ?? 0),
    extraDiscountPercent:
      plan.extraDiscountPercent ?? plan.benefitRule?.extraDiscountPercent,
    productDiscountPercent:
      plan.productDiscountPercent ?? plan.benefitRule?.productDiscountPercent,
    schedulingRulesText:
      plan.schedulingRulesText ?? plan.benefitRule?.schedulingRulesText,
    usageRulesText: plan.usageRulesText ?? plan.benefitRule?.usageRulesText,
    internalNotes: plan.internalNotes ?? plan.benefitRule?.internalNotes,
    featured: plan.featured ?? false,
  }))
}

export function saveCommercialPlans<T extends Plan>(plans: T[]) {
  writeStorage(COMMERCIAL_PLANS_STORAGE_KEY, plans)
}

export function getStoredCommercialSubscriptions<T extends Subscription>(
  fallback: T[]
) {
  const stored = readStorage<T[] | null>(
    COMMERCIAL_SUBSCRIPTIONS_STORAGE_KEY,
    null
  )
  if (!stored || stored.length === 0) return fallback
  if (fallback.length > 0 && stored[0].client !== fallback[0].client)
    return fallback
  if (stored.some((subscription) => !Array.isArray(subscription.benefitBalances)))
    return fallback
  return stored
}

export function saveCommercialSubscriptions<T extends Subscription>(
  subscriptions: T[]
) {
  writeStorage(COMMERCIAL_SUBSCRIPTIONS_STORAGE_KEY, subscriptions)
}
