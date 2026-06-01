"use client"

import * as React from "react"
import { CalendarClock, Loader2, TriangleAlert } from "lucide-react"

import { AppointmentDetailsDialog } from "@/components/client-portal/appointments/appointment-details-dialog"
import { AppointmentListItem } from "@/components/client-portal/appointments/appointment-list-item"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/client-portal/utils"
import type { Appointment } from "@/types/client-portal"

interface AppointmentResolvedItem {
  appointment: Appointment
  serviceName: string
  professionalName: string
}

interface AppointmentsScreenProps {
  items: AppointmentResolvedItem[]
  isLoading: boolean
  error: string | null
  onRetry: () => void
  onOpenBooking: () => void
}

const statusLabels = {
  confirmed: "Confirmado",
  pending: "Pendente",
  completed: "Concluido",
  cancelled: "Cancelado",
} as const

export function AppointmentsScreen({
  items,
  isLoading,
  error,
  onRetry,
  onOpenBooking,
}: AppointmentsScreenProps) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const selectedItem = items.find((item) => item.appointment.id === selectedId)

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Agendamentos</h1>
          <p className="text-sm text-muted-foreground">
            Histórico dos seus agendamentos na barbearia.
          </p>
        </div>
        <Button type="button" onClick={onOpenBooking}>
          Novo agendamento
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Carregando histórico...
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="space-y-3 py-6 text-sm">
            <p className="flex items-center gap-2 text-destructive">
              <TriangleAlert className="size-4" />
              {error}
            </p>
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="space-y-3 py-10 text-center">
            <CalendarClock className="mx-auto size-7 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Nenhum agendamento registrado até o momento.
            </p>
            <Button type="button" onClick={onOpenBooking}>
              Novo agendamento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {items.map((item) => (
            <AppointmentListItem
              key={item.appointment.id}
              serviceName={item.serviceName}
              professionalName={item.professionalName}
              dateLabel={formatDate(item.appointment.date)}
              time={item.appointment.time}
              statusLabel={statusLabels[item.appointment.status]}
              valueLabel={formatCurrency(item.appointment.valueOriginal)}
              usedPlanBenefit={item.appointment.usedPlanBenefit}
              onOpen={() => setSelectedId(item.appointment.id)}
            />
          ))}
        </div>
      )}

      {selectedItem ? (
        <AppointmentDetailsDialog
          open={Boolean(selectedItem)}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedId(null)
            }
          }}
          appointmentId={selectedItem.appointment.id}
          serviceName={selectedItem.serviceName}
          dateLabel={formatDate(selectedItem.appointment.date)}
          time={selectedItem.appointment.time}
          professionalName={selectedItem.professionalName}
          statusLabel={statusLabels[selectedItem.appointment.status]}
          originalValue={formatCurrency(selectedItem.appointment.valueOriginal)}
          paidValue={formatCurrency(selectedItem.appointment.valuePaid)}
          usedPlanBenefit={selectedItem.appointment.usedPlanBenefit}
          notes={selectedItem.appointment.notes}
        />
      ) : null}
    </div>
  )
}
