export const PORTAL_CLIENT_AUTH_KEY = "bigood.portal.client.auth"
export const PORTAL_CLIENT_DATA_KEY = "bigood.portal.client.data"

export type PortalClientData = {
  name: string
  email: string
  phone: string
}

export function getPortalAuth(): PortalClientData | null {
  if (typeof window === "undefined") return null
  const raw = localStorage.getItem(PORTAL_CLIENT_AUTH_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as PortalClientData
  } catch {
    return null
  }
}

export function setPortalAuth(data: PortalClientData) {
  localStorage.setItem(PORTAL_CLIENT_AUTH_KEY, JSON.stringify(data))
  window.dispatchEvent(new Event("bigood_portal_auth_sync"))
}

export function clearPortalAuth() {
  localStorage.removeItem(PORTAL_CLIENT_AUTH_KEY)
  localStorage.removeItem(PORTAL_CLIENT_DATA_KEY)
  window.dispatchEvent(new Event("bigood_portal_auth_sync"))
}
