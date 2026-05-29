import { CalendarPlus, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarbershopHero } from "@/components/client-portal/barbershop-hero"
import { LatestAppointmentCard } from "@/components/client-portal/latest-appointment-card"
import { formatDate } from "@/lib/client-portal/mock-data"
import type { Appointment, Barbershop } from "@/types/client-portal"

interface HomeScreenProps {
  barbershop: Barbershop
  latestAppointment: Appointment | null
  appointmentServiceName?: string
  appointmentProfessionalName?: string
  isLoading: boolean
  onOpenBooking: () => void
  onViewDetails: () => void
  onReschedule: () => void
}

export function HomeScreen({
  barbershop,
  latestAppointment,
  appointmentServiceName,
  appointmentProfessionalName,
  isLoading,
  onOpenBooking,
  onViewDetails,
  onReschedule,
}: HomeScreenProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)]">
      <div className="min-w-0">
        <BarbershopHero barbershop={barbershop} />
      </div>

      <div className="grid min-w-0 content-start gap-4">
        {isLoading ? (
          <Card>
            <CardContent className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Carregando último agendamento...
            </CardContent>
          </Card>
        ) : latestAppointment && appointmentServiceName && appointmentProfessionalName ? (
          <LatestAppointmentCard
            serviceName={appointmentServiceName}
            professionalName={appointmentProfessionalName}
            dateLabel={formatDate(latestAppointment.date)}
            time={latestAppointment.time}
            status={latestAppointment.status}
            value={latestAppointment.valueOriginal}
            usedPlanBenefit={latestAppointment.usedPlanBenefit}
            onViewDetails={onViewDetails}
            onReschedule={onReschedule}
          />
        ) : (
          <Card>
            <CardContent className="space-y-3 py-8 text-center">
              <p className="text-sm text-muted-foreground">
                Você ainda não possui agendamentos por aqui.
              </p>
              <Button type="button" onClick={onOpenBooking}>
                Criar meu primeiro agendamento
              </Button>
            </CardContent>
          </Card>
        )}

        <Button type="button" size="lg" className="w-full" onClick={onOpenBooking}>
          <CalendarPlus className="mr-2 size-4" />
          Novo agendamento
        </Button>
      </div>
    </div>
  )
}
