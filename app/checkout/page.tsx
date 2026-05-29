import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"
import {
  CheckmarkCircle02Icon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { BrandMark } from "@/components/landing/brand-mark"
import { plans, type PlanKey } from "@/components/landing/landing-data"
import { CheckoutActions } from "@/components/landing/checkout-actions"
import { PORTAL_IMAGES } from "@/lib/marketing-assets"

export const metadata: Metadata = {
  title: "Confirmacao do plano",
  description:
    "Revise o plano escolhido e avance para o acesso ao painel Bigood apos a confirmacao.",
}

type CheckoutPageProps = {
  searchParams: Promise<{ plan?: string }>
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const params = await searchParams
  const selectedPlan = parsePlan(params.plan)
  const plan = plans.find((item) => item.key === selectedPlan) ?? plans[1]

  return (
    <main className="organic-auth h-dvh overflow-y-auto bg-[var(--landing-background)] text-[var(--landing-primary-dark)]">
      <div className="mx-auto flex min-h-full w-full max-w-[1180px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 py-3">
          <BrandMark />
          <Link
            href="/escolher-plano"
            className="rounded-full border border-[var(--landing-border-strong)] px-4 py-2 text-sm font-bold text-[var(--landing-primary-dark)] transition hover:bg-[var(--landing-primary-soft)] focus-visible:ring-2 focus-visible:ring-[var(--landing-ring)] focus-visible:outline-none"
          >
            Trocar plano
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-6 py-6 lg:grid-cols-[0.92fr_1.08fr]">
          <aside className="relative min-h-[540px] overflow-hidden rounded-[32px] bg-[var(--landing-primary-dark)] shadow-[var(--landing-shadow-card)]">
            <Image
              src={PORTAL_IMAGES.barberLogin}
              alt="Barbearia premium em funcionamento"
              fill
              priority
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,47,34,0.88),rgba(8,47,34,0.58),rgba(8,47,34,0.26))]" />
            <div className="pointer-events-none absolute -left-12 top-24 h-56 w-80 rotate-[-16deg] rounded-full border-[8px] border-[var(--landing-accent)] border-r-transparent border-b-transparent opacity-80" />
            <div className="pointer-events-none absolute left-6 bottom-4 text-[clamp(72px,12vw,160px)] font-black tracking-[-0.08em] text-white/10 uppercase">
              Checkout
            </div>

            <div className="relative z-10 flex min-h-[540px] flex-col justify-between p-6 text-white sm:p-8 lg:p-10">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/16 bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur">
                <HugeiconsIcon icon={CreditCardIcon} size={17} aria-hidden />
                Checkout do plano
              </span>

              <div className="max-w-[650px]">
                <h1 className="text-[clamp(42px,6vw,76px)] leading-[0.95] font-extrabold tracking-[-0.05em] text-balance">
                  Confirme o {plan.name} para ativar seu painel.
                </h1>
                <p className="mt-5 max-w-[560px] text-base leading-7 text-white/80 md:text-lg">
                  Revise valor, forma de pagamento e regra de transicao de
                  sistema antes de seguir para o login do painel.
                </p>
              </div>

              <p className="rounded-[22px] border border-white/16 bg-white/12 p-4 text-sm leading-6 text-white/82 backdrop-blur">
                Esta tela representa o checkout do gateway de pagamento. Apos a
                confirmacao, o barbeiro ativa seu painel Bigood.
              </p>
            </div>
          </aside>

          <section className="rounded-[32px] border border-[var(--landing-border)] bg-white p-5 shadow-[var(--landing-shadow-card)] sm:p-8 lg:p-10">
            <div className="rounded-[28px] border border-[var(--landing-border)] bg-[var(--landing-card-soft)] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-[var(--landing-muted)]">
                    Plano selecionado
                  </p>
                  <h2 className="mt-1 text-3xl font-extrabold tracking-[-0.03em] text-[var(--landing-primary-dark)]">
                    {plan.name}
                  </h2>
                </div>
                <span className="grid size-12 place-items-center rounded-full border border-[rgba(11,51,36,0.14)] bg-[var(--landing-accent-soft)] text-[var(--landing-primary-dark)]">
                  <HugeiconsIcon
                    icon={CreditCardIcon}
                    size={23}
                    aria-hidden="true"
                  />
                </span>
              </div>

              <div className="mt-7 flex items-end gap-2">
                <span className="text-[48px] leading-none font-black tracking-[-0.04em]">
                  {plan.price}
                </span>
                <span className="pb-2 text-sm font-bold text-[var(--landing-muted)]">
                  {plan.period}
                </span>
              </div>

              {selectedPlan === "pro-anual" ? (
                <p className="mt-2 rounded-full bg-[var(--landing-accent-soft)] px-4 py-2 text-sm font-extrabold text-[var(--landing-primary)]">
                  Equivalente a R$ 175 por mes, economia de R$ 540 por ano.
                </p>
              ) : null}

              <div className="mt-6 grid gap-3 text-sm">
                <InfoLine text={plan.payment} />
                <InfoLine text={plan.transition} />
                <InfoLine text="Plano Pro inclui até 3 unidades. Para 4 ou mais unidades, use o Personalizado." />
              </div>
            </div>

            <CheckoutActions planKey={plan.key} />
          </section>
        </section>
      </div>
    </main>
  )
}

function InfoLine({ text }: { text: string }) {
  return (
    <p className="flex gap-3 rounded-[20px] border border-[var(--landing-border)] bg-white p-4 leading-6 text-[var(--landing-foreground-soft)]">
      <HugeiconsIcon
        icon={CheckmarkCircle02Icon}
        size={18}
        className="mt-0.5 shrink-0 text-[var(--landing-primary)]"
        aria-hidden="true"
      />
      <span>{text}</span>
    </p>
  )
}

function parsePlan(plan?: string): PlanKey {
  if (
    plan === "pro-mensal" ||
    plan === "pro-anual" ||
    plan === "personalizado"
  ) {
    return plan
  }

  return "pro-anual"
}
