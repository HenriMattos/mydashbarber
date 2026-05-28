export type CompanyOperationalSettings = {
  unitName: string
  openingDays: string
  openingStart: string
  openingEnd: string
  breakText: string
  minimumAdvanceHours: number
  minimumCancellationHours: number
  minimumRescheduleHours: number
  allowPortalBooking: boolean
  allowWalkIn: boolean
  allowChooseProfessional: boolean
  allowAnyProfessional: boolean
  portalShowPrices: boolean
  portalShowDuration: boolean
  portalShowProfessionals: boolean
  portalShowPlans: boolean
  portalShowBalance: boolean
  whatsappLabel: string
  welcomeMessage: string
  cancellationPolicy: string
  noShowPolicy: string
  paymentMethods: string[]
  blockedDaysNote: string
}

export type Company = {
  corporateName: string
  tradeName: string
  cnpj: string
  email: string
  timezone: string
  phone: string
  slug: string
  primaryColor: { r: number; g: number; b: number }
  logoUrl: string
  logoAlt: string
  iconUrl: string
  chairs: string[]
  professionalRoles: string[]
  serviceCategories: string[]
  operationalSettings?: CompanyOperationalSettings
  address: {
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zip: string
    mapsUrl: string
  }
  social: {
    instagram: string
    whatsapp: string
    facebook: string
  }
}
