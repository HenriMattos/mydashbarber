import { database } from "@/components/admin/database"
import {
  formatCurrency as formatMoney,
  getComandaDirectReceivedTotal,
  getComandaPlatformAvailableTotal,
  getComandaPaidTotal,
  getComandaPlatformPendingReleaseTotal,
  getComandaPlatformProcessedTotal,
  getComandaPendingTotal,
  getComandaSubscriptionTotal,
  getComandaSubtotal,
} from "@/components/admin/caixa-data"
import {
  ATTENDANCE_STATUS,
  COMMAND_STATUS,
  PAYMENT_STATUS,
  SUBSCRIPTION_STATUS,
} from "@/types"

type Tone = "green" | "amber" | "red" | "blue" | "neutral"

export type FinancialRevenueSource = {
  label: string
  value: number
  tone: Tone
  detail: string
}

export type FinancialRankingItem = {
  label: string
  value: number
  detail: string
}

export type FinancialInsights = {
  totalSold: number
  receivedToday: number
  pendingToday: number
  directReceivedTotal: number
  platformProcessedTotal: number
  subscriptionRevenueTotal: number
  platformAvailableToWithdraw: number
  platformPendingRelease: number
  openCommands: number
  pendingCommands: number
  paidCommands: number
  activeSubscriptions: number
  delinquentSubscriptions: number
  pausedSubscriptions: number
  cancelledSubscriptions: number
  expiredSubscriptions: number
  activeClients: number
  recurringClients: number
  clientsWithoutReturn: number
  clientsWithPendingCommand: number
  clientsWithNextAppointment: number
  clientsPotentialPlan: number
  todayAppointments: number
  completedAppointments: number
  agendaOccupancy: number
  ticketAverage: number
  mrrEstimated: number
  monthlyServiceRevenue: number
  monthlyRecurringRevenue: number
  monthlyProductRevenue: number
  monthlyGrossRevenue: number
  monthlyExpenses: number
  monthlyNetRevenue: number
  overdueAmount: number
  serviceRevenue: number
  extraRevenue: number
  productRevenue: number
  coveredByPlanValue: number
  discountTotal: number
  alerts: FinancialRankingItem[]
  revenueSources: FinancialRevenueSource[]
  paymentMix: FinancialRevenueSource[]
  topServices: FinancialRankingItem[]
  topProfessionals: FinancialRankingItem[]
  topPlans: FinancialRankingItem[]
  topClients: FinancialRankingItem[]
}

const todayInput = toDateInputValue(new Date())

