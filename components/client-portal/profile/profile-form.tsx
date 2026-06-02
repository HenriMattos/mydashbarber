"use client"

import * as React from "react"
import { Camera, Loader2, Save, X } from "lucide-react"

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

  function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        updateField("avatarUrl", reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  function handleRemovePhoto() {
    updateField("avatarUrl", `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=random`)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSaving(true)
    setFeedback(null)
    await onSave(formData)
    setFeedback("Alterações salvas com sucesso.")
    setIsSaving(false)
    setTimeout(() => setFeedback(null), 2500)
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>Atualize seus dados pessoais e de contato.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Card de Foto de Perfil - Modelo do Dashboard */}
          <section className="overflow-hidden rounded-xl border bg-muted/20">
            <div className="flex flex-wrap items-baseline gap-2 border-b bg-card/50 px-4 py-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Foto de perfil</h3>
            </div>
            <div className="grid gap-5 p-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:p-5">
              <div className="grid place-items-center overflow-hidden rounded-2xl border bg-background size-24">
                <Avatar className="size-full rounded-none">
                  <AvatarImage src={formData.avatarUrl} alt={formData.fullName} className="object-cover" />
                  <AvatarFallback className="text-2xl rounded-none">
                    {formData.fullName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col gap-2.5 sm:flex-row sm:justify-end">
                <Button type="button" size="sm" asChild className="h-10 rounded-xl">
                  <label className="cursor-pointer">
                    <Camera className="mr-2 size-4" />
                    Alterar foto
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </Button>
                <Button type="button" variant="outline" size="sm" className="h-10 rounded-xl" onClick={handleRemovePhoto}>
                  <X className="mr-2 size-4" />
                  Remover
                </Button>
              </div>
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Field label="Nome completo *">
              <Input
                required
                value={formData.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                className="h-11 rounded-xl"
              />
            </Field>
            <Field label="Email *">
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="h-11 rounded-xl"
              />
            </Field>
            <Field label="Telefone *">
              <Input
                required
                value={formData.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="h-11 rounded-xl"
              />
            </Field>
            <Field label="Data de nascimento *">
              <Input
                required
                type="date"
                value={formData.birthDate}
                onChange={(event) => updateField("birthDate", event.target.value)}
                className="h-11 rounded-xl"
              />
            </Field>
            <Field label="CPF">
              <Input 
                value={formData.cpf} 
                onChange={(event) => updateField("cpf", event.target.value)} 
                className="h-11 rounded-xl"
              />
            </Field>
            <Field label="CEP">
              <Input 
                value={formData.cep} 
                onChange={(event) => updateField("cep", event.target.value)} 
                className="h-11 rounded-xl"
              />
            </Field>
            <Field label="Rua">
              <Input 
                value={formData.street} 
                onChange={(event) => updateField("street", event.target.value)} 
                className="h-11 rounded-xl"
              />
            </Field>
            <Field label="Número">
              <Input 
                value={formData.number} 
                onChange={(event) => updateField("number", event.target.value)} 
                className="h-11 rounded-xl"
              />
            </Field>
            <Field label="Complemento">
              <Input
                value={formData.complement}
                onChange={(event) => updateField("complement", event.target.value)}
                className="h-11 rounded-xl"
              />
            </Field>
            <Field label="Cidade">
              <Input 
                value={formData.city} 
                onChange={(event) => updateField("city", event.target.value)} 
                className="h-11 rounded-xl"
              />
            </Field>
            <Field label="Bairro">
              <Input 
                value={formData.district} 
                onChange={(event) => updateField("district", event.target.value)} 
                className="h-11 rounded-xl"
              />
            </Field>
            <Field label="Estado">
              <Input 
                value={formData.state} 
                onChange={(event) => updateField("state", event.target.value)} 
                className="h-11 rounded-xl"
              />
            </Field>
          </div>

          {feedback ? <p className="text-sm font-medium text-primary">{feedback}</p> : null}

          <Button type="submit" size="lg" className="w-full h-12 rounded-xl" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Salvar alterações
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
