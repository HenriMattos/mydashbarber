import {
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  DashboardSquare03Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Container } from "@/components/landing/ui/container"
import { IconBubble } from "@/components/landing/ui/icon-bubble"
import { SectionHeader, SectionPill } from "@/components/landing/ui/section-header"

const comparisons = [
  {
    label: "OpÃ§Ã£o 1",
    title: "WhatsApp e planilha",
    icon: CancelCircleIcon,
    bad: [
      "Agenda espalhada",
      "Comanda manual",
      "Assinante esquecido",
      "Caixa sem leitura",
    ],
  },
  {
    label: "OpÃ§Ã£o 2",
    title: "Sistema complexo",
    icon: DashboardSquare03Icon,
    bad: [
      "Demora para usar",
      "Tela demais",
      "Equipe trava",
      "Pouco foco em barbearia",
    ],
  },
]

export function CompareSection() {
  return (
    <section
      className="landing-guide-section landing-scroll-reveal section-space bg-white"
      aria-labelledby="compare-heading"
    >
      <Container>
        <SectionHeader
          eyebrow="Comparativo"
          title="WhatsApp e planilha vs. Bigood."
          text="VocÃª pode continuar do jeito antigo ou agendar uma demonstraÃ§Ã£o e ver a diferenÃ§a."
        />

        <div className="stagger-grid mt-10 grid gap-3 lg:grid-cols-3">
          {comparisons.map((item) => (
            <article
              key={item.title}
              className="card-hover-lift landing-card rounded-[20px] border border-[var(--landing-border)] bg-white p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] font-black tracking-[0.12em] text-[var(--landing-muted)] uppercase">
                    {item.label}
                  </p>
                  <h3 className="mt-4 text-2xl font-black text-[var(--landing-primary-dark)]">
                    {item.title}
                  </h3>
                </div>
                <IconBubble icon={item.icon} />
              </div>
              <ul className="mt-6 grid gap-3 text-xs text-[var(--landing-foreground-soft)]">
                {item.bad.map((line) => (
                  <li key={line} className="flex gap-2">
                    <HugeiconsIcon
                      icon={CancelCircleIcon}
                      size={18}
                      className="mt-0.5 shrink-0 text-red-400"
                    />
                    {line}
                  </li>
                ))}
              </ul>
            </article>
          ))}

          <article className="card-hover-lift landing-card landing-dark-gradient rounded-[20px] p-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <SectionPill className="border-transparent bg-[var(--landing-accent)]">
                  Recomendado
                </SectionPill>
                <h3 className="mt-4 text-2xl font-black">Bigood</h3>
              </div>
              <IconBubble icon={CheckmarkCircle02Icon} />
            </div>
            <ul className="mt-6 grid gap-3 text-xs text-white/72">
              {[
                "Agenda e caixa no mesmo lugar",
                "Planos de assinatura para clientes",
                "Gestao de clientes pronto para vender",
                "Rotina pensada para barbearia",
              ].map((line) => (
                <li key={line} className="flex gap-2">
                  <HugeiconsIcon
                    icon={CheckmarkCircle02Icon}
                    size={18}
                    className="mt-0.5 shrink-0 text-[var(--landing-accent)]"
                  />
                  {line}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </Container>
    </section>
  )
}
