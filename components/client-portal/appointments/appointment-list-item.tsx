import { CalendarDays, Clock4, Receipt, UserRound } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface AppointmentListItemProps {
  serviceName: string
  professionalName: string
  dateLabel: string
  time: string
  statusLabel: string
  valueLabel: string
  usedPlanBenefit: boolean
  onOpen: () => void
}

export function AppointmentListItem({
  serviceName,
  professionalName,
  dateLabel,
  time,
  statusLabel,
  valueLabel,
  usedPlanBenefit,
  onOpen,
}: AppointmentListItemProps) {
  return (
    <Card>
      <CardContent className="space-y-3 pt-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold">{serviceName}</h3>
          <Badge variant="secondary">{statusLabel}</Badge>
        </div>
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {dateLabel}
          </p>
          <p className="flex items-center gap-1.5">
            <Clock4 className="size-3.5" />
            {time}
          </p>
          <p className="flex items-center gap-1.5">
            <UserRound className="size-3.5" />
            {professionalName}
          </p>
          <p className="flex items-center gap-1.5">
            <Receipt className="size-3.5" />
            {usedPlanBenefit ? "Coberto pelo plano" : valueLabel}
          </p>
        </div>
        <Button type="button" variant="outline" className="w-full" onClick={onOpen}>
          Ver mais
        </Button>
      </CardContent>
    </Card>
  )
}

