import { database } from "@/components/admin/database"
import type { Barbershop } from "@/types/client-portal"

export const PORTAL_SETTINGS_STORAGE_KEY = "bigood.v1.clientPortal.settings"
export const PORTAL_SETTINGS_CHANGED_EVENT = "bigood:client-portal-settings-changed"

function rgbToHex(r: number, g: number, b: number) {
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase()
}

export const defaultPortalSettings: Barbershop = {
  id: database.company.slug,
  slug: database.company.slug,
  name: database.company.companyName,
  slogan: database.company.operationalSettings.welcomeMessage || "Cabelo, barba e cuidado no seu tempo.",
  description: "Experiencia premium para agendar e acompanhar seus atendimentos.",
  bannerUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80",
  bannerPlacement: { x: 50, y: 50, zoom: 1 },
  logoUrl: database.company.logoUrl,
  logoPlacement: { x: 50, y: 50, zoom: 1 },
  address: `${database.company.address.street}, ${database.company.address.number}, ${database.company.address.neighborhood}, ${database.company.address.city}, ${database.company.address.state}`,
  phone: database.company.phone,
  primaryColor: rgbToHex(database.company.primaryColor.r, database.company.primaryColor.g, database.company.primaryColor.b),
  social: {
    instagram: database.company.social.instagram,
    whatsapp: database.company.social.whatsapp,
    facebook: database.company.social.facebook,
  },
  onboardingSlides: [
    {
      title: "Bem-vindo",
      description: "Agende serviços com facilidade, e aproveite um atendimento personalizado.",
      imageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Escolha seu profissional",
      description: "Visualize horários disponíveis e encontre o barbeiro ideal.",
      imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=1200&q=80",
    },
    {
      title: "Acompanhe seus agendamentos",
      description: "Gerencie horários, histórico e serviços em um único lugar.",
      imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80",
    },
  ],
}

export function normalizePortalSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function readPortalSettings(): Barbershop {
  if (typeof window === "undefined") return defaultPortalSettings

  try {
    const raw = window.localStorage.getItem(PORTAL_SETTINGS_STORAGE_KEY)
    if (!raw) return defaultPortalSettings
    const storedSettings = JSON.parse(raw) as Partial<Barbershop>

    return {
      ...defaultPortalSettings,
      ...storedSettings,
      bannerPlacement: {
        ...defaultPortalSettings.bannerPlacement,
        ...storedSettings.bannerPlacement,
      },
      logoPlacement: {
        ...defaultPortalSettings.logoPlacement,
        ...storedSettings.logoPlacement,
      },
    }
  } catch {
    return defaultPortalSettings
  }
}

export function writePortalSettings(settings: Barbershop) {
  if (typeof window === "undefined") return

  window.localStorage.setItem(PORTAL_SETTINGS_STORAGE_KEY, JSON.stringify(settings))
  window.dispatchEvent(new CustomEvent(PORTAL_SETTINGS_CHANGED_EVENT, { detail: settings }))
}

export function getPortalUrl(slug: string) {
  const normalizedSlug = normalizePortalSlug(slug) || defaultPortalSettings.slug
  return `/portal/${normalizedSlug}`
}

export function getReadableForeground(hexColor: string) {
  const fallback = "#10251A"
  const normalized = hexColor.replace("#", "")
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return fallback

  const red = Number.parseInt(normalized.slice(0, 2), 16)
  const green = Number.parseInt(normalized.slice(2, 4), 16)
  const blue = Number.parseInt(normalized.slice(4, 6), 16)
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000

  return brightness > 150 ? "#10251A" : "#FFFFFF"
}
