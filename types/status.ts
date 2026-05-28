export const APPOINTMENT_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  CANCELLED: "cancelled",
  NO_SHOW: "no_show",
} as const

export type AppointmentStatus =
  (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS]

export const ATTENDANCE_STATUS = {
  CLIENT_ARRIVED: "client_arrived",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const

export type AttendanceStatus =
  (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS]

export const SUBSCRIPTION_STATUS = {
  ACTIVE: "active",
  DELINQUENT: "delinquent",
  PAUSED: "paused",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
} as const

export type SubscriptionStatus =
  (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS]

export const COMMAND_STATUS = {
  OPEN: "open",
  PENDING: "pending",
  PAID: "paid",
} as const

export type CommandStatus =
  (typeof COMMAND_STATUS)[keyof typeof COMMAND_STATUS]

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PARTIAL: "partial",
  PAID: "paid",
  CANCELLED: "cancelled",
} as const

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]

export const BENEFIT_BALANCE_STATUS = {
  AVAILABLE: "available",
  RESERVED: "reserved",
  CONSUMED: "consumed",
} as const

export type BenefitBalanceStatus =
  (typeof BENEFIT_BALANCE_STATUS)[keyof typeof BENEFIT_BALANCE_STATUS]

export const PLAN_STATUS = {
  ACTIVE: "active",
  DRAFT: "draft",
  INACTIVE: "inactive",
} as const

export type PlanStatus = (typeof PLAN_STATUS)[keyof typeof PLAN_STATUS]

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  no_show: "Nao compareceu",
}

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  client_arrived: "Cliente chegou",
  in_progress: "Em atendimento",
  completed: "Concluido",
  cancelled: "Cancelado",
}

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active: "Ativa",
  delinquent: "Inadimplente",
  paused: "Pausada",
  cancelled: "Cancelada",
  expired: "Expirada",
}

export const COMMAND_STATUS_LABELS: Record<CommandStatus, string> = {
  open: "Aberta",
  pending: "Pendente",
  paid: "Paga",
}

export const PLAN_STATUS_LABELS: Record<PlanStatus, string> = {
  active: "Ativo",
  draft: "Rascunho",
  inactive: "Inativo",
}
