"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  Add01Icon,
  CashierIcon,
  Delete02Icon,
  MoneyReceiveCircleIcon,
  MoneySendCircleIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  type CashMovement,
  type CashMovementType,
  type Comanda,
  type ComandaItem,
  type ComandaStatus,
  cashMovements as initialCashMovements,
  comandas as initialComandas,
  formatCurrency,
  getComandaPaidTotal,
  getComandaPendingTotal,
  getComandaTotal,
} from "@/components/admin/caixa-data"
import {
  serviceCatalog,
} from "@/components/admin/catalog-data"
import { clients as registeredClients } from "@/components/admin/clientes-data"
import { database } from "@/components/admin/database"
import { SectionCard } from "@/components/admin/section-card"
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
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import {
  APPOINTMENT_STATUS,
  COMMAND_STATUS,
  CASH_REGISTER_STATUS,
  PAYMENT_STATUS,
  type CashRegister,
} from "@/types"

const services = serviceCatalog
  .filter(
    (service) =>
      service.status === "Ativo" &&
      !service.hidden &&
      service.portalVisible !== false &&
      service.onlineBookable !== false
  )
  .map((service) => ({
    name: service.name,
    category: service.category,
    price: service.price,
  }))

const chairOptions = database.company.chairs
const appointments = database.agendaEvents
  .filter((event) => event.type === "appointment")
  .map((event) => {
    const service = serviceCatalog.find((item) => item.name === event.detail)

    return {
      id: `ag-${event.id}`,
      label: `${event.start} - ${event.title}`,
      date: event.date,
      start: event.start,
      status: event.status,
      client: event.title,
      barber: event.barber,
      chair: chairOptions[0] ?? "Geral",
      service: event.detail,
      price: service?.price ?? 0,
    }
  })

const products = database.products
const barberOptions = database.professionals
  .filter((professional) => professional.status === "Ativo")
  .map((professional) => professional.name)
const cashCardHeaderClassName = "md:flex-col md:items-start md:justify-start"
const cashCardActionClassName =
  "md:w-full md:[&_[data-slot=button]]:w-auto"

