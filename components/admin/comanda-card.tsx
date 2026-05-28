import { StatusBadge } from "@/components/admin/status-badge"
import {
  type Comanda,
  getAttendanceLabel,
  getClientTypeLabel,
  getCommandBalanceLabel,
  getComandaCoveredTotal,
  formatCurrency,
  getComandaSubtotal,
  getComandaPaidTotal,
  getComandaPendingTotal,
  getComandaTotal,
  getOriginLabel,
  getStatusLabel,
  getStatusTone,
} from "@/components/admin/caixa-data"
import { cn } from "@/lib/utils"

export function ComandaCard({
  comanda,
  action,
}: {
  comanda: Comanda
  action?: React.ReactNode
}) {
  if (!comanda) return null
  const subtotal = getComandaSubtotal(comanda)
  const coveredTotal = getComandaCoveredTotal(comanda)
  const total = getComandaTotal(comanda)
  const paidTotal = getComandaPaidTotal(comanda)
  const pendingTotal = getComandaPendingTotal(comanda)
  const serviceCount = comanda.items.filter(
    (item) => item.category === "servico"
  ).length
  const productCount = comanda.items.filter(
    (item) => item.category === "produto"
  ).length

  return (
    <article className="rounded-md border bg-background p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <ComandaHeader comanda={comanda} action={action} />

        <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4 lg:min-w-[30rem]">
          <ComandaMiniInfo label="Servicos" value={String(serviceCount)} />
          <ComandaMiniInfo label="Produtos" value={String(productCount)} />
          <ComandaMiniInfo label="Pago" value={formatCurrency(paidTotal)} />
          <ComandaMiniInfo label="Total" value={formatCurrency(total)} strong />
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-md border">
        <div className="grid grid-cols-[minmax(0,1fr)_3rem_5rem] bg-muted/70 px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
          <span>Item</span>
          <span className="text-center">Qtd</span>
          <span className="text-right">Valor</span>
        </div>
        <div className="divide-y">
          {comanda.items.map((item) => (
            <div
              key={`${comanda.id}-${item.name}`}
              className="grid grid-cols-[minmax(0,1fr)_3rem_5rem] px-3 py-2 text-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{item.name}</p>
                <p className="text-xs capitalize text-muted-foreground">
                  {item.category}
                </p>
              </div>
              <span className="text-center text-muted-foreground">
                {item.quantity}
              </span>
              <span className="text-right font-medium">
                {formatCurrency(item.quantity * item.unitPrice)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-2 rounded-md bg-muted/30 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1 text-muted-foreground">
          <p>Subtotal: {formatCurrency(subtotal)}</p>
          {coveredTotal > 0 ? <p>Plano: -{formatCurrency(coveredTotal)}</p> : null}
          {comanda.discount ? (
            <p>Desconto: -{formatCurrency(comanda.discount)}</p>
          ) : null}
          {pendingTotal > 0 ? <p>Pendente: {formatCurrency(pendingTotal)}</p> : null}
          {comanda.notes ? <p>Obs.: {comanda.notes}</p> : null}
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Total da comanda
          </p>
          <p className="text-xl font-semibold">{formatCurrency(total)}</p>
        </div>
      </div>
    </article>
  )
}

export function LatestComandaCard({
  comanda,
  action,
}: {
  comanda: Comanda
  action?: React.ReactNode
}) {
  if (!comanda) return null
  const total = getComandaTotal(comanda)
  const services = comanda.items
    .filter((item) => item.category === "servico")
    .map((item) => item.name)
    .join(", ")

  return (
    <article className="rounded-md border bg-background p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <ComandaHeader comanda={comanda} action={action} />

        <div className="rounded-md border bg-muted/30 px-3 py-2 sm:text-right">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            Total
          </p>
          <p className="text-xl font-semibold">{formatCurrency(total)}</p>
        </div>
      </div>

      <div className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
        <ComandaMiniInfo label="Servicos" value={services} />
        <ComandaMiniInfo label="Itens" value={String(comanda.items.length)} />
        <ComandaMiniInfo label="Pagamento" value={comanda.payment} />
      </div>
    </article>
  )
}

function ComandaHeader({
  comanda,
  action,
}: {
  comanda: Comanda
  action?: React.ReactNode
}) {
  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold">{comanda.id}</span>
            <StatusBadge tone={getStatusTone(comanda.status)}>
              {getStatusLabel(comanda.status)}
            </StatusBadge>
            <StatusBadge tone="neutral">{getClientTypeLabel(comanda)}</StatusBadge>
            <StatusBadge tone="neutral">{getOriginLabel(comanda)}</StatusBadge>
            <StatusBadge tone="amber">{getCommandBalanceLabel(comanda)}</StatusBadge>
            <span className="text-xs text-muted-foreground">
              {comanda.time} - {comanda.chair}
            </span>
          </span>
          <span className="mt-2 grid gap-1 text-sm text-muted-foreground sm:grid-cols-2">
            <span>
              Cliente:{" "}
              <span className="font-medium text-foreground">{comanda.client}</span>
            </span>
            <span>
              Barbeiro:{" "}
              <span className="font-medium text-foreground">{comanda.barber}</span>
            </span>
            <span>
              Atendimento:{" "}
              <span className="font-medium text-foreground">
                {getAttendanceLabel(comanda)}
              </span>
            </span>
            <span>
              Pagamento:{" "}
              <span className="font-medium text-foreground">
                {comanda.paymentMethodLabel ?? comanda.payment}
              </span>
            </span>
          </span>
        </span>
        {action ? <span className="shrink-0">{action}</span> : null}
      </div>
    </div>
  )
}

function ComandaMiniInfo({
  label,
  value,
  strong,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="min-w-0 rounded-md border bg-card px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-0.5 truncate text-sm",
          strong && "font-semibold text-primary"
        )}
      >
        {value}
      </p>
    </div>
  )
}
