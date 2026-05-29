import Image from "next/image"
import {
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Container } from "@/components/landing/ui/container"
import { LandingLinkButton } from "@/components/landing/ui/landing-link-button"
import { LANDING_IMAGES } from "@/lib/marketing-assets"
import { cn } from "@/lib/utils"

const limeButtonClass =
  "h-12 rounded-full border-[rgba(11,51,36,0.18)] bg-[var(--landing-accent)] px-6 text-sm font-extrabold text-[var(--landing-primary-dark)] shadow-[inset_0_-2px_0_rgba(11,51,36,0.18)] hover:bg-[var(--landing-accent-hover)]"

const trustNumbers = [
  { value: "200+", label: "Barbearias ativas" },
  { value: "15mil+", label: "Agendamentos/mês" },
  { value: "R$ 2mi+", label: "Em planos processados" },
  { value: "98%", label: "Satisfa??o" },
]

const highlights = [
  "Agenda online",
  "Planos de assinatura",
  "Caixa e comandas",
  "Gestão de clientes",
]

export function HeroSection() {
  return (
    <section className="hero-gradient" aria-labelledby="hero-heading">
      <Container className="grid gap-10 pb-0 pt-12 md:grid-cols-[1fr_1.1fr] md:items-center md:pt-16 lg:pt-20">
        <div>
          <p className="inline-flex items-center gap-1.5 rounded-full border border-[var(--landing-border)] bg-white/70 px-3.5 py-1.5 text-[13px] font-bold text-[var(--landing-primary)]">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-[var(--landing-accent)]" />
            Sistema completo para barbearias
          </p>
          <h1
            id="hero-heading"
            className="mt-5 max-w-[560px] text-[clamp(32px,4.5vw,52px)] leading-[1.04] font-bold text-[var(--landing-primary-dark)] md:mt-6"
          >
            Sua barbearia mais organizada.
            <br />
            <span className="text-[var(--landing-primary)]">Seus clientes voltando todo mês.</span>
          </h1>
          <p className="mt-4 max-w-[480px] text-[15px] leading-6 text-[var(--landing-muted)] md:mt-5 md:text-base md:leading-7">
            Agenda, caixa, clientes e planos de assinatura em um
            painel simples. Menos improviso, mais resultado.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row md:mt-8">
            <LandingLinkButton href="#demonstracao" className={cn(limeButtonClass, "hero-cta-glow")}>
              Agendar demonstração
            </LandingLinkButton>
          </div>

          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-1.5">
            {highlights.map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-sm font-semibold text-[var(--landing-foreground-soft)]">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={16} className="text-[var(--landing-accent)]" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative -mx-6 sm:-mx-8 md:mx-0">
          <div className="hero-dashboard-mockup">
            <Image
              src={LANDING_IMAGES.dashboard}
              alt="Dashboard Bigood"
              width={2400}
              height={1600}
              className="w-full object-contain"
              priority
            />
          </div>
        </div>
      </Container>

      <Container className="py-10 md:py-12">
        <div className="grid gap-6 border-t border-[var(--landing-border)] pt-8 md:grid-cols-4 md:pt-10">
          {trustNumbers.map((item) => (
            <div key={item.label} className="text-center md:text-left">
              <p className="text-[clamp(24px,2.8vw,36px)] leading-none font-bold text-[var(--landing-primary-dark)]">
                {item.value}
              </p>
              <p className="mt-1.5 text-[13px] font-medium text-[var(--landing-muted)]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
