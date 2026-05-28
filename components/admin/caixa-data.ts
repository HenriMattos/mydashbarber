export type {
  CashMovement,
  CashMovementType,
  Comanda,
  ComandaItem,
  ComandaStatus,
} from "@/types"

import { adminService } from "@/services/admin"
import {
  COMMAND_STATUS,
  COMMAND_STATUS_LABELS,
  PAYMENT_STATUS,
} from "@/types"

export const comandas = adminService.comandas
export const cashMovements = adminService.cashMovements

export function getComandaSubtotal(comanda: import("@/types").Comanda) {
  return comanda.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  )
}

export function getComandaCoveredTotal(comanda: import("@/types").Comanda) {
  return comanda.items.reduce((sum, item) => {
    if (item.coverage !== "included_in_plan") return sum
    return sum + item.quantity * item.unitPrice
  }, 0)
}

export function getComandaTotal(comanda: import("@/types").Comanda) {
  return getComandaSubtotal(comanda) - (comanda.discount ?? 0)
}

export function getComandaPaidTotal(comanda: import("@/types").Comanda) {
  if (comanda.payments?.length) {
    return comanda.payments.reduce(
      (sum, payment) =>
        sum +
        (payment.status === PAYMENT_STATUS.CANCELLED ||
        payment.status === PAYMENT_STATUS.PENDING
          ? 0
          : payment.amount),
      0
    )
  }

  if (comanda.status === COMMAND_STATUS.PAID) {
    return getComandaTotal(comanda)
  }

  return 0
}

export function getComandaPendingTotal(comanda: import("@/types").Comanda) {
  return Math.max(getComandaTotal(comanda) - getComandaPaidTotal(comanda), 0)
}

function isPaidPayment(payment: import("@/types").Payment) {
  return (
    payment.status !== PAYMENT_STATUS.CANCELLED &&
    payment.status !== PAYMENT_STATUS.PENDING
  )
}

function inferFinancialOrigin(
  paymentMethod: string
): "direct" | "platform" | "subscription" {
  const method = paymentMethod.toLowerCase()

  if (method.includes("assinatura") || method.includes("plano")) {
    return "subscription"
  }

  if (
    method.includes("cartao online") ||
    method.includes("checkout plataforma") ||
    method.includes("gateway")
  ) {
    return "platform"
  }

  return "direct"
}

function isPlatformEligiblePayment(
  payment: import("@/types").Payment
) {
  if (payment.isPlatformBalanceEligible !== undefined) {
    return payment.isPlatformBalanceEligible
  }

  const origin = payment.financialOrigin ?? inferFinancialOrigin(payment.method)
  return origin === "platform" || origin === "subscription"
}

export function getComandaDirectReceivedTotal(comanda: import("@/types").Comanda) {
  if (!comanda.payments?.length) return 0

  return comanda.payments.reduce((sum, payment) => {
    if (!isPaidPayment(payment)) return sum

    const origin = payment.financialOrigin ?? inferFinancialOrigin(payment.method)
    if (origin !== "direct") return sum

    return sum + payment.amount
  }, 0)
}

export function getComandaPlatformProcessedTotal(
  comanda: import("@/types").Comanda
) {
  if (!comanda.payments?.length) return 0

  return comanda.payments.reduce((sum, payment) => {
    if (!isPaidPayment(payment)) return sum
    if (!isPlatformEligiblePayment(payment)) return sum

    return sum + payment.amount
  }, 0)
}

export function getComandaSubscriptionTotal(comanda: import("@/types").Comanda) {
  if (!comanda.payments?.length) return 0

  return comanda.payments.reduce((sum, payment) => {
    if (!isPaidPayment(payment)) return sum

    const origin = payment.financialOrigin ?? inferFinancialOrigin(payment.method)
    if (origin !== "subscription") return sum

    return sum + payment.amount
  }, 0)
}

