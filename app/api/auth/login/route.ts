import { NextResponse } from "next/server"
import {
  AUTH_COOKIE_NAME,
  AUTH_SESSION_MAX_AGE,
  createAuthSession,
  isAdminCredential,
} from "@/lib/auth"
import { validatePassword } from "@/lib/auth-store"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""
  const password = typeof body?.password === "string" ? body.password : ""

  if (!email || !password) {
    return NextResponse.json(
      { message: "Informe e-mail e senha." },
      { status: 400 }
    )
  }

  const isAdmin = isAdminCredential(email, password)

  let user: {
    email: string
    name: string
    companyName?: string
    hasActivePlan: boolean
    planKey?: string
  }

  if (isAdmin) {
    user = {
      email,
      name: "Rafael Oliveira",
      companyName: "Sua Barbearia",
      hasActivePlan: true,
      planKey: "pro-anual",
    }
  } else {
    const registered = validatePassword(email, password)
    if (!registered) {
      return NextResponse.json(
        { message: "E-mail ou senha invalidos." },
        { status: 401 }
      )
    }
    user = {
      email: registered.email,
      name: registered.name,
      companyName: registered.companyName,
      hasActivePlan: false,
    }
  }

  const response = NextResponse.json({ ok: true, user })
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: await createAuthSession(user),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_SESSION_MAX_AGE,
  })

  return response
}
