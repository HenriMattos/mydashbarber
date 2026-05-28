"use client"

import { useMemo, useState, type ReactNode } from "react"
import {
  Delete02Icon,
  PencilEdit02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { clients as initialClients } from "@/components/admin/clientes-data"
import {
  formatCepInput,
  formatCpfInput,
  formatDateInput,
  formatNumberInput,
  formatPhoneInput,
  formatUfInput,
} from "@/components/admin/client-input-formatters"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import type { Client } from "@/types"

type ClientEditDraft = {
  name: string
  email: string
  howKnown: string
  password: string
  phone: string
  birthday: string
  cpf: string
  cep: string
  street: string
  neighborhood: string
  city: string
  state: string
  number: string
  complement: string
  notes: string
  rememberOnSchedule: boolean
}

export function ClientesListManager() {
  const [items, setItems] = useState<Client[]>(initialClients)
  const [query, setQuery] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<ClientEditDraft | null>(null)

  const filteredItems = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return items

    return items.filter((client) => {
      return (
        client.name.toLowerCase().includes(term) ||
        String(client.id).includes(term) ||
        client.email.toLowerCase().includes(term)
      )
    })
  }, [items, query])

  function removeClient(clientId: number) {
    if (!window.confirm("Deseja remover este cliente?")) return
    setItems((current) => current.filter((client) => client.id !== clientId))
  }

  function openEditModal(client: Client) {
    setEditingId(client.id)
    setDraft({
      name: client.name,
      email: client.email,
      howKnown: getHowKnownLabel(client.origin),
      password: "********",
      phone: client.phone,
      birthday: client.birthday ?? "",
      cpf: "",
      cep: "",
      street: "",
      neighborhood: "",
      city: "",
      state: "",
      number: "",
      complement: "",
      notes: client.internalNotes ?? "",
      rememberOnSchedule: false,
    })
  }

  function closeEditModal() {
    setEditingId(null)
    setDraft(null)
  }

  function saveClientEdit() {
    if (!draft || editingId === null) return

    setItems((current) =>
      current.map((client) =>
        client.id === editingId
          ? {
              ...client,
              name: draft.name.trim(),
              email: draft.email.trim(),
              phone: draft.phone.trim(),
              birthday: draft.birthday.trim() || undefined,
              internalNotes: draft.notes.trim() || undefined,
            }
          : client
      )
    )
    closeEditModal()
  }

  function updateDraft<Key extends keyof ClientEditDraft>(
    key: Key,
    value: ClientEditDraft[Key]
  ) {
    setDraft((current) => (current ? { ...current, [key]: value } : current))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="relative w-full lg:flex-1 lg:px-2">
          <HugeiconsIcon
            icon={Search01Icon}
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pesquise..."
            className="pl-9"
          />
        </div>
        <Button
          size="sm"
          variant="outline"
          className="lg:shrink-0"
          onClick={() => window.alert("Exportação em breve.")}
        >
          Exportar dados
        </Button>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/30 text-left">
            <tr>
              <th className="px-3 py-2 font-semibold">ID</th>
              <th className="px-3 py-2 font-semibold">Nome</th>
              <th className="px-3 py-2 font-semibold">Criado em</th>
              <th className="px-3 py-2 font-semibold">Atualizado em</th>
              <th className="px-3 py-2 font-semibold text-right">Opções</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td className="px-3 py-6 text-center text-muted-foreground" colSpan={5}>
                  Nenhum cliente encontrado.
                </td>
              </tr>
            ) : (
              filteredItems.map((client, index) => (
                <tr key={client.id} className="border-t">
                  <td className="px-3 py-2">{client.id}</td>
                  <td className="px-3 py-2 font-medium">{client.name}</td>
                  <td className="px-3 py-2">{formatDateTime(client.createdAt, index)}</td>
                  <td className="px-3 py-2">
                    {formatDateTime(client.nextAppointmentAt ?? client.lastVisit, index + 1)}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="icon-sm"
                        variant="outline"
                        onClick={() => openEditModal(client)}
                        aria-label={`Editar ${client.name}`}
                      >
                        <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="destructive"
                        onClick={() => removeClient(client.id)}
                        aria-label={`Remover ${client.name}`}
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={editingId !== null}
        onOpenChange={(open) => !open && closeEditModal()}
      >
        <DialogContent className="sm:h-[min(44rem,calc(100dvh-2rem))] sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar cliente</DialogTitle>
            <DialogDescription>
              Dados. Preencha todos os campos obrigatórios.
            </DialogDescription>
          </DialogHeader>

          {draft ? (
            <ScrollArea className="min-h-0 flex-1">
              <div className="grid gap-3 p-4 sm:grid-cols-2">
                <EditField label="Nome *">
                  <Input
                    value={draft.name}
                    onChange={(event) => updateDraft("name", event.target.value)}
                  />
                </EditField>
                <EditField label="Email *">
                  <Input
                    value={draft.email}
                    type="email"
                    onChange={(event) => updateDraft("email", event.target.value)}
                  />
                </EditField>
                <EditField label="Como conheceu *">
                  <Input
                    value={draft.howKnown}
                    onChange={(event) => updateDraft("howKnown", event.target.value)}
                  />
                </EditField>
                <EditField label="Senha *">
                  <Input
                    value={draft.password}
                    type="password"
                    onChange={(event) => updateDraft("password", event.target.value)}
                  />
                </EditField>
                <EditField label="Telefone *">
                  <Input
                    value={draft.phone}
                    inputMode="tel"
                    onChange={(event) =>
                      updateDraft("phone", formatPhoneInput(event.target.value))
                    }
                  />
                </EditField>
                <EditField label="Data nascimento *">
                  <Input
                    value={draft.birthday}
                    placeholder="dd/mm/aaaa"
                    inputMode="numeric"
                    onChange={(event) =>
                      updateDraft("birthday", formatDateInput(event.target.value))
                    }
                  />
                </EditField>
                <EditField label="CPF">
                  <Input
                    value={draft.cpf}
                    inputMode="numeric"
                    onChange={(event) =>
                      updateDraft("cpf", formatCpfInput(event.target.value))
                    }
                  />
                </EditField>
                <EditField label="CEP">
                  <Input
                    value={draft.cep}
                    inputMode="numeric"
                    onChange={(event) =>
                      updateDraft("cep", formatCepInput(event.target.value))
                    }
                  />
                </EditField>
                <EditField label="Logradouro">
                  <Input
                    value={draft.street}
                    onChange={(event) => updateDraft("street", event.target.value)}
                  />
                </EditField>
                <EditField label="Bairro">
                  <Input
                    value={draft.neighborhood}
                    onChange={(event) =>
                      updateDraft("neighborhood", event.target.value)
                    }
                  />
                </EditField>
                <EditField label="Cidade">
                  <Input
                    value={draft.city}
                    onChange={(event) => updateDraft("city", event.target.value)}
                  />
                </EditField>
                <EditField label="UF">
                  <Input
                    value={draft.state}
                    onChange={(event) =>
                      updateDraft("state", formatUfInput(event.target.value))
                    }
                  />
                </EditField>
                <EditField label="Número">
                  <Input
                    value={draft.number}
                    inputMode="numeric"
                    onChange={(event) =>
                      updateDraft("number", formatNumberInput(event.target.value))
                    }
                  />
                </EditField>
                <EditField label="Complemento">
                  <Input
                    value={draft.complement}
                    onChange={(event) =>
                      updateDraft("complement", event.target.value)
                    }
                  />
                </EditField>
                <div className="grid gap-1.5 sm:col-span-2">
                  <Label>Notas do cliente</Label>
                  <Textarea
                    value={draft.notes}
                    placeholder="Notas do cliente"
                    className="min-h-24"
                    onChange={(event) => updateDraft("notes", event.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2 rounded-md border bg-muted/20 px-3 py-2 sm:col-span-2">
                  <Checkbox
                    id="edit-remember-schedule"
                    checked={draft.rememberOnSchedule}
                    onCheckedChange={(checked) =>
                      updateDraft("rememberOnSchedule", checked === true)
                    }
                  />
                  <Label
                    htmlFor="edit-remember-schedule"
                    className="text-sm font-medium"
                  >
                    Lembrar ao agendar
                  </Label>
                </div>
              </div>
            </ScrollArea>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={closeEditModal}>
              Cancelar
            </Button>
            <Button onClick={saveClientEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function formatDateTime(dateInput: string, minuteOffset = 0) {
  const date = parseDateInput(dateInput)
  date.setHours(9, minuteOffset % 60, 0, 0)

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function parseDateInput(value: string) {
  const parts = value.split("-").map(Number)
  if (parts.length === 3 && parts.every((part) => Number.isFinite(part))) {
    const [year, month, day] = parts
    return new Date(year, month - 1, day)
  }

  return new Date()
}

function EditField({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function getHowKnownLabel(origin: Client["origin"]) {
  const labels: Record<NonNullable<Client["origin"]>, string> = {
    indicacao: "Indicação",
    instagram: "Instagram",
    whatsapp: "WhatsApp",
    campanha: "Campanha",
    passou_na_frente: "Passou na frente",
    portal: "Portal",
    outro: "Outro",
  }

  return origin ? labels[origin] : ""
}
