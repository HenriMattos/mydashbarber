import type {
  AppointmentStatus,
  AttendanceStatus,
  CommandStatus,
  PlanStatus,
  SubscriptionStatus,
} from "./status"
import type { Command, CommandItem } from "./command"
import type {
  FunctionalPlan,
  PlanIncludedService,
} from "./plan"
import type {
  SubscriptionBenefitBalance,
  SubscriptionBenefitUsage,
} from "./subscription"

export type ClientType =
  | "avulso"
  | "recorrente"
  | "assinante_ativo"
  | "assinante_inadimplente"
  | "ex_assinante"
  | "sem_plano"

export type ClientStatus = "ativo" | "em_atencao" | "inativo" | "sem_retorno"
export type ClientOrigin =
  | "indicacao"
  | "instagram"
  | "whatsapp"
  | "campanha"
  | "passou_na_frente"
  | "portal"
  | "outro"

export type ClientTimelineItem = {
  id: string
  date: string
  title: string
  detail?: string
  kind: "atendimento" | "agendamento" | "comanda" | "assinatura" | "nota"
  status?: string
  professional?: string
  amount?: number
  commandId?: string
  appointmentId?: string
}

export type ServiceStatus = "Ativo" | "Inativo"
export type ProfessionalStatus = "Ativo" | "Ferias" | "Inativo"
export type AccountStatus = "Ativa" | "Em uso" | "Inativa"
export type PaymentMethodStatus = "Ativo" | "Inativo"
export type ComandaStatus = CommandStatus
export type CashMovementType = "entrada" | "saida"

export type Client = {
  id: number
  name: string
  phone: string
  email: string
  visits: number
  averageTicket: number
  totalSpent: number
  status: ClientStatus
  clientType: ClientType
  lastVisit: string
  nextAppointmentAt?: string
  favoriteService: string
  preferredProfessional?: string
  frequencyLabel?: string
  origin?: ClientOrigin
  birthday?: string
  active: boolean
  createdAt: string
  planName?: string
  subscriptionStatus?: SubscriptionStatus
  pendingCommandTotal?: number
  hasOpenCommand?: boolean
  internalNotes?: string
  preferences?: string[]
  tags?: string[]
  history?: ClientTimelineItem[]
  returnRecommendation?: string
  whatsappEnabled?: boolean
  noReturnDays?: number
  lastAttendanceSummary?: string
  planStatus?: PlanStatus
}

export type ServiceCatalogItem = {
  id: number
  name: string
  category: string
  description?: string
  internalDescription?: string
  duration: string
  durationMinutes: number
  price: number
  credits: number
  repurchaseDays: number
  professionals: string
  professionalIds?: number[]
  status: ServiceStatus
  createdAt: string
  updatedAt: string
  hidden: boolean
  fitIn: boolean
  startingFrom: boolean
  featured: boolean
  order: number
  portalVisible?: boolean
  onlineBookable?: boolean
  canBeInPlan?: boolean
  requiresProfessionalSelection?: boolean
  internalNotes?: string
  popularityCount?: number
  revenueGenerated?: number
}

export type Plan = Omit<FunctionalPlan, "id"> & {
  id: number
  benefit: string
  recurrence: string
  servicesLimit: number
  includedServices: PlanIncludedService[]
  extraDiscountPercent?: number
  productDiscountPercent?: number
  commercialText?: string
  subscriberCount: number
  estimatedRecurringRevenue: number
  schedulingRulesText?: string
  usageRulesText?: string
  internalNotes?: string
  churnRisk: "Baixo" | "Medio" | "Alto"
}

export type Subscription = {
  id: number
  clientId: number
  client: string
  phone: string
  plan: string
  value: number
  nextCharge: string
  startedAt: string
  status: SubscriptionStatus
  benefitBalances: SubscriptionBenefitBalance[]
  usageHistory: SubscriptionBenefitUsage[]
  lastUsageAt?: string
  nextAppointmentAt?: string
  alert?: string
  notes?: string
}

export type OverdueSubscription = {
  id: number
  client: string
  plan: string
  value: number
  delay: string
  status: "Em atraso" | "Critico" | "Cobranca enviada"
  phone: string
}

export type Professional = {
  id: number
  name: string
  avatarUrl?: string
  phone?: string
  email?: string
  role: string
  commission: string
  scheduleStart: string
  scheduleEnd: string
  workingDays?: string[]
  breakStart?: string
  breakEnd?: string
  unit?: string
  services?: string[]
  specialties?: string[]
  status: ProfessionalStatus
  todayAppointments?: number
  nextAppointmentAt?: string
  estimatedRevenue?: number
  notes?: string
  portalVisible?: boolean
}

export type Product = {
  id: number
  name: string
  category: string
  price: number
}

export type AgendaEvent = {
  id: number
  barber: string
  date: string
  start: string
  end: string
  title: string
  detail: string
  status?: AppointmentStatus
  attendanceStatus?: AttendanceStatus
  commandId?: string
  origin?: "portal" | "manual" | "walk_in" | "recurring"
  notes?: string
  reservedBenefitServiceId?: string
  rescheduledFromId?: number
  cancelReason?: "client_cancelled" | "barbershop_cancelled" | "rescheduled"
  type: "appointment" | "blocked" | "break" | "unavailable"
}

export type ComandaItem = CommandItem

export type Comanda = Command & {
  time: string
  chair: string
  sourceLabel?: string
  clientTypeLabel?: string
  paymentMethodLabel?: string
  coveredByPlanTotal?: number
  paidTotal?: number
  pendingTotal?: number
  subtotal?: number
  attendanceLabel?: string
}

export type CashMovement = {
  id: string
  type: CashMovementType
  label: string
  description?: string
  category: string
  value: number
  payment: string
  time: string
}

export type PaymentMethod = {
  id: number
  name: string
  description: string
  status: PaymentMethodStatus
  fee: number
  settlement: string
  amount: number
  transactions: number
}
