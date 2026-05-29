"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Calendar03Icon,
  CheckmarkCircle01Icon,
  CrownIcon,
  GiftIcon,
  ScissorIcon,
  Store01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/hooks/use-auth"

const TRIAL_STORAGE_KEY = "bigood.trial.acknowledged"
const WELCOME_STORAGE_KEY = "bigood.welcome.seen"
type ActiveDialog = "idle" | "welcome" | "trial" | "none"

const setupSteps = [
  {
    title: "Configure a barbearia",
    description: "Nome, identidade, horários e dados principais.",
    icon: Store01Icon,
  },
  {
    title: "Monte equipe e serviços",
    description: "Profissionais, duracoes, precos e categorias.",
    icon: UserAdd01Icon,
  },
  {
    title: "Organize a agenda",
    description: "Disponibilidade, atendimentos e confirmações.",
    icon: Calendar03Icon,
  },
  {
    title: "Publique o portal",
    description: "Seu cliente agenda pelo celular quando estiver pronto.",
    icon: ScissorIcon,
  },
]

export function WelcomeFlow({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user } = useAuth()
  const [activeDialog, setActiveDialog] = useState<ActiveDialog>("idle")
  const userEmail = user?.email ?? ""
  const storageKeys = getStorageKeys(userEmail)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const welcomeSeen = window.localStorage.getItem(storageKeys.welcome)
      const trialAcknowledged = window.localStorage.getItem(storageKeys.trial)

      if (!welcomeSeen) {
        setActiveDialog("welcome")
        return
      }

      if (!trialAcknowledged) {
        setActiveDialog("trial")
        return
      }

      setActiveDialog("none")
    })

    return () => window.cancelAnimationFrame(frame)
  }, [storageKeys.trial, storageKeys.welcome])

  function dismissWelcome() {
    window.localStorage.setItem(storageKeys.welcome, "true")
    setActiveDialog("none")

    const trialAcknowledged = window.localStorage.getItem(storageKeys.trial)
    if (!trialAcknowledged) {
      setTimeout(() => setActiveDialog("trial"), 360)
    }
  }

  function continueTrial() {
    window.localStorage.setItem(storageKeys.trial, "true")
    setActiveDialog("none")
  }

  function goToPlan() {
    window.localStorage.setItem(storageKeys.trial, "true")
    setActiveDialog("none")
    router.push("/escolher-plano")
  }

  if (activeDialog === "idle") return <>{children}</>

  return (
    <>
      <Dialog
        open={activeDialog === "welcome"}
        onOpenChange={(open) => {
          if (!open) dismissWelcome()
        }}
      >
        <DialogContent className="max-w-2xl overflow-hidden sm:rounded-[28px]">
          <DialogHeader className="border-0 px-5 pt-6 text-center sm:px-8 sm:pt-8">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HugeiconsIcon icon={GiftIcon} size={32} />
            </div>
            <DialogTitle className="mx-auto mt-3 max-w-md text-3xl leading-none font-extrabold tracking-[-0.03em]">
              Bem-vindo ao seu painel Bigood.
            </DialogTitle>
            <DialogDescription className="mx-auto mt-2 max-w-lg text-base leading-7">
              Antes da rotina comecar, siga um caminho curto para deixar sua
              barbearia pronta para operar.
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="px-5 pb-5 sm:px-8">
            <div className="grid gap-3 sm:grid-cols-2">
              {setupSteps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl border bg-muted/25 p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                      <HugeiconsIcon icon={step.icon} size={19} />
                    </span>
                    <div>
                      <p className="text-xs font-black tracking-[0.16em] text-muted-foreground uppercase">
                        0{index + 1}
                      </p>
                      <h3 className="mt-1 font-bold">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-3xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-background text-primary">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} />
                </span>
                <div>
                  <p className="font-bold text-primary">
                    O tutorial fica dentro do painel.
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    Você pode pular, voltar depois e configurar cada parte no
                    seu ritmo.
                  </p>
                </div>
              </div>
            </div>
          </DialogBody>

          <DialogFooter className="border-0 px-5 pb-5 sm:px-8 sm:pb-8">
            <Button onClick={dismissWelcome} className="h-11 rounded-full px-6">
              Comecar pelo painel
              <HugeiconsIcon icon={ArrowRight01Icon} size={17} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={activeDialog === "trial"}
        onOpenChange={(open) => {
          if (!open) continueTrial()
        }}
      >
        <DialogContent className="max-w-xl overflow-hidden sm:rounded-[28px]">
          <DialogHeader className="border-0 px-5 pt-6 text-center sm:px-8 sm:pt-8">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-[var(--landing-accent)] text-[var(--landing-primary-dark)]">
              <HugeiconsIcon icon={CrownIcon} size={31} />
            </div>
            <DialogTitle className="mx-auto mt-3 max-w-md text-3xl leading-none font-extrabold tracking-[-0.03em]">
              Você tem 30 dias gratuitos.
            </DialogTitle>
            <DialogDescription className="mx-auto mt-2 max-w-lg text-base leading-7">
              Explore o Bigood com todos os recursos liberados. Depois você
              escolhe um plano para continuar usando o painel.
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="px-5 pb-5 sm:px-8">
            <div className="grid gap-3 sm:grid-cols-[0.85fr_1fr]">
              <div className="rounded-3xl border bg-[linear-gradient(135deg,#d7ff26_0%,#efffc2_100%)] p-5 text-[var(--landing-primary-dark)]">
                <p className="text-sm font-black tracking-[0.16em] uppercase opacity-70">
                  Periodo inicial
                </p>
                <p className="mt-4 text-5xl font-black tracking-[-0.05em]">
                  30
                </p>
                <p className="mt-1 text-lg font-extrabold">dias gratuitos</p>
              </div>

              <div className="grid gap-2">
                {[
                  "Sem cartao no cadastro",
                  "Acesso ao painel completo",
                  "Planos disponiveis quando quiser assinar",
                  "Conta e pagamento nas configuracoes do dashboard",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-2xl border bg-muted/25 px-3 py-2 text-sm font-semibold"
                  >
                    <span className="size-2 rounded-full bg-primary" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </DialogBody>

          <DialogFooter className="grid gap-2 border-0 px-5 pb-5 sm:grid-cols-2 sm:px-8 sm:pb-8">
            <Button
              variant="outline"
              onClick={continueTrial}
              className="h-11 rounded-full"
            >
              Seguir com o teste
            </Button>
            <Button onClick={goToPlan} className="h-11 rounded-full">
              Assinar um plano
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {children}
    </>
  )
}

function getStorageKeys(email: string) {
  const suffix = email ? `.${email.toLowerCase()}` : ""

  return {
    welcome: `${WELCOME_STORAGE_KEY}${suffix}`,
    trial: `${TRIAL_STORAGE_KEY}${suffix}`,
  }
}