export function CaixaView() {
  const [comandas, setComandas] = useState<Comanda[]>(initialComandas)
  const [cashMovements, setCashMovements] =
    useState<CashMovement[]>(initialCashMovements)
  const [modalOpen, setModalOpen] = useState(false)
  const [movementModalType, setMovementModalType] =
    useState<CashMovementType | null>(null)
  const [closeCashModalOpen, setCloseCashModalOpen] = useState(false)
  const [cashRegister, setCashRegister] = useState<CashRegister>({
    id: "CX-20260521",
    openedAt: new Date().toISOString(),
    status: CASH_REGISTER_STATUS.OPEN,
    openingAmount: 250,
  })

  const paidTotal = comandas
    .filter((comanda) => comanda.status === COMMAND_STATUS.PAID)
    .reduce((sum, comanda) => sum + getComandaPaidTotal(comanda), 0)
  const openTotal = comandas
    .filter(
      (comanda) =>
        comanda.status === COMMAND_STATUS.OPEN ||
        comanda.status === COMMAND_STATUS.PENDING
    )
    .reduce((sum, comanda) => sum + getComandaPendingTotal(comanda), 0)
  const manualIncomeTotal = cashMovements
    .filter((movement) => movement.type === "entrada")
    .reduce((sum, movement) => sum + movement.value, 0)
  const expenseTotal = cashMovements
    .filter((movement) => movement.type === "saida")
    .reduce((sum, movement) => sum + movement.value, 0)
  const receivedTotal = paidTotal + manualIncomeTotal
  const expectedTotal = comandas.reduce(
    (sum, comanda) => sum + getComandaTotal(comanda),
    0
  )
  const cashBalance =
    cashRegister.openingAmount + receivedTotal - expenseTotal
  const paidCount = comandas.filter(
    (comanda) => comanda.status === COMMAND_STATUS.PAID
  ).length
  const openCount = comandas.filter(
    (comanda) => comanda.status === COMMAND_STATUS.OPEN
  ).length
  const pendingStatusCount = comandas.filter(
    (comanda) => comanda.status === COMMAND_STATUS.PENDING
  ).length
  const pendingCount = openCount + pendingStatusCount

  function saveComanda(comanda: Comanda) {
    setComandas((current) => {
      const nextComandas = current.some((item) => item.id === comanda.id)
        ? current.map((item) => (item.id === comanda.id ? comanda : item))
        : [...current, comanda]

      database.comandas = nextComandas
      return nextComandas
    })
    setModalOpen(false)
  }

  function openCreateModal() {
    setModalOpen(true)
  }

  function addCashMovement(movement: CashMovement) {
    setCashMovements((current) => [movement, ...current])
    setMovementModalType(null)
  }

  function closeCashRegister() {
    setCashRegister((current) => ({
      ...current,
      status: CASH_REGISTER_STATUS.CLOSED,
      closedAt: new Date().toISOString(),
      closingAmount: cashBalance,
      receivedAmount: receivedTotal,
      pendingAmount: openTotal,
      openCommandsAmount: openTotal,
      pendingCommandsAmount: openTotal,
      paidCommandsAmount: paidTotal,
      openCommandsCount: openCount,
      pendingCommandsCount: pendingCount,
      paidCommandsCount: paidCount,
      cashMovementsCount: cashMovements.length,
      notes:
        "Fechamento visual do dia com base em comandas pagas, entradas manuais e pendencias.",
    }))
    setCloseCashModalOpen(false)
  }

  return (
    <>
      <div className="grid items-start gap-4 xl:grid-cols-2 2xl:grid-cols-3">
        <SectionCard
          title="Entradas e saidas"
          description="Visao superficial do movimento manual do caixa."
          headerClassName={cashCardHeaderClassName}
          actionClassName={cashCardActionClassName}
          action={
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => setMovementModalType("entrada")}
              >
                <HugeiconsIcon icon={MoneyReceiveCircleIcon} size={16} />
                Nova entrada
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => setMovementModalType("saida")}
              >
                <HugeiconsIcon icon={MoneySendCircleIcon} size={16} />
                Nova saida
              </Button>
            </div>
          }
        >
          <div className="grid gap-2">
            <CashSummaryTile
              label="Entradas"
              value={formatCurrency(manualIncomeTotal)}
            />
            <CashSummaryTile label="Saidas" value={formatCurrency(expenseTotal)} />
            <CashSummaryTile
              label="Lancamentos"
              value={String(cashMovements.length)}
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Fechamento do dia"
          description="Visao superficial antes do fechamento."
          headerClassName={cashCardHeaderClassName}
          actionClassName={cashCardActionClassName}
          action={
            <Button size="sm" onClick={() => setCloseCashModalOpen(true)}>
              Fechar caixa
            </Button>
          }
        >
          <div className="grid gap-2">
            <CashSummaryTile
              label="Status"
              value={
                cashRegister.status === CASH_REGISTER_STATUS.OPEN
                  ? "Aberto"
                  : "Fechado"
              }
            />
            <CashSummaryTile label="Recebido" value={formatCurrency(receivedTotal)} />
            <CashSummaryTile
              label="Pendente"
              value={formatCurrency(openTotal)}
            />
            <CashSummaryTile label="Saldo" value={formatCurrency(cashBalance)} />
          </div>
        </SectionCard>

        <SectionCard
          title="Comandas"
          description="Visao superficial das comandas no caixa."
          headerClassName={cashCardHeaderClassName}
          actionClassName={cashCardActionClassName}
          action={
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Button size="sm" variant="outline" asChild>
                <Link href="/caixa/comandas">Ver historico</Link>
              </Button>
              <Button size="sm" onClick={openCreateModal}>
                <HugeiconsIcon icon={CashierIcon} size={16} />
                Nova comanda
              </Button>
            </div>
          }
        >
          <div className="grid gap-2">
            <CashSummaryTile
              label="Total de comandas"
              value={String(comandas.length)}
            />
            <CashSummaryTile label="Pagas" value={String(paidCount)} />
            <CashSummaryTile label="Pendentes" value={String(pendingCount)} />
            <CashSummaryTile
              label="Total recebido"
              value={formatCurrency(paidTotal)}
            />
          </div>
        </SectionCard>
      </div>

      <NovaComandaModal
        key="nova-comanda"
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSave={saveComanda}
        nextNumber={1024 + comandas.length}
        editingComanda={null}
      />

      <CashMovementModal
        key={movementModalType ?? "cash-movement"}
        type={movementModalType ?? "entrada"}
        open={Boolean(movementModalType)}
        onOpenChange={(open) => {
          if (!open) setMovementModalType(null)
        }}
        onSave={addCashMovement}
        nextNumber={cashMovements.length + 1}
      />

      <CashRegisterCloseModal
        open={closeCashModalOpen}
        onOpenChange={setCloseCashModalOpen}
        cashRegister={cashRegister}
        cashBalance={cashBalance}
        receivedTotal={receivedTotal}
        pendingTotal={openTotal}
        expectedTotal={expectedTotal}
        openCount={openCount}
        pendingCount={pendingCount}
        paidCount={paidCount}
        onConfirm={closeCashRegister}
      />
    </>
  )
}

