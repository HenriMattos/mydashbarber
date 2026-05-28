import type { AttendanceStatus } from "./status"

export type AttendanceServiceItem = {
  serviceId?: string
  serviceName: string
  quantity: number
  coveredByPlan: boolean
  extraPaid: boolean
}

export type Attendance = {
  id: string
  appointmentId?: string
  commandId?: string
  clientId?: string
  clientName: string
  professionalId?: string
  professionalName: string
  status: AttendanceStatus
  startedAt?: string
  completedAt?: string
  services: AttendanceServiceItem[]
  notes?: string
}
