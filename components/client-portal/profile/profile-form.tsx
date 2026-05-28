"use client"

import * as React from "react"
import { Loader2, Save } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Client } from "@/types/client-portal"

interface ProfileFormProps {
  client: Client
  onSave: (client: Client) => Promise<void>
}

export function ProfileForm({ client, onSave }: ProfileFormProps) {
  const [formData, setFormData] = React.useState<Client>(client)
  const [isSaving, setIsSaving] = React.useState(false)
  const [feedback, setFeedback] = React.useState<string | null>(null)

  function updateField<Key extends keyof Client>(field: Key, value: Client[Key]) {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setFeedback(null)
    await onSave(formData)
    setFeedback("Alteracoes salvas com sucesso.")
    setIsSaving(false)
    setTimeout(() => setFeedback(null), 2500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>Atualize seus dados pessoais e de contato.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-3 rounded-xl border bg-muted/20 p-3 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
            <Avatar className="size-14">
              <AvatarImage src={formData.avatarUrl} alt={formData.fullName} />
              <AvatarFallback>{formData.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <p className="text-sm font-semibold">Foto de perfil</p>
              <Input
                value={formData.avatarUrl}
                onChange={(event) => updateField("avatarUrl", event.target.value)}
                placeholder="URL da imagem"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Field label="Nome completo *">
              <Input
                required
                value={formData.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
              />
            </Field>
            <Field label="Email *">
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
            </Field>
            <Field label="Telefone *">
              <Input
                required
                value={formData.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </Field>
            <Field label="Data nascimento *">
              <Input
                required
                type="date"
                value={formData.birthDate}
                onChange={(event) => updateField("birthDate", event.target.value)}
              />
            </Field>
            <Field label="CPF">
              <Input value={formData.cpf} onChange={(event) => updateField("cpf", event.target.value)} />
            </Field>
            <Field label="CEP">
              <Input value={formData.cep} onChange={(event) => updateField("cep", event.target.value)} />
            </Field>
            <Field label="Rua">
              <Input value={formData.street} onChange={(event) => updateField("street", event.target.value)} />
            </Field>
            <Field label="Numero">
              <Input value={formData.number} onChange={(event) => updateField("number", event.target.value)} />
            </Field>
            <Field label="Complemento">
              <Input
                value={formData.complement}
                onChange={(event) => updateField("complement", event.target.value)}
              />
            </Field>
            <Field label="Cidade">
              <Input value={formData.city} onChange={(event) => updateField("city", event.target.value)} />
            </Field>
            <Field label="Bairro">
              <Input value={formData.district} onChange={(event) => updateField("district", event.target.value)} />
            </Field>
            <Field label="Estado">
              <Input value={formData.state} onChange={(event) => updateField("state", event.target.value)} />
            </Field>
          </div>

          {feedback ? <p className="text-sm text-primary">{feedback}</p> : null}

          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Salvar alteracoes
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1.5">
      <Label>{label}</Label>
      {children}
    </label>
  )
}
