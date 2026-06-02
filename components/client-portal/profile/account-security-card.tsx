import * as React from "react"
import { ShieldCheck, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { PasswordInput } from "@/components/auth/PasswordInput"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface AccountSecurityCardProps {
  twoFactorEnabled: boolean
  onToggleTwoFactor: (checked: boolean) => void
  onChangePassword: () => void
}

export function AccountSecurityCard({
  twoFactorEnabled,
  onToggleTwoFactor,
}: AccountSecurityCardProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [passwords, setPasswords] = React.useState({ current: "", next: "", confirm: "" })

  async function handleUpdatePassword() {
    if (!passwords.current || !passwords.next || !passwords.confirm) {
      toast.error("Preencha todos os campos.")
      return
    }
    if (passwords.next !== passwords.confirm) {
      toast.error("As senhas não conferem.")
      return
    }

    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    toast.success("Senha alterada com sucesso!")
    setIsSaving(false)
    setIsDialogOpen(false)
    setPasswords({ current: "", next: "", confirm: "" })
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="size-4" />
            Segurança da conta
          </CardTitle>
          <CardDescription>Gerencie senha e autenticação em dois fatores.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="rounded-xl border bg-muted/20 p-3">
            <p className="text-xs text-muted-foreground">Senha</p>
            <p className="font-medium">••••••••</p>
          </div>
          <div className="flex items-center justify-between rounded-xl border bg-muted/20 p-3">
            <div>
              <p className="font-medium">Autenticação em dois fatores</p>
              <p className="text-xs text-muted-foreground">Camada extra para proteger sua conta.</p>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={onToggleTwoFactor} />
          </div>
          <Button type="button" variant="outline" className="w-full" onClick={() => setIsDialogOpen(true)}>
            Alterar senha
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Alterar senha</DialogTitle>
            <DialogDescription>
              Crie uma nova senha forte para proteger sua conta.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-pass">Senha atual</Label>
              <PasswordInput
                id="current-pass"
                value={passwords.current}
                onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pass">Nova senha</Label>
              <PasswordInput
                id="new-pass"
                value={passwords.next}
                onChange={(e) => setPasswords({ ...passwords, next: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-pass">Confirmar nova senha</Label>
              <PasswordInput
                id="confirm-pass"
                value={passwords.confirm}
                onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSaving}>
              Cancelar
            </Button>
            <Button onClick={handleUpdatePassword} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Atualizar senha"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

