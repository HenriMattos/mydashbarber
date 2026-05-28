import type { PlanStatus } from "./status"

export type BillingCycle = "monthly" | "annual"

export type PlanIncludedService = {
  serviceId: string
  serviceName: string
  quantityPerCycle: number
  unlimited?: boolean
  requiresReservation?: boolean
  professionalScope?: "any" | "specific"
  note?: string
}

export type PlanBenefitRule = {
  includedServices: PlanIncludedService[]
  extraDiscountPercent?: number
  productDiscountPercent?: number
  customerRulesText: string
  schedulingRulesText?: string
  usageRulesText?: string
  internalNotes?: string
}

export type FunctionalPlan = {
  id: string
  name: string
  description: string
  price: number
  billingCycle: BillingCycle
  status: PlanStatus
  benefitRule: PlanBenefitRule
  featured?: boolean
  commercialText?: string
  subscriberCount?: number
  estimatedRecurringRevenue?: number
  internalNotes?: string
}
