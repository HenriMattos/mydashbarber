"use client"

import { useMemo, useState } from "react"
import { Invoice03Icon, PlusSignCircleIcon, UserMultipleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { database, type Subscription } from "@/components/admin/database"
import {
  getStoredCommercialPlans,
  getStoredCommercialSubscriptions,
  saveCommercialSubscriptions,
} from "@/components/company/commercial-storage"
import {
  formatDateForDisplay,
  toDateInputValue,
} from "@/components/admin/date-utils"
import { SectionCard } from "@/components/admin/section-card"
import { SimpleTable } from "@/components/admin/simple-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { EmptyState } from "@/components/admin/empty-state"
import { Button } from "@/components/ui/button"
import { SUBSCRIPTION_STATUS, SUBSCRIPTION_STATUS_LABELS } from "@/types"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const initialSubscriptions: Subscription[] = database.subscriptions

const subscriptionClientOptions = Array.from(
  new Set([
    ...database.clients.map((client) => client.name),
    ...initialSubscriptions.map((subscription) => subscription.client),
  ])
)

export default function GerenciarAssinaturasPage() {
  const [items, setItems] = useState(() =>
    getStoredCommercialSubscriptions(initialSubscriptions)
  )
  const [plans] = useState(() => getStoredCommercialPlans(database.plans))
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState("todas")
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Subscription | null>(null)
  const [detailsSubscription, setDetailsSubscription] =
    useState<Subscription | null>(null)
  const [draft, setDraft] = useState<Subscription>(createEmptySubscription())
  const [feedback, setFeedback] = useState("Nenhuma alteração nesta sessão.")

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return items.filter((item) => {
      const matchesFilter =
        filter === "todas" ||
        (filter === "ativas" && item.status === SUBSCRIPTION_STATUS.ACTIVE) ||
        (filter === "pausadas" && item.status === SUBSCRIPTION_STATUS.PAUSED) ||
        (filter === "atrasadas" &&
          item.status === SUBSCRIPTION_STATUS.DELINQUENT) ||
        (filter === "canceladas" &&
          item.status === SUBSCRIPTION_STATUS.CANCELLED) ||
        (filter === "expiradas" &&
          item.status === SUBSCRIPTION_STATUS.EXPIRED)
      const matchesQuery =
        !normalizedQuery ||
        item.client.toLowerCase().includes(normalizedQuery) ||
        item.plan.toLowerCase().includes(normalizedQuery) ||
        item.status.toLowerCase().includes(normalizedQuery)

      return matchesFilter && matchesQuery
    })
  }, [filter, items, query])

  const recurringTotal = filteredItems.reduce(
    (sum, item) => sum + item.value,
    0
  )

  function openCreate() {
    setEditing(null)
    setDraft(createEmptySubscription())
    setModalOpen(true)
  }

  function openEdit(subscription: Subscription) {
    setEditing(subscription)
    setDraft({
      ...subscription,
      nextCharge: toDateInputValue(subscription.nextCharge),
    })
    setModalOpen(true)
  }

  function saveSubscription() {
    if (!draft.client.trim()) return
    const savedDraft = {
      ...draft,
      nextCharge: formatDateForDisplay(draft.nextCharge),
    }

    setItems((current) => {
      const nextItems = editing
        ? current.map((item) => (item.id === draft.id ? savedDraft : item))
        : [{ ...savedDraft, id: Date.now() }, ...current]
      saveCommercialSubscriptions(nextItems)
      return nextItems
    })
    setFeedback(
      editing
        ? `Assinatura de ${draft.client} atualizada.`
        : `Assinatura de ${draft.client} criada.`
    )
    setModalOpen(false)
  }

  function togglePause(subscription: Subscription) {
    const nextStatus: Subscription["status"] =
      subscription.status === SUBSCRIPTION_STATUS.PAUSED
        ? SUBSCRIPTION_STATUS.ACTIVE
        : SUBSCRIPTION_STATUS.PAUSED

    setItems((current) => {
      const nextItems = current.map((item) =>
        item.id === subscription.id ? { ...item, status: nextStatus } : item
      )
      saveCommercialSubscriptions(nextItems)
      return nextItems
    })
    setFeedback(
      `${subscription.client}: status alterado para ${SUBSCRIPTION_STATUS_LABELS[nextStatus]}.`
    )
  }

  function updateDraft<Key extends keyof Subscription>(
    key: Key,
    value: Subscription[Key]
  ) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function updateClient(clientName: string) {
    const client = database.clients.find((item) => item.name === clientName)

    setDraft((current) => ({
      ...current,
      client: clientName,
      clientId: client?.id ?? current.clientId,
      phone: client?.phone ?? current.phone,
    }))
  }

  function updatePlan(planName: string) {
    const plan = plans.find((item) => item.name === planName)

    setDraft((current) => ({
      ...current,
      plan: planName,
      value: plan?.price ?? current.value,
      benefitBalances:
        plan?.includedServices.map((service) => ({
          serviceId: service.serviceId,
          serviceName: service.serviceName,
          available: service.quantityPerCycle,
          reserved: 0,
          consumed: 0,
        })) ?? current.benefitBalances,
    }))
  }

  return (
    <>
      <SectionCard
        title="Gerenciar assinaturas"
        description="Acompanhe contratos ativos, vencimentos e renovações"
        action={
          <Button size="sm" onClick={openCreate}>
            <HugeiconsIcon icon={PlusSignCircleIcon} size={16} />
            Nova assinatura
          </Button>
        }
      >
        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <MetricChip label="Ativas" value={countByStatus(SUBSCRIPTION_STATUS.ACTIVE, items)} tone="green" />
          <MetricChip label="Inadimplentes" value={countByStatus(SUBSCRIPTION_STATUS.DELINQUENT, items)} tone="red" />
          <MetricChip label="Pausadas" value={countByStatus(SUBSCRIPTION_STATUS.PAUSED, items)} tone="amber" />
          <MetricChip label="Saldo reservado" value={countReservedBenefits(items)} tone="blue" />
        </div>

        <div className="mb-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_13rem]">
          <Input
            value={query}
            placeholder="Buscar cliente, plano ou status"
            onChange={(event) => setQuery(event.target.value)}
          />
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas</SelectItem>
              <SelectItem value="ativas">Ativas</SelectItem>
              <SelectItem value="pausadas">Pausadas</SelectItem>
              <SelectItem value="atrasadas">Inadimplentes</SelectItem>
              <SelectItem value="canceladas">Canceladas</SelectItem>
              <SelectItem value="expiradas">Expiradas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {items.length === 0 ? (
          <EmptyState
            icon={UserMultipleIcon}
            title="Nenhuma assinatura ativa"
            description="Você ainda não possui clientes assinantes. Comece criando uma assinatura para um cliente."
            actionLabel="Nova assinatura"
            onAction={openCreate}
          />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon={UserMultipleIcon}
            title="Nenhum assinante encontrado"
            description="Não encontramos nenhuma assinatura que corresponda aos filtros aplicados."
            actionLabel="Limpar busca"
            onAction={() => {
              setQuery("")
              setFilter("todas")
            }}
          />
        ) : (
          <SimpleTable
            columns={[
              "Cliente",
              "Plano",
              "Valor",
              "Próxima cobrança",
              "Status",
              "Ações",
            ]}
            rows={filteredItems.map((subscription) => [
              subscription.client,
              subscription.plan,
              formatCurrency(subscription.value),
              subscription.nextCharge,
              <StatusBadge key="status" tone={getStatusTone(subscription.status)}>
                {SUBSCRIPTION_STATUS_LABELS[subscription.status]}
              </StatusBadge>,
              <div key="actions" className="flex flex-wrap gap-2">
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => setDetailsSubscription(subscription)}
                >
                  Ver
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => openEdit(subscription)}
                >
                  Editar
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => togglePause(subscription)}
                >
                  {subscription.status === SUBSCRIPTION_STATUS.PAUSED
                    ? "Reativar"
                    : "Pausar"}
                </Button>
              </div>,
            ])}
          />
        )}

        <div className="mt-4 flex flex-col gap-2 rounded-md border bg-muted/35 px-3 py-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2">
            <HugeiconsIcon icon={Invoice03Icon} size={16} />
            Total recorrente filtrado: {formatCurrency(recurringTotal)}
          </span>
          <span>{feedback}</span>
        </div>
      </SectionCard>

      <Dialog
        open={Boolean(detailsSubscription)}
        onOpenChange={(open) => !open && setDetailsSubscription(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da assinatura</DialogTitle>
            <DialogDescription>
              Leia o saldo por servico, o uso recente e os alertas do cliente.
            </DialogDescription>
          </DialogHeader>

          {detailsSubscription ? (
            <div className="grid gap-4">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
                <div className="rounded-md border bg-muted/25 p-4">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Cliente
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">
                    {detailsSubscription.client}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Plano: {detailsSubscription.plan}
                  </p>
                  {detailsSubscription.alert ? (
                    <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
                      {detailsSubscription.alert}
                    </p>
                  ) : null}
                </div>
                <div className="rounded-md border bg-background p-4">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Status
                  </p>
                  <div className="mt-2 inline-flex">
                    <StatusBadge tone={getStatusTone(detailsSubscription.status)}>
                      {SUBSCRIPTION_STATUS_LABELS[detailsSubscription.status]}
                    </StatusBadge>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                    <p>Inicio: {detailsSubscription.startedAt}</p>
                    <p>Renovacao: {detailsSubscription.nextCharge}</p>
                    <p>Valor: {formatCurrency(detailsSubscription.value)}</p>
                    <p>{getBenefitSummary(detailsSubscription)}</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {detailsSubscription.benefitBalances.map((balance) => (
                  <div
                    key={balance.serviceId}
                    className="rounded-md border bg-background p-4"
                  >
                    <p className="text-sm font-semibold">{balance.serviceName}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {balance.available} disponivel
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {balance.reserved} reservado
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {balance.consumed} consumido
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-md border bg-background p-4">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  Historico recente
                </p>
                <div className="mt-3 grid gap-2">
                  {detailsSubscription.usageHistory.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Nenhum uso registrado.
                    </p>
                  ) : (
                    detailsSubscription.usageHistory.map((usage) => (
                      <div
                        key={usage.id}
                        className="flex flex-col gap-1 rounded-md border px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="font-medium">{usage.serviceName}</span>
                        <span className="text-muted-foreground">
                          {usage.status} - {usage.occurredAt}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : null}

          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => {
                if (!detailsSubscription) return
                setDetailsSubscription(null)
                openEdit(detailsSubscription)
              }}
            >
              Editar
            </Button>
            <Button onClick={() => setDetailsSubscription(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Editar assinatura" : "Nova assinatura"}
            </DialogTitle>
            <DialogDescription>
              Defina cliente, plano, valor e próxima cobrança.
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="grid gap-4 md:grid-cols-2">
            <Field label="Cliente">
              <Select value={draft.client} onValueChange={updateClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptionClientOptions.map((clientName) => (
                    <SelectItem key={clientName} value={clientName}>
                      {clientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Plano">
              <Select value={draft.plan} onValueChange={updatePlan}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.name} value={plan.name}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Valor">
              <Input
                value={String(draft.value)}
                inputMode="decimal"
                onChange={(event) =>
                  updateDraft("value", Number(event.target.value) || 0)
                }
              />
            </Field>
            <Field label="Próxima cobrança">
              <Input
                type="date"
                value={draft.nextCharge}
                onChange={(event) =>
                  updateDraft("nextCharge", event.target.value)
                }
              />
            </Field>
            <Field label="Status">
              <Select
                value={draft.status}
                onValueChange={(value) =>
                  updateDraft("status", value as Subscription["status"])
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SUBSCRIPTION_STATUS.ACTIVE}>
                    Ativa
                  </SelectItem>
                  <SelectItem value={SUBSCRIPTION_STATUS.DELINQUENT}>
                    Inadimplente
                  </SelectItem>
                  <SelectItem value={SUBSCRIPTION_STATUS.PAUSED}>
                    Pausada
                  </SelectItem>
                  <SelectItem value={SUBSCRIPTION_STATUS.CANCELLED}>
                    Cancelada
                  </SelectItem>
                  <SelectItem value={SUBSCRIPTION_STATUS.EXPIRED}>
                    Expirada
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </DialogBody>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={saveSubscription}>
              {editing ? "Salvar alterações" : "Criar assinatura"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function createEmptySubscription(): Subscription {
  return {
    id: 0,
    clientId: database.clients[0]?.id ?? 0,
    client: database.clients[0]?.name ?? "",
    phone: database.clients[0]?.phone ?? "",
    plan: database.plans[0]?.name ?? "",
    value: database.plans[0]?.price ?? 0,
    nextCharge: "2026-05-29",
    startedAt: "29/04/2026",
    status: SUBSCRIPTION_STATUS.ACTIVE,
    benefitBalances: database.plans[0]?.includedServices.map((service) => ({
      serviceId: service.serviceId,
      serviceName: service.serviceName,
      available: service.quantityPerCycle,
      reserved: 0,
      consumed: 0,
    })) ?? [],
    usageHistory: [],
  }
}

function getStatusTone(status: Subscription["status"]) {
  if (status === SUBSCRIPTION_STATUS.ACTIVE) return "green"
  if (status === SUBSCRIPTION_STATUS.DELINQUENT) return "red"
  if (status === SUBSCRIPTION_STATUS.PAUSED) return "amber"
  return "neutral"
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

function getBenefitSummary(subscription: Subscription) {
  const firstBalance = subscription.benefitBalances[0]
  if (!firstBalance) return "Sem saldo registrado"

  return `${firstBalance.available} disponivel, ${firstBalance.reserved} reservado, ${firstBalance.consumed} consumido`
}

function countByStatus(
  status: Subscription["status"],
  items: Subscription[]
) {
  return items.filter((item) => item.status === status).length
}

function countReservedBenefits(items: Subscription[]) {
  return items.reduce(
    (sum, item) =>
      sum +
      item.benefitBalances.reduce((balanceSum, balance) => balanceSum + balance.reserved, 0),
    0
  )
}

function MetricChip({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: "green" | "red" | "amber" | "blue"
}) {
  const toneClass = {
    green: "border-emerald-200 bg-emerald-50 text-emerald-900",
    red: "border-red-200 bg-red-50 text-red-900",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    blue: "border-blue-200 bg-blue-50 text-blue-900",
  }[tone]

  return (
    <div className={`rounded-md border px-3 py-2 ${toneClass}`}>
      <p className="text-xs font-semibold uppercase opacity-80">{label}</p>
      <p className="mt-1 text-lg font-bold">{value}</p>
    </div>
  )
}
