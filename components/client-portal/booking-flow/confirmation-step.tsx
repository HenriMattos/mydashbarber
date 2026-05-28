import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/client-portal/mock-data"

interface ConfirmationStepProps {
  barbershopName: string
  serviceName: string
  serviceValue: number
  serviceDuration: number
  professionalName: string
  dateLabel: string
  time: string
  usesPlanBenefit: boolean
}

export function ConfirmationStep({
  barbershopName,
  serviceName,
  serviceValue,
  serviceDuration,
  professionalName,
  dateLabel,
  time,
  usesPlanBenefit,
}: ConfirmationStepProps) {
  const finalValue = usesPlanBenefit ? 0 : serviceValue
  return (
    <Card>
      <CardContent className="space-y-2 pt-4 text-sm">
        <InfoRow label="Barbearia" value={barbershopName} />
        <InfoRow label="Servico" value={serviceName} />
        <InfoRow label="Valor" value={formatCurrency(serviceValue)} />
        <InfoRow label="Tempo estimado" value={`${serviceDuration} min`} />
        <InfoRow label="Profissional" value={professionalName} />
        <InfoRow label="Data" value={dateLabel} />
        <InfoRow label="Horario" value={time} />
        <div className="rounded-xl border bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">Beneficio de plano</p>
          {usesPlanBenefit ? (
            <Badge className="mt-1">Aplicado</Badge>
          ) : (
            <p className="mt-1 font-medium">Nao aplicado</p>
          )}
        </div>
        <div className="rounded-xl border bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">Valor final</p>
          <p className="mt-1 text-base font-semibold">{formatCurrency(finalValue)}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-muted/20 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  )
}

