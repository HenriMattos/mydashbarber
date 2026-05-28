export type {
  Client,
  ClientStatus,
  ClientType,
  ClientTimelineItem,
  ClientOrigin,
} from "@/types"

import { adminService } from "@/services/admin"
import type { Client, ClientStatus, ClientType, Subscription } from "@/types"
import { SUBSCRIPTION_STATUS } from "@/types"

export const clients: Client[] = adminService.clients

export const loyalClients = clients
  .filter(
    (client) =>
      client.active &&
      (client.clientType === "recorrente" ||
        client.clientType === "assinante_ativo" ||
        client.clientType === "assinante_inadimplente") &&
      client.visits >= 8
  )
  .sort((a, b) => {
    if (b.visits !== a.visits) return b.visits - a.visits
    return b.totalSpent - a.totalSpent
  })
  .slice(0, 6)

export const repurchaseClients = clients
  .filter((client) => (client.noReturnDays ?? 0) >= 30 || client.returnRecommendation)
  .sort((a, b) => (b.noReturnDays ?? 0) - (a.noReturnDays ?? 0))
  .slice(0, 12)
  .map((client) => {
    const service = adminService.services.find(
      (item) => item.name === client.favoriteService
    )
    const interval = service?.repurchaseDays ?? 30

    return {
      id: client.id,
      client: client.name,
      phone: client.phone,
      clientType: client.clientType,
      status: client.status,
      lastPurchase: client.favoriteService,
      lastDate: client.lastVisit,
      recommended: client.returnRecommendation || client.favoriteService,
      dueDate: getDueDate(client.lastVisit, interval),
      reason:
        client.returnRecommendation ||
        `${interval} dias desde o ultimo atendimento ou ciclo de recompra do servico.`,
    }
  })

export function getClientById(id: number) {
  return clients.find((client) => client.id === id)
}

export function getClientSubscription(client: Client): Subscription | undefined {
  return adminService.subscriptions.find(
    (subscription) => subscription.clientId === client.id
  )
}

export function getClientTypeLabel(status: ClientType) {
  const labels: Record<ClientType, string> = {
    avulso: "Avulso",
    recorrente: "Recorrente",
    assinante_ativo: "Assinante ativo",
    assinante_inadimplente: "Assinante inadimplente",
    ex_assinante: "Ex-assinante",
    sem_plano: "Sem plano",
  }
  return labels[status]
}

export function getClientTypeTone(
  status: ClientType
): "amber" | "green" | "blue" | "red" | "neutral" {
  const tones: Record<ClientType, "amber" | "green" | "blue" | "red" | "neutral"> =
    {
      avulso: "neutral",
      recorrente: "blue",
      assinante_ativo: "green",
      assinante_inadimplente: "red",
      ex_assinante: "amber",
      sem_plano: "neutral",
    }
  return tones[status]
}

export function getClientStatusLabel(status: ClientStatus) {
  const labels: Record<ClientStatus, string> = {
    ativo: "Ativo",
    em_atencao: "Em atencao",
    inativo: "Inativo",
    sem_retorno: "Sem retorno",
  }
  return labels[status]
}

export function getClientStatusTone(
  status: ClientStatus
): "amber" | "green" | "blue" | "red" | "neutral" {
  const tones: Record<
    ClientStatus,
    "amber" | "green" | "blue" | "red" | "neutral"
  > = {
    ativo: "green",
    em_atencao: "amber",
    inativo: "neutral",
    sem_retorno: "red",
  }
  return tones[status]
}

export function getClientSubscriptionLabel(
  subscription: Subscription | undefined
) {
  if (!subscription) return "Sem plano"

  const labels = {
    [SUBSCRIPTION_STATUS.ACTIVE]: "Plano ativo",
    [SUBSCRIPTION_STATUS.DELINQUENT]: "Inadimplente",
    [SUBSCRIPTION_STATUS.PAUSED]: "Plano pausado",
    [SUBSCRIPTION_STATUS.CANCELLED]: "Plano cancelado",
    [SUBSCRIPTION_STATUS.EXPIRED]: "Plano expirado",
  }

  return labels[subscription.status]
}

export function getClientSubscriptionTone(
  subscription: Subscription | undefined
): "amber" | "green" | "blue" | "red" | "neutral" {
  if (!subscription) return "neutral"

  const tones = {
    [SUBSCRIPTION_STATUS.ACTIVE]: "green" as const,
    [SUBSCRIPTION_STATUS.DELINQUENT]: "red" as const,
    [SUBSCRIPTION_STATUS.PAUSED]: "amber" as const,
    [SUBSCRIPTION_STATUS.CANCELLED]: "neutral" as const,
    [SUBSCRIPTION_STATUS.EXPIRED]: "neutral" as const,
  }

  return tones[subscription.status]
}

export function getClientCardSummary(client: Client) {
  const planLabel = client.planName
    ? `${client.planName} - ${getClientSubscriptionLabel(
        getClientSubscription(client)
      )}`
    : getClientTypeLabel(client.clientType)

  const returnLabel =
    client.status === "sem_retorno"
      ? `${client.noReturnDays ?? 0} dias sem retorno`
      : client.returnRecommendation || "Cliente ativo na base"

  return {
    planLabel,
    returnLabel,
  }
}

export function getClientContactLink(client: Client) {
  const phoneDigits = client.phone.replace(/\D/g, "")
  return phoneDigits ? `https://wa.me/55${phoneDigits}` : "https://wa.me/"
}

export function getClientTags(client: Client) {
  const tags = [...(client.tags ?? [])]

  if (client.pendingCommandTotal && client.pendingCommandTotal > 0) {
    tags.unshift("Comanda pendente")
  }

  if (client.nextAppointmentAt) {
    tags.unshift("Proximo agendamento")
  }

  if (client.returnRecommendation) {
    tags.unshift("Retorno recomendado")
  }

  return Array.from(new Set(tags))
}

function getDueDate(dateStr: string, days: number) {
  let date: Date
  if (dateStr.includes("-")) {
    const [year, month, day] = dateStr.split("-").map(Number)
    date = new Date(year, month - 1, day)
  } else {
    const [day, month, year] = dateStr.split("/").map(Number)
    date = new Date(year, month - 1, day)
  }
  if (isNaN(date.getTime())) return "Data invalida"
  date.setDate(date.getDate() + days)
  return new Intl.DateTimeFormat("pt-BR").format(date)
}
