"use client"

import Link from "next/link"
import {
  Calendar03Icon,
  CrownIcon,
  Message01Icon,
  UserMultipleIcon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  database,
  toDateInputValue,
} from "@/components/admin/database"
import { EmptyState } from "@/components/admin/empty-state"
import { OnboardingGuide } from "@/components/admin/onboarding-guide"
import { MetricCard } from "@/components/admin/metric-card"
import { SectionCard } from "@/components/admin/section-card"
import { SimpleTable } from "@/components/admin/simple-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { getFinancialInsights } from "@/components/admin/financial-insights"
import { formatCurrency as formatMoney, getComandaTotal } from "@/components/admin/caixa-data"
import { Button } from "@/components/ui/button"
import { COMMAND_STATUS } from "@/types"

const today = new Date()
const todayInput = toDateInputValue(today)
const financialInsights = getFinancialInsights()

const todayAppointments = database.agendaEvents.filter(
  (event) => event.date === todayInput && event.type === "appointment"
)

const appointmentRows = todayAppointments.slice(0, 4).map((event, index) => [
  event.start,
  event.title,
  event.detail,
  event.barber,
  <StatusBadge
    key={event.id}
    tone={index === 0 ? "green" : index === 1 ? "amber" : "blue"}
  >
    {index === 0 ? "Confirmado" : index === 1 ? "Aguardando" : "Agendado"}
  </StatusBadge>,
])

const delinquentClients = database.clients.filter(
  (client) =>
    client.subscriptionStatus === "delinquent" ||
    client.clientType === "assinante_inadimplente"
)

const openComandas = database.comandas
  .filter(
    (command) =>
      command.status === COMMAND_STATUS.OPEN ||
      command.status === COMMAND_STATUS.PENDING
  )
  .sort((first, second) => {
    const firstOpened = new Date(first.openedAt ?? first.createdAt ?? 0).getTime()
    const secondOpened = new Date(second.openedAt ?? second.createdAt ?? 0).getTime()
    return firstOpened - secondOpened
  })

export function DashboardView() {
  return (
    <>
      <OnboardingGuide />
      <SectionCard
        title="Agenda de hoje"
        description="Proximos atendimentos e status de chegada"
        action={
          <Button size="sm" asChild>
            <Link href="/agenda">Ver agenda</Link>
          </Button>
        }
      >
        {appointmentRows.length === 0 ? (
          <EmptyState
            icon={Calendar03Icon}
            title="Agenda vazia para hoje"
            description="Não há atendimentos agendados para este período. Que tal registrar um novo?"
            actionLabel="Novo agendamento"
            href="/agenda"
          />
        ) : (
          <SimpleTable
            columns={["Horario", "Cliente", "Servico", "Barbeiro", "Status"]}
            rows={appointmentRows}
          />
        )}
      </SectionCard>

      <SectionCard
        title="Saldo para saque"
        description="Apenas valores processados pela plataforma"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <strong className="text-3xl font-semibold tracking-normal sm:text-4xl">
              {formatMoney(financialInsights.platformAvailableToWithdraw)}
            </strong>
            <p className="mt-1 text-sm text-muted-foreground">
              Pendente de liberacao: {formatMoney(financialInsights.platformPendingRelease)}
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">
              Processado na plataforma: {formatMoney(financialInsights.platformProcessedTotal)}
            </span>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Comandas abertas"
        description="Pendencias de fechamento do barbeiro"
        action={
          <Button size="sm" asChild>
            <Link href="/caixa/comandas">Abrir comandas</Link>
          </Button>
        }
      >
        {openComandas.length === 0 ? (
          <EmptyState
            icon={Wallet02Icon}
            title="Nenhuma comanda aberta"
            description="Todas as comandas foram fechadas."
            actionLabel="Ir para caixa"
            href="/caixa"
          />
        ) : (
          <div className="grid gap-2">
            {openComandas.map((command) => (
              <div
                key={command.id}
                className="grid gap-2 rounded-md border bg-background p-3 sm:grid-cols-[minmax(0,1fr)_12rem]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-semibold">{command.client}</p>
                    <StatusBadge tone={command.status === COMMAND_STATUS.OPEN ? "blue" : "amber"}>
                      {command.status === COMMAND_STATUS.OPEN ? "Aberta" : "Pendente"}
                    </StatusBadge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Agendamento: {command.appointmentStart ?? command.time} | Servico: {command.mainService ?? command.items[0]?.name ?? "Servico"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Profissional: {command.barber} | Aberta ha {getElapsedLabel(command.openedAt ?? command.createdAt)}
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2 sm:items-end">
                  <p className="text-sm text-muted-foreground">Valor da comanda</p>
                  <p className="text-lg font-semibold">{formatMoney(getComandaTotal(command))}</p>
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/caixa/comandas">Abrir / editar / fechar</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="admin-metric-grid" data-columns="3">
        <MetricCard
          title="Clientes ativos"
          value={String(financialInsights.activeClients)}
          change={`${financialInsights.recurringClients} recorrentes na base`}
          icon={UserMultipleIcon}
          tone="blue"
        />

        <MetricCard
          title="Assinantes ativos"
          value={String(financialInsights.activeSubscriptions)}
          change={`${financialInsights.delinquentSubscriptions} inadimplentes`}
          icon={CrownIcon}
          tone="green"
        />

        <div className="admin-metric-card premium-card motion-rise min-w-0 rounded-lg border bg-card p-3 text-card-foreground shadow-sm sm:p-4">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground sm:text-sm">
                Inadimplentes
              </p>
              <strong className="mt-1.5 block text-xl font-semibold tracking-normal sm:mt-2 sm:text-2xl">
                {financialInsights.delinquentSubscriptions}
              </strong>
            </div>
            <span className="rounded-md bg-red-500/10 p-2 text-red-600 dark:text-red-400">
              <HugeiconsIcon icon={Wallet02Icon} size={20} />
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between gap-2 sm:mt-4">
            <p className="text-xs font-medium text-muted-foreground">
              {delinquentClients.length > 0
                ? `${formatCurrency(financialInsights.overdueAmount)} em aberto`
                : "Nenhum inadimplente"}
            </p>
            <Button size="sm" variant="outline" className="gap-2" asChild>
              <Link href="/assinaturas/inadimplentes">
                <HugeiconsIcon icon={Message01Icon} size={16} />
                Mandar msg
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value)
}

function getElapsedLabel(openedAt?: string) {
  if (!openedAt) return "agora"

  const opened = new Date(openedAt)
  if (Number.isNaN(opened.getTime())) return "agora"

  const diffMinutes = Math.max(
    0,
    Math.floor((Date.now() - opened.getTime()) / (1000 * 60))
  )

  if (diffMinutes < 60) return `${diffMinutes} min`
  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60
  if (minutes === 0) return `${hours} h`
  return `${hours} h ${minutes} min`
}

