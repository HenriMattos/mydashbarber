import type { AppointmentStatus } from "./status"

export type AppointmentKind = "appointment" | "blocked" | "break" | "unavailable"
export type AppointmentCancelReason =
  | "client_cancelled"
  | "barbershop_cancelled"
  | "rescheduled"
  | "no_show_policy"

export type AppointmentBenefitReservation = {
  subscriptionId: string
  serviceId: string
  quantity: number
  status: "reserved" | "released" | "consumed"
}

export type Appointment = {
  id: string
  companyId?: string
  unitId?: string
  clientId?: string
  clientName: string
  professionalId?: string
  professionalName: string
  serviceId?: string
  serviceName: string
  date: string
  start: string
  end: string
  status: AppointmentStatus
  kind: AppointmentKind
  benefitReservation?: AppointmentBenefitReservation
  rescheduledFromAppointmentId?: string
  cancelReason?: AppointmentCancelReason
  notes?: string
}
