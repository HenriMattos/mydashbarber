import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import {
  ArrowRight02Icon,
  Calendar03Icon,
  CashierIcon,
  CreditCardIcon,
  DashboardSquare03Icon,
  SmartPhone01Icon,
  StoreManagement01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { BrandMark } from "@/components/landing/brand-mark"
import { LandingHeader } from "@/components/landing/landing-header"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { LANDING_IMAGES } from "@/lib/marketing-assets"
import { cn } from "@/lib/utils"

const primaryButtonClass =
  "h-12 rounded-full border border-[rgba(11,51,36,0.18)] bg-[var(--landing-accent)] px-5 font-extrabold text-[var(--landing-primary-dark)] shadow-[inset_0_-2px_0_rgba(11,51,36,0.18)] hover:bg-[var(--landing-accent-hover)]"

const textArrowLinkClass =
  "group inline-flex items-center text-sm font-extrabold text-[var(--landing-primary-dark)] transition-colors hover:text-[var(--landing-primary)] focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"

const textArrowIconClass =
  "ml-1 transition-transform duration-300 ease-out group-hover:translate-x-1.5"

const heroSignals = [
  {
    title: "Gestao de clientes",
    description: "Seu cliente agenda pelo celular.",
    icon: SmartPhone01Icon,
  },
  {
    title: "Painel do barbeiro",
    description: "Agenda, caixa e equipe em uma tela.",
    icon: DashboardSquare03Icon,
  },
]

const heroFloatingCards = [
  {
    title: "Agenda clara",
    description: "HorÃ¡rios e equipe em ordem.",
    icon: Calendar03Icon,
    className: "top-[18%] left-[2%]",
  },
  {
    title: "Painel ativo",
    description: "Rotina visÃ­vel para o barbeiro.",
    icon: DashboardSquare03Icon,
    className: "right-[4%] bottom-[22%]",
  },
]

const featureCards = [
  {
    title: "Agenda sem improviso",
    description: "ServiÃ§os, horÃ¡rios e confirmaÃ§Ãµes em uma agenda clara.",
    icon: Calendar03Icon,
  },
  {
    title: "Caixa organizado",
    description: "Comandas, pagamentos e fechamento do dia no mesmo fluxo.",
    icon: CashierIcon,
  },
  {
    title: "Planos recorrentes",
    description: "Assinantes, benefÃ­cios e renovaÃ§Ãµes sem planilha.",
    icon: CreditCardIcon,
  },
  {
    title: "Gestao de clientes",
    description: "Seu cliente agenda e acompanha tudo pelo celular.",
    icon: SmartPhone01Icon,
  },
]

const flowSteps = [
  {
    title: "Entre pelo site",
    description: "Acesse o painel da barbearia em poucos passos.",
    icon: Calendar03Icon,
  },
  {
    title: "Configure a rotina",
    description: "Agenda, equipe, servicos e clientes no mesmo lugar.",
    icon: StoreManagement01Icon,
  },
  {
    title: "Acompanhe pelo painel",
    description: "Veja caixa, clientes e atendimentos sem ruÃ­do.",
    icon: DashboardSquare03Icon,
  },
]

const dashboardMetrics = [
  { label: "Agenda de hoje", value: "32 horÃ¡rios", icon: Calendar03Icon },
  { label: "Caixa do dia", value: "R$ 2.840", icon: CashierIcon },
  { label: "Clientes ativos", value: "486", icon: UserGroupIcon },
  { label: "Assinaturas", value: "86 ativas", icon: CreditCardIcon },
]

const proofItems = [
  {
    title: "Agenda centralizada",
    description: "HorÃ¡rios, profissionais e serviÃ§os organizados.",
    icon: Calendar03Icon,
  },
  {
    title: "OperaÃ§Ã£o conectada",
    description: "Caixa, clientes e atendimentos no mesmo fluxo.",
    icon: StoreManagement01Icon,
  },
  {
    title: "Painel completo",
    description: "A rotina aparece clara para o barbeiro.",
    icon: DashboardSquare03Icon,
  },
  {
    title: "Planos e recorrÃªncia",
    description: "Assinaturas e benefÃ­cios visÃ­veis para a gestÃ£o.",
    icon: CreditCardIcon,
  },
]

const faqItems = [
  {
    question: "Posso criar uma conta sozinho?",
    answer:
      "Sim. O barbeiro pode criar a conta pelo site e acessar o painel para configurar a operaÃ§Ã£o.",
  },
  {
    question: "Onde vejo planos e assinatura?",
    answer:
      "As informaÃ§Ãµes de plano, assinatura e conta ficam dentro do dashboard, junto com as configuraÃ§Ãµes pessoais.",
  },
  {
    question: "O cliente final tambÃ©m usa o Bigood?",
    answer:
      "Sim. A barbearia gerencia agendamentos, servicos, planos e relacionamento com clientes pelo painel administrativo.",
  },
  {
    question: "Onde configuro login, senha e dados da conta?",
    answer:
      "Essas opÃ§Ãµes ficam dentro do dashboard, na Ã¡rea de conta pessoal, junto com dados do plano assinado.",
  },
]

function FrameSection({
  children,
  className,
  contentClassName,
  id,
  stripedFrame = false,
}: {
  children: ReactNode
  className?: string
  contentClassName?: string
  id?: string
  stripedFrame?: boolean
}) {
  const sideClassName = cn(
    "landing-frame-side hidden lg:block",
    stripedFrame ? "landing-frame-side-striped" : "bg-white"
  )

  return (
    <section
      id={id}
      className={cn(
        "flex gap-px border-b border-[var(--landing-border)] bg-[var(--landing-border)]",
        className
      )}
    >
      <div className={cn(sideClassName, "rounded-r-lg")} />
      <div
        className={cn(
          "mx-auto w-full max-w-[1200px] min-w-0 overflow-hidden rounded-lg bg-white",
          contentClassName
        )}
      >
        {children}
      </div>
      <div className={cn(sideClassName, "rounded-l-lg")} />
    </section>
  )
}

function IconTile({ icon }: { icon: IconSvgElement }) {
  return (
    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[var(--landing-accent-soft)] text-[var(--landing-primary-dark)]">
      <HugeiconsIcon icon={icon} size={22} aria-hidden="true" />
    </span>
  )
}

function SectionHeading({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string
  title: string
  text: string
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-extrabold tracking-[0.16em] text-[var(--landing-muted)] uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] leading-[1.04] font-black text-[var(--landing-primary-dark)]">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 font-medium text-[var(--landing-muted)]">
        {text}
      </p>
    </div>
  )
}

