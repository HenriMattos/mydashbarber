export interface Service {
  id: number
  name: string
  category: string
  price: number
  durationMinutes: number
  hidden: boolean
  fittingService: boolean
  description?: string
}
