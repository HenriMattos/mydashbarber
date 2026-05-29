"use client"

import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface AppointmentDetailsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointmentId: string
  serviceName: string
  dateLabel: string
  time: string
  professionalName: string
  statusLabel: string
  originalValue: string
  paidValue: string
  usedPlanBenefit: boolean
  notes?: string
}

export function AppointmentDetailsDialog({
  open,
  onOpenChange,
  appointmentId,
  serviceName,
  dateLabel,
  time,
  professionalName,
  statusLabel,
  originalValue,
  paidValue,
  usedPlanBenefit,
  notes,
}: AppointmentDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do agendamento</DialogTitle>
        </DialogHeader>
        <DialogBody className="space-y-3 text-sm">
          <InfoRow label="Serviço" value={serviceName} />
          <InfoRow label="Data" value={dateLabel} />
          <InfoRow label="Horário" value={time} />
          <InfoRow label="Profissional" value={professionalName} />
          <InfoRow label="Status" value={statusLabel} />
          <InfoRow label="Valor original" value={originalValue} />
          <InfoRow label="Valor pago" value={paidValue} />
          <InfoRow
            label="Benefício do plano"
            value={usedPlanBenefit ? "Sim, benefício aplicado" : "Não utilizado"}
          />
          <InfoRow label="Observações" value={notes || "Sem observações"} />
          <InfoRow label="Codigo" value={appointmentId} />
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  )
}

