import type { BenefitBalanceStatus, SubscriptionStatus } from "./status"

export type SubscriptionBenefitBalance = {
  serviceId: string
  serviceName: string
  available: number
  reserved: number
  consumed: number
}

export type SubscriptionBenefitUsage = {
  id: string
  serviceId: string
  serviceName: string
  appointmentId?: string
  attendanceId?: string
  commandId?: string
  quantity: number
  status: BenefitBalanceStatus
  occurredAt: string
}

export type FunctionalSubscription = {
  id: string
  clientId: string
  planId: string
  status: SubscriptionStatus
  startedAt: string
  nextCharge: string
  benefitBalances: SubscriptionBenefitBalance[]
  usageHistory: SubscriptionBenefitUsage[]
  lastUsageAt?: string
  nextAppointmentAt?: string
  alert?: string
  notes: string
}
