"use client"

import { useMemo, useState, type ReactNode } from "react"
import {
  Building02Icon,
  Delete02Icon,
  PencilEdit02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  formatCepInput,
  formatNumberInput,
  formatPhoneInput,
  formatUfInput,
} from "@/components/admin/client-input-formatters"
import { SectionCard } from "@/components/admin/section-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Branch = {
  id: number
  neighborhood: string
  createdAt: string
  updatedAt: string
  email: string
  phone: string
  cep: string
  street: string
  city: string
  state: string
  number: string
  complement: string
  hidden: boolean
  paymentsEnabled: boolean
}

const initialBranches: Branch[] = [
  {
    id: 3656,
    neighborhood: "Flores",
    createdAt: "2025-07-09T15:30:00",
    updatedAt: "2026-05-25T03:11:00",
    email: "paulojeanbarbeiro@gmail.com",
    phone: "5592994592664",
    cep: "69028335",
    street: "Rua Pitágoras",
    city: "Manaus",
    state: "AM",
    number: "81",
    complement: "",
    hidden: false,
    paymentsEnabled: true,
  },
]

export function CompanyBranchesView() {
  const [branches, setBranches] = useState<Branch[]>(initialBranches)
  const [query, setQuery] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<Branch | null>(null)

  const filteredBranches = useMemo(() => {
    const term = normalize(query)
    if (!term) return branches

    return branches.filter((branch) => {
      return (
        String(branch.id).includes(term) ||
        normalize(branch.neighborhood).includes(term) ||
        normalize(branch.email).includes(term) ||
        normalize(branch.city).includes(term)
      )
    })
  }, [branches, query])

  function openEdit(branch: Branch) {
    setEditingId(branch.id)
    setDraft({ ...branch })
  }

  function closeEdit() {
    setEditingId(null)
    setDraft(null)
  }

  function updateDraft<Key extends keyof Branch>(key: Key, value: Branch[Key]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current))
  }

  function saveBranch() {
    if (!draft || editingId === null) return

    setBranches((current) =>
      current.map((branch) =>
        branch.id === editingId
          ? {
              ...draft,
              neighborhood: draft.neighborhood.trim(),
              updatedAt: new Date().toISOString(),
            }
          : branch
      )
    )
    closeEdit()
  }

  function addBranch() {
    const nextId = Math.max(...branches.map((branch) => branch.id), 3655) + 1
    const nextBranch: Branch = {
      ...initialBranches[0],
      id: nextId,
      neighborhood: "Nova filial",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setBranches((current) => [nextBranch, ...current])
    openEdit(nextBranch)
  }

  function removeBranch(branch: Branch) {
    if (!window.confirm(`Deseja remover a filial ${branch.neighborhood}?`)) return
    setBranches((current) => current.filter((item) => item.id !== branch.id))
  }

  return (
    <>
      <SectionCard
        title="Registros Ativos"
        description="Filiais do sistema."
        action={
          <Button size="sm" onClick={addBranch}>
            <HugeiconsIcon icon={Building02Icon} size={16} />
            Nova filial
          </Button>
        }
      >
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
              onClick={() => exportBranchesCsv(filteredBranches)}
            >
              Exportar dados
            </Button>
          </div>

          <div className="grid gap-2 md:hidden">
            {filteredBranches.length === 0 ? (
              <div className="rounded-md border bg-muted/20 px-3 py-6 text-center text-sm text-muted-foreground">
                Nenhuma filial encontrada.
              </div>
            ) : (
              filteredBranches.map((branch) => (
                <article
                  key={branch.id}
                  className="min-w-0 rounded-md border bg-background p-3"
                >
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">
                        ID {branch.id}
                      </p>
                      <h3 className="mt-1 truncate text-sm font-semibold">
                        {branch.neighborhood}
                      </h3>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {branch.city}, {branch.state}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <Button
                        size="icon-sm"
                        variant="outline"
                        onClick={() => openEdit(branch)}
                        aria-label={`Editar filial ${branch.neighborhood}`}
                      >
                        <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
                      </Button>
                      <Button
                        size="icon-sm"
                        variant="destructive"
                        onClick={() => removeBranch(branch)}
                        aria-label={`Remover filial ${branch.neighborhood}`}
                      >
                        <HugeiconsIcon icon={Delete02Icon} size={14} />
                      </Button>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                    <BranchMobileInfoLine
                      label="Criado em"
                      value={formatDateTime(branch.createdAt)}
                    />
                    <BranchMobileInfoLine
                      label="Atualizado em"
                      value={formatDateTime(branch.updatedAt)}
                    />
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="hidden rounded-md border md:block md:overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/30 text-left">
                <tr>
                  <TableHead>ID</TableHead>
                  <TableHead>Bairro</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead>Atualizado em</TableHead>
                  <TableHead className="text-right">Opções</TableHead>
                </tr>
              </thead>
              <tbody>
                {filteredBranches.length === 0 ? (
                  <tr>
                    <td className="px-3 py-6 text-center text-muted-foreground" colSpan={5}>
                      Nenhuma filial encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredBranches.map((branch) => (
                    <tr key={branch.id} className="border-t">
                      <TableCell>{branch.id}</TableCell>
                      <TableCell className="font-medium">{branch.neighborhood}</TableCell>
                      <TableCell>{formatDateTime(branch.createdAt)}</TableCell>
                      <TableCell>{formatDateTime(branch.updatedAt)}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon-sm"
                            variant="outline"
                            onClick={() => openEdit(branch)}
                            aria-label={`Editar filial ${branch.neighborhood}`}
                          >
                            <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
                          </Button>
                          <Button
                            size="icon-sm"
                            variant="destructive"
                            onClick={() => removeBranch(branch)}
                            aria-label={`Remover filial ${branch.neighborhood}`}
                          >
                            <HugeiconsIcon icon={Delete02Icon} size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      <Dialog open={editingId !== null} onOpenChange={(open) => !open && closeEdit()}>
        <DialogContent className="sm:h-[min(46rem,calc(100dvh-2rem))] sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Editar filial</DialogTitle>
            <DialogDescription>
              Dados. Preencha todos os campos obrigatórios.
            </DialogDescription>
          </DialogHeader>

          {draft ? (
            <DialogBody className="space-y-5">
              <FormSection title="Dados" description="Preencha todos os campos obrigatórios.">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <EditField label="Email *">
                    <Input
                      value={draft.email}
                      type="email"
                      onChange={(event) => updateDraft("email", event.target.value)}
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
                  <EditField label="CEP *">
                    <Input
                      value={draft.cep}
                      inputMode="numeric"
                      onChange={(event) =>
                        updateDraft("cep", formatCepInput(event.target.value))
                      }
                    />
                  </EditField>
                  <EditField label="Logradouro *">
                    <Input
                      value={draft.street}
                      onChange={(event) => updateDraft("street", event.target.value)}
                    />
                  </EditField>
                  <EditField label="Bairro *">
                    <Input
                      value={draft.neighborhood}
                      onChange={(event) =>
                        updateDraft("neighborhood", event.target.value)
                      }
                    />
                  </EditField>
                  <EditField label="Cidade *">
                    <Input
                      value={draft.city}
                      onChange={(event) => updateDraft("city", event.target.value)}
                    />
                  </EditField>
                  <EditField label="UF *">
                    <Input
                      value={draft.state}
                      onChange={(event) =>
                        updateDraft("state", formatUfInput(event.target.value))
                      }
                    />
                  </EditField>
                  <EditField label="Número *">
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
                  <CheckField
                    label="Filial Oculta"
                    checked={draft.hidden}
                    onCheckedChange={(checked) => updateDraft("hidden", checked)}
                  />
                  <CheckField
                    label="Filial pagamentos"
                    checked={draft.paymentsEnabled}
                    onCheckedChange={(checked) =>
                      updateDraft("paymentsEnabled", checked)
                    }
                  />
                </div>
              </FormSection>

            </DialogBody>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={closeEdit}>
              Cancelar
            </Button>
            <Button onClick={saveBranch}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function TableHead({ className, children }: { className?: string; children: ReactNode }) {
  return <th className={`px-3 py-2 font-semibold ${className ?? ""}`}>{children}</th>
}

function TableCell({ className, children }: { className?: string; children: ReactNode }) {
  return <td className={`px-3 py-2 align-middle ${className ?? ""}`}>{children}</td>
}

function BranchMobileInfoLine({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-md bg-muted/30 px-2.5 py-2">
      <span className="shrink-0">{label}</span>
      <span className="min-w-0 truncate text-right font-medium text-foreground">
        {value}
      </span>
    </div>
  )
}

function EditField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function CheckField({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <label className="flex min-h-10 items-center gap-2 rounded-md border bg-muted/20 px-3 py-2 text-sm font-medium">
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      <span>{label}</span>
    </label>
  )
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="grid gap-3 rounded-md border bg-muted/10 p-3">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function formatDateTime(value: string) {
  const date = new Date(value)

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function exportBranchesCsv(branches: Branch[]) {
  const rows = [
    ["ID", "Bairro", "Criado em", "Atualizado em"],
    ...branches.map((branch) => [
      branch.id,
      branch.neighborhood,
      formatDateTime(branch.createdAt),
      formatDateTime(branch.updatedAt),
    ]),
  ]
  const csv = rows
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(";"))
    .join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")

  anchor.href = url
  anchor.download = "filiais.csv"
  anchor.click()
  URL.revokeObjectURL(url)
}
