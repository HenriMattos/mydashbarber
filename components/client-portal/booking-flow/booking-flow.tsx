"use client"

import * as React from "react"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"

import { ConfirmationStep } from "@/components/client-portal/booking-flow/confirmation-step"
import { DateStep } from "@/components/client-portal/booking-flow/date-step"
import { ProfessionalStep } from "@/components/client-portal/booking-flow/professional-step"
import { ServiceStep } from "@/components/client-portal/booking-flow/service-step"
import { SuccessStep } from "@/components/client-portal/booking-flow/success-step"
import { TimeStep } from "@/components/client-portal/booking-flow/time-step"
import { Button } from "@/components/ui/button"
import { Sheet, SheetBody, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { formatDate } from "@/lib/client-portal/mock-data"
import type { Appointment, BookingDraft, Professional, Service } from "@/types/client-portal"

type BookingStep = 1 | 2 | 3 | 4 | 5 | 6

interface BookingFlowProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  barbershopName: string
  services: Service[]
  professionals: Professional[]
  usesPlanBenefit: boolean
  onConfirm: (draft: Required<BookingDraft>) => Promise<Appointment>
  onFinish: () => void
}

const availableTimes = ["09:00", "09:30", "10:00", "10:30", "14:00", "15:30", "16:00", "17:00"]

export function BookingFlow({
  open,
  onOpenChange,
  barbershopName,
  services,
  professionals,
  usesPlanBenefit,
  onConfirm,
  onFinish,
}: BookingFlowProps) {
  const [step, setStep] = React.useState<BookingStep>(1)
  const [draft, setDraft] = React.useState<BookingDraft>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [createdAppointment, setCreatedAppointment] = React.useState<Appointment | null>(null)

  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep(1)
        setDraft({})
        setError(null)
        setIsSubmitting(false)
        setCreatedAppointment(null)
      }, 200)
    }
  }, [open])

  const selectedService = services.find((service) => service.id === draft.serviceId)
  const selectedProfessional = professionals.find(
    (professional) => professional.id === draft.professionalId
  )

  const availableDates = React.useMemo(() => {
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date()
      date.setDate(date.getDate() + index + 1)
      return date.toISOString().slice(0, 10)
    })
  }, [])

  const isCurrentStepValid = (() => {
    if (step === 1) return Boolean(draft.serviceId)
    if (step === 2) return Boolean(draft.professionalId)
    if (step === 3) return Boolean(draft.date)
    if (step === 4) return Boolean(draft.time)
    if (step === 5) return Boolean(draft.serviceId && draft.professionalId && draft.date && draft.time)
    return true
  })()

  async function handleContinue() {
    setError(null)
    if (!isCurrentStepValid) {
      setError("Selecione uma opcao para continuar.")
      return
    }

    if (step < 5) {
      setStep((current) => (current + 1) as BookingStep)
      return
    }

    if (step === 5 && draft.serviceId && draft.professionalId && draft.date && draft.time) {
      setIsSubmitting(true)
      try {
        const appointment = await onConfirm({
          serviceId: draft.serviceId,
          professionalId: draft.professionalId,
          date: draft.date,
          time: draft.time,
        })
        setCreatedAppointment(appointment)
        setStep(6)
      } catch {
        setError("Nao foi possivel confirmar o agendamento. Tente novamente.")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  function handleBack() {
    if (step > 1 && step < 6) {
      setStep((current) => (current - 1) as BookingStep)
    }
  }

  function renderStepContent() {
    if (step === 1) {
      return (
        <ServiceStep
          services={services}
          selectedServiceId={draft.serviceId}
          onSelect={(serviceId) => setDraft((current) => ({ ...current, serviceId }))}
        />
      )
    }

    if (step === 2) {
      return (
        <ProfessionalStep
          professionals={professionals}
          selectedProfessionalId={draft.professionalId}
          onSelect={(professionalId) => setDraft((current) => ({ ...current, professionalId }))}
        />
      )
    }

    if (step === 3) {
      return (
        <DateStep
          availableDates={availableDates}
          selectedDate={draft.date}
          onSelect={(date) => setDraft((current) => ({ ...current, date }))}
        />
      )
    }

    if (step === 4) {
      return (
        <TimeStep
          times={availableTimes}
          selectedTime={draft.time}
          onSelect={(time) => setDraft((current) => ({ ...current, time }))}
        />
      )
    }

    if (step === 5 && selectedService && selectedProfessional && draft.date && draft.time) {
      return (
        <ConfirmationStep
          barbershopName={barbershopName}
          serviceName={selectedService.name}
          serviceValue={selectedService.price}
          serviceDuration={selectedService.durationMinutes}
          professionalName={selectedProfessional.name}
          dateLabel={formatDate(draft.date)}
          time={draft.time}
          usesPlanBenefit={usesPlanBenefit}
        />
      )
    }

    if (step === 6 && createdAppointment && selectedService && selectedProfessional) {
      return (
        <SuccessStep
          serviceName={selectedService.name}
          dateLabel={formatDate(createdAppointment.date)}
          time={createdAppointment.time}
          professionalName={selectedProfessional.name}
          onGoHome={() => {
            onOpenChange(false)
            onFinish()
          }}
        />
      )
    }

    return null
  }

  const stepTitle: Record<BookingStep, string> = {
    1: "Escolher servico",
    2: "Escolher profissional",
    3: "Escolher data",
    4: "Escolher horario",
    5: "Confirmacao",
    6: "Sucesso",
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="md:max-w-3xl">
        <SheetHeader>
          <SheetTitle>{stepTitle[step]}</SheetTitle>
          {step < 6 ? (
            <p className="text-xs text-muted-foreground">Etapa {step} de 5</p>
          ) : (
            <p className="text-xs text-muted-foreground">Agendamento finalizado</p>
          )}
        </SheetHeader>
        <SheetBody>
          {renderStepContent()}
          {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
        </SheetBody>

        {step < 6 ? (
          <SheetFooter className="grid grid-cols-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || isSubmitting}
            >
              <ArrowLeft className="mr-1 size-4" />
              Voltar
            </Button>
            <Button type="button" onClick={() => void handleContinue()} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1 size-4 animate-spin" />
                  Confirmando...
                </>
              ) : step === 5 ? (
                "Confirmar agendamento"
              ) : (
                <>
                  Continuar
                  <ArrowRight className="ml-1 size-4" />
                </>
              )}
            </Button>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
