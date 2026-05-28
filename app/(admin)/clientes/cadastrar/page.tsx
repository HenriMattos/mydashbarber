"use client"

import Link from "next/link"
import { useState } from "react"
import { UserAdd01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  formatCepInput,
  formatCpfInput,
  formatDateInput,
  formatNumberInput,
  formatPhoneInput,
  formatUfInput,
} from "@/components/admin/client-input-formatters"
import { SectionCard } from "@/components/admin/section-card"
import { FormField, FormGrid } from "@/components/admin/responsive-form"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function CadastrarClientePage() {
  const [phone, setPhone] = useState("")
  const [birthday, setBirthday] = useState("")
  const [cpf, setCpf] = useState("")
  const [cep, setCep] = useState("")
  const [state, setState] = useState("")
  const [number, setNumber] = useState("")

  return (
    <SectionCard
      title="Criar novo cliente"
      description="Dados. Preencha todos os campos obrigatórios."
      action={
        <Button size="sm">
          <HugeiconsIcon icon={UserAdd01Icon} size={16} />
          Salvar cliente
        </Button>
      }
    >
      <div className="grid gap-5">
        <FormGrid>
          <FormField label="Nome *">
            <Input placeholder="Nome completo" />
          </FormField>
          <FormField label="Email *">
            <Input type="email" placeholder="email@cliente.com" />
          </FormField>
          <FormField label="Como conheceu *">
            <Input placeholder="Ex.: Indicação" />
          </FormField>
          <FormField label="Senha *">
            <Input type="password" placeholder="Senha de acesso" />
          </FormField>
          <FormField label="Telefone *">
            <Input
              value={phone}
              inputMode="tel"
              placeholder="(00) 00000-0000"
              onChange={(event) =>
                setPhone(formatPhoneInput(event.target.value))
              }
            />
          </FormField>
          <FormField label="Data nascimento *">
            <Input
              value={birthday}
              inputMode="numeric"
              placeholder="dd/mm/aaaa"
              onChange={(event) =>
                setBirthday(formatDateInput(event.target.value))
              }
            />
          </FormField>
          <FormField label="CPF">
            <Input
              value={cpf}
              inputMode="numeric"
              placeholder="000.000.000-00"
              onChange={(event) => setCpf(formatCpfInput(event.target.value))}
            />
          </FormField>
          <FormField label="CEP">
            <Input
              value={cep}
              inputMode="numeric"
              placeholder="00000-000"
              onChange={(event) => setCep(formatCepInput(event.target.value))}
            />
          </FormField>
          <FormField label="Logradouro">
            <Input placeholder="Rua / Avenida" />
          </FormField>
          <FormField label="Bairro">
            <Input placeholder="Bairro" />
          </FormField>
          <FormField label="Cidade">
            <Input placeholder="Cidade" />
          </FormField>
          <FormField label="UF">
            <Input
              value={state}
              placeholder="UF"
              onChange={(event) => setState(formatUfInput(event.target.value))}
            />
          </FormField>
          <FormField label="Número">
            <Input
              value={number}
              inputMode="numeric"
              placeholder="Número"
              onChange={(event) =>
                setNumber(formatNumberInput(event.target.value))
              }
            />
          </FormField>
          <FormField label="Complemento">
            <Input placeholder="Complemento" />
          </FormField>
        </FormGrid>

        <FormField label="Notas do cliente">
          <Textarea
            className="min-h-28"
            placeholder="Notas do cliente"
          />
        </FormField>

        <div className="flex items-center gap-2 rounded-md border bg-muted/20 px-3 py-2">
          <Checkbox id="remember-schedule" />
          <Label htmlFor="remember-schedule" className="text-sm font-medium">
            Lembrar ao agendar
          </Label>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button>Salvar cliente</Button>
          <Button variant="outline" asChild>
            <Link href="/clientes">Voltar para clientes</Link>
          </Button>
        </div>
      </div>
    </SectionCard>
  )
}
