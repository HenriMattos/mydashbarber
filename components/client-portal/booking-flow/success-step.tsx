import { CircleCheckBig } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface SuccessStepProps {
  serviceName: string
  dateLabel: string
  time: string
  professionalName: string
  onGoHome: () => void
}

export function SuccessStep({
  serviceName,
  dateLabel,
  time,
  professionalName,
  onGoHome,
}: SuccessStepProps) {
  return (
    <Card>
      <CardContent className="space-y-3 pt-6 text-center">
        <CircleCheckBig className="mx-auto size-12 text-primary" />
        <h3 className="text-lg font-semibold">Agendamento confirmado</h3>
        <p className="text-sm text-muted-foreground">
          {serviceName} com {professionalName} em {dateLabel}, {time}.
        </p>
        <Button type="button" className="w-full" onClick={onGoHome}>
          Voltar para inicio
        </Button>
      </CardContent>
    </Card>
  )
}

