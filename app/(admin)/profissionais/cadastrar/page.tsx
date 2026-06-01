/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, type ChangeEvent } from "react"
import { Delete02Icon, PlusSignIcon, UserAdd01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Camera, FileText, X } from "lucide-react"

import {
  formatCepInput,
  formatCnpjCpfInput,
  formatCnpjInput,
  formatCpfInput,
  formatDateInput,
  formatNumberInput,
  formatPhoneInput,
  formatUfInput,
} from "@/components/admin/client-input-formatters"
import { FormField, FormGrid } from "@/components/admin/responsive-form"
import { SectionCard } from "@/components/admin/section-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const professionalTypeOptions = ["PROFISSIONAL", "ADMIN"]
const professionalGroupOptions = ["Profissionais", "Administradores"]
const professionalBranchOptions = ["Matriz", "Unidade principal"]

export default function CadastrarProfissionalPage() {
  const [birthday, setBirthday] = useState("")
  const [documentType, setDocumentType] = useState<"CPF" | "CNPJ">("CPF")
  const [document, setDocument] = useState("")
  const [phone, setPhone] = useState("")
  const [pixKey, setPixKey] = useState("")
  const [cep, setCep] = useState("")
  const [state, setState] = useState("")
  const [number, setNumber] = useState("")
  const [emergencyPhone, setEmergencyPhone] = useState("")
  const [type, setType] = useState(professionalTypeOptions[0])
  const [group, setGroup] = useState(professionalGroupOptions[0])
  const [branch, setBranch] = useState(professionalBranchOptions[0])
  const [photoUrl, setPhotoUrl] = useState("")
  const [contractName, setContractName] = useState("")
  const [contractFileUrl, setContractFileUrl] = useState("")
  const [contracts, setContracts] = useState<{ id: string; name: string; fileUrl: string }[]>([])

  function handlePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== "string") return
      setPhotoUrl(reader.result)
      event.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  function handleContractFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== "string") return
      setContractFileUrl(reader.result)
      event.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  function addContract() {
    if (!contractName || !contractFileUrl) return
    setContracts((prev) => [
      ...prev,
      {
        id: `contract-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        name: contractName,
        fileUrl: contractFileUrl,
      },
    ])
    setContractName("")
    setContractFileUrl("")
  }

  function removeContract(id: string) {
    setContracts((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <SectionCard
      title="Criar novo usuário"
      description="Dados. Preencha todos os campos obrigatórios."
      action={
        <Button size="sm">
          <HugeiconsIcon icon={UserAdd01Icon} size={16} />
          Salvar usuário
        </Button>
      }
    >
      <div className="grid gap-5">
        <FormGrid>
          <FormField label="Nome Completo *">
            <Input placeholder="Nome completo" />
          </FormField>
          <FormField label="Nome no APP *">
            <Input placeholder="Nome exibido no app" />
          </FormField>
          <FormField label="CPF / CNPJ">
            <div className="flex gap-2">
              <Select value={documentType} onValueChange={(value) => setDocumentType(value as "CPF" | "CNPJ")}>
                <SelectTrigger className="w-20 shrink-0"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="CPF">CPF</SelectItem>
                  <SelectItem value="CNPJ">CNPJ</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={document}
                inputMode="numeric"
                placeholder={documentType === "CPF" ? "000.000.000-00" : "00.000.000/0000-00"}
                onChange={(event) => setDocument(formatCnpjCpfInput(event.target.value))}
              />
            </div>
          </FormField>
          <FormField label="Data de nascimento">
            <Input
              value={birthday}
              inputMode="numeric"
              placeholder="dd/mm/aaaa"
              onChange={(event) => setBirthday(formatDateInput(event.target.value))}
            />
          </FormField>
          <FormField label="Email *">
            <Input type="email" placeholder="email@usuário.com" />
          </FormField>
          <FormField label="Senha *">
            <Input type="password" placeholder="Senha" />
          </FormField>
          <FormField label="Tipo *">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {professionalTypeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Grupo *">
            <Select value={group} onValueChange={setGroup}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {professionalGroupOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Filial *">
            <Select value={branch} onValueChange={setBranch}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {professionalBranchOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Telefone *">
            <Input
              value={phone}
              inputMode="tel"
              placeholder="(00) 00000-0000"
              onChange={(event) => setPhone(formatPhoneInput(event.target.value))}
            />
          </FormField>
          <FormField label="Chave Pix *">
            <Input
              value={pixKey}
              placeholder="CPF, telefone, e-mail ou chave aleatória"
              onChange={(event) => setPixKey(event.target.value)}
            />
          </FormField>
          <div className="rounded-md border bg-muted/20 px-3 py-2 sm:col-span-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Checkbox />
              <span>Possui acesso à dados de filiais?</span>
            </label>
          </div>
          <FormField label="CEP *">
            <Input
              value={cep}
              inputMode="numeric"
              placeholder="00000-000"
              onChange={(event) => setCep(formatCepInput(event.target.value))}
            />
          </FormField>
          <FormField label="Logradouro *">
            <Input placeholder="Rua / Avenida" />
          </FormField>
          <FormField label="Bairro *">
            <Input placeholder="Bairro" />
          </FormField>
          <FormField label="Cidade *">
            <Input placeholder="Cidade" />
          </FormField>
          <FormField label="UF *">
            <Input
              value={state}
              placeholder="UF"
              onChange={(event) => setState(formatUfInput(event.target.value))}
            />
          </FormField>
          <FormField label="Número *">
            <Input
              value={number}
              inputMode="numeric"
              placeholder="Número"
              onChange={(event) => setNumber(formatNumberInput(event.target.value))}
            />
          </FormField>
          <FormField label="Complemento">
            <Input placeholder="Complemento" />
          </FormField>
        </FormGrid>

        <PhotoUploadSection
          imageUrl={photoUrl}
          onUpload={handlePhotoUpload}
          onRemove={() => setPhotoUrl("")}
        />

        <section className="grid gap-3 rounded-md border bg-muted/20 p-3">
          <h3 className="text-sm font-semibold">Contatos de emergência</h3>
          <p className="text-sm text-muted-foreground">
            Contatos de emergência adicionados.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <FormField label="Nome *">
              <Input placeholder="Nome do contato" />
            </FormField>
            <FormField label="Telefone *">
              <Input
                value={emergencyPhone}
                inputMode="tel"
                placeholder="(00) 00000-0000"
                onChange={(event) =>
                  setEmergencyPhone(formatPhoneInput(event.target.value))
                }
              />
            </FormField>
          </div>
          <p className="text-sm text-muted-foreground">Nenhum contato adicionado!</p>
        </section>

        <section className="grid gap-3 rounded-md border bg-muted/20 p-3">
          <h3 className="text-sm font-semibold">Contratos</h3>
          <p className="text-sm text-muted-foreground">Contratos adicionados.</p>
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(10rem,1fr)_3rem]">
            <FormField label="Nome do contrato *">
              <Input value={contractName} onChange={(event) => setContractName(event.target.value)} placeholder="Nome do contrato" />
            </FormField>
            <div className="flex items-end gap-2">
              {contractFileUrl ? (
                <span className="truncate text-sm text-muted-foreground">{contractFileUrl.split(",")[0].slice(0, 30)}...</span>
              ) : null}
              <Button type="button" variant="outline" size="sm" asChild className="shrink-0">
                <label>
                  <FileText className="size-4" />
                  {contractFileUrl ? "Trocar" : "Selecionar"}
                  <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="sr-only" onChange={handleContractFileUpload} />
                </label>
              </Button>
            </div>
            <Button type="button" size="icon-sm" className="mt-auto w-full lg:w-8" onClick={addContract} aria-label="Adicionar contrato">
              <HugeiconsIcon icon={PlusSignIcon} size={14} />
            </Button>
          </div>
          {contracts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum contrato adicionado!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-3 py-2 font-semibold">Nome</th>
                    <th className="px-3 py-2 font-semibold">Arquivo</th>
                    <th className="px-3 py-2 font-semibold">Opções</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="border-b">
                      <td className="px-3 py-2">{contract.name}</td>
                      <td className="px-3 py-2">
                        <a href={contract.fileUrl} download={contract.name} className="text-blue-600 underline">
                          Download
                        </a>
                      </td>
                      <td className="px-3 py-2">
                        <Button size="icon-sm" variant="destructive" onClick={() => removeContract(contract.id)} aria-label="Remover">
                          <HugeiconsIcon icon={Delete02Icon} size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button>Salvar usuário</Button>
          <Button variant="outline">Cancelar</Button>
        </div>
      </div>
    </SectionCard>
  )
}

function PhotoUploadSection({
  imageUrl,
  onUpload,
  onRemove,
}: {
  imageUrl: string
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
}) {
  return (
    <section className="overflow-hidden rounded-lg border bg-muted/10">
      <div className="flex flex-wrap items-center gap-1.5 border-b px-4 py-3">
        <h3 className="text-sm font-semibold">Foto</h3>
        <p className="text-sm text-muted-foreground">Foto de perfil.</p>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
        <div className="grid size-24 place-items-center overflow-hidden rounded-md border bg-background">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Foto de perfil"
              className="size-full object-cover"
            />
          ) : (
            <span className="text-xs font-medium text-muted-foreground">
              Sem foto
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" asChild>
            <label>
              <Camera className="size-4" />
              Adicionar foto
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onUpload}
              />
            </label>
          </Button>
          <Button type="button" variant="outline" onClick={onRemove}>
            <X className="size-4" />
            Remover
          </Button>
        </div>
      </div>
    </section>
  )
}
