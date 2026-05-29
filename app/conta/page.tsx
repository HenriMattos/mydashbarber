import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import type { Metadata } from "next"
import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { BrandMark } from "@/components/landing/brand-mark"
import { Button } from "@/components/ui/button"
import { AUTH_COOKIE_NAME, getAuthSession } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Configurar conta",
  description: "Revise os dados da conta Bigood e o status da assinatura.",
}

export default async function ContaPage() {
  const cookieStore = await cookies()
  const session = await getAuthSession(cookieStore.get(AUTH_COOKIE_NAME)?.value)

  if (!session) {
    redirect("/login?next=/conta")
  }

  return (
    <main className="organic-auth min-h-dvh bg-[var(--landing-background)] px-4 py-4 text-[var(--landing-primary-dark)] sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-2rem)] w-full max-w-[980px] flex-col">
        <header className="flex items-center justify-between gap-4 py-3">
          <BrandMark />
          <Link
            href="/"
            className="rounded-full border border-[var(--landing-border-strong)] px-4 py-2 text-sm font-bold text-[var(--landing-primary-dark)] transition hover:bg-[var(--landing-primary-soft)] focus-visible:ring-2 focus-visible:ring-[var(--landing-ring)] focus-visible:outline-none"
          >
            Voltar
          </Link>
        </header>

        <section className="grid flex-1 items-center py-10">
          <div className="rounded-[36px] border border-[var(--landing-border)] bg-white p-6 shadow-[var(--landing-shadow-card)] sm:p-8 lg:p-10">
            <span className="inline-flex rounded-full border border-[var(--landing-border)] bg-[var(--landing-primary-soft)] px-3 py-1.5 text-sm font-bold text-[var(--landing-primary)]">
              Minha conta
            </span>
            <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <div>
                <div className="grid size-20 place-items-center rounded-full bg-[var(--landing-accent)] text-[var(--landing-primary-dark)]">
                  <HugeiconsIcon icon={UserIcon} size={34} aria-hidden />
                </div>
                <h1 className="mt-6 text-[42px] leading-[1] font-extrabold tracking-[-0.05em]">
                  Conta Bigood
                </h1>
                <p className="mt-4 text-base leading-7 text-[var(--landing-muted)]">
                  Esta conta e a mesma usada para assinar planos e acessar o
                  dashboard do barbeiro.
                </p>
              </div>

              <div className="grid gap-4">
                <InfoCard label="E-mail" value={session.email} />
                <InfoCard
                  label="Responsavel"
                  value={session.name || "Não informado"}
                />
                <InfoCard
                  label="Barbearia"
                  value={session.companyName || "Não informada"}
                />
                <InfoCard
                  label="Assinatura"
                  value={
                    session.hasActivePlan
                      ? `Plano ativo${session.planKey ? `: ${session.planKey}` : ""}`
                      : "Sem plano ativo"
                  }
                  active={session.hasActivePlan}
                />

                <Button
                  className="h-12 rounded-full border border-[rgba(11,51,36,0.18)] bg-[var(--landing-accent)] font-extrabold text-[var(--landing-primary-dark)] shadow-[inset_0_-2px_0_rgba(11,51,36,0.18)] hover:bg-[var(--landing-accent-hover)]"
                  asChild
                >
                  <Link
                    href={
                      session.hasActivePlan ? "/dashboard" : "/escolher-plano"
                    }
                  >
                    {session.hasActivePlan ? "Acessar painel" : "Assinar plano"}
                    <HugeiconsIcon
                      icon={ArrowRight01Icon}
                      size={18}
                      aria-hidden
                    />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function InfoCard({
  label,
  value,
  active = false,
}: {
  label: string
  value: string
  active?: boolean
}) {
  return (
    <div className="rounded-[22px] border border-[var(--landing-border)] bg-[var(--landing-card-soft)] p-4">
      <p className="text-xs font-black tracking-[0.08em] text-[var(--landing-muted)] uppercase">
        {label}
      </p>
      <p className="mt-2 flex items-center gap-2 text-lg font-extrabold text-[var(--landing-primary-dark)]">
        {active ? (
          <HugeiconsIcon
            icon={CheckmarkCircle02Icon}
            size={18}
            className="text-[var(--landing-primary)]"
            aria-hidden
          />
        ) : null}
        {value}
      </p>
    </div>
  )
}
