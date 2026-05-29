"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { Calendar03Icon, Wallet02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { database } from "@/components/admin/database"
import { EmptyState } from "@/components/admin/empty-state"
import { SectionCard } from "@/components/admin/section-card"
import { StatusBadge } from "@/components/admin/status-badge"
import {
  formatCurrency as formatMoney,
  getComandaTotal,
} from "@/components/admin/caixa-data"
import { Button } from "@/components/ui/button"
import { COMMAND_STATUS } from "@/types"

const todayStart = new Date()
todayStart.setHours(0, 0, 0, 0)

const upcomingAppointments = database.agendaEvents
  .filter((event) => event.type === "appointment")
  .map((event) => ({ ...event, startsAt: getEventDateTime(event.date, event.start) }))
  .filter((event) => event.startsAt.getTime() >= todayStart.getTime())
  .sort((first, second) => first.startsAt.getTime() - second.startsAt.getTime())
  .slice(0, 3)

const latestOpenComandas = database.comandas
  .filter((command) => command.status === COMMAND_STATUS.OPEN)
  .sort((first, second) => {
    const firstOpened = new Date(first.openedAt ?? first.createdAt ?? 0).getTime()
    const secondOpened = new Date(second.openedAt ?? second.createdAt ?? 0).getTime()
    return secondOpened - firstOpened
  })
  .slice(0, 3)

export function DashboardView() {
  return (
    <>
      <SectionCard
        title="Agendamentos"
        description="Os 3 próximos atendimentos da agenda."
        action={
          <Button size="sm" asChild>
            <Link href="/agenda">Ver agenda</Link>
          </Button>
        }
      >
        {upcomingAppointments.length === 0 ? (
          <EmptyState
            icon={Calendar03Icon}
            title="Nenhum agendamento próximo"
            description="A agenda não possui atendimentos futuros para exibir."
            actionLabel="Novo agendamento"
            href="/agenda"
          />
        ) : (
          <div className="grid gap-2">
            {upcomingAppointments.map((appointment, index) => (
              <DashboardListItem
                key={appointment.id}
                icon={Calendar03Icon}
                title={appointment.title}
                badge={
                  <StatusBadge tone={index === 0 ? "green" : "blue"}>
                    {index === 0 ? "Próximo" : "Agendado"}
                  </StatusBadge>
                }
                meta={`${formatAppointmentDate(appointment.startsAt)} as ${appointment.start}`}
                detail={`${appointment.detail} | ${appointment.barber}`}
                action={
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/agenda">Abrir agenda</Link>
                  </Button>
                }
              />
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Comandas abertas"
        description="As 3 últimas comandas ainda abertas."
        action={
          <Button size="sm" asChild>
            <Link href="/caixa/comandas">Abrir comandas</Link>
          </Button>
        }
      >
        {latestOpenComandas.length === 0 ? (
          <EmptyState
            icon={Wallet02Icon}
            title="Nenhuma comanda aberta"
            description="Todas as comandas foram fechadas."
            actionLabel="Ir para caixa"
            href="/caixa"
          />
        ) : (
          <div className="grid gap-2">
            {latestOpenComandas.map((command) => (
              <DashboardListItem
                key={command.id}
                icon={Wallet02Icon}
                title={command.client}
                badge={<StatusBadge tone="blue">Aberta</StatusBadge>}
                meta={`${command.appointmentStart ?? command.time} | ${command.barber}`}
                detail={`${command.mainService ?? command.items[0]?.name ?? "Serviço"} | ${formatMoney(getComandaTotal(command))}`}
                action={
                  <Button size="sm" variant="outline" asChild>
                    <Link href="/caixa/comandas">Abrir comanda</Link>
                  </Button>
                }
              />
            ))}
          </div>
        )}
      </SectionCard>
    </>
  )
}

function DashboardListItem({
  icon,
  title,
  badge,
  meta,
  detail,
  action,
}: {
  icon: typeof Calendar03Icon
  title: string
  badge: ReactNode
  meta: string
  detail: string
  action: ReactNode
}) {
  return (
    <div className="grid gap-3 rounded-md border bg-background p-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
      <span className="grid size-10 place-items-center rounded-md bg-muted text-muted-foreground">
        <HugeiconsIcon icon={icon} size={19} />
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate font-semibold">{title}</p>
          {badge}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{meta}</p>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </div>
      <div className="sm:justify-self-end">{action}</div>
    </div>
  )
}

function getEventDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`)
}

function formatAppointmentDate(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}
