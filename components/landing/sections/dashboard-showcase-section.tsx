import Image from "next/image"
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Container } from "@/components/landing/ui/container"
import { LandingLinkButton } from "@/components/landing/ui/landing-link-button"
import { LANDING_IMAGES } from "@/lib/marketing-assets"
import { cn } from "@/lib/utils"

const limeButtonClass =
  "h-12 rounded-full border-[rgba(11,51,36,0.18)] bg-[var(--landing-accent)] px-6 text-sm font-extrabold text-[var(--landing-primary-dark)] shadow-[inset_0_-2px_0_rgba(11,51,36,0.18)] hover:bg-[var(--landing-accent-hover)]"

const benefits = [
  "Agenda e comandas em tempo real",
  "Planos de assinatura para clientes",
  "Gestão de clientes pronto para vender",
  "Financeiro claro sem surpresa",
]

export function DashboardShowcaseSection() {
  return (
    <section className="section-space bg-[var(--landing-background)]" id="dashboard" aria-labelledby="dashboard-heading">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-[var(--landing-muted)] uppercase">
              Por dentro do Bigood
            </p>
            <h2 id="dashboard-heading" className="mt-4 max-w-[480px] text-[clamp(26px,3.2vw,40px)] leading-[1.1] font-bold text-[var(--landing-primary-dark)]">
              Um painel. Toda a operação.
            </h2>
            <p className="mt-3 max-w-[440px] text-[15px] leading-6 text-[var(--landing-muted)]">
              Abra o dashboard e veja agenda, caixa, clientes e receita sem
              procurar informação em três lugares.
            </p>

            <div className="mt-6 grid gap-2.5">
              {benefits.map((item) => (
                <div key={item} className="flex items-center gap-2.5">
                  <HugeiconsIcon icon={CheckmarkCircle02Icon} size={18} className="shrink-0 text-[var(--landing-accent)]" />
                  <span className="text-sm font-medium text-[var(--landing-foreground-soft)]">{item}</span>
                </div>
              ))}
            </div>

            <LandingLinkButton href="#demonstracao" className={cn(limeButtonClass, "mt-7")}>
              Agendar demonstração
            </LandingLinkButton>
          </div>

          <div className="shadow-card-lg rounded-xl overflow-hidden border border-[var(--landing-border)]/50">
            <Image
              src={LANDING_IMAGES.dashboard}
              alt="Dashboard Bigood"
              width={2400}
              height={1600}
              className="w-full object-contain"
            />
          </div>
        </div>
      </Container>
    </section>
  )
}