export function getComandaPlatformPendingReleaseTotal(
  comanda: import("@/types").Comanda
) {
  if (!comanda.payments?.length) return 0

  return comanda.payments.reduce((sum, payment) => {
    if (!isPaidPayment(payment)) return sum
    if (!isPlatformEligiblePayment(payment)) return sum
    if (payment.releaseStatus === "available") return sum
    if (payment.releaseStatus === "transferred") return sum

    return sum + payment.amount
  }, 0)
}

export function getComandaPlatformAvailableTotal(
  comanda: import("@/types").Comanda
) {
  if (!comanda.payments?.length) return 0

  return comanda.payments.reduce((sum, payment) => {
    if (!isPaidPayment(payment)) return sum
    if (!isPlatformEligiblePayment(payment)) return sum
    if (payment.releaseStatus === "transferred") return sum

    if (payment.releaseStatus === "pending") return sum

    return sum + payment.amount
  }, 0)
}

export function getStatusLabel(status: import("@/types").ComandaStatus) {
  const labels: Record<import("@/types").ComandaStatus, string> = {
    [COMMAND_STATUS.OPEN]: COMMAND_STATUS_LABELS.open,
    [COMMAND_STATUS.PENDING]: COMMAND_STATUS_LABELS.pending,
    [COMMAND_STATUS.PAID]: COMMAND_STATUS_LABELS.paid,
  }
  return labels[status]
}

export function getStatusTone(
  status: import("@/types").ComandaStatus
): "amber" | "green" | "blue" {
  const tones = {
    [COMMAND_STATUS.OPEN]: "amber" as const,
    [COMMAND_STATUS.PENDING]: "blue" as const,
    [COMMAND_STATUS.PAID]: "green" as const,
  }
  return tones[status]
}

export function getClientTypeLabel(
  comanda: import("@/types").Comanda
) {
  if (comanda.clientType === "assinante_ativo") return "Assinante ativo"
  if (comanda.clientType === "assinante_inadimplente")
    return "Assinante inadimplente"
  if (comanda.clientType === "sem_plano") return "Cliente sem plano"
  if (comanda.origin === "walk_in") return "Avulso"
  return "Avulso"
}

export function getOriginLabel(comanda: import("@/types").Comanda) {
  const labels: Record<NonNullable<import("@/types").Comanda["origin"]>, string> = {
    agenda: "Agenda",
    walk_in: "Encaixe",
    direct_sale: "Venda direta",
    portal: "Portal",
  }

  return comanda.origin ? labels[comanda.origin] : "Agenda"
}

export function getAttendanceLabel(comanda: import("@/types").Comanda) {
  if (!comanda.attendanceStatus) return "Sem atendimento vinculado"
  return {
    client_arrived: "Cliente chegou",
    in_progress: "Em atendimento",
    completed: "Concluido",
    cancelled: "Cancelado",
  }[comanda.attendanceStatus]
}

export function getSubscriptionLabel(comanda: import("@/types").Comanda) {
  if (!comanda.subscriptionStatus) return "Sem assinatura"
  return {
    active: "Ativa",
    delinquent: "Inadimplente",
    paused: "Pausada",
    cancelled: "Cancelada",
    expired: "Expirada",
  }[comanda.subscriptionStatus]
}

export function getPaymentSummary(comanda: import("@/types").Comanda) {
  if (comanda.payments?.length) {
    return comanda.payments
      .map((payment) => {
        const suffix =
          payment.status === PAYMENT_STATUS.PARTIAL
            ? " (parcial)"
            : payment.status === PAYMENT_STATUS.PENDING
              ? " (pendente)"
              : ""

        return `${payment.method} ${formatCurrency(payment.amount)}${suffix}`
      })
      .join(" + ")
  }

  return comanda.payment
}

export function getCommandBalanceLabel(comanda: import("@/types").Comanda) {
  const pending = getComandaPendingTotal(comanda)

  if (comanda.status === COMMAND_STATUS.PAID) return "Quitada"
  if (pending > 0) return `Pendente: ${formatCurrency(pending)}`

  return "Sem pendencia"
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

