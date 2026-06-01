const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const AUTH_COOKIE_NAME = "mydashbarber.session"
export const AUTH_SESSION_MAX_AGE = 60 * 60 * 8

export type AuthUser = {
  email: string
  name?: string
  companyName?: string
  hasActivePlan: boolean
  planKey?: string
}

export type SessionPayload = AuthUser & {
  sub: string
  exp: number
}

export const DEMO_ADMIN_CREDENTIALS = {
  email: "admin@bigood.com",
  password: "bigood123",
}

export function getAdminCredentials() {
  // Em producao, as variaveis devem ser definidas no ambiente.
  return {
    email: process.env.ADMIN_EMAIL ?? DEMO_ADMIN_CREDENTIALS.email,
    password: process.env.ADMIN_PASSWORD ?? DEMO_ADMIN_CREDENTIALS.password,
  }
}

export function isAdminCredential(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedPassword = password.trim()
  const envAdmin = getAdminCredentials()
  const candidates = [envAdmin, DEMO_ADMIN_CREDENTIALS]

  return candidates.some(
    (candidate) =>
      candidate.email.trim().toLowerCase() === normalizedEmail &&
      candidate.password === normalizedPassword
  )
}

export async function createAuthSession(user: AuthUser) {
  const payload: SessionPayload = {
    ...user,
    sub: user.email,
    exp: Math.floor(Date.now() / 1000) + AUTH_SESSION_MAX_AGE,
  }
  const encodedPayload = base64UrlEncode(
    encoder.encode(JSON.stringify(payload))
  )
  const signature = await sign(encodedPayload)

  return `${encodedPayload}.${signature}`
}

export async function getAuthSession(token?: string) {
  if (!token) return null

  const [encodedPayload, signature] = token.split(".")

  if (!encodedPayload || !signature) return null

  const expectedSignature = await sign(encodedPayload)

  if (!safeEqual(signature, expectedSignature)) return null

  try {
    const payload = JSON.parse(
      decoder.decode(base64UrlDecode(encodedPayload))
    ) as SessionPayload

    if (!payload.sub || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export async function verifyAuthSession(token?: string) {
  return Boolean(await getAuthSession(token))
}

export async function verifyActiveSubscription(token?: string) {
  const session = await getAuthSession(token)
  return Boolean(session?.hasActivePlan)
}

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getAuthSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value))

  return base64UrlEncode(new Uint8Array(signature))
}

function getAuthSecret() {
  // AUTH_SECRET deve ser definido em producao.
  return process.env.AUTH_SECRET ?? "dev-only-change-this-secret"
}

function base64UrlEncode(bytes: Uint8Array) {
  let binary = ""

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "")
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "="
  )
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

function safeEqual(first: string, second: string) {
  if (first.length !== second.length) return false

  let result = 0

  for (let index = 0; index < first.length; index += 1) {
    result |= first.charCodeAt(index) ^ second.charCodeAt(index)
  }

  return result === 0
}
