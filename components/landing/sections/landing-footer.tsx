import Link from "next/link"
import {
  Calendar03Icon,
  CashierIcon,
  CreditCardIcon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { BrandMark } from "@/components/landing/brand-mark"
import { Container } from "@/components/landing/ui/container"
import { LandingLinkButton } from "@/components/landing/ui/landing-link-button"
import { cn } from "@/lib/utils"

const limeButtonClass =
  "h-12 rounded-full border-[rgba(11,51,36,0.18)] bg-[var(--landing-accent)] px-6 text-sm font-extrabold text-[var(--landing-primary-dark)] shadow-[inset_0_-2px_0_rgba(11,51,36,0.18)] hover:bg-[var(--landing-accent-hover)]"

const footerBadges = [
  { icon: Calendar03Icon, label: "Agenda" },
  { icon: CashierIcon, label: "Caixa" },
  { icon: CreditCardIcon, label: "Planos" },
  { icon: SmartPhone01Icon, label: "Clientes" },
]

const footerColumns = [
{
      title: "Produto",
      links: [
        { label: "Como funciona", href: "#como-funciona" },
        { label: "Dashboard", href: "#dashboard" },
        { label: "Recursos", href: "#recursos" },
        { label: "DÃºvidas", href: "#duvidas" },
      ],
    },
    {
      title: "GestÃ£o",
      links: [
        { label: "Agenda online", href: "#recursos" },
        { label: "Caixa e comandas", href: "#recursos" },
        { label: "Assinaturas", href: "#recursos" },
        { label: "Clientes", href: "#recursos" },
      ],
    },
    {
      title: "Acesso",
      links: [
        { label: "Entrar", href: "/login" },
        { label: "DÃºvidas", href: "#duvidas" },
      ],
    },
]

export function LandingFooter() {
  return (
    <footer className="bg-[var(--landing-primary-dark)] text-white" aria-label="RodapÃ©">
      <Container className="py-12">
        <div className="grid gap-8 border-b border-white/10 pb-8 lg:grid-cols-[1.1fr_1.4fr_0.9fr]">
          <div>
            <BrandMark inverse />
            <p className="mt-5 max-w-[360px] text-sm leading-6 text-white/64">
              Sistema de gestÃ£o para barbearias que querem agenda, caixa,
              clientes e planos de assinatura no mesmo lugar.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {footerBadges.map((item) => (
                <span
                  key={item.label}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-black text-white/72"
                >
                  <HugeiconsIcon icon={item.icon} size={14} />
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-black tracking-[0.12em] text-white/44 uppercase">
                  {column.title}
                </h3>
                <ul className="mt-5 grid gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm font-semibold text-white/72 transition-colors hover:text-[var(--landing-accent)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

<div className="rounded-[28px] border border-white/10 bg-white/6 p-6">
            <p className="text-sm font-black text-white">Pronto para conversar?</p>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Fale com o time comercial e receba a configuracao ideal.
            </p>
            <LandingLinkButton
              href="#demonstracao"
              className={cn(limeButtonClass, "mt-6")}
            >
              Agendar demonstraÃ§Ã£o
            </LandingLinkButton>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 text-xs font-semibold text-white/44 md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 Bigood. GestÃ£o simples para barbearias.</p>
          <p>Feito para agenda, caixa, clientes e assinaturas.</p>
        </div>
      </Container>
    </footer>
  )
}
