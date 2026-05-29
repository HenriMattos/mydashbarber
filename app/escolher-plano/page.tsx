"use client"

import Link from "next/link"
import {
  ArrowRight01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { plans } from "@/components/landing/landing-data"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

const limeButtonClass =
  "h-11 rounded-full border-[rgba(11,51,36,0.18)] bg-[var(--landing-accent)] px-5 text-[15px] font-extrabold text-[var(--landing-primary-dark)] shadow-[inset_0_-2px_0_rgba(11,51,36,0.18)] hover:bg-[var(--landing-accent-hover)]"

const darkButtonClass =
  "h-11 rounded-full border-[var(--landing-primary-dark)] bg-[var(--landing-primary-dark)] px-5 text-[15px] font-extrabold text-white hover:bg-black"

export default function EscolherPlanoPage() {
  const { user, isLoading } = useAuth()

  return (
    <main className="organic-auth min-h-dvh bg-[var(--landing-background)] text-[var(--landing-primary-dark)] py-12 px-4">
      <div className="mx-auto max-w-[1200px]">
        <header className="text-center mb-12">
          <p className="inline-flex rounded-full border border-[var(--landing-border)] bg-[var(--landing-primary-soft)] px-3 py-1.5 text-sm font-bold text-[var(--landing-primary)]">
            Configuração da conta
          </p>
          <h1 className="mt-4 text-[42px] font-extrabold tracking-[-0.04em] text-[var(--landing-primary-dark)]">
            Escolha seu plano Bigood
          </h1>
          <p className="mt-3 text-lg text-[var(--landing-muted)] max-w-[600px] mx-auto">
            Selecione a melhor opcao para a gestão da sua barbearia e comece agora.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3 items-stretch">
          {plans.map((plan) => (
            <article
              key={plan.key}
              className={cn(
                "rounded-[32px] border p-8 flex flex-col shadow-[var(--landing-shadow-soft)] transition-all hover:translate-y-[-4px]",
                plan.highlighted
                  ? "border-[rgba(216,242,58,0.35)] bg-[var(--landing-primary-dark)] text-white shadow-[0_24px_55px_rgba(11,51,36,0.18)]"
                  : "border-[var(--landing-border)] bg-white text-[var(--landing-primary-dark)]"
              )}
            >
              <div className="flex-1">
                <span
                  className={cn(
                    "inline-flex rounded-full border px-3 py-1 text-xs font-bold",
                    plan.highlighted
                      ? "border-white/10 bg-white/10 text-white"
                      : "border-[var(--landing-border)] bg-[var(--landing-primary-soft)] text-[var(--landing-primary)]"
                  )}
                >
                  {plan.badge}
                </span>

                <h3 className="mt-5 text-2xl font-extrabold tracking-[-0.03em]">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-end gap-2">
                  <span className="text-4xl font-black">{plan.price}</span>
                  {plan.period && (
                    <span
                      className={cn(
                        "pb-1 text-sm font-bold",
                        plan.highlighted ? "text-white/60" : "text-[var(--landing-muted)]"
                      )}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>

                <p
                  className={cn(
                    "mt-5 text-sm leading-relaxed",
                    plan.highlighted ? "text-white/70" : "text-[var(--landing-muted)]"
                  )}
                >
                  {plan.description}
                </p>

                <ul className="mt-8 grid gap-3 text-sm">
                  {plan.features.slice(0, 6).map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <HugeiconsIcon
                        icon={CheckmarkCircle02Icon}
                        size={18}
                        className={cn(
                          "mt-0.5 shrink-0",
                          plan.highlighted
                            ? "text-[var(--landing-accent)]"
                            : "text-[var(--landing-primary)]"
                        )}
                      />
                      <span className={plan.highlighted ? "text-white/80" : ""}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <Button
                  asChild
                  className={cn(
                    "w-full rounded-full h-12 text-base font-extrabold",
                    plan.highlighted ? limeButtonClass : darkButtonClass
                  )}
                >
                  <Link
                    href={
                      !isLoading && !user
                        ? `/login?mode=signup&next=/checkout?plan=${plan.key}`
                        : `/checkout?plan=${plan.key}`
                    }
                  >
                    {plan.cta}
                    <HugeiconsIcon icon={ArrowRight01Icon} size={18} />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-sm font-bold text-[var(--landing-muted)] hover:text-[var(--landing-primary-dark)]"
          >
            Voltar para o inicio
          </Link>
        </div>
      </div>
    </main>
  )
}
