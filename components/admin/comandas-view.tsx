"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  ArrowLeft01Icon,
  CashierIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  type Comanda,
  comandas as initialComandas,
  getStatusLabel,
  getStatusTone,
} from "@/components/admin/caixa-data"
import { database } from "@/components/admin/database"
import { SectionCard } from "@/components/admin/section-card"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { COMMAND_STATUS, PAYMENT_STATUS, type CommandStatus } from "@/types"
import { NovaComandaModal } from "@/components/admin/caixa-view"

type ComandaFilter = "all" | CommandStatus

const filterOptions: Array<{ value: ComandaFilter; label: string }> = [
  { value: "all", label: "Todas" },
  { value: COMMAND_STATUS.OPEN, label: "Abertas" },
  { value: COMMAND_STATUS.PENDING, label: "Pendentes" },
  { value: COMMAND_STATUS.PAID, label: "Pagas" },
]

const demoCurrency = "R$ 0,00"

export function ComandasView() {
  const [comandas, setComandas] = useState<Comanda[]>(initialComandas)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingComanda, setEditingComanda] = useState<Comanda | null>(null)
  const [selectedComanda, setSelectedComanda] = useState<Comanda | null>(null)
  const [filter, setFilter] = useState<ComandaFilter>("all")
  const [search, setSearch] = useState("")

  const orderedComandas = useMemo(() => {
    return [...comandas].sort((a, b) => {
      return getComandaSequence(a.id) - getComandaSequence(b.id)
    })
  }, [comandas])

  const filteredComandas = useMemo(() => {
    const term = search.trim().toLowerCase()

    return orderedComandas.filter((comanda) => {
      const matchesSearch =
        !term ||
        comanda.id.toLowerCase().includes(term) ||
        comanda.client.toLowerCase().includes(term) ||
        getStatusLabel(comanda.status).toLowerCase().includes(term)

      const matchesFilter =
        filter === "all" ? true : comanda.status === filter

      return matchesSearch && matchesFilter
    })
  }, [orderedComandas, filter, search])

  function saveComanda(comanda: Comanda) {
    setComandas((current) => {
      const nextComandas = current.some((item) => item.id === comanda.id)
        ? current.map((item) => (item.id === comanda.id ? comanda : item))
        : [...current, comanda]

      database.comandas = nextComandas
      return nextComandas
    })
    setEditingComanda(null)
    setModalOpen(false)
  }

  function openCreateModal() {
    setEditingComanda(null)
    setModalOpen(true)
  }

  function openEditModal(comanda: Comanda) {
    setEditingComanda(comanda)
    setModalOpen(true)
  }

  function closeComanda(comanda: Comanda) {
    const canClose = window.confirm(
      "Deseja adicionar algum servico ou produto antes de fechar esta comanda?"
    )
    if (!canClose) return

    const paymentMethod =
      window.prompt(
        "Informe a forma de pagamento final (ex.: Pix direto para barbearia, Dinheiro em especie, Cartao online (plataforma), Assinatura (plataforma)).",
        "Pix direto para barbearia"
      ) ?? "Pix direto para barbearia"

    const paymentMeta = getPaymentFinancialMetadata(paymentMethod)
    const total = comanda.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    )
    const nowIso = new Date().toISOString()

    setComandas((current) => {
      const settledPayment: import("@/types").Payment = {
        id: `PAY-${Date.now()}`,
        commandId: comanda.id,
        amount: Number(total.toFixed(2)),
        method: paymentMethod,
        status: PAYMENT_STATUS.PAID,
        paidAt: nowIso,
        ...paymentMeta,
      }

      const nextComandas = current.map((item) =>
        item.id === comanda.id
          ? {
              ...item,
              status: COMMAND_STATUS.PAID,
              payment: paymentMethod,
              updatedAt: nowIso,
              closedAt: nowIso,
              payments: [settledPayment],
            }
          : item
      )

      database.comandas = nextComandas
      return nextComandas
    })
  }

  return (
    <>
      <SectionCard
        title="Histórico de comandas"
        description="Listagem da primeira até a última comanda registrada no caixa"
        action={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button size="sm" variant="outline" asChild>
              <Link href="/caixa">
                <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                Voltar ao caixa
              </Link>
            </Button>
            <Button size="sm" onClick={openCreateModal}>
              <HugeiconsIcon icon={CashierIcon} size={16} />
              Nova comanda
            </Button>
          </div>
        }
      >
        <div className="grid gap-3">
          <div className="grid gap-3 rounded-md border bg-muted/20 p-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-center">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {filterOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  size="sm"
                  variant={filter === option.value ? "default" : "outline"}
                  className="h-8 shrink-0 text-xs"
                  onClick={() => setFilter(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            <div className="relative">
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por cliente, ID ou status"
                className="h-10 pl-9"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-md border">
            <table className="min-w-full text-sm">
              <thead className="bg-muted/30 text-left">
                <tr>
                  <th className="px-3 py-2 font-semibold">ID</th>
                  <th className="px-3 py-2 font-semibold">Cliente</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                  <th className="px-3 py-2 font-semibold">Data de criacao</th>
                  <th className="px-3 py-2 font-semibold">Atualizada em</th>
                  <th className="px-3 py-2 font-semibold text-right">Acoes</th>
                </tr>
              </thead>
              <tbody>
                {filteredComandas.length === 0 ? (
                  <tr>
                    <td className="px-3 py-6 text-center text-muted-foreground" colSpan={6}>
                      Nenhuma comanda encontrada.
                    </td>
                  </tr>
                ) : (
                  filteredComandas.map((comanda, index) => (
                    <tr key={comanda.id} className="border-t">
                      <td className="px-3 py-2 font-medium">{comanda.id}</td>
                      <td className="px-3 py-2">{comanda.client}</td>
                      <td className="px-3 py-2">
                        <StatusBadge tone={getStatusTone(comanda.status)}>
                          {getStatusLabel(comanda.status)}
                        </StatusBadge>
                      </td>
                      <td className="px-3 py-2">{getCreatedAtLabel(comanda, index)}</td>
                      <td className="px-3 py-2">{getUpdatedAtLabel(comanda, index)}</td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => setSelectedComanda(comanda)}>
                            Ver detalhes
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => openEditModal(comanda)}>
                            Abrir / editar
                          </Button>
                          {comanda.status !== COMMAND_STATUS.PAID ? (
                            <Button size="sm" onClick={() => closeComanda(comanda)}>
                              Fechar
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>

      <ComandaDetailsDialog
        comanda={selectedComanda}
        open={Boolean(selectedComanda)}
        onOpenChange={(open) => {
          if (!open) setSelectedComanda(null)
        }}
      />

      <NovaComandaModal
        key={editingComanda?.id ?? "nova-comanda"}
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open)
          if (!open) setEditingComanda(null)
        }}
        onSave={saveComanda}
        nextNumber={1024 + comandas.length}
        editingComanda={editingComanda}
      />
    </>
  )
}

function ComandaDetailsDialog({
  comanda,
  open,
  onOpenChange,
}: {
  comanda: Comanda | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!comanda) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="grid grid-rows-[auto_auto_minmax(0,1fr)_auto] sm:h-[min(46rem,calc(100dvh-1rem))] sm:max-w-5xl">
        <DialogHeader className="border-b px-4 py-3">
          <DialogTitle className="flex flex-wrap items-center gap-2">
            <span>{comanda.id}</span>
            <StatusBadge tone={getStatusTone(comanda.status)}>
              {getStatusLabel(comanda.status)}
            </StatusBadge>
          </DialogTitle>
          <DialogDescription>
            {comanda.client}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="min-h-0">
          <div className="grid gap-4 p-4">
            <section className="rounded-md border p-3">
              <h3 className="text-sm font-semibold">Agendamentos</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Agendamentos adicionados na comanda.
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/30 text-left">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Cliente</th>
                      <th className="px-3 py-2 font-semibold">Data e hora do agendamento</th>
                      <th className="px-3 py-2 font-semibold">Total dos serviços</th>
                      <th className="px-3 py-2 font-semibold">Total de descontos</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-3 py-2">Hamilton Rodrigues</td>
                      <td className="px-3 py-2">07/04/2026 09:00:00</td>
                      <td className="px-3 py-2">{demoCurrency}</td>
                      <td className="px-3 py-2">{demoCurrency}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-md border p-3">
              <h3 className="text-sm font-semibold">Produtos</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Produtos adicionados na comanda.
              </p>
              <p className="mt-3 text-sm font-medium">Nenhum produto adicionado!</p>
            </section>

            <section className="rounded-md border p-3">
              <h3 className="text-sm font-semibold">Serviços</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Serviços adicionados na comanda.
              </p>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/30 text-left">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Profissional</th>
                      <th className="px-3 py-2 font-semibold">Serviço</th>
                      <th className="px-3 py-2 font-semibold">Valor</th>
                      <th className="px-3 py-2 font-semibold">Desconto</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-3 py-2">Paulo Junior</td>
                      <td className="px-3 py-2">Sobrancelha</td>
                      <td className="px-3 py-2">{demoCurrency}</td>
                      <td className="px-3 py-2">{demoCurrency}</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-3 py-2">Paulo Junior</td>
                      <td className="px-3 py-2">Corte</td>
                      <td className="px-3 py-2">{demoCurrency}</td>
                      <td className="px-3 py-2">{demoCurrency}</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-3 py-2">Paulo Junior</td>
                      <td className="px-3 py-2">Barba</td>
                      <td className="px-3 py-2">{demoCurrency}</td>
                      <td className="px-3 py-2">{demoCurrency}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-md border p-3">
              <h3 className="text-sm font-semibold">Valores</h3>
              <div className="mt-3 grid gap-2 text-sm">
                <DetailLine label="Total de serviços com desconto" value={demoCurrency} />
                <DetailLine label="Desconto em serviços" value={demoCurrency} />
                <DetailLine label="Total de produtos com desconto" value={demoCurrency} />
                <DetailLine label="Desconto em produtos" value={demoCurrency} />
                <DetailLine label="Total da comanda" value={demoCurrency} />
              </div>
            </section>

            <section className="rounded-md border p-3">
              <h3 className="text-sm font-semibold">Pagamento</h3>
              <p className="mt-1 text-sm text-muted-foreground">Caixa</p>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-muted/30 text-left">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Forma de pagamento</th>
                      <th className="px-3 py-2 font-semibold">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t">
                      <td className="px-3 py-2">Dinheiro</td>
                      <td className="px-3 py-2">{demoCurrency}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </ScrollArea>

        <DialogFooter className="border-t p-3 sm:p-4">
          <Button type="button" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DetailLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-md bg-muted/20 px-3 py-2">
      <span>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function getComandaSequence(id: string) {
  const parsed = Number(id.replace(/\D+/g, ""))
  return Number.isFinite(parsed) ? parsed : 0
}

function getCreatedAtLabel(comanda: Comanda, index: number) {
  if (comanda.createdAt) return formatDateTime(new Date(comanda.createdAt))
  const value = index + getComandaSequence(comanda.id)
  const date = new Date(2026, 3, 7, 8, 0 + value)
  return formatDateTime(date)
}

function getUpdatedAtLabel(comanda: Comanda, index: number) {
  if (comanda.updatedAt) return formatDateTime(new Date(comanda.updatedAt))
  const value = index + getComandaSequence(comanda.id)
  const date = new Date(2026, 3, 7, 9, 0 + value)
  return formatDateTime(date)
}

function getPaymentFinancialMetadata(method: string) {
  const normalized = method.toLowerCase()

  if (
    normalized.includes("assinatura") ||
    normalized.includes("plataforma") ||
    normalized.includes("cartao online")
  ) {
    return {
      financialOrigin: normalized.includes("assinatura")
        ? ("subscription" as const)
        : ("platform" as const),
      processingChannel: "platform_gateway" as const,
      isPlatformBalanceEligible: true,
      releaseStatus: normalized.includes("assinatura")
        ? ("available" as const)
        : ("pending" as const),
    }
  }

  return {
    financialOrigin: "direct" as const,
    processingChannel: "external" as const,
    isPlatformBalanceEligible: false,
  }
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

