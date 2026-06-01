export type AppointmentStatus =
  | "confirmed"
  | "pending"
  | "completed"
  | "cancelled"

export type PlanPeriodicity = "mensal" | "anual"

export interface Client {
  id: string
  fullName: string
  email: string
  phone: string
  birthDate: string
  cpf: string
  cep: string
  street: string
  number: string
  complement: string
  city: string
  district: string
  state: string
  avatarUrl: string
}

export interface Barbershop {
  id: string
  slug: string
  name: string
  slogan: string
  description: string
  bannerUrl: string
  bannerPlacement: PortalImagePlacement
  logoUrl: string
  logoPlacement: PortalImagePlacement
  address: string
  phone: string
  primaryColor: string
  social?: {
    instagram?: string
    whatsapp?: string
    facebook?: string
  }
  onboardingSlides?: OnboardingSlide[]
}

export interface OnboardingSlide {
  title: string
  description: string
  imageUrl: string
}

export interface PortalImagePlacement {
  x: number
  y: number
  zoom: number
}

export interface Service {
  id: string
  name: string
  durationMinutes: number
  price: number
  description?: string
}

export interface Professional {
  id: string
  name: string
  role?: string
  avatarUrl?: string
}

export interface Appointment {
  id: string
  serviceId: string
  professionalId: string
  date: string
  time: string
  status: AppointmentStatus
  valueOriginal: number
  valuePaid: number
  usedPlanBenefit: boolean
  notes?: string
  createdAt: string
}

export interface PlanBenefit {
  id: string
  serviceName: string
  originalValue: number
  discountPercent: number
  cyclesIncluded: number
  isExtra?: boolean
}

export interface Plan {
  id: string
  name: string
  value: number
  periodicity: PlanPeriodicity
  slotsAvailable: number
  description: string
  benefits: PlanBenefit[]
}

export interface ActivePlan {
  planId: string
  status: "ativo"
  nextChargeDate: string
  remainingBenefits: Array<{
    serviceName: string
    available: number
    reserved: number
    consumed: number
  }>
}

export interface BookingDraft {
  serviceIds: string[]
  professionalId?: string
  date?: string
  time?: string
}

export interface PortalNotificationSettings {
  appointmentConfirmation: boolean
  appointmentReminder: boolean
  offersAndNews: boolean
  planUpdates: boolean
}
