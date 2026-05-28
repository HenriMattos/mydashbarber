import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowRight01Icon,
  Calendar03Icon,
  Message01Icon,
  PlusSignCircleIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import {
  getClientCardSummary,
  getClientContactLink,
  getClientStatusLabel,
  getClientStatusTone,
  getClientSubscriptionLabel,
  getClientSubscriptionTone,
  getClientTags,
  getClientTypeLabel,
  getClientTypeTone,
} from "@/components/admin/clientes-data"
import { SectionCard } from "@/components/admin/section-card"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/admin/empty-state"
import { database } from "@/components/admin/database"
import {
  COMMAND_STATUS,
  SUBSCRIPTION_STATUS,
  type SubscriptionStatus,
  type ClientTimelineItem,
} from "@/types"
import { cn } from "@/lib/utils"
import { formatDateForDisplay } from "@/components/admin/date-utils"

export default async function ClienteDetalhePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const clientId = Number(id)
  const client = database.clients.find((item) => item.id === clientId)

  if (!client) {
    notFound()
  }

  const subscription = client.planName
    ? database.subscriptions.find((item) => item.clientId === client.id)
    : undefined
  const agendaEvents = database.agendaEvents.filter((event) => event.title === client.name)
  const comandas = database.comandas.filter((item) => item.client === client.name)
  const history = buildClientHistory(client, agendaEvents, comandas)
  const summary = getClientCardSummary(client)
  const tags = getClientTags(client)
  const openCommand = comandas.find(
    (item) => item.status !== COMMAND_STATUS.PAID
  )

  return (
    <div className="grid gap-4">
      <SectionCard
        title="Ficha do cliente"
          description="Resumo operacional do relacionamento, plano, retorno e pendencias"
        action={
          <Button size="sm" asChild>
            <Link href="/clientes/listagem">
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
              Voltar
            </Link>
          </Button>
        }
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.6fr)]">
          <div className="rounded-md border bg-background p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-2xl font-semibold">{client.name}</h1>
                  <StatusBadge tone={getClientTypeTone(client.clientType)}>
                    {getClientTypeLabel(client.clientType)}
                  </StatusBadge>
                  <StatusBadge tone={getClientStatusTone(client.status)}>
                    {getClientStatusLabel(client.status)}
                  </StatusBadge>
                  {subscription ? (
                    <StatusBadge tone={getClientSubscriptionTone(subscription)}>
                      {getClientSubscriptionLabel(subscription)}
                    </StatusBadge>
                  ) : null}
                </div>

                <p className="mt-2 text-sm text-muted-foreground">
                  {client.phone} - {client.email}
                </p>
                <p className="mt-2 text-sm font-medium text-muted-foreground">
                  {summary.planLabel}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {summary.returnLabel}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-xs font-medium",
                        tag === "Comanda pendente"
                          ? "border-amber-300 bg-amber-50 text-amber-800"
                          : tag === "Retorno recomendado"
                            ? "border-sky-300 bg-sky-50 text-sky-800"
                            : tag === "Proximo agendamento"
                              ? "border-primary/30 bg-primary/10 text-primary"
                              : "border-border bg-muted text-muted-foreground"
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-2 lg:w-[16rem]">
                <Button variant="outline" size="sm" asChild className="justify-start">
                  <Link href={`/agenda?cliente=${client.id}`}>
                    <HugeiconsIcon icon={Calendar03Icon} size={16} />
                    Agendar
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="justify-start">
                  <Link href={`/caixa?cliente=${client.id}`}>
                    <HugeiconsIcon icon={Wallet01Icon} size={16} />
                    Abrir comanda
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="justify-start">
                  <Link href={getClientContactLink(client)} target="_blank">
                    <HugeiconsIcon icon={Message01Icon} size={16} />
                    WhatsApp
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="justify-start">
                  <Link href="/planos/gerenciar">
                    <HugeiconsIcon icon={PlusSignCircleIcon} size={16} />
                    Oferecer plano
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <InfoTile
                label="Ultima visita"
                value={formatDateForDisplay(client.lastVisit)}
              />
              <InfoTile
                label="Proximo agendamento"
                value={
                  client.nextAppointmentAt
                    ? formatDateForDisplay(client.nextAppointmentAt)
                    : "Sem agendamento"
                }
              />
              <InfoTile label="Ticket medio" value={formatCurrency(client.averageTicket)} />
              <InfoTile label="Total gasto" value={formatCurrency(client.totalSpent)} />
            </div>
          </div>

          <div className="grid gap-4">
            <SectionCard title="Plano e beneficios" description="Resumo do plano atual e saldo">
              {subscription ? (
                <div className="grid gap-3">
                  <div className="rounded-md border bg-background p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="text-base">{subscription.plan}</strong>
                      <StatusBadge tone={getClientSubscriptionTone(subscription)}>
                        {getClientSubscriptionLabel(subscription)}
                      </StatusBadge>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Inicio: {formatDateForDisplay(subscription.startedAt)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Proxima cobranca: {formatDateForDisplay(subscription.nextCharge)}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Valor: {formatCurrency(subscription.value)}
                    </p>
                    {subscription.alert ? (
                      <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900">
                        {subscription.alert}
                      </p>
                    ) : null}
                    {subscription.notes ? (
                      <p className="mt-3 text-sm text-muted-foreground">
                        {subscription.notes}
                      </p>
                    ) : null}
                  </div>

                  <div className="grid gap-2">
                    {subscription.benefitBalances.map((balance) => (
                      <div
                        key={balance.serviceId}
                        className="rounded-md border bg-muted/25 px-3 py-2"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium">{balance.serviceName}</p>
                          <span className="text-xs text-muted-foreground">
                            {balance.available} disponivel
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {balance.reserved} reservado - {balance.consumed} consumido
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-2 md:grid-cols-3">
                    <InfoTile
                      label="Ultimo uso"
                      value={subscription.lastUsageAt ? formatDateForDisplay(subscription.lastUsageAt) : "Sem uso"}
                    />
                    <InfoTile
                      label="Proximo agendamento"
                      value={
                        subscription.nextAppointmentAt
                          ? formatDateForDisplay(subscription.nextAppointmentAt)
                          : "Sem reserva"
                      }
                    />
                    <InfoTile
                      label="Status do plano"
                      value={subscriptionStatusLabel(subscription.status)}
                    />
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={Calendar03Icon}
                  title="Sem plano ativo"
                  description="Este cliente esta como avulso ou sem assinatura ativa no momento."
                />
              )}
            </SectionCard>

            <SectionCard title="Acoes rapidas" description="Atalhos para rotina do barbeiro">
              <div className="grid gap-2 sm:grid-cols-2">
                <QuickAction label="Ver assinatura" value={subscription ? "Abrir" : "Sem plano"} />
                <QuickAction label="Adicionar observacao" value="Registrar" />
                <QuickAction label="Editar cliente" value="Ajustar cadastro" />
                <QuickAction
                  label="WhatsApp"
                  value={client.whatsappEnabled ? "Disponivel" : "Nao informado"}
                />
              </div>
            </SectionCard>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <SectionCard title="Historico recente" description="Atendimentos, comandas e observacoes">
          {history.length === 0 ? (
            <EmptyState
              icon={Calendar03Icon}
              title="Sem historico recente"
              description="Este cliente ainda nao possui eventos suficientes para exibir na ficha."
              className="min-h-[220px]"
            />
          ) : (
            <div className="grid gap-3">
              {history.map((item) => (
                <article
                  key={item.id}
                  className="rounded-md border bg-background p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDateForDisplay(item.date)}
                        {item.professional ? ` · ${item.professional}` : ""}
                      </p>
                    </div>
                    <StatusBadge tone={getTimelineTone(item.kind)}>
                      {getTimelineLabel(item.kind)}
                    </StatusBadge>
                  </div>
                  {item.detail ? (
                    <p className="mt-3 text-sm text-muted-foreground">{item.detail}</p>
                  ) : null}
                </article>
              ))}
            </div>
          )}
        </SectionCard>

        <SectionCard title="Preferencias e observacoes" description="Continuidade de atendimento">
          <div className="grid gap-3">
            <InfoTile
              label="Servico preferido"
              value={client.favoriteService}
            />
            <InfoTile
              label="Profissional preferido"
              value={client.preferredProfessional || "Nao informado"}
            />
            <InfoTile
              label="Frequencia"
              value={client.frequencyLabel || "Nao informada"}
            />
            <div className="rounded-md border bg-background p-3">
              <p className="text-xs text-muted-foreground">Observacoes internas</p>
              <p className="mt-1 text-sm text-foreground">
                {client.internalNotes || "Sem observacoes internas registradas."}
              </p>
            </div>
            <div className="rounded-md border bg-background p-3">
              <p className="text-xs text-muted-foreground">Resumo operacional</p>
              <p className="mt-1 text-sm text-foreground">
                {client.returnRecommendation || client.lastAttendanceSummary || "Cliente em acompanhamento."}
              </p>
            </div>
            {openCommand ? (
              <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
                Existe uma comanda pendente para este cliente.
              </div>
            ) : null}
            {client.clientType === "assinante_inadimplente" ? (
              <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-900">
                Cliente assinante inadimplente: confira antes de aplicar beneficio.
              </div>
            ) : null}
          </div>
        </SectionCard>
      </div>
    </div>
  )
}

function buildClientHistory(
  client: NonNullable<ReturnType<typeof database.clients.find>>,
  agendaEvents: typeof database.agendaEvents,
  comandas: typeof database.comandas
): ClientTimelineItem[] {
  const fromClient = client.history ?? []
  const fromAgenda = agendaEvents.map((event) => ({
    id: `agenda-${event.id}`,
    date: event.date,
    title: event.detail || "Agendamento registrado",
    detail: event.notes,
    kind: "agendamento" as const,
    status: event.status,
    professional: event.barber,
  }))
  const fromCommands = comandas.map((command) => ({
    id: `command-${command.id}`,
    date: client.lastVisit,
    title: command.status === COMMAND_STATUS.PAID ? "Comanda paga" : "Comanda pendente",
    detail: command.notes,
    kind: "comanda" as const,
    status: command.status,
    professional: command.barber,
    amount: command.paidTotal ?? command.subtotal ?? 0,
    commandId: command.id,
  }))

  return [...fromClient, ...fromAgenda, ...fromCommands]
    .sort((a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime())
    .slice(0, 8)
}

function getTimelineLabel(kind: ClientTimelineItem["kind"]) {
  const labels: Record<ClientTimelineItem["kind"], string> = {
    atendimento: "Atendimento",
    agendamento: "Agendamento",
    comanda: "Comanda",
    assinatura: "Assinatura",
    nota: "Nota",
  }
  return labels[kind]
}

function getTimelineTone(kind: ClientTimelineItem["kind"]) {
  const tones: Record<ClientTimelineItem["kind"], "green" | "amber" | "red" | "blue" | "neutral"> = {
    atendimento: "green",
    agendamento: "blue",
    comanda: "amber",
    assinatura: "green",
    nota: "neutral",
  }
  return tones[kind]
}

function subscriptionStatusLabel(status: SubscriptionStatus) {
  const labels = {
    [SUBSCRIPTION_STATUS.ACTIVE]: "Ativa",
    [SUBSCRIPTION_STATUS.DELINQUENT]: "Inadimplente",
    [SUBSCRIPTION_STATUS.PAUSED]: "Pausada",
    [SUBSCRIPTION_STATUS.CANCELLED]: "Cancelada",
    [SUBSCRIPTION_STATUS.EXPIRED]: "Expirada",
  }
  return labels[status]
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] bg-muted/35 px-4 py-3">
      <p className="text-[11px] font-black tracking-[0.08em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">{value}</p>
    </div>
  )
}

function QuickAction({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-background p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold">{value}</p>
    </div>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number)
  return new Date(year, month - 1, day)
}

