import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/client-portal/utils"

interface ServiceSummary {
  name: string
  price: number
  discountPercent: number | null
}

interface ConfirmationStepProps {
  barbershopName: string
  services: ServiceSummary[]
  professionalName: string
  dateLabel: string
  time: string
  usesPlanBenefit: boolean
}

export function ConfirmationStep({
  barbershopName,
  services,
  professionalName,
  dateLabel,
  time,
  usesPlanBenefit,
}: ConfirmationStepProps) {
  const totalOriginal = services.reduce((sum, s) => sum + s.price, 0)
  const totalSavings = services.reduce(
    (sum, s) =>
      sum +
      (s.discountPercent !== null
        ? Math.round((s.price * s.discountPercent) / 100)
        : 0),
    0
  )
  const totalPaid = totalOriginal - totalSavings

  return (
    <Card>
      <CardContent className="space-y-2 pt-4 text-sm">
        <InfoRow label="Barbearia" value={barbershopName} />

        <div className="rounded-xl border bg-muted/20 p-3">
          <p className="mb-1 text-xs text-muted-foreground">Serviços</p>
          {services.map((service, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-1"
            >
              <span className="font-medium">{service.name}</span>
              <div className="flex items-center gap-2">
                <span>{formatCurrency(service.price)}</span>
                {service.discountPercent !== null ? (
                  <Badge
                    variant="outline"
                    className="border-green-300 bg-green-50 text-green-700"
                  >
                    -{service.discountPercent}%
                  </Badge>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <InfoRow label="Profissional" value={professionalName} />
        <InfoRow label="Data" value={dateLabel} />
        <InfoRow label="Horário" value={time} />

        <div className="rounded-xl border bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">Benefício de plano</p>
          {usesPlanBenefit ? (
            <Badge className="mt-1">Aplicado</Badge>
          ) : (
            <p className="mt-1 font-medium">Não aplicado</p>
          )}
        </div>

        <div className="rounded-xl border bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">Valor final</p>
          {totalSavings > 0 ? (
            <>
              <p className="mt-0.5 text-xs text-muted-foreground line-through">
                {formatCurrency(totalOriginal)}
              </p>
              <p className="text-xs text-green-600">
                -{formatCurrency(totalSavings)}
              </p>
            </>
          ) : null}
          <p className="mt-1 text-base font-semibold">
            {formatCurrency(totalPaid)}
          </p>
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