function ProductPreview() {
  return (
    <div className="relative hidden min-h-[440px] overflow-visible md:block lg:min-h-[500px]">
      <Image
        src={LANDING_IMAGES.barber}
        alt="Barbeiro consultor Bigood"
        width={1024}
        height={1024}
        className="absolute right-[1%] bottom-0 z-20 h-[96%] w-auto max-w-none object-contain drop-shadow-[0_24px_48px_rgba(11,51,36,0.18)] lg:h-[104%]"
        priority
      />
      {heroFloatingCards.map((card, index) => (
        <article
          key={card.title}
          className={cn(
            "landing-float-card absolute w-[178px] rounded-2xl border border-[var(--landing-border)] bg-white/94 p-4 shadow-[0_18px_45px_rgba(11,51,36,0.12)] backdrop-blur",
            index === 0 ? "z-10" : "landing-float-card-delay z-30",
            card.className
          )}
        >
          <span className="grid size-10 place-items-center rounded-full bg-[var(--landing-accent-soft)] text-[var(--landing-primary-dark)]">
            <HugeiconsIcon icon={card.icon} size={20} aria-hidden="true" />
          </span>
          <p className="mt-3 text-sm font-black text-[var(--landing-primary-dark)]">
            {card.title}
          </p>
          <p className="mt-1 text-xs leading-4 font-semibold text-[var(--landing-muted)]">
            {card.description}
          </p>
        </article>
      ))}
    </div>
  )
}

