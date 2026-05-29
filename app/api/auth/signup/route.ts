import { NextResponse } from "next/server"
import {
  AUTH_COOKIE_NAME,
  AUTH_SESSION_MAX_AGE,
  createAuthSession,
} from "@/lib/auth"
import { registerUser } from "@/lib/auth-store"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : ""
  const password = typeof body?.password === "string" ? body.password : ""
  const name = typeof body?.name === "string" ? body.name.trim() : ""
  const companyName =
    typeof body?.companyName === "string" && body.companyName.trim()
      ? body.companyName.trim()
      : "Minha Barbearia"

  if (!email || !password || !name) {
    return NextResponse.json(
      { message: "Preencha nome, e-mail e senha." },
      { status: 400 }
    )
  }

  if (password.length < 4) {
    return NextResponse.json(
      { message: "A senha deve ter pelo menos 4 caracteres." },
      { status: 400 }
    )
  }

  try {
    registerUser(email, name, password, companyName)
  } catch {
    return NextResponse.json(
      { message: "Este e-mail já possui cadastro." },
      { status: 409 }
    )
  }

  const user = { email, name, companyName, hasActivePlan: false }
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
