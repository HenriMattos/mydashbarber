import type {
  AttendanceStatus,
  CommandStatus,
  SubscriptionStatus,
} from "./status"
import type { Payment } from "./payment"

export type CommandItemCategory = "servico" | "produto"
export type CommandItemCoverage = "included_in_plan" | "extra_paid" | "regular"
export type CommandOrigin = "agenda" | "walk_in" | "direct_sale" | "portal"
export type CommandClientType =
  | "avulso"
  | "assinante_ativo"
  | "assinante_inadimplente"
  | "sem_plano"

export type CommandItem = {
  name: string
  quantity: number
  unitPrice: number
  category: CommandItemCategory
  coverage?: CommandItemCoverage
  serviceId?: string
}

export type Command = {
  id: string
  type?: "attendance"
  attendanceId?: string
  appointmentId?: string
  origin?: CommandOrigin
  clientType?: CommandClientType
  client: string
  barber: string
  status: CommandStatus
  attendanceStatus?: AttendanceStatus
  subscriptionStatus?: SubscriptionStatus
  mainService?: string
  appointmentDate?: string
  appointmentStart?: string
  createdAt?: string
  updatedAt?: string
  openedAt?: string
  closedAt?: string
  payment: string
  payments?: Payment[]
  items: CommandItem[]
  discount?: number
  notes?: string
}
