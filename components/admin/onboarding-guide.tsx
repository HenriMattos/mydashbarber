"use client"

import Link from "next/link"
import {
  ArrowRight01Icon,
  CheckmarkCircle01Icon,
  ScissorIcon,
  UserAdd01Icon,
  Store01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"
import { database } from "@/components/admin/database"

export function OnboardingGuide() {
  const hasProfessionals = database.professionals.length > 0
  const hasServices = database.services.length > 0
  const hasCompanyData = Boolean(database.company.companyName && database.company.companyName !== "Minha Barbearia")

  const steps = [
    {
      title: "Cadastre sua equipe",
      description: "Adicione os profissionais que atendem na sua barbearia.",
      icon: UserAdd01Icon,
      href: "/profissionais/cadastrar",
      completed: hasProfessionals,
    },
    {
      title: "Crie seus serviços",
      description: "Defina os preços, tempos e categorias do seu cardápio.",
      icon: ScissorIcon,
      href: "/servicos",
      completed: hasServices,
    },
    {
      title: "Configure sua marca",
      description: "Personalize o nome, logo e cores do seu portal de agendamento.",
      icon: Store01Icon,
      href: "/empresa",
      completed: hasCompanyData,
    },
  ]

  const completedSteps = steps.filter((s) => s.completed).length
  const progress = Math.round((completedSteps / steps.length) * 100)

  if (progress === 100) return null

  return (
    <section className="animate-in fade-in slide-in-from-top-4 duration-700 mb-6 overflow-hidden rounded-xl border bg-linear-to-br from-primary/5 via-background to-background p-1 shadow-sm">
      <div className="rounded-[10px] bg-background p-5 md:p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex size-10 md:size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-xs">
              <HugeiconsIcon icon={SparklesIcon} size={24} className="md:hidden" />
              <HugeiconsIcon icon={SparklesIcon} size={28} className="hidden md:block" />
            </div>
            <div className="space-y-0.5 md:space-y-1">
              <h2 className="text-lg md:text-xl font-bold tracking-tight">Comece por aqui</h2>
              <p className="text-xs md:text-sm text-muted-foreground leading-snug">
                Siga estes passos para configurar sua barbearia.
              </p>
            </div>
          </div>
          
          <div className="flex items-center justify-between border-t pt-4 sm:border-0 sm:pt-0 sm:justify-end gap-4">
            <div className="sm:text-right">
              <p className="text-[10px] md:text-xs font-semibold uppercase tracking-wider text-muted-foreground">Progresso</p>
              <p className="text-base md:text-lg font-bold text-primary">{progress}%</p>
            </div>
            <div className="relative size-10 md:size-12 shrink-0 overflow-hidden rounded-full bg-muted">
              <div 
                className="absolute inset-0 bg-primary transition-all duration-1000 ease-in-out" 
                style={{ clipPath: `inset(${100 - progress}% 0 0 0)` }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-background mix-blend-difference">
                {completedSteps}/{steps.length}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <Link
              key={index}
              href={step.href}
              className={cn(
                "group relative flex flex-col gap-3 rounded-lg border p-4 transition-all hover:border-primary/50 hover:bg-primary/5 hover:shadow-md",
                step.completed && "border-primary/20 bg-primary/5"
              )}
            >
              <div className="flex items-start justify-between">
                <div className={cn(
                  "flex size-10 items-center justify-center rounded-lg border transition-colors group-hover:bg-background",
                  step.completed ? "bg-primary text-primary-foreground border-primary" : "bg-muted/50 text-muted-foreground border-border"
                )}>
                  <HugeiconsIcon icon={step.icon} size={20} />
                </div>
                {step.completed ? (
                  <div className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} size={14} />
                  </div>
                ) : (
                  <div className="flex size-6 items-center justify-center rounded-full border bg-background text-muted-foreground/30 transition-colors group-hover:text-primary/50">
                    <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
                  </div>
                )}
              </div>
              
              <div className="mt-1">
                <h3 className={cn(
                  "font-bold transition-colors group-hover:text-primary",
                  step.completed && "text-primary"
                )}>
                  {step.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>

              {step.completed && (
                <div className="absolute top-0 right-0 h-1 w-full rounded-t-lg bg-primary/20" />
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
