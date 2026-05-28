import { ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

interface AccountSecurityCardProps {
  twoFactorEnabled: boolean
  onToggleTwoFactor: (checked: boolean) => void
  onChangePassword: () => void
}

export function AccountSecurityCard({
  twoFactorEnabled,
  onToggleTwoFactor,
  onChangePassword,
}: AccountSecurityCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="size-4" />
          Seguranca da conta
        </CardTitle>
        <CardDescription>Gerencie senha e autenticacao em dois fatores.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="rounded-xl border bg-muted/20 p-3">
          <p className="text-xs text-muted-foreground">Senha</p>
          <p className="font-medium">••••••••</p>
        </div>
        <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-3">
          <div>
            <p className="font-medium">Autenticacao em dois fatores</p>
            <p className="text-xs text-muted-foreground">Camada extra para proteger sua conta.</p>
          </div>
          <Switch checked={twoFactorEnabled} onCheckedChange={onToggleTwoFactor} />
        </div>
        <Button type="button" variant="outline" className="w-full" onClick={onChangePassword}>
          Alterar senha
        </Button>
      </CardContent>
    </Card>
  )
}

