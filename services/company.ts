export const COMPANY_LOGO_STORAGE_KEY = "mydashbarber.v1.logoUrl"
export const COMPANY_TRADE_NAME_STORAGE_KEY = "mydashbarber.v1.tradeName"
export const COMPANY_ICON_STORAGE_KEY = "mydashbarber.v1.iconUrl"
export const COMPANY_CAROUSEL_IMAGE_1_STORAGE_KEY =
  "mydashbarber.v1.carouselImage1"
export const COMPANY_CAROUSEL_IMAGE_2_STORAGE_KEY =
  "mydashbarber.v1.carouselImage2"
export const COMPANY_CAROUSEL_IMAGE_3_STORAGE_KEY =
  "mydashbarber.v1.carouselImage3"
export const COMPANY_OPERATIONAL_SETTINGS_STORAGE_KEY =
  "mydashbarber.v1.company.operationalSettings"

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(key, JSON.stringify(value))
}