export function LandingPage() {
  return (
    <main className="landing-page min-h-screen overflow-x-hidden bg-[var(--landing-background)] text-[var(--landing-primary-dark)]">
      <LandingHeader />

      <FrameSection contentClassName="landing-hero-surface">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_34%,rgba(220,255,34,0.96)_0%,rgba(216,242,58,0.64)_28%,rgba(242,255,193,0.34)_48%,rgba(255,255,255,0)_72%)]" />
          <div className="relative grid min-w-0 gap-8 px-5 pt-8 sm:px-8 md:grid-cols-[0.92fr_1.08fr] md:px-12 lg:px-16 lg:pt-12">
            <div className="min-w-0 pb-7 md:pb-8">
              <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--landing-border)] bg-white/80 p-2 pr-3">
                <span className="flex -space-x-2">
                  <span className="grid size-6 place-items-center rounded-full border-2 border-white bg-[var(--landing-primary-dark)] text-[10px] font-black text-white">
                    B
                  </span>
                  <span className="grid size-6 place-items-center rounded-full border-2 border-white bg-[var(--landing-accent)] text-[10px] font-black text-[var(--landing-primary-dark)]">
                    G
                  </span>
                  <span className="grid size-6 place-items-center rounded-full border-2 border-white bg-white text-[10px] font-black text-[var(--landing-primary-dark)]">
                    +
                  </span>
                </span>
                <span className="min-w-0 truncate text-xs font-extrabold text-[var(--landing-primary-dark)]">
                  GestÃ£o premium para barbearias modernas
                </span>
              </div>

              <h1 className="mt-5 max-w-[620px] text-[clamp(2.25rem,5.4vw,4.1rem)] leading-[0.98] font-black break-words text-[var(--landing-primary-dark)]">
                Barba, cabelo e gestÃ£o para seu negÃ³cio{" "}
                <span className="landing-sketched-word text-[var(--landing-primary)]">
                  crescer.
                </span>
              </h1>
              <p className="mt-5 max-w-[500px] text-lg leading-8 font-medium text-[var(--landing-foreground-soft)]">
                Agenda, caixa, equipe, planos e portal em um sistema simples de
                operar.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className={cn(primaryButtonClass, "w-full sm:w-auto")}
                  asChild
                >
                  <Link href="/login">Acessar painel</Link>
                </Button>
                <Link
                  href="#como-funciona"
                  className={cn(
                    textArrowLinkClass,
                    "min-h-12 justify-center sm:justify-start"
                  )}
                >
                  Ver como funciona
                  <HugeiconsIcon
                    icon={ArrowRight02Icon}
                    size={18}
                    className={textArrowIconClass}
                    aria-hidden="true"
                  />
                </Link>
              </div>

              <div className="mt-8 grid max-w-xl grid-cols-1 gap-6 min-[460px]:grid-cols-2">
                {heroSignals.map((item) => (
                  <div key={item.title} className="flex items-center gap-3">
                    <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[var(--landing-primary-soft)] text-[var(--landing-primary-dark)]">
                      <HugeiconsIcon
                        icon={item.icon}
                        size={22}
                        aria-hidden="true"
                      />
                    </span>
                    <span>
                      <span className="block text-sm font-extrabold text-[var(--landing-primary-dark)]">
                        {item.title}
                      </span>
                      <span className="block text-xs font-semibold text-[var(--landing-muted)]">
                        {item.description}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <ProductPreview />
          </div>
        </div>
      </FrameSection>

      <FrameSection id="como-funciona">
        <div className="grid gap-10 px-5 py-16 sm:px-8 md:px-12 lg:grid-cols-[0.86fr_1.14fr] lg:px-16 lg:py-24">
          <SectionHeading
            eyebrow="Como funciona"
            title="Configure a barbearia e acompanhe pelo painel."
            text="O Bigood mostra a rotina em telas simples, do primeiro acesso ao atendimento."
          />

          <div id="fluxo-de-acesso" className="grid gap-4">
            {flowSteps.map((step, index) => (
              <article
                key={step.title}
                className="grid gap-5 rounded-lg border border-[var(--landing-border)] bg-white p-5 sm:grid-cols-[auto_1fr] sm:p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-[var(--landing-muted)]">
                    0{index + 1}
                  </span>
                  <IconTile icon={step.icon} />
                </div>
                <div>
                  <h3 className="text-lg leading-tight font-black text-[var(--landing-primary-dark)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 font-medium text-[var(--landing-muted)]">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </FrameSection>

      <FrameSection id="recursos">
        <div className="grid bg-white md:grid-cols-4">
          {featureCards.map((feature) => (
            <article
              key={feature.title}
              className="group relative min-h-[320px] border-t border-[var(--landing-border)] bg-white p-6 transition-colors hover:bg-[var(--landing-card-soft)] md:border-t-0 md:border-l md:border-dashed md:p-8 md:first:border-l-0"
            >
              <span className="landing-icon-sketch grid size-14 place-items-center text-[var(--landing-primary-dark)] transition-transform duration-300 group-hover:-translate-y-1">
                <HugeiconsIcon
                  icon={feature.icon}
                  size={24}
                  aria-hidden="true"
                />
              </span>
              <h2 className="mt-20 text-xl leading-tight font-black text-[var(--landing-primary-dark)]">
                {feature.title}
              </h2>
              <p className="mt-3 text-sm leading-6 font-medium text-[var(--landing-muted)]">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </FrameSection>

      <FrameSection>
        <div className="grid gap-px bg-[var(--landing-border)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[420px] overflow-hidden bg-[var(--landing-accent)] lg:min-h-[520px]">
            <Image
              key="plans-section-image-v3"
              src={LANDING_IMAGES.barber4}
              alt="Barbeiro apresentando o Bigood para planos e agendamentos"
              width={1200}
              height={900}
              className="absolute inset-x-0 bottom-0 h-[104%] w-full object-contain object-bottom drop-shadow-[0_24px_52px_rgba(11,51,36,0.12)]"
            />
          </div>
          <div className="flex items-center bg-white px-6 py-14 sm:px-10 lg:px-20">
            <div className="max-w-lg">
              <span className="inline-flex rounded-full border border-[var(--landing-border)] px-4 py-2 text-sm font-bold text-[var(--landing-foreground-soft)]">
                Planos e agendamentos
              </span>
              <h2 className="mt-8 text-[clamp(2rem,4vw,3.35rem)] leading-[1.06] font-black text-[var(--landing-primary-dark)]">
                Sistema completo para planos e agenda.
              </h2>
              <p className="mt-6 text-lg leading-8 font-medium text-[var(--landing-muted)]">
                Para barbearias com assinantes, serviÃ§os avulsos ou os dois.
              </p>
              <Link
                href="#dashboard"
                className={cn(textArrowLinkClass, "mt-12")}
              >
                Ver painel
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  size={18}
                  className={textArrowIconClass}
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </div>
      </FrameSection>

      <FrameSection id="dashboard">
        <div className="px-5 py-14 sm:px-8 md:px-12 lg:px-16 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-extrabold tracking-[0.16em] text-[var(--landing-muted)] uppercase">
              Painel Bigood
            </p>
            <h2 className="mt-4 text-[clamp(2rem,4vw,3.25rem)] leading-[1.04] font-black text-[var(--landing-primary-dark)]">
              Uma visÃ£o de produto no primeiro contato.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 font-medium text-[var(--landing-muted)]">
              O visitante entende que o Bigood nÃ£o Ã© uma promessa abstrata: a
              operaÃ§Ã£o aparece em telas, mÃ©tricas e rotinas claras.
            </p>
          </div>

          <div className="relative mx-auto mt-6 h-[330px] max-w-[980px] overflow-visible rounded-2xl bg-white sm:h-[430px] lg:mt-2 lg:h-[560px]">
            <Image
              src={LANDING_IMAGES.dashboard}
              alt="MacBook com o dashboard administrativo Bigood aberto"
              width={2400}
              height={1600}
              className="absolute top-[4%] left-1/2 w-[168%] max-w-none -translate-x-1/2 object-contain drop-shadow-[0_24px_55px_rgba(11,51,36,0.18)] sm:top-[-4%] sm:w-[108%] lg:top-[-12%] lg:w-[100%]"
            />

            {dashboardMetrics.map((metric, index) => (
              <article
                key={metric.label}
                className={cn(
                  "absolute z-10 hidden w-[176px] rounded-2xl border border-[var(--landing-border)] bg-white/94 p-4 shadow-[0_18px_45px_rgba(11,51,36,0.12)] backdrop-blur md:block",
                  index === 0 && "top-[18%] left-[3%]",
                  index === 1 && "top-[18%] right-[3%]",
                  index === 2 && "bottom-[15%] left-[7%]",
                  index === 3 && "right-[7%] bottom-[15%]"
                )}
              >
                <HugeiconsIcon
                  icon={metric.icon}
                  size={20}
                  className="text-[var(--landing-primary-dark)]"
                  aria-hidden="true"
                />
                <p className="mt-4 text-xl font-black text-[var(--landing-primary-dark)]">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs font-bold text-[var(--landing-muted)]">
                  {metric.label}
                </p>
              </article>
            ))}
          </div>
        </div>
      </FrameSection>

      <FrameSection>
        <div className="landing-soft-band grid gap-8 px-5 py-14 sm:px-8 md:px-12 lg:grid-cols-[1fr_auto] lg:items-center lg:px-16">
          <div>
            <h2 className="max-w-3xl text-[clamp(1.85rem,3.6vw,3.1rem)] leading-[1.06] font-black text-white">
              Agenda, caixa, portal e assinaturas.{" "}
              <span className="text-[var(--landing-accent)]">
                Tudo no mesmo painel.
              </span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 font-semibold text-white/72">
              Menos abas abertas. Mais rotina organizada.
            </p>
          </div>
          <Link
            href="/login"
            className={cn(
              textArrowLinkClass,
              "w-fit justify-self-start text-white hover:text-white lg:justify-self-end"
            )}
          >
            Acessar painel
            <HugeiconsIcon
              icon={ArrowRight02Icon}
              size={18}
              className={textArrowIconClass}
              aria-hidden="true"
            />
          </Link>
        </div>
      </FrameSection>

      <FrameSection>
        <div className="px-5 py-16 sm:px-8 md:px-12 lg:px-16 lg:py-24">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-extrabold tracking-[0.16em] text-[var(--landing-muted)] uppercase">
                Primeiro acesso
              </p>
              <h2 className="mt-4 max-w-2xl text-[clamp(2rem,4vw,3.25rem)] leading-[1.04] font-black text-[var(--landing-primary-dark)]">
                A gestÃ£o comeÃ§a com a estrutura certa.
              </h2>
            </div>
            <Link href="#recursos" className={textArrowLinkClass}>
              Ver recursos
              <HugeiconsIcon
                icon={ArrowRight02Icon}
                size={18}
                className={textArrowIconClass}
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="grid gap-px overflow-hidden rounded-lg border border-[var(--landing-border)] bg-[var(--landing-border)] md:grid-cols-4">
            {proofItems.map((item) => (
              <article
                key={item.title}
                className="group bg-white p-6 transition-colors hover:bg-[var(--landing-card-soft)] md:p-8"
              >
                <span className="grid size-12 place-items-center rounded-full bg-[var(--landing-accent-soft)] text-[var(--landing-primary-dark)] transition-transform duration-300 group-hover:-translate-y-1">
                  <HugeiconsIcon
                    icon={item.icon}
                    size={22}
                    aria-hidden="true"
                  />
                </span>
                <h3 className="mt-14 text-2xl leading-tight font-black text-[var(--landing-primary-dark)] md:mt-20">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 font-semibold text-[var(--landing-muted)]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </FrameSection>

      <FrameSection id="duvidas">
        <div className="grid gap-10 px-5 py-16 sm:px-8 md:px-12 lg:grid-cols-[0.92fr_1.08fr] lg:px-16 lg:py-28">
          <SectionHeading
            eyebrow="DÃºvidas frequentes"
            title="Tem dÃºvidas? Relaxa, nÃ³s temos as respostas."
            text="Selecionamos as perguntas que mais aparecem antes do primeiro acesso ao Bigood."
          />

          <Accordion
            type="single"
            collapsible
            className="overflow-hidden border border-[var(--landing-border)] bg-white"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.question}
                value={item.question}
                className="border-[var(--landing-border)] px-6 last:border-b-0"
              >
                <AccordionTrigger className="py-6 text-left text-lg font-black text-[var(--landing-primary-dark)] hover:text-[var(--landing-primary)]">
                  <div>{item.question}</div>
                </AccordionTrigger>
                <AccordionContent className="pr-10 pb-6 text-sm leading-7 font-medium text-[var(--landing-muted)]">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </FrameSection>

      <FrameSection id="cadastro" contentClassName="bg-white" stripedFrame>
        <div className="px-5 py-12 sm:px-8 md:px-12 lg:px-16">
          <div className="landing-end-cta relative grid min-h-[420px] overflow-hidden rounded-lg bg-[var(--landing-accent)] px-7 py-12 sm:px-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:px-20">
            <div className="relative z-10 mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
              <h2 className="text-[clamp(2.25rem,4.8vw,4rem)] leading-[1.02] font-black text-[var(--landing-primary-dark)]">
                VocÃª chegou no fim da pÃ¡gina.
              </h2>
              <p className="mx-auto mt-7 max-w-md text-base leading-7 font-semibold text-[var(--landing-primary-dark)]/78 lg:mx-0">
                Se o Bigood faz sentido para sua barbearia, veja o produto em
                aÃ§Ã£o.
              </p>
              <div className="mt-12 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Button size="lg" className={primaryButtonClass} asChild>
                  <Link href="/login">Acessar painel</Link>
                </Button>
                <Link
                  href="#recursos"
                  className={cn(
                    textArrowLinkClass,
                    "min-h-12 justify-center text-[var(--landing-primary-dark)] hover:text-[var(--landing-primary-dark)]"
                  )}
                >
                  Ver recursos
                  <HugeiconsIcon
                    icon={ArrowRight02Icon}
                    size={18}
                    className={textArrowIconClass}
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </div>
            <div className="relative z-0 mt-10 hidden min-h-[260px] lg:mt-0 lg:block lg:min-h-[360px]">
              <Image
                src={LANDING_IMAGES.finalDash}
                alt="Dashboard Bigood aberto em um monitor"
                width={1800}
                height={1400}
                className="absolute right-[-38%] bottom-[-28%] w-[150%] max-w-none object-contain drop-shadow-[0_28px_55px_rgba(11,51,36,0.18)] sm:right-[-30%] lg:right-[-40%] lg:bottom-[-38%] lg:w-[164%]"
              />
            </div>
          </div>
        </div>
      </FrameSection>

      <footer className="flex gap-px border-b border-[var(--landing-border)] bg-[var(--landing-border)]">
        <div className="landing-frame-side hidden bg-white lg:block" />
        <div className="mx-auto w-full max-w-[1200px] min-w-0 bg-white px-5 pt-20 text-[var(--landing-primary-dark)] sm:px-8 md:px-12 lg:px-16">
          <div className="grid gap-10 pb-20 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr]">
            {[
              {
                title: "Conta",
                links: [
                  ["Criar conta", "/cadastro"],
                  ["Login", "/login"],
                ],
              },
              {
                title: "Suporte",
                links: [
                  ["Central de ajuda", "#duvidas"],
                  ["Falar com suporte", "#cadastro"],
                  ["Criar conta", "/cadastro"],
                ],
              },
              {
                title: "Produto",
                links: [
                  ["Agenda", "#recursos"],
                  ["Caixa", "#recursos"],
                  
                  ["Assinaturas", "#dashboard"],
                ],
              },
              {
                title: "Website",
                links: [
                  ["Como funciona", "#como-funciona"],
                  ["Recursos", "#recursos"],
                  ["DÃºvidas", "#duvidas"],
                  ["Privacidade", "#"],
                  ["Termos", "#"],
                ],
              },
              {
                title: "Sistema",
                links: [
                  ["Painel do barbeiro", "#dashboard"],
                  
                  ["Painel completo", "#dashboard"],
                ],
              },
            ].map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-bold text-[var(--landing-primary-dark)]">
                  {column.title}
                </h3>
                <ul className="mt-5 grid gap-4">
                  {column.links.map(([label, href]) => (
                    <li key={label}>
                      <Link
                        href={href}
                        className="text-base font-semibold text-[var(--landing-muted)] transition-colors hover:text-[var(--landing-primary)]"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-dashed border-[var(--landing-border)] py-8">
            <div className="flex justify-center">
              <BrandMark compact />
            </div>
            <div className="mt-8 flex flex-col gap-5 text-xs font-semibold text-[var(--landing-muted)] md:flex-row md:items-center md:justify-between">
              <p>
                Copyright Â© 2026 Bigood Tecnologia. Sistema de gestÃ£o para
                barbearias.
              </p>
              <div className="flex items-center gap-3">
                {["IG", "YT", "X"].map((item) => (
                  <span
                    key={item}
                    className="grid size-8 place-items-center rounded-full border border-[var(--landing-border)] text-[11px] font-black text-[var(--landing-primary-dark)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="landing-frame-side hidden bg-white lg:block" />
      </footer>
    </main>
  )
}