export function getFinancialInsights(): FinancialInsights {
  const commands = database.comandas
  const subscriptions = database.subscriptions
  const clients = database.clients
  const appointmentsToday = database.agendaEvents.filter(
    (event) => event.type === "appointment" && event.date === todayInput
  )

  const summary = commands.reduce(
    (acc, command) => {
      const subtotal = getComandaSubtotal(command)
      const paid = getComandaPaidTotal(command)
      const pending = getComandaPendingTotal(command)
      const directReceived = getComandaDirectReceivedTotal(command)
      const platformProcessed = getComandaPlatformProcessedTotal(command)
      const subscriptionReceived = getComandaSubscriptionTotal(command)
      const platformPendingRelease = getComandaPlatformPendingReleaseTotal(command)
      const platformAvailableToWithdraw = getComandaPlatformAvailableTotal(command)

      acc.subtotal += subtotal
      acc.paid += paid
      acc.pending += pending
      acc.discount += command.discount ?? 0
      acc.directReceived += directReceived
      acc.platformProcessed += platformProcessed
      acc.subscriptionRevenue += subscriptionReceived
      acc.platformPendingRelease += platformPendingRelease
      acc.platformAvailableToWithdraw += platformAvailableToWithdraw

      if (command.status === COMMAND_STATUS.OPEN) acc.open += 1
      if (command.status === COMMAND_STATUS.PENDING) acc.pendingStatusCount += 1
      if (command.status === COMMAND_STATUS.PAID) acc.paidCount += 1

      command.items.forEach((item) => {
        const itemTotal = item.quantity * item.unitPrice

        if (item.category === "produto") {
          acc.productRevenue += itemTotal
        } else if (item.coverage === "included_in_plan") {
          acc.coveredByPlanValue += itemTotal
        } else if (item.coverage === "extra_paid") {
          acc.extraRevenue += itemTotal
          acc.serviceRevenue += itemTotal
        } else {
          acc.serviceRevenue += itemTotal
        }

        if (item.category === "servico") {
          const current = acc.serviceMap.get(item.name) ?? {
            label: item.name,
            value: 0,
            covered: 0,
          }

          current.value += itemTotal
          if (item.coverage === "included_in_plan") {
            current.covered += item.quantity
          }
          acc.serviceMap.set(item.name, current)
        }
      })

      command.payments?.forEach((payment) => {
        if (
          payment.status === PAYMENT_STATUS.PENDING ||
          payment.status === PAYMENT_STATUS.CANCELLED
        ) {
          return
        }

        const current = acc.paymentMap.get(payment.method) ?? 0
        acc.paymentMap.set(payment.method, current + payment.amount)
      })

      const barber = acc.barberMap.get(command.barber) ?? {
        label: command.barber,
        value: 0,
        commands: 0,
      }
      barber.value += paid
      barber.commands += 1
      acc.barberMap.set(command.barber, barber)

      return acc
    },
    {
      subtotal: 0,
      paid: 0,
      pending: 0,
      discount: 0,
      directReceived: 0,
      platformProcessed: 0,
      subscriptionRevenue: 0,
      platformPendingRelease: 0,
      platformAvailableToWithdraw: 0,
      open: 0,
      pendingStatusCount: 0,
      paidCount: 0,
      serviceRevenue: 0,
      extraRevenue: 0,
      productRevenue: 0,
      coveredByPlanValue: 0,
      serviceMap: new Map<string, { label: string; value: number; covered: number }>(),
      paymentMap: new Map<string, number>(),
      barberMap: new Map<string, { label: string; value: number; commands: number }>(),
    }
  )

  const activeSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === SUBSCRIPTION_STATUS.ACTIVE
  )
  const delinquentSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === SUBSCRIPTION_STATUS.DELINQUENT
  )
  const pausedSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === SUBSCRIPTION_STATUS.PAUSED
  )
  const cancelledSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === SUBSCRIPTION_STATUS.CANCELLED
  )
  const expiredSubscriptions = subscriptions.filter(
    (subscription) => subscription.status === SUBSCRIPTION_STATUS.EXPIRED
  )

  const activeClients = clients.filter((client) => client.active).length
  const recurringClients = clients.filter(
    (client) =>
      client.clientType !== "avulso" && client.clientType !== "sem_plano"
  ).length
  const clientsWithoutReturn = clients.filter(
    (client) => (client.noReturnDays ?? 0) >= 60 || client.status === "sem_retorno"
  ).length
  const clientsWithPendingCommand = clients.filter(
    (client) => (client.pendingCommandTotal ?? 0) > 0
  ).length
  const clientsWithNextAppointment = clients.filter(
    (client) => Boolean(client.nextAppointmentAt)
  ).length
  const clientsPotentialPlan = clients.filter(
    (client) => client.clientType === "avulso" || client.clientType === "sem_plano"
  ).length

  const mrrEstimated = activeSubscriptions.reduce(
    (sum, subscription) => sum + subscription.value,
    0
  )
  const ticketAverage =
    summary.paidCount > 0 ? Math.round(summary.paid / summary.paidCount) : 0
  const agendaOccupancy =
    database.analytics.peakHours.length > 0
      ? Math.round(
          database.analytics.peakHours.reduce(
            (sum, item) => sum + item.occupancy,
            0
          ) / database.analytics.peakHours.length
        )
      : 0

  const topServices = Array.from(summary.serviceMap.values())
    .sort((a, b) => b.value - a.value)
    .slice(0, 4)
    .map((item) => ({
      label: item.label,
      value: item.value,
      detail: `${item.covered} cobertos pelo plano`,
    }))

  const topProfessionals = Array.from(summary.barberMap.values())
    .sort((a, b) => b.value - a.value)
    .slice(0, 4)
    .map((item) => ({
      label: item.label,
      value: item.value,
      detail: `${item.commands} comandas no periodo`,
    }))

  const planTotals = subscriptions.reduce(
    (map, subscription) => {
      const current = map.get(subscription.plan) ?? {
        label: subscription.plan,
        subscribers: 0,
        revenue: 0,
        delinquent: 0,
        reservedBenefits: 0,
      }

      if (subscription.status === SUBSCRIPTION_STATUS.ACTIVE) {
        current.subscribers += 1
        current.revenue += subscription.value
      }
      if (subscription.status === SUBSCRIPTION_STATUS.DELINQUENT) {
        current.delinquent += 1
      }
      current.reservedBenefits += subscription.benefitBalances.reduce(
        (sum, balance) => sum + balance.reserved,
        0
      )

      map.set(subscription.plan, current)
      return map
    },
    new Map<
      string,
      {
        label: string
        subscribers: number
        revenue: number
        delinquent: number
        reservedBenefits: number
      }
    >()
  )

  const topPlans = Array.from(planTotals.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 4)
    .map((item) => ({
      label: item.label,
      value: item.revenue,
      detail: `${item.subscribers} ativos, ${item.delinquent} inadimplentes, ${item.reservedBenefits} reservados`,
    }))

  const topClients = clients
    .filter((client) => client.active)
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 4)
    .map((client) => ({
      label: client.name,
      value: client.totalSpent,
      detail: client.planName || client.returnRecommendation || "Cliente ativo",
    }))

  const paymentMix = Array.from(summary.paymentMap.entries())
    .map(([label, value], index) => ({
      label,
      value,
      tone: (["green", "blue", "amber", "red", "neutral"] as Tone[])[
        index % 5
      ],
      detail: "Pagamentos recebidos no periodo",
    }))
    .sort((a, b) => b.value - a.value)

  const alerts: FinancialRankingItem[] = []
  if (summary.pending > 0) {
    alerts.push({
      label: "Comandas pendentes",
      value: summary.pending,
      detail: "Valor pendente em aberto no caixa",
    })
  }
  if (delinquentSubscriptions.length > 0) {
    alerts.push({
      label: "Assinantes inadimplentes",
      value: delinquentSubscriptions.length,
      detail: "Beneficios precisam de conferencia",
    })
  }
  if (clientsWithoutReturn > 0) {
    alerts.push({
      label: "Clientes sem retorno",
      value: clientsWithoutReturn,
      detail: "Base fria para contato e reativacao",
    })
  }
  if (summary.coveredByPlanValue > 0) {
    alerts.push({
      label: "Beneficios de plano consumidos",
      value: summary.coveredByPlanValue,
      detail: "Itens cobertos pelo plano no periodo",
    })
  }

  const manualIncome = database.cashMovements
    .filter((movement) => movement.type === "entrada")
    .reduce((sum, movement) => sum + movement.value, 0)

  return {
    totalSold: summary.subtotal - summary.discount,
    receivedToday: summary.paid + manualIncome,
    pendingToday: summary.pending,
    directReceivedTotal: summary.directReceived,
    platformProcessedTotal: summary.platformProcessed,
    subscriptionRevenueTotal: summary.subscriptionRevenue,
    platformAvailableToWithdraw: summary.platformAvailableToWithdraw,
    platformPendingRelease: summary.platformPendingRelease,
    openCommands: summary.open,
    pendingCommands: summary.open + summary.pendingStatusCount,
    paidCommands: summary.paidCount,
    activeSubscriptions: activeSubscriptions.length,
    delinquentSubscriptions: delinquentSubscriptions.length,
    pausedSubscriptions: pausedSubscriptions.length,
    cancelledSubscriptions: cancelledSubscriptions.length,
    expiredSubscriptions: expiredSubscriptions.length,
    activeClients,
    recurringClients,
    clientsWithoutReturn,
    clientsWithPendingCommand,
    clientsWithNextAppointment,
    clientsPotentialPlan,
    todayAppointments: appointmentsToday.length,
    completedAppointments: appointmentsToday.filter(
      (event) => event.attendanceStatus === ATTENDANCE_STATUS.COMPLETED
    ).length,
    agendaOccupancy,
    ticketAverage,
    mrrEstimated,
    monthlyServiceRevenue: database.analytics.monthlyServiceRevenue,
    monthlyRecurringRevenue: database.analytics.monthlyRecurringRevenue,
    monthlyProductRevenue: database.analytics.monthlyProductRevenue,
    monthlyGrossRevenue: database.analytics.monthlyGrossRevenue,
    monthlyExpenses: database.analytics.monthlyExpenses,
    monthlyNetRevenue: database.analytics.monthlyNetRevenue,
    overdueAmount: database.analytics.overdueAmount,
    serviceRevenue: summary.serviceRevenue,
    extraRevenue: summary.extraRevenue,
    productRevenue: summary.productRevenue,
    coveredByPlanValue: summary.coveredByPlanValue,
    discountTotal: summary.discount,
    alerts,
    revenueSources: [
      {
        label: "Avulso",
        value: summary.serviceRevenue - summary.extraRevenue,
        tone: "green",
        detail: "Servicos cobrados normalmente",
      },
      {
        label: "Planos",
        value: mrrEstimated,
        tone: "blue",
        detail: "Receita recorrente estimada",
      },
      {
        label: "Produtos",
        value: summary.productRevenue,
        tone: "amber",
        detail: "Vendas de produtos pagos",
      },
      {
        label: "Extras",
        value: summary.extraRevenue,
        tone: "red",
        detail: "Servicos cobrados a parte",
      },
      {
        label: "Descontos",
        value: summary.discount,
        tone: "neutral",
        detail: "Descontos aplicados nas comandas",
      },
    ],
    paymentMix,
    topServices,
    topProfessionals,
    topPlans,
    topClients,
  }
}

function toDateInputValue(date: Date) {
  return [
    String(date.getFullYear()),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

export { formatMoney as formatCurrency }

