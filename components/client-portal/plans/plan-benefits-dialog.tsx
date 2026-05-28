"use client"

import type { Plan } from "@/types/client-portal"
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/client-portal/mock-data"

interface PlanBenefitsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: Plan | null
}

export function PlanBenefitsDialog({ open, onOpenChange, plan }: PlanBenefitsDialogProps) {
  if (!plan) return null

  const coreBenefits = plan.benefits.filter((item) => !item.isExtra)
  const extraBenefits = plan.benefits.filter((item) => item.isExtra)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Beneficios de {plan.name}</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-4 text-sm">
          <section className="space-y-2">
            <h3 className="font-semibold">Servicos inclusos</h3>
            {coreBenefits.map((benefit) => {
              const finalValue = benefit.originalValue * (1 - benefit.discountPercent / 100)
              return (
                <article key={benefit.id} className="rounded-xl border bg-muted/20 p-3">
                  <p className="font-medium">{benefit.serviceName}</p>
                  <p className="text-xs text-muted-foreground">
                    Valor original: {formatCurrency(benefit.originalValue)}
                  </p>
                  <p className="text-xs text-muted-foreground">Desconto: {benefit.discountPercent}%</p>
                  <p className="text-xs text-muted-foreground">
                    Ciclos incluidos: {benefit.cyclesIncluded}
                  </p>
                  <p className="text-sm font-semibold">Valor no plano: {formatCurrency(finalValue)}</p>
                </article>
              )
            })}
          </section>
          <section className="space-y-2">
            <h3 className="font-semibold">Servicos extras com desconto</h3>
            {extraBenefits.length === 0 ? (
              <p className="text-xs text-muted-foreground">Sem servicos extras com desconto.</p>
            ) : (
              extraBenefits.map((benefit) => {
                const finalValue = benefit.originalValue * (1 - benefit.discountPercent / 100)
                return (
                  <article key={benefit.id} className="rounded-xl border bg-muted/20 p-3">
                    <p className="font-medium">{benefit.serviceName}</p>
                    <p className="text-xs text-muted-foreground">
                      Valor original: {formatCurrency(benefit.originalValue)}
                    </p>
                    <p className="text-xs text-muted-foreground">Desconto: {benefit.discountPercent}%</p>
                    <p className="text-sm font-semibold">Valor no plano: {formatCurrency(finalValue)}</p>
                  </article>
                )
              })
            )}
          </section>
        </DialogBody>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

