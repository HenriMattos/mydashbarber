export const CASH_REGISTER_STATUS = {
  OPEN: "open",
  CLOSED: "closed",
} as const

export type CashRegisterStatus =
  (typeof CASH_REGISTER_STATUS)[keyof typeof CASH_REGISTER_STATUS]

export const CASH_REGISTER_STATUS_LABELS: Record<CashRegisterStatus, string> = {
  open: "Aberto",
  closed: "Fechado",
}

export type CashRegister = {
  id: string
  companyId?: string
  unitId?: string
  openedAt: string
  closedAt?: string
  status: CashRegisterStatus
  openingAmount: number
  closingAmount?: number
  receivedAmount?: number
  pendingAmount?: number
  openCommandsAmount?: number
  pendingCommandsAmount?: number
  paidCommandsAmount?: number
  openCommandsCount?: number
  pendingCommandsCount?: number
  paidCommandsCount?: number
  cashMovementsCount?: number
  notes?: string
}
