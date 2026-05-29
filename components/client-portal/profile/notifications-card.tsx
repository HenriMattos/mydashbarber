import { BellRing } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import type { PortalNotificationSettings } from "@/types/client-portal"

interface NotificationsCardProps {
  value: PortalNotificationSettings
  onChange: (value: PortalNotificationSettings) => void
}

export function NotificationsCard({ value, onChange }: NotificationsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <BellRing className="size-4" />
          Notificacoes
        </CardTitle>
        <CardDescription>Escolha quais atualizacoes deseja receber.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <NotificationRow
          label="Confirmacao de agendamento"
          checked={value.appointmentConfirmation}
          onCheckedChange={(checked) =>
            onChange({ ...value, appointmentConfirmation: checked })
          }
        />
        <NotificationRow
          label="Lembrete antes do horário"
          checked={value.appointmentReminder}
          onCheckedChange={(checked) => onChange({ ...value, appointmentReminder: checked })}
        />
        <NotificationRow
          label="Promocoes e novidades"
          checked={value.offersAndNews}
          onCheckedChange={(checked) => onChange({ ...value, offersAndNews: checked })}
        />
        <NotificationRow
          label="Atualizacoes de plano"
          checked={value.planUpdates}
          onCheckedChange={(checked) => onChange({ ...value, planUpdates: checked })}
        />
      </CardContent>
    </Card>
  )
}

function NotificationRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-3">
      <span className="text-sm font-medium">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