function CashSummaryTile({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-md border bg-muted/20 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-semibold">{value}</p>
    </div>
  )
}

function CashMovementModal({
  type,
  open,
  onOpenChange,
  onSave,
  nextNumber,
}: {
  type: CashMovementType
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (movement: CashMovement) => void
  nextNumber: number
}) {
  const [label, setLabel] = useState("")
  const [description, setDescription] = useState("")
  const [value, setValue] = useState("")
  const isIncome = type === "entrada"
  const parsedValue = Number(value.replace(",", ".")) || 0
  const canSave = label.trim().length > 0 && parsedValue > 0

  function reset() {
    setLabel("")
    setDescription("")
    setValue("")
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  function submit() {
    if (!canSave) return

    onSave({
      id: `MOV-${String(nextNumber).padStart(3, "0")}`,
      type,
      label: label.trim(),
      description: description.trim() || undefined,
      category: description.trim() || "Sem descricao",
      value: parsedValue,
      payment: "Manual",
      time: new Intl.DateTimeFormat("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date()),
    })
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="grid grid-rows-[auto_auto_minmax(0,1fr)_auto] shadow-2xl sm:h-[min(38rem,calc(100dvh-2rem))] sm:max-w-[36rem] sm:rounded-xl">
        <DialogHeader
          className={cn(
            "relative gap-2 overflow-hidden border-b p-4 pt-3 sm:gap-3 sm:p-4",
            isIncome ? "bg-primary/5" : "bg-destructive/5"
          )}
        >
          <span
            className={cn(
              "pointer-events-none absolute top-4 right-4 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-normal uppercase sm:top-4 sm:right-4",
              isIncome
                ? "border-primary/20 bg-primary/10 text-primary"
                : "border-destructive/20 bg-destructive/10 text-destructive"
            )}
          >
            {isIncome ? "Entrada" : "Saida"}
          </span>
          <DialogTitle className="flex items-start gap-2.5 pr-14 text-base sm:items-center sm:gap-3 sm:pr-0 sm:text-lg">
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-md sm:size-10",
                isIncome
                  ? "bg-primary/15 text-primary"
                  : "bg-destructive/10 text-destructive"
              )}
            >
              <HugeiconsIcon
                icon={isIncome ? MoneyReceiveCircleIcon : MoneySendCircleIcon}
                size={18}
              />
            </span>
            <span className="min-w-0">
              <span className="block truncate">
                {isIncome ? "Nova entrada" : "Nova saida"}
              </span>
              <span className="mt-0.5 block truncate text-[10px] font-semibold tracking-normal text-muted-foreground uppercase sm:text-[11px]">
                <span className="sm:hidden">Manual do caixa</span>
                <span className="hidden sm:inline">
                  Lancamento manual do caixa
                </span>
              </span>
            </span>
          </DialogTitle>
            <DialogDescription className="text-xs leading-relaxed sm:text-sm">
              {isIncome ? "Nova entrada" : "Nova saida"}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="min-h-0 bg-muted/15">
            <div className="grid gap-3 p-3 sm:p-4">
              <div className="grid gap-2 rounded-lg border bg-background p-3 shadow-xs">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">
                  Nome *
                </Label>
                <Input
                  className="h-12 border-0 bg-muted/35 text-base shadow-none focus-visible:ring-2"
                  value={label}
                  onChange={(event) => setLabel(event.target.value)}
                  autoFocus
                  placeholder={isIncome ? "Ex.: Troco inicial" : "Ex.: Compra de material"}
                />
              </div>

              <div className="rounded-lg border bg-background p-3 shadow-xs">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">
                  Valor *
                </Label>
                <div className="mt-2 flex items-center rounded-lg border bg-muted/20 px-3 transition-colors focus-within:border-ring/50 focus-within:bg-background focus-within:ring-2 focus-within:ring-ring/25">
                  <span className="shrink-0 text-sm font-semibold text-muted-foreground">
                  R$
                </span>
                <Input
                  className="h-12 border-0 bg-transparent px-2 text-xl font-semibold shadow-none focus-visible:ring-0 sm:text-2xl"
                  value={value}
                    onChange={(event) => setValue(event.target.value)}
                    inputMode="decimal"
                    placeholder="0,00"
                  />
                </div>
              </div>

              <div className="grid gap-2 rounded-lg border bg-background p-3 shadow-xs">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">
                  Descricao
                </Label>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  placeholder="Ex.: Referente ao caixa do dia."
                  className="w-full resize-none rounded-md border-0 bg-muted/35 px-3 py-2 text-sm shadow-none outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
                />
              </div>
            </div>
          </ScrollArea>

        <DialogFooter className="grid grid-cols-2 gap-2 border-t bg-background/95 p-3 sm:flex sm:bg-muted/25 sm:p-4">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full sm:w-auto sm:min-w-28"
            onClick={() => handleOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="h-11 w-full sm:w-auto sm:min-w-40"
            disabled={!canSave}
            onClick={submit}
          >
            {isIncome ? "Salvar entrada" : "Salvar saida"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function NovaComandaModal({
  open,
  onOpenChange,
  onSave,
  nextNumber,
  editingComanda,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (comanda: Comanda) => void
  nextNumber: number
  editingComanda?: Comanda | null
}) {
  const [appointmentId, setAppointmentId] = useState("")
  const [client, setClient] = useState(editingComanda?.client ?? "")
  const [barber, setBarber] = useState(
    editingComanda?.barber ?? barberOptions[0] ?? ""
  )
  const [chair, setChair] = useState(editingComanda?.chair ?? "Cadeira 1")
  const [status, setStatus] = useState<ComandaStatus>(
    editingComanda?.status ?? COMMAND_STATUS.OPEN
  )
  const [payment, setPayment] = useState(editingComanda?.payment ?? "Pendente")
  const [productName, setProductName] = useState("")
  const [productQuantity, setProductQuantity] = useState("1")
  const [serviceName, setServiceName] = useState("")
  const [items, setItems] = useState<ComandaItem[]>(editingComanda?.items ?? [])
  const [step, setStep] = useState(0)
  const steps = ["Dados", "Servicos", "Produtos", "Fechamento"]
  const lastStep = steps.length - 1
  const editing = Boolean(editingComanda)
  const isBarberSession = true
  const paymentOptions = [
    "Pendente",
    "Pix direto para barbearia",
    "Dinheiro em especie",
    "Maquininha externa debito",
    "Maquininha externa credito",
    "Transferencia bancaria direta",
    "Cartao online (plataforma)",
    "Assinatura (plataforma)",
  ]

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0),
    [items]
  )

  function reset() {
    setAppointmentId("")
    setClient("")
    setBarber(barberOptions[0] ?? "")
    setChair("Cadeira 1")
    setStatus(COMMAND_STATUS.OPEN)
    setPayment("Pendente")
    setProductName("")
    setProductQuantity("1")
    setServiceName("")
    setItems([])
    setStep(0)
  }

  function getRelatedAppointmentByClient(clientName: string) {
    return appointments
      .filter(
        (item) =>
          item.client === clientName &&
          item.status !== APPOINTMENT_STATUS.CANCELLED
      )
      .sort((first, second) => {
        if (first.date === second.date) {
          return first.start.localeCompare(second.start)
        }
        return first.date.localeCompare(second.date)
      })[0]
  }

  function handleAppointment(value: string) {
    setAppointmentId(value)
    const appointment = appointments.find((item) => item.id === value)
    if (!appointment) return

    setClient(appointment.client)
    setBarber(appointment.barber)
    setChair(appointment.chair)
    setServiceName(appointment.service)
    if (!items.some((item) => item.name === appointment.service)) {
      setItems((current) => [
        ...current,
        {
          name: appointment.service,
          category: "servico",
          quantity: 1,
          unitPrice: appointment.price,
        },
      ])
    }
  }

  function handleClientSelect(value: string) {
    setClient(value)
    const relatedAppointment = getRelatedAppointmentByClient(value)
    if (!relatedAppointment) return
    if (relatedAppointment.id === appointmentId) return
    handleAppointment(relatedAppointment.id)
  }

  function addProduct() {
    const product = products.find((item) => item.name === productName)
    if (!product) return

    setItems((current) => [
      ...current,
      {
        name: product.name,
        category: "produto",
        quantity: Number(productQuantity) || 1,
        unitPrice: product.price,
      },
    ])
    setProductName("")
    setProductQuantity("1")
  }

  function addService() {
    const service = services.find((item) => item.name === serviceName)
    if (!service) return

    setItems((current) => [
      ...current,
      {
        name: service.name,
        category: "servico",
        quantity: 1,
        unitPrice: service.price,
      },
    ])
    setServiceName("")
  }

  function removeItem(index: number) {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }

  function submit() {
    if (!items.length) return
    if (!client) return
    if (!barber) return

    if (status === COMMAND_STATUS.PAID && !isBarberSession) {
      window.alert("Somente o barbeiro pode fechar uma comanda.")
      return
    }

    if (status === COMMAND_STATUS.PAID) {
      const shouldClose = window.confirm(
        "Deseja adicionar algum servico ou produto antes de fechar esta comanda?"
      )

      if (!shouldClose) return
    }

    const createdAt =
      editingComanda?.createdAt ?? new Date().toISOString()
    const updatedAt = new Date().toISOString()
    const openedAt = editingComanda?.openedAt ?? createdAt
    const closedAt =
      status === COMMAND_STATUS.PAID ? updatedAt : editingComanda?.closedAt

    const financialMeta = getPaymentFinancialMetadata(payment)
    const shouldCreatePayment = status === COMMAND_STATUS.PAID
    const parsedTotal = Number(total.toFixed(2))
    const paymentAmount = parsedTotal

    const comanda: Comanda = {
      id: editingComanda?.id ?? `CMD-${nextNumber}`,
      type: "attendance",
      time:
        editingComanda?.time ??
        new Intl.DateTimeFormat("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      appointmentId: appointmentId || editingComanda?.appointmentId,
      mainService:
        items.find((item) => item.category === "servico")?.name ?? serviceName,
      appointmentDate:
        appointments.find((item) => item.id === appointmentId)?.date ??
        editingComanda?.appointmentDate,
      appointmentStart:
        appointments.find((item) => item.id === appointmentId)?.start ??
        editingComanda?.appointmentStart,
      createdAt,
      updatedAt,
      openedAt,
      closedAt,
      client,
      barber,
      chair,
      status,
      payment,
      items,
      payments: shouldCreatePayment
        ? [
            {
              id: `PAY-${Date.now()}`,
              commandId: editingComanda?.id ?? `CMD-${nextNumber}`,
              amount: paymentAmount,
              method: payment,
              status: PAYMENT_STATUS.PAID,
              paidAt: updatedAt,
              financialOrigin: financialMeta.financialOrigin,
              processingChannel: financialMeta.processingChannel,
              isPlatformBalanceEligible: financialMeta.isPlatformBalanceEligible,
              releaseStatus: financialMeta.releaseStatus,
            },
          ]
        : editingComanda?.payments,
      notes:
        "Comanda de atendimento. Fechamento manual pelo barbeiro.",
    }

    onSave(comanda)
    reset()
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) reset()
    onOpenChange(nextOpen)
  }

  function goNext() {
    setStep((current) => Math.min(current + 1, lastStep))
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0))
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="grid grid-rows-[auto_auto_minmax(0,1fr)_auto] sm:h-[min(38rem,calc(100dvh-1rem))] sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b p-3 sm:p-4">
          <DialogTitle className="flex items-center gap-2">
            <HugeiconsIcon icon={CashierIcon} size={18} />
            {editing ? "Editar comanda" : "Criar nova comanda"}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-foreground">
              {step + 1}/{steps.length}
            </span>
            <span>{steps[step]}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="border-b px-3 py-2 sm:px-4">
          <ComandaStepper steps={steps} currentStep={step} />
        </div>

        <ScrollArea className="h-full min-h-0">
          <div className="h-full space-y-4 overflow-y-auto p-3 pr-4 sm:p-4 sm:pr-5">
            {step === 0 ? (
              <section className="grid gap-3 rounded-md border bg-muted/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold">Dados da comanda</h3>
                  <span className="text-xs text-muted-foreground">
                    {editing ? editingComanda?.id : "Campos obrigatorios"}
                  </span>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label>Agendamento</Label>
                    <Select
                      value={appointmentId}
                      onValueChange={handleAppointment}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar agendamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {appointments.map((appointment) => (
                          <SelectItem
                            key={appointment.id}
                            value={appointment.id}
                          >
                            {appointment.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-4">
                  <div className="grid gap-1.5 md:col-span-2">
                    <Label>Cliente</Label>
                    <Select value={client} onValueChange={handleClientSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecionar cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {registeredClients.map((item) => (
                          <SelectItem key={item.id} value={item.name}>
                            <span className="flex min-w-0 flex-col gap-0.5">
                              <span className="truncate font-medium">
                                {item.name}
                              </span>
                              <span className="truncate text-xs text-muted-foreground">
                                {item.phone} - {item.favoriteService}
                              </span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Barbeiro</Label>
                    <Select value={barber} onValueChange={setBarber}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {barberOptions.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Cadeira</Label>
                    <Select value={chair} onValueChange={setChair}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {chairOptions.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </section>
            ) : null}

            {step === 1 ? (
              <section className="grid gap-3 rounded-md border bg-background p-3">
                <h3 className="text-sm font-semibold">Servicos</h3>
                <div className="grid gap-2 md:grid-cols-[1fr_2.25rem]">
                  <Select value={serviceName} onValueChange={setServiceName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Servico" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.name} value={service.name}>
                          {service.name} - {formatCurrency(service.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    size="icon"
                    aria-label="Adicionar servico"
                    onClick={addService}
                  >
                    <HugeiconsIcon icon={Add01Icon} size={18} />
                  </Button>
                </div>
                <ItemsList
                  items={items.filter((item) => item.category === "servico")}
                  allItems={items}
                  onRemove={removeItem}
                  empty="Nenhum servico adicionado."
                />
              </section>
            ) : null}

            {step === 2 ? (
              <section className="grid gap-3 rounded-md border bg-background p-3">
                <h3 className="text-sm font-semibold">Produtos</h3>
                <div className="grid gap-2 md:grid-cols-[1fr_2.25rem]">
                  <Select value={productName} onValueChange={setProductName}>
                    <SelectTrigger>
                      <SelectValue placeholder="Produto" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((product) => (
                        <SelectItem key={product.name} value={product.name}>
                          {product.name} - {formatCurrency(product.price)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    size="icon"
                    aria-label="Adicionar produto"
                    onClick={addProduct}
                  >
                    <HugeiconsIcon icon={Add01Icon} size={18} />
                  </Button>
                </div>
                <div className="grid gap-2 sm:grid-cols-[9rem_1fr]">
                  <div className="grid gap-1.5">
                    <Label>Quantidade</Label>
                    <Input
                      value={productQuantity}
                      onChange={(event) =>
                        setProductQuantity(event.target.value)
                      }
                      inputMode="numeric"
                    />
                  </div>
                </div>
                <ItemsList
                  items={items.filter((item) => item.category === "produto")}
                  allItems={items}
                  onRemove={removeItem}
                  empty="Nenhum produto adicionado."
                />
              </section>
            ) : null}

            {step === 3 ? (
              <section className="grid gap-4">
                <div className="grid gap-3 rounded-md border bg-muted/20 p-3 md:grid-cols-3">
                  <div className="grid gap-1.5">
                    <Label>Status</Label>
                    <Select
                      value={status}
                      onValueChange={(value) =>
                        setStatus(value as ComandaStatus)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={COMMAND_STATUS.OPEN}>
                          Aberta
                        </SelectItem>
                        <SelectItem value={COMMAND_STATUS.PENDING}>
                          Pendente
                        </SelectItem>
                        {isBarberSession ? (
                          <SelectItem value={COMMAND_STATUS.PAID}>
                            Paga
                          </SelectItem>
                        ) : null}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Pagamento</Label>
                    <Select value={payment} onValueChange={setPayment}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentOptions.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="rounded-md border bg-card p-3">
                    <p className="text-xs text-muted-foreground">
                      Total da comanda
                    </p>
                    <p className="mt-1 text-2xl font-semibold">
                      {formatCurrency(total)}
                    </p>
                  </div>
                </div>

                <div className="rounded-md border bg-background p-3">
                  <h3 className="text-sm font-semibold">Resumo</h3>
                  <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <SummaryInfo
                      label="Cliente"
                      value={client || "Selecionar cliente"}
                    />
                    <SummaryInfo label="Barbeiro" value={barber} />
                    <SummaryInfo label="Cadeira" value={chair} />
                    <SummaryInfo label="Itens" value={String(items.length)} />
                  </div>
                  <div className="mt-3">
                    <ItemsList
                      items={items}
                      allItems={items}
                      onRemove={removeItem}
                      empty="Nenhum item adicionado."
                    />
                  </div>
                </div>
              </section>
            ) : null}
          </div>
        </ScrollArea>

        <DialogFooter className="shrink-0 border-t p-3 sm:p-4">
          <div className="grid w-full gap-2 sm:flex sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <div className="grid gap-2 sm:flex">
              {step > 0 ? (
                <Button type="button" variant="outline" onClick={goBack}>
                  Voltar
                </Button>
              ) : null}
              {step < lastStep ? (
                <Button type="button" onClick={goNext}>
                  Proximo
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={!client || !items.length}
                  onClick={submit}
                >
                  {editing ? "Salvar" : "Enviar"}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ComandaStepper({
  steps,
  currentStep,
}: {
  steps: string[]
  currentStep: number
}) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {steps.map((item, index) => {
        const isActive = index === currentStep
        const isDone = index < currentStep

        return (
          <div key={item} className="min-w-0">
            <div
              className={cn(
                "h-1 rounded-full bg-muted",
                (isActive || isDone) && "bg-primary"
              )}
            />
            <p
              className={cn(
                "mt-1 hidden truncate text-[11px] font-medium text-muted-foreground sm:block",
                isActive && "text-foreground"
              )}
            >
              {item}
            </p>
          </div>
        )
      })}
    </div>
  )
}

function ItemsList({
  items,
  allItems,
  onRemove,
  empty,
}: {
  items: ComandaItem[]
  allItems: ComandaItem[]
  onRemove: (index: number) => void
  empty: string
}) {
  if (!items.length) {
    return (
      <div className="flex min-h-16 items-center justify-center rounded-md border border-dashed bg-muted/20 px-3 text-center text-sm font-medium text-muted-foreground">
        {empty}
      </div>
    )
  }

  return (
    <div className="grid gap-2">
      {items.map((item) => {
        const itemIndex = allItems.indexOf(item)

        return (
          <div
            key={`${item.name}-${itemIndex}`}
            className="grid grid-cols-[minmax(0,1fr)_4rem_5.5rem_2rem] items-center gap-2 rounded-md border bg-muted/20 px-3 py-2 text-sm"
          >
            <span className="min-w-0 truncate font-medium">{item.name}</span>
            <span className="text-center text-muted-foreground">
              {item.quantity}x
            </span>
            <span className="text-right font-semibold">
              {formatCurrency(item.quantity * item.unitPrice)}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={`Remover ${item.name}`}
              onClick={() => onRemove(itemIndex)}
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} />
            </Button>
          </div>
        )
      })}
    </div>
  )
}

function SummaryInfo({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-muted/40 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-medium">{value}</p>
    </div>
  )
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
    releaseStatus: undefined,
  }
}

function CashRegisterCloseModal({
  open,
  onOpenChange,
  cashRegister,
  cashBalance,
  receivedTotal,
  pendingTotal,
  expectedTotal,
  openCount,
  pendingCount,
  paidCount,
  onConfirm,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  cashRegister: CashRegister
  cashBalance: number
  receivedTotal: number
  pendingTotal: number
  expectedTotal: number
  openCount: number
  pendingCount: number
  paidCount: number
  onConfirm: () => void
}) {
  const [notes, setNotes] = useState(cashRegister.notes ?? "")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="grid grid-rows-[auto_auto_minmax(0,1fr)_auto] sm:h-[min(38rem,calc(100dvh-1rem))] sm:max-w-2xl">
        <DialogHeader className="border-b p-3 sm:p-4">
          <DialogTitle>Fechamento de caixa</DialogTitle>
          <DialogDescription>
            Resumo visual do caixa atual antes de confirmar o fechamento.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="min-h-0">
          <div className="grid gap-4 p-3 sm:p-4">
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryInfo label="Status" value={cashRegister.status === "open" ? "Aberto" : "Fechado"} />
              <SummaryInfo label="Esperado" value={formatCurrency(expectedTotal)} />
              <SummaryInfo label="Recebido" value={formatCurrency(receivedTotal)} />
              <SummaryInfo label="Pendente" value={formatCurrency(pendingTotal)} />
              <SummaryInfo label="Saldo projetado" value={formatCurrency(cashBalance)} />
            </div>

            <div className="grid gap-2 rounded-md border bg-muted/20 p-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Comandas pagas</span>
                <span className="font-semibold">{paidCount}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Comandas abertas</span>
                <span className="font-semibold">{openCount}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Comandas pendentes</span>
                <span className="font-semibold">{pendingCount}</span>
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label>Observacao do fechamento</Label>
              <Input
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Troco conferido, pendencias enviadas, etc."
              />
              <p className="text-xs text-muted-foreground">
                Esta nota fica apenas como referencia visual nesta fase.
              </p>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="border-t p-3 sm:p-4">
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={() => {
                onConfirm()
                setNotes("")
              }}
            >
              Confirmar fechamento
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


