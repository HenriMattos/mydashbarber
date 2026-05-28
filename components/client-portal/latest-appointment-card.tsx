import { CalendarDays, Clock4, Scissors, UserRound } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/client-portal/mock-data"
import type { AppointmentStatus } from "@/types/client-portal"

interface LatestAppointmentCardProps {
  serviceName: string
  professionalName: string
  dateLabel: string
  time: string
  status: AppointmentStatus
  value: number
  usedPlanBenefit: boolean
  onViewDetails: () => void
  onReschedule: () => void
}

const statusLabel: Record<AppointmentStatus, string> = {
  confirmed: "Confirmado",
  pending: "Pendente",
  completed: "Concluido",
  cancelled: "Cancelado",
}

export function LatestAppointmentCard({
  serviceName,
  professionalName,
  dateLabel,
  time,
  status,
  value,
  usedPlanBenefit,
  onViewDetails,
  onReschedule,
}: LatestAppointmentCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-base">{serviceName}</CardTitle>
          <Badge variant="outline">{statusLabel[status]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="size-4" />
          {dateLabel}
        </p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <Clock4 className="size-4" />
          {time}
        </p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <UserRound className="size-4" />
          {professionalName}
        </p>
        <p className="flex items-center gap-2 text-muted-foreground">
          <Scissors className="size-4" />
          {usedPlanBenefit
            ? "Horario reservado com beneficio do plano"
            : `Valor: ${formatCurrency(value)}`}
        </p>
        <div className="grid gap-2 pt-1 sm:grid-cols-2">
          <Button type="button" variant="outline" onClick={onViewDetails}>
            Ver detalhes
          </Button>
          <Button type="button" onClick={onReschedule}>
            Reagendar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
