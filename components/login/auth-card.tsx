"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ArrowRight01Icon,
  LockPasswordIcon,
  Mail01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

type Mode = "login" | "register"

export function AuthCard() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setAuthenticatedUser } = useAuth()
  const initialMode =
    searchParams.get("mode") === "signup" ? "register" : "login"
  const [mode, setMode] = useState<Mode>(initialMode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const isLogin = mode === "login"

  async function handleAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setLoading(true)

    const form = new FormData(event.currentTarget)
    const email = form.get("email") as string
    const password = form.get("password") as string
    const name = mode === "register" ? (form.get("name") as string) : ""
    const companyName =
      mode === "register" ? (form.get("companyName") as string) : ""

    const endpoint =
      mode === "register" ? "/api/auth/signup" : "/api/auth/login"
    const body: Record<string, string> = { email, password }
    if (mode === "register") {
      body.name = name
      body.companyName = companyName
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    setLoading(false)

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as {
        message?: string
      } | null
      setError(payload?.message ?? "Não foi possível continuar.")
      return
    }

    const payload = (await response.json().catch(() => null)) as {
      user?: {
        email: string
        name?: string
        companyName?: string
        hasActivePlan: boolean
      }
    } | null

    if (payload?.user) {
      setAuthenticatedUser(payload.user)
    }

    router.replace("/dashboard")
    router.refresh()
  }

  function switchMode(nextMode: Mode) {
    setMode(nextMode)
    setError("")
  }

  return (
    <div className="w-full max-w-[390px]">
      <ModeToggle mode={mode} onChange={switchMode} />

      <div className="mt-6">
        <p className="text-xs font-black tracking-[0.16em] text-[var(--landing-muted)] uppercase">
          {isLogin ? "Entrar" : "Cadastro"}
        </p>
        <h1 className="mt-2 text-[34px] leading-[0.98] font-extrabold tracking-[-0.035em] text-[var(--landing-primary-dark)] sm:text-[40px]">
          {isLogin ? "Acesse seu painel." : "Crie sua conta."}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--landing-muted)]">
          {isLogin
            ? "Entre para continuar gerenciando a rotina da sua barbearia."
            : "Cadastre seus dados e comece a configurar o Bigood pelo dashboard."}
        </p>
      </div>

      <form onSubmit={handleAuth} className="mt-6 space-y-3">
        {mode === "register" && (
          <>
            <Field
              id="name"
              type="text"
              label="Seu nome"
              placeholder="Nome do responsavel"
              icon={UserIcon}
              required
            />
          </>
        )}

        <Field
          id="email"
          type="email"
          label="Email"
          placeholder="seu@email.com"
          icon={Mail01Icon}
          required
        />

        <Field
          id="password"
          type="password"
          label="Senha"
          placeholder="********"
          icon={LockPasswordIcon}
          required
        />

        {error && (
          <p className="rounded-2xl border border-destructive/20 bg-destructive/10 p-3 text-xs font-bold text-destructive">
            {error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          className="mt-1 h-11 w-full rounded-full border border-[rgba(11,51,36,0.18)] bg-[var(--landing-accent)] text-sm font-extrabold text-[var(--landing-primary-dark)] shadow-[inset_0_-2px_0_rgba(11,51,36,0.18)] hover:bg-[var(--landing-accent-hover)]"
          disabled={loading}
        >
          {loading
            ? "Processando..."
            : isLogin
              ? "Entrar agora"
              : "Criar conta"}
          <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
        </Button>
      </form>
    </div>
  )
}

function ModeToggle({
  mode,
  onChange,
}: {
  mode: Mode
  onChange: (mode: Mode) => void
}) {
  const isRegister = mode === "register"

  return (
    <div
      className="relative grid h-11 grid-cols-2 rounded-full border border-[var(--landing-border-strong)] bg-[var(--landing-card-soft)] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
      role="tablist"
      aria-label="Escolha entre entrar ou cadastrar"
    >
      <span
        className="absolute top-1 bottom-1 left-1 rounded-full bg-[var(--landing-accent)] shadow-[inset_0_-2px_0_rgba(11,51,36,0.16),0_12px_24px_-18px_rgba(11,51,36,0.6)] transition-transform duration-300 ease-out"
        style={{
          width: "calc((100% - 0.5rem) / 2)",
          transform: isRegister ? "translateX(100%)" : "translateX(0)",
        }}
      />
      <button
        type="button"
        role="tab"
        aria-selected={mode === "login"}
        onClick={() => onChange("login")}
        className={cn(
          "relative z-10 rounded-full text-sm font-extrabold transition-colors",
          mode === "login"
            ? "text-[var(--landing-primary-dark)]"
            : "text-[var(--landing-muted)] hover:text-[var(--landing-primary-dark)]"
        )}
      >
        Entrar
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "register"}
        onClick={() => onChange("register")}
        className={cn(
          "relative z-10 rounded-full text-sm font-extrabold transition-colors",
          mode === "register"
            ? "text-[var(--landing-primary-dark)]"
            : "text-[var(--landing-muted)] hover:text-[var(--landing-primary-dark)]"
        )}
      >
        Cadastrar
      </button>
    </div>
  )
}

function Field({
  id,
  label,
  icon,
  ...props
}: React.ComponentProps<typeof Input> & {
  id: string
  label: string
  icon?: React.ComponentProps<typeof HugeiconsIcon>["icon"]
}) {
  return (
    <div className="grid gap-1.5">
      <Label
        htmlFor={id}
        className="ml-1 text-xs font-bold text-[var(--landing-primary-dark)]"
      >
        {label}
      </Label>
      <div className="relative">
        {icon && (
          <HugeiconsIcon
            icon={icon}
            size={17}
            className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-[var(--landing-muted)]"
          />
        )}
        <Input
          id={id}
          name={id}
          className={cn(
            "h-11 rounded-full border-[var(--landing-border)] bg-white text-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] focus-visible:ring-[var(--landing-accent)]/30",
            icon ? "pl-11" : "px-4"
          )}
          {...props}
        />
      </div>
    </div>
  )
}
