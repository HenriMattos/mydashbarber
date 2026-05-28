import type { PaymentStatus } from "./status"

export type PaymentFinancialOrigin =
  | "direct"
  | "platform"
  | "subscription"

export type PaymentProcessingChannel = "external" | "platform_gateway"

export type PlatformReleaseStatus = "pending" | "available" | "transferred"

export type Payment = {
  id: string
  commandId?: string
  subscriptionId?: string
  amount: number
  method: string
  status: PaymentStatus
  financialOrigin?: PaymentFinancialOrigin
  processingChannel?: PaymentProcessingChannel
  isPlatformBalanceEligible?: boolean
  releaseStatus?: PlatformReleaseStatus
  paidAt?: string
  notes?: string
}
