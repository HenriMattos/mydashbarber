"use client"

import Link from "next/link"

import { BrandMark } from "@/components/landing/brand-mark"
import { navLinks } from "@/components/landing/landing-data"
import { Button } from "@/components/ui/button"

const limeButtonClass =
  "h-11 rounded-full border border-[rgba(11,51,36,0.18)] bg-[var(--landing-accent)] px-5 text-sm font-extrabold text-[var(--landing-primary-dark)] shadow-[inset_0_-2px_0_rgba(11,51,36,0.18)] hover:bg-[var(--landing-accent-hover)]"

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 flex gap-px border-b border-[var(--landing-border)] bg-[var(--landing-border)]">
      <div className="landing-frame-side hidden rounded-br-lg bg-white lg:block" />
      <div className="mx-auto w-full max-w-[1200px] min-w-0 rounded-b-lg bg-white">
        <div className="flex min-h-16 w-full items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:min-h-[76px]">
          <Link
            href="/"
            className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
            aria-label="Bigood, inicio"
          >
            <BrandMark compact />
          </Link>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Navegação principal"
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-semibold text-[var(--landing-foreground-soft)] transition-colors hover:bg-[var(--landing-primary-soft)] hover:text-[var(--landing-primary-dark)] focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button size="lg" className={limeButtonClass} asChild>
              <Link href="/login">Acessar painel</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="landing-frame-side hidden rounded-bl-lg bg-white lg:block" />
    </header>
  )
}
