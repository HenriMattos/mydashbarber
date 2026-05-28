"use client"

import Link from "next/link"
import { useMemo, useState, type ReactNode } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowLeftRightIcon,
  BankIcon,
  CancelCircleIcon,
  ChartBarLineIcon,
  ChartDecreaseIcon,
  ChartIncreaseIcon,
  CheckmarkCircle01Icon,
  CreditCardIcon,
  Delete02Icon,
  DollarCircleIcon,
  File01Icon,
  InformationCircleIcon,
  MoneyReceiveCircleIcon,
  MoneySendCircleIcon,
  PlusSignCircleIcon,
  ShieldCheck,
  TrendingUp,
  Wallet02Icon,
} from "@hugeicons/core-free-icons"

import { MetricCard } from "@/components/admin/metric-card"
import { EmptyState } from "@/components/admin/empty-state"
import {
  formatDateForDisplay,
  toDateInputValue,
} from "@/components/admin/date-utils"
import { FormGrid, ResponsiveActions } from "@/components/admin/responsive-form"
import { SectionCard } from "@/components/admin/section-card"
import { SimpleTable } from "@/components/admin/simple-table"
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
import { database } from "@/components/admin/database"
import {
  getComandaPaidTotal,
  getComandaPendingTotal,
} from "@/components/admin/caixa-data"
import { getFinancialInsights } from "@/components/admin/financial-insights"
import { COMMAND_STATUS, SUBSCRIPTION_STATUS } from "@/types"

type Tone = "green" | "amber" | "red" | "blue" | "neutral"
type FinancialType = "Receita" | "Despesa"
type AccountStatus = "Ativa" | "Em uso" | "Inativa"
type PaymentStatus = "Ativo" | "Inativo"
type ModalMode = "create" | "edit"

type FinancialMovement = {
  id: number
  date: string
  description: string
  category: string
  account: string
  amount: number
  type: FinancialType
}

type BankAccount = {
  id: number
  name: string
  agency: string
  account: string
  type: string
  balance: number
  status: AccountStatus
}

type FinancialCategory = {
  id: number
  name: string
  description: string
  type: FinancialType
  monthlyAmount: number
  trend: number
}

type PaymentMethod = {
  id: number
  name: string
  description: string
  status: PaymentStatus
  fee: number
  settlement: string
  amount: number
  transactions: number
}

const dialogPanelClass =
  "grid grid-rows-[auto_auto_minmax(0,1fr)_auto] sm:h-[min(40rem,calc(100dvh-1rem))] sm:max-w-2xl"

const initialMovements: FinancialMovement[] = database.financialMovements
const initialMovementIds = new Set(
  initialMovements.map((movement) => movement.id)
)
const initialAccounts: BankAccount[] = database.bankAccounts
const defaultAccountName = initialAccounts[0]?.name ?? "Conta operacional"
const accountOptions = [
  ...initialAccounts.map((account) => account.name),
  "Pix",
]
const initialCategories: FinancialCategory[] = database.financialCategories
const financialCategoryOptions = initialCategories.map(
  (category) => category.name
)
const initialPaymentMethods: PaymentMethod[] = database.paymentMethods
const accountTypeOptions = [
  "Conta corrente",
  "Poupança",
  "Conta salário",
  "Conta pagamento",
  "Cartão de crédito",
  "Caixa interno",
]
const accountStatusOptions: AccountStatus[] = ["Ativa", "Em uso", "Inativa"]
const paymentMethodNameOptions = [
  "Pix",
  "Cartão de crédito",
  "Cartão de débito",
  "Dinheiro",
  "Convênio",
  "Assinatura",
  "Transferência",
]
const paymentSettlementOptions = [
  "Imediato",
  "D+1",
  "D+2",
  "D+7",
  "D+14",
  "D+30",
]
const categoryNameOptions: Record<FinancialType, string[]> = {
  Receita: [
    "Receitas de Serviços",
    "Assinaturas",
    "Produtos",
    "Receitas de coloração",
    "Pacotes e combos",
    "Outras receitas",
  ],
  Despesa: [
    "Aluguel e Utilidades",
    "Comissões",
    "Produtos e insumos",
    "Marketing",
    "Taxas financeiras",
    "Outras despesas",
  ],
}

export function FinanceiroOverview() {
  const [movements, setMovements] = useState(initialMovements)
  const [movementModalType, setMovementModalType] =
    useState<FinancialType | null>(null)
  const [reportOpen, setReportOpen] = useState(false)
  const [feedback, setFeedback] = useState(
    "Nenhuma ação executada nesta sessão."
  )

  const totals = useMemo(
    () =>
      summarizeMovements(
        movements.filter((movement) => !initialMovementIds.has(movement.id))
      ),
    [movements]
  )
  const financialInsights = getFinancialInsights()
  const withdrawalHistory = [
    {
      id: "SW-1021",
      requestedAt: "22/05/2026 10:30",
      amount: 780,
      status: "Concluido",
      expectedAt: "22/05/2026",
    },
    {
      id: "SW-1022",
      requestedAt: "23/05/2026 15:10",
      amount: 460,
      status: "Pendente",
      expectedAt: "24/05/2026",
    },
  ] as const
  const commandPendingTotal = database.comandas.reduce(
    (sum, comanda) => sum + getComandaPendingTotal(comanda),
    0
  )
  const commandPaidTotal = database.comandas.reduce(
    (sum, comanda) => sum + getComandaPaidTotal(comanda),
    0
  )
  const openCommands = database.comandas.filter(
    (comanda) => comanda.status === COMMAND_STATUS.OPEN
  ).length
  const pendingStatusCommands = database.comandas.filter(
    (comanda) => comanda.status === COMMAND_STATUS.PENDING
  ).length
  const pendingCommands = openCommands + pendingStatusCommands
  const activeSubscriptions = database.subscriptions.filter(
    (subscription) => subscription.status === SUBSCRIPTION_STATUS.ACTIVE
  ).length
  const delinquentSubscriptions = database.subscriptions.filter(
    (subscription) => subscription.status === SUBSCRIPTION_STATUS.DELINQUENT
  ).length
  const mrrEstimated = database.subscriptions
    .filter((subscription) => subscription.status === SUBSCRIPTION_STATUS.ACTIVE)
    .reduce((sum, subscription) => sum + subscription.value, 0)
  const clientsWithoutReturn = database.clients.filter(
    (client) => (client.noReturnDays ?? 0) >= 60 || client.status === "sem_retorno"
  ).length
  const clientsWithPendingCommand = database.clients.filter(
    (client) => (client.pendingCommandTotal ?? 0) > 0
  ).length
  const additionalFeeRate =
    database.analytics.monthlyGrossRevenue > 0
      ? database.analytics.paymentFeesEstimated /
        database.analytics.monthlyGrossRevenue
      : 0
  const additionalPaymentFees = Math.round(totals.income * additionalFeeRate)
  const grossRevenue = database.analytics.monthlyGrossRevenue + totals.income
  const expenses =
    database.analytics.monthlyExpenses + totals.expense + additionalPaymentFees
  const operatingProfit = grossRevenue - expenses
  const netRevenue =
    database.analytics.monthlyNetRevenue + totals.income - additionalPaymentFees
  const margin = grossRevenue > 0 ? operatingProfit / grossRevenue : 0

  const overviewRows = [
    ["Receita Bruta", formatCurrency(grossRevenue), "Base consolidada"],
    ["Receita Líquida", formatCurrency(netRevenue), "Apos taxas estimadas"],
    ["Despesas Totais", formatCurrency(expenses), "Custos operacionais"],
    [
      "Lucro Operacional",
      formatCurrency(operatingProfit),
      "Receitas menos despesas",
    ],
    ["Margem Líquida", formatPercent(margin), "Indicador gerencial"],
  ]

  const cashFlowRows = [
    [
      "Entradas",
      formatCurrency(grossRevenue),
      <Trend key="income" tone="green" value="Receita" />,
    ],
    [
      "Saídas",
      formatCurrency(expenses),
      <Trend key="expense" tone="red" value="Despesa" />,
    ],
    [
      "Saldo Inicial",
      formatCurrency(
        database.bankAccounts.reduce((sum, account) => sum + account.balance, 0)
      ),
      <Trend key="initial" tone="blue" value="Contas" />,
    ],
    [
      "Saldo Final",
      formatCurrency(grossRevenue - expenses),
      <Trend key="final" tone="green" value="Projetado" />,
    ],
  ]

  function addMovement(draft: MovementDraft) {
    const next: FinancialMovement = {
      id: Date.now(),
      date: draft.date,
      description: draft.description,
      category: draft.category,
      account: draft.account,
      amount: parseAmount(draft.amount),
      type: draft.type,
    }

    setMovements((current) => [next, ...current])
    setFeedback(`${draft.type} registrada: ${draft.description}.`)
    setMovementModalType(null)
  }

  function exportReport() {
    setFeedback(
      "Relatorio financeiro do periodo atual preparado para exportacao."
    )
    setReportOpen(false)
  }

  return (
    <>
      <div className="admin-metric-grid" data-columns="6">
        <MetricCard
          title="Total vendido no periodo"
          value={formatCurrency(financialInsights.totalSold)}
          change="Servicos e produtos em comandas"
          icon={ChartBarLineIcon}
          tone="blue"
        />
        <MetricCard
          title="Total recebido diretamente"
          value={formatCurrency(financialInsights.directReceivedTotal)}
          change="Pix, dinheiro, maquininha e meios externos"
          icon={MoneyReceiveCircleIcon}
          tone="amber"
        />
        <MetricCard
          title="Total processado pela plataforma"
          value={formatCurrency(financialInsights.platformProcessedTotal)}
          change="Gateway e pagamentos internos"
          icon={ShieldCheck}
          tone="green"
        />
        <MetricCard
          title="Total vindo de assinaturas"
          value={formatCurrency(financialInsights.subscriptionRevenueTotal)}
          change="Receita recorrente dentro da plataforma"
          icon={Wallet02Icon}
          tone="blue"
        />
        <MetricCard
          title="Saldo disponivel para saque"
          value={formatCurrency(financialInsights.platformAvailableToWithdraw)}
          change="Somente valores repassaveis"
          icon={DollarCircleIcon}
          tone="green"
        />
        <MetricCard
          title="Saldo pendente de liberacao"
          value={formatCurrency(financialInsights.platformPendingRelease)}
          change="Aguardando liberacao do processamento"
          icon={InformationCircleIcon}
          tone="amber"
        />
      </div>

      <SectionCard
        title="Historico de saques solicitados"
        description="Solicitacoes de saque do saldo processado pela plataforma"
      >
        <ResponsiveFinancialRows
          columns={["Solicitacao", "Valor", "Status"]}
          rows={withdrawalHistory.map((item) => [
            `${item.id} - ${item.requestedAt}`,
            formatCurrency(item.amount),
            `${item.status} (previsto ${item.expectedAt})`,
          ])}
          primaryLabel="Solicitacao"
          secondaryLabel="Valor"
          tertiaryLabel="Status"
        />
      </SectionCard>

      <div className="admin-metric-grid" data-columns="4">
        <MetricCard
          title="Receita Bruta"
          value={formatCurrency(grossRevenue)}
          change="Clientes, assinaturas e caixa"
          icon={TrendingUp}
          tone="green"
        />
        <MetricCard
          title="Receita Líquida"
          value={formatCurrency(netRevenue)}
          change="Apos taxas estimadas"
          icon={DollarCircleIcon}
          tone="green"
        />
        <MetricCard
          title="Despesas Totais"
          value={formatCurrency(expenses)}
          change="Categorias operacionais"
          icon={ChartDecreaseIcon}
          tone="red"
        />
        <MetricCard
          title="Lucro Operacional"
          value={formatCurrency(operatingProfit)}
          change="Margem sobre a operacao"
          icon={ShieldCheck}
          tone="blue"
        />
      </div>

      <section className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
        <SectionCard
          title="Visão Geral Financeira"
          description="Indicadores-chave de desempenho da barbearia"
        >
          <ResponsiveFinancialRows
            columns={["Indicador", "Valor", "Variação"]}
            rows={overviewRows}
            primaryLabel="Indicador"
            secondaryLabel="Valor"
            tertiaryLabel="Variação"
          />
        </SectionCard>

        <SectionCard
          title="Fluxo de Caixa"
          description="Entradas, saídas e saldo do período"
        >
          <ResponsiveFinancialRows
            columns={["Categoria", "Valor", "Variação"]}
            rows={cashFlowRows}
            primaryLabel="Categoria"
            secondaryLabel="Valor"
            tertiaryLabel="Variação"
          />
        </SectionCard>
      </section>

      <SectionCard
        title="Ações financeiras"
        description="Lançamentos rápidos e rotinas operacionais"
        action={
          <Button size="sm" onClick={() => setReportOpen(true)}>
            <HugeiconsIcon icon={File01Icon} size={16} />
            Relatório
          </Button>
        }
      >
        <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(14rem,auto)] xl:items-center">
          <Button
            className="h-10 w-full"
            onClick={() => setMovementModalType("Receita")}
          >
            <HugeiconsIcon icon={MoneyReceiveCircleIcon} size={17} />
            Registrar receita
          </Button>
          <Button
            className="h-10 w-full"
            variant="outline"
            onClick={() => setMovementModalType("Despesa")}
          >
            <HugeiconsIcon icon={MoneySendCircleIcon} size={17} />
            Registrar despesa
          </Button>
          <p className="min-w-0 rounded-md bg-muted/50 px-3 py-2 text-xs leading-snug text-muted-foreground md:col-span-2 xl:col-span-1 xl:min-w-56">
            {feedback}
          </p>
        </div>
      </SectionCard>

      <SectionCard
        title="Leitura gerencial"
        description="Recebido, pendente, assinatura e clientes em um unico bloco"
      >
        <ResponsiveFinancialRows
          columns={["Indicador", "Valor", "Leitura"]}
          rows={[
            [
              "Receita recebida",
              formatCurrency(commandPaidTotal + totals.income),
              "Comandas pagas e entradas manuais",
            ],
            [
              "Pendente",
              formatCurrency(commandPendingTotal),
              "Comandas abertas e pendentes",
            ],
            [
              "Assinantes ativos",
              String(activeSubscriptions),
              `${delinquentSubscriptions} inadimplentes e MRR estimado de ${formatCurrency(mrrEstimated)}`,
            ],
            [
              "Clientes sem retorno",
              String(clientsWithoutReturn),
              `${clientsWithPendingCommand} clientes com pendencia aberta`,
            ],
            [
              "Ocupacao da agenda",
              `${financialInsights.agendaOccupancy}%`,
              `${financialInsights.todayAppointments} agendamentos e ${financialInsights.completedAppointments} concluidos hoje`,
            ],
            [
              "Comandas pendentes",
              String(pendingCommands),
              `${openCommands} abertas e ${pendingStatusCommands} pendentes`,
            ],
          ]}
          primaryLabel="Indicador"
          secondaryLabel="Valor"
          tertiaryLabel="Leitura"
        />
      </SectionCard>

      <SectionCard
        title="Acesso rápido aos módulos financeiros"
        description="Configure bases e acompanhe operações por área"
      >
        <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <ModuleLink
            href="/financeiro/contas-bancarias"
            icon={<HugeiconsIcon icon={BankIcon} size={22} />}
            title="Contas bancárias"
            description="Saldos, contas, cartão corporativo e movimentações"
          />
          <ModuleLink
            href="/financeiro/categorias"
            icon={<HugeiconsIcon icon={File01Icon} size={22} />}
            title="Categorias financeiras"
            description="Receitas, despesas, metas e performance por grupo"
          />
          <ModuleLink
            href="/financeiro/formas-pagamento"
            icon={<HugeiconsIcon icon={CreditCardIcon} size={22} />}
            title="Formas de pagamento"
            description="Taxas, prazos, status e distribuição das vendas"
          />
        </div>
      </SectionCard>

      <MovementModal
        key={`overview-movement-${movementModalType ?? "closed"}`}
        type={movementModalType ?? "Receita"}
        open={Boolean(movementModalType)}
        onOpenChange={(open) => {
          if (!open) setMovementModalType(null)
        }}
        onSubmit={addMovement}
      />

      <ReportModal
        open={reportOpen}
        onOpenChange={setReportOpen}
        onSubmit={exportReport}
      />
    </>
  )
}

export function ContasBancariasView() {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [movements, setMovements] = useState(initialMovements)
  const [modalMode, setModalMode] = useState<ModalMode | null>(null)
  const [draft, setDraft] = useState<BankAccount | null>(null)
  const [movementAccount, setMovementAccount] = useState<BankAccount | null>(
    null
  )

  const activeBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  )
  const monthIncome = movements
    .filter((movement) => movement.type === "Receita")
    .reduce((sum, movement) => sum + movement.amount, 0)
  const monthExpense = movements
    .filter((movement) => movement.type === "Despesa")
    .reduce((sum, movement) => sum + movement.amount, 0)

  function openCreate() {
    setDraft({
      id: Date.now(),
      name: "",
      agency: "",
      account: "",
      type: "Conta corrente",
      balance: 0,
      status: "Ativa",
    })
    setModalMode("create")
  }

  function openEdit(account: BankAccount) {
    setDraft({ ...account })
    setModalMode("edit")
  }

  function saveAccount() {
    if (!draft) return
    setAccounts((current) =>
      modalMode === "create"
        ? [draft, ...current]
        : current.map((account) => (account.id === draft.id ? draft : account))
    )
    closeAccountModal()
  }

  function removeAccount() {
    if (!draft) return
    setAccounts((current) =>
      current.filter((account) => account.id !== draft.id)
    )
    closeAccountModal()
  }

  function closeAccountModal() {
    setDraft(null)
    setModalMode(null)
  }

  function saveMovement(data: MovementDraft) {
    if (!movementAccount) return
    const amount = parseAmount(data.amount)
    const signedAmount = data.type === "Receita" ? amount : -amount

    setAccounts((current) =>
      current.map((account) =>
        account.id === movementAccount.id
          ? { ...account, balance: account.balance + signedAmount }
          : account
      )
    )
    setMovements((current) => [
      {
        id: Date.now(),
        date: data.date,
        description: data.description,
        category: data.category,
        account: movementAccount.name,
        amount,
        type: data.type,
      },
      ...current,
    ])
    setMovementAccount(null)
  }

  return (
    <>
      <div className="admin-metric-grid">
        <MetricCard
          title="Saldo Total"
          value={formatCurrency(activeBalance)}
          change="Soma das contas cadastradas"
          icon={BankIcon}
          tone="green"
        />
        <MetricCard
          title="Entradas Este Mês"
          value={formatCurrency(monthIncome)}
          change="Movimentos de receita"
          icon={MoneyReceiveCircleIcon}
          tone="green"
        />
        <MetricCard
          title="Saídas Este Mês"
          value={formatCurrency(monthExpense)}
          change="Movimentos de despesa"
          icon={MoneySendCircleIcon}
          tone="red"
        />
      </div>

      <SectionCard
        title="Contas Bancárias Cadastradas"
        description="Gerencie contas, saldos e movimentações da barbearia"
        action={
          <Button size="sm" onClick={openCreate}>
            <HugeiconsIcon icon={PlusSignCircleIcon} size={16} />
            Nova conta
          </Button>
        }
      >
        <div className="grid gap-3 lg:grid-cols-2">
          {accounts.length === 0 ? (
            <div className="lg:col-span-2">
              <EmptyState
                icon={BankIcon}
                title="Nenhuma conta cadastrada"
                description="Cadastre suas contas bancárias para gerenciar saldos e movimentações."
                actionLabel="Nova conta"
                onAction={openCreate}
              />
            </div>
          ) : (
            accounts.map((account) => (
              <FinanceCard key={account.id}>
                <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="min-w-0 font-semibold break-words">
                        {account.name}
                      </h3>
                      <StatusBadge tone={getAccountTone(account.status)}>
                        {account.status}
                      </StatusBadge>
                    </div>
                    <p className="mt-1 text-sm break-words text-muted-foreground">
                      Agência {account.agency} · Conta {account.account}
                    </p>
                  </div>
                  <strong className="text-lg sm:text-right">
                    {formatCurrency(account.balance)}
                  </strong>
                </div>
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  <InfoPill label="Tipo" value={account.type} />
                  <InfoPill
                    label="Saldo"
                    value={formatCurrency(account.balance)}
                  />
                  <InfoPill label="Status" value={account.status} />
                </div>
                <ResponsiveActions className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMovementAccount(account)}
                  >
                    <HugeiconsIcon icon={ArrowLeftRightIcon} size={16} />
                    Movimentar
                  </Button>
                  <Button size="sm" onClick={() => openEdit(account)}>
                    <HugeiconsIcon icon={File01Icon} size={16} />
                    Editar
                  </Button>
                </ResponsiveActions>
              </FinanceCard>
            ))
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Transações Recentes"
        description="Últimas movimentações registradas nesta sessão"
      >
        {movements.length === 0 ? (
          <EmptyState
            icon={InformationCircleIcon}
            title="Nenhuma transação"
            description="As movimentações financeiras recentes aparecerão nesta lista."
            className="min-h-40"
          />
        ) : (
          <SimpleTable
            columns={["Data", "Descrição", "Valor", "Tipo"]}
            rows={movements.map((movement) => [
              movement.date,
              movement.description,
              formatCurrency(movement.amount),
              <StatusBadge
                key={movement.id}
                tone={movement.type === "Receita" ? "green" : "red"}
              >
                {movement.type === "Receita" ? "Entrada" : "Saída"}
              </StatusBadge>,
            ])}
          />
        )}
      </SectionCard>

      <AccountModal
        mode={modalMode ?? "create"}
        draft={draft}
        open={Boolean(modalMode)}
        onOpenChange={(open) => {
          if (!open) closeAccountModal()
        }}
        onChange={setDraft}
        onSave={saveAccount}
        onRemove={modalMode === "edit" ? removeAccount : undefined}
      />

      <MovementModal
        key={`account-movement-${movementAccount?.id ?? "closed"}`}
        type="Receita"
        account={movementAccount?.name}
        open={Boolean(movementAccount)}
        onOpenChange={(open) => {
          if (!open) setMovementAccount(null)
        }}
        onSubmit={saveMovement}
      />
    </>
  )
}

export function CategoriasFinanceirasView() {
  const [categories, setCategories] = useState(initialCategories)
  const [modalMode, setModalMode] = useState<ModalMode | null>(null)
  const [draft, setDraft] = useState<FinancialCategory | null>(null)

  const revenue = categories
    .filter((category) => category.type === "Receita")
    .reduce((sum, category) => sum + category.monthlyAmount, 0)
  const expenses = categories
    .filter((category) => category.type === "Despesa")
    .reduce((sum, category) => sum + category.monthlyAmount, 0)
  const margin = revenue > 0 ? (revenue - expenses) / revenue : 0

  function openCreate() {
    setDraft({
      id: Date.now(),
      name: categoryNameOptions.Receita[0],
      description: "",
      type: "Receita",
      monthlyAmount: 0,
      trend: 0,
    })
    setModalMode("create")
  }

  function openEdit(category: FinancialCategory) {
    setDraft({ ...category })
    setModalMode("edit")
  }

  function duplicateCategory(category: FinancialCategory) {
    setCategories((current) => [
      {
        ...category,
        id: Date.now(),
        name: `${category.name} - cópia`,
      },
      ...current,
    ])
  }

  function saveCategory() {
    if (!draft) return
    setCategories((current) =>
      modalMode === "create"
        ? [draft, ...current]
        : current.map((category) =>
            category.id === draft.id ? draft : category
          )
    )
    closeModal()
  }

  function removeCategory() {
    if (!draft) return
    setCategories((current) =>
      current.filter((category) => category.id !== draft.id)
    )
    closeModal()
  }

  function closeModal() {
    setDraft(null)
    setModalMode(null)
  }

  return (
    <>
      <div className="admin-metric-grid">
        <MetricCard
          title="Total Receitas"
          value={formatCurrency(revenue)}
          change="+9% vs mês anterior"
          icon={ChartIncreaseIcon}
          tone="green"
        />
        <MetricCard
          title="Total Despesas"
          value={formatCurrency(expenses)}
          change="+4% vs mês anterior"
          icon={ChartDecreaseIcon}
          tone="red"
        />
        <MetricCard
          title="Margem Líquida"
          value={formatPercent(margin)}
          change="+2,3 pp vs mês anterior"
          icon={File01Icon}
          tone="blue"
        />
      </div>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
        <SectionCard
          title="Categorias Financeiras"
          description="Organize receitas e despesas para relatórios e metas"
          action={
            <Button size="sm" onClick={openCreate}>
              <HugeiconsIcon icon={PlusSignCircleIcon} size={16} />
              Nova categoria
            </Button>
          }
        >
          <div className="grid gap-3">
            {categories.length === 0 ? (
              <EmptyState
                icon={File01Icon}
                title="Nenhuma categoria"
                description="Organize suas receitas e despesas criando categorias personalizadas."
                actionLabel="Nova categoria"
                onAction={openCreate}
              />
            ) : (
              categories.map((category) => (
                <FinanceCard key={category.id}>
                  <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="min-w-0 font-semibold break-words">
                          {category.name}
                        </h3>
                        <StatusBadge
                          tone={category.type === "Receita" ? "green" : "red"}
                        >
                          {category.type}
                        </StatusBadge>
                      </div>
                      <p className="mt-1 text-sm break-words text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                    <strong className="text-lg md:text-right">
                      {formatCurrency(category.monthlyAmount)}
                    </strong>
                  </div>
                  <ResponsiveActions className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => duplicateCategory(category)}
                    >
                      Duplicar
                    </Button>
                    <Button size="sm" onClick={() => openEdit(category)}>
                      <HugeiconsIcon icon={File01Icon} size={16} />
                      Editar
                    </Button>
                  </ResponsiveActions>
                </FinanceCard>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Performance por Categoria"
          description="Variação percentual das categorias por período"
        >
          {categories.length === 0 ? (
            <EmptyState
              icon={ChartBarLineIcon}
              title="Sem dados de performance"
              description="Acompanhe o crescimento ou queda das suas categorias conforme registra movimentações."
            />
          ) : (
            <SimpleTable
              columns={["Categoria", "Mensal", "Trimestral", "Semestral"]}
              rows={categories.map((category) => [
                category.name,
                <Trend
                  key="m"
                  tone={category.trend >= 0 ? "green" : "red"}
                  value={`${category.trend}%`}
                />,
                <Trend
                  key="t"
                  tone={category.trend >= 0 ? "green" : "red"}
                  value={`${category.trend + 2}%`}
                />,
                <Trend
                  key="s"
                  tone={category.trend >= 0 ? "green" : "red"}
                  value={`${category.trend + 5}%`}
                />,
              ])}
            />
          )}
        </SectionCard>
      </section>

      <CategoryModal
        mode={modalMode ?? "create"}
        draft={draft}
        open={Boolean(modalMode)}
        onOpenChange={(open) => {
          if (!open) closeModal()
        }}
        onChange={setDraft}
        onSave={saveCategory}
        onRemove={modalMode === "edit" ? removeCategory : undefined}
      />
    </>
  )
}

export function FormasPagamentoView() {
  const [methods, setMethods] = useState(initialPaymentMethods)
  const [modalMode, setModalMode] = useState<ModalMode | null>(null)
  const [draft, setDraft] = useState<PaymentMethod | null>(null)
  const [simulationOpen, setSimulationOpen] = useState(false)

  const totalAmount = methods.reduce((sum, method) => sum + method.amount, 0)
  const totalTransactions = methods.reduce(
    (sum, method) => sum + method.transactions,
    0
  )
  const averageTicket =
    totalTransactions > 0 ? totalAmount / totalTransactions : 0
  const activeMethods = methods.filter((method) => method.status === "Ativo")
  const estimatedDailyVolume = Math.round(totalAmount / 30)
  const activeGridRate =
    methods.length > 0 ? activeMethods.length / methods.length : 0

  function openCreate() {
    setDraft({
      id: Date.now(),
      name: paymentMethodNameOptions[0],
      description: "",
      status: "Ativo",
      fee: 0,
      settlement: "Imediato",
      amount: 0,
      transactions: 0,
    })
    setModalMode("create")
  }

  function openEdit(method: PaymentMethod) {
    setDraft({ ...method })
    setModalMode("edit")
  }

  function toggleStatus(method: PaymentMethod) {
    setMethods((current) =>
      current.map((item) =>
        item.id === method.id
          ? { ...item, status: item.status === "Ativo" ? "Inativo" : "Ativo" }
          : item
      )
    )
  }

  function saveMethod() {
    if (!draft) return
    setMethods((current) =>
      modalMode === "create"
        ? [draft, ...current]
        : current.map((method) => (method.id === draft.id ? draft : method))
    )
    closeModal()
  }

  function removeMethod() {
    if (!draft) return
    setMethods((current) => current.filter((method) => method.id !== draft.id))
    closeModal()
  }

  function closeModal() {
    setDraft(null)
    setModalMode(null)
  }

  return (
    <>
      <div className="admin-metric-grid">
        <MetricCard
          title="Transações Hoje"
          value={formatCurrency(estimatedDailyVolume)}
          change="Estimativa diaria pela base mensal"
          icon={Wallet02Icon}
          tone="green"
        />
        <MetricCard
          title="Ticket Médio"
          value={formatCurrency(averageTicket)}
          change={`${totalTransactions} transacoes no periodo`}
          icon={ArrowLeftRightIcon}
          tone="blue"
        />
        <MetricCard
          title="Formas Ativas"
          value={String(activeMethods.length)}
          change={`${formatPercent(activeGridRate)} da grade ativa`}
          icon={CheckmarkCircle01Icon}
          tone="green"
        />
      </div>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)]">
        <SectionCard
          title="Formas de Pagamento Cadastradas"
          description="Gerencie as formas aceitas, taxas e prazos de liquidação"
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSimulationOpen(true)}
              >
                Simular taxa
              </Button>
              <Button size="sm" onClick={openCreate}>
                <HugeiconsIcon icon={PlusSignCircleIcon} size={16} />
                Nova forma
              </Button>
            </div>
          }
        >
          <div className="grid gap-3">
            {methods.length === 0 ? (
              <EmptyState
                icon={CreditCardIcon}
                title="Nenhuma forma de pagamento"
                description="Ative as formas de pagamento que sua barbearia aceita."
                actionLabel="Nova forma"
                onAction={openCreate}
              />
            ) : (
              methods.map((method) => (
                <FinanceCard key={method.id}>
                  <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="min-w-0 font-semibold break-words">
                          {method.name}
                        </h3>
                        <StatusBadge
                          tone={method.status === "Ativo" ? "green" : "neutral"}
                        >
                          {method.status}
                        </StatusBadge>
                      </div>
                      <p className="mt-1 text-sm break-words text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                    <strong className="text-lg md:text-right">
                      {formatCurrency(method.amount)}
                    </strong>
                  </div>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    <InfoPill label="Taxa" value={`${method.fee.toFixed(2)}%`} />
                    <InfoPill label="Liquidação" value={method.settlement} />
                    <InfoPill
                      label="Transações"
                      value={String(method.transactions)}
                    />
                  </div>
                  <ResponsiveActions className="mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(method)}
                    >
                      <HugeiconsIcon
                        icon={
                          method.status === "Ativo"
                            ? CancelCircleIcon
                            : CheckmarkCircle01Icon
                        }
                        size={16}
                      />
                      {method.status === "Ativo" ? "Desativar" : "Ativar"}
                    </Button>
                    <Button size="sm" onClick={() => openEdit(method)}>
                      <HugeiconsIcon icon={File01Icon} size={16} />
                      Editar
                    </Button>
                  </ResponsiveActions>
                </FinanceCard>
              ))
            )}
          </div>
        </SectionCard>

        <SectionCard
          title="Distribuição por Forma de Pagamento"
          description="Percentual de uso de cada forma no mês"
        >
          <SimpleTable
            columns={["Forma", "% do total", "Valor", "Transações"]}
            rows={methods.map((method) => [
              method.name,
              formatPercent(totalAmount > 0 ? method.amount / totalAmount : 0),
              formatCurrency(method.amount),
              `${method.transactions} transações`,
            ])}
          />
        </SectionCard>
      </section>

      <PaymentMethodModal
        mode={modalMode ?? "create"}
        draft={draft}
        open={Boolean(modalMode)}
        onOpenChange={(open) => {
          if (!open) closeModal()
        }}
        onChange={setDraft}
        onSave={saveMethod}
        onRemove={modalMode === "edit" ? removeMethod : undefined}
      />

      <FeeSimulationModal
        open={simulationOpen}
        methods={methods}
        onOpenChange={setSimulationOpen}
      />
    </>
  )
}

type MovementDraft = {
  type: FinancialType
  date: string
  description: string
  category: string
  account: string
  amount: string
}

function MovementModal({
  type,
  account,
  open,
  onOpenChange,
  onSubmit,
}: {
  type: FinancialType
  account?: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (draft: MovementDraft) => void
}) {
  const [draft, setDraft] = useState<MovementDraft>(() => ({
    type,
    date: "2026-04-28",
    description: "",
    category:
      type === "Receita" ? "Receitas de Serviços" : "Aluguel e Utilidades",
    account: account ?? defaultAccountName,
    amount: "",
  }))

  function update<Key extends keyof MovementDraft>(
    key: Key,
    value: MovementDraft[Key]
  ) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function submit() {
    if (!draft.description.trim() || !draft.amount.trim()) return
    onSubmit({
      ...draft,
      type,
      date: formatDateForDisplay(draft.date),
      account: account ?? draft.account,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogPanelClass}>
        <DialogHeader>
          <DialogTitle>
            {type === "Receita" ? "Registrar receita" : "Registrar despesa"}
          </DialogTitle>
          <DialogDescription>
            O lançamento entra imediatamente nas tabelas desta sessão.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="min-h-0">
          <div className="grid gap-4 p-4 sm:grid-cols-2">
            <Field label="Data">
              <Input
                type="date"
                value={draft.date}
                min="2026-01-01"
                max="2026-12-31"
                onChange={(event) =>
                  update("date", toDateInputValue(event.target.value))
                }
              />
            </Field>
            <Field label="Valor">
              <Input
                value={draft.amount}
                inputMode="decimal"
                placeholder="0,00"
                maxLength={14}
                onChange={(event) =>
                  update("amount", formatCurrencyInput(event.target.value))
                }
              />
            </Field>
            <Field className="sm:col-span-2" label="Descrição">
              <Input
                value={draft.description}
                placeholder={
                  type === "Receita"
                    ? "Ex: Recebimento - corte premium"
                    : "Ex: Pagamento - fornecedor"
                }
                maxLength={80}
                onChange={(event) =>
                  update("description", limitText(event.target.value, 80))
                }
              />
            </Field>
            <Field label="Categoria">
              <Select
                value={draft.category}
                onValueChange={(value) => update("category", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {financialCategoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                  <SelectItem value="Transferências">Transferências</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label="Conta">
              <Select
                value={account ?? draft.account}
                disabled={Boolean(account)}
                onValueChange={(value) => update("account", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {accountOptions.map((accountName) => (
                    <SelectItem key={accountName} value={accountName}>
                      {accountName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={submit}>
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} />
            Salvar lançamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ReportModal({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogPanelClass}>
        <DialogHeader>
          <DialogTitle>Exportar relatório financeiro</DialogTitle>
          <DialogDescription>
            Configure o período e o formato do resumo.
          </DialogDescription>
        </DialogHeader>
        <FormGrid className="content-start p-4">
          <Field label="Período">
            <Select defaultValue="abril-2026">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="abril-2026">Abril de 2026</SelectItem>
                <SelectItem value="marco-2026">Março de 2026</SelectItem>
                <SelectItem value="trimestre">Último trimestre</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Formato">
            <Select defaultValue="pdf">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF executivo</SelectItem>
                <SelectItem value="csv">CSV detalhado</SelectItem>
                <SelectItem value="xlsx">Planilha XLSX</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="rounded-md bg-muted/60 p-3 text-sm text-muted-foreground sm:col-span-2">
            O fluxo atual prepara o relatório na interface. A integração real de
            download pode ser conectada ao backend depois.
          </div>
        </FormGrid>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={onSubmit}>Preparar relatório</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AccountModal({
  mode,
  draft,
  open,
  onOpenChange,
  onChange,
  onSave,
  onRemove,
}: {
  mode: ModalMode
  draft: BankAccount | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (draft: BankAccount | null) => void
  onSave: () => void
  onRemove?: () => void
}) {
  function update<Key extends keyof BankAccount>(
    key: Key,
    value: BankAccount[Key]
  ) {
    onChange(draft ? { ...draft, [key]: value } : draft)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogPanelClass}>
        <DialogHeader>
          <DialogTitle>
            {mode === "create"
              ? "Nova conta bancária"
              : "Editar conta bancária"}
          </DialogTitle>
          <DialogDescription>
            Mantenha os saldos e contas do financeiro organizados.
          </DialogDescription>
        </DialogHeader>
        {draft ? (
          <ScrollArea className="min-h-0">
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <Field className="sm:col-span-2" label="Nome da conta">
                <Input
                  value={draft.name}
                  placeholder="Ex: Conta Corrente - Banco"
                  maxLength={48}
                  onChange={(event) =>
                    update("name", limitText(event.target.value, 48))
                  }
                />
              </Field>
              <Field label="Agência">
                <Input
                  value={draft.agency}
                  inputMode="numeric"
                  placeholder="0001"
                  maxLength={6}
                  onChange={(event) =>
                    update("agency", formatAgency(event.target.value))
                  }
                />
              </Field>
              <Field label="Conta">
                <Input
                  value={draft.account}
                  inputMode="numeric"
                  placeholder="000000-0"
                  maxLength={13}
                  onChange={(event) =>
                    update("account", formatBankAccount(event.target.value))
                  }
                />
              </Field>
              <Field label="Tipo">
                <Select
                  value={draft.type}
                  onValueChange={(value) => update("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ensureOption(accountTypeOptions, draft.type).map(
                      (type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Saldo atual">
                <Input
                  value={formatCurrencyValue(draft.balance)}
                  inputMode="decimal"
                  placeholder="0,00"
                  maxLength={14}
                  onChange={(event) =>
                    update(
                      "balance",
                      parseAmount(formatCurrencyInput(event.target.value))
                    )
                  }
                />
              </Field>
              <Field label="Status">
                <Select
                  value={draft.status}
                  onValueChange={(value) =>
                    update("status", value as AccountStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accountStatusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </ScrollArea>
        ) : null}
        <DialogFooter className="sm:justify-between">
          {onRemove ? (
            <Button variant="destructive" onClick={onRemove}>
              <HugeiconsIcon icon={Delete02Icon} size={16} />
              Remover
            </Button>
          ) : (
            <span />
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={onSave}>Salvar conta</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CategoryModal({
  mode,
  draft,
  open,
  onOpenChange,
  onChange,
  onSave,
  onRemove,
}: {
  mode: ModalMode
  draft: FinancialCategory | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (draft: FinancialCategory | null) => void
  onSave: () => void
  onRemove?: () => void
}) {
  function update<Key extends keyof FinancialCategory>(
    key: Key,
    value: FinancialCategory[Key]
  ) {
    onChange(draft ? { ...draft, [key]: value } : draft)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogPanelClass}>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nova categoria" : "Editar categoria"}
          </DialogTitle>
          <DialogDescription>
            As categorias alimentam relatórios, metas e filtros financeiros.
          </DialogDescription>
        </DialogHeader>
        {draft ? (
          <ScrollArea className="min-h-0">
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <Field className="sm:col-span-2" label="Nome da categoria">
                <Select
                  value={draft.name}
                  onValueChange={(value) => update("name", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {ensureOption(
                      categoryNameOptions[draft.type],
                      draft.name
                    ).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field className="sm:col-span-2" label="Descrição">
                <textarea
                  value={draft.description}
                  rows={3}
                  maxLength={160}
                  className="min-h-24 w-full resize-none rounded-md border bg-background px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
                  onChange={(event) =>
                    update("description", limitText(event.target.value, 160))
                  }
                />
              </Field>
              <Field label="Tipo">
                <Select
                  value={draft.type}
                  onValueChange={(value) => {
                    const nextType = value as FinancialType
                    onChange(
                      draft
                        ? {
                            ...draft,
                            type: nextType,
                            name: categoryNameOptions[nextType][0],
                          }
                        : draft
                    )
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Receita">Receita</SelectItem>
                    <SelectItem value="Despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Valor mensal">
                <Input
                  value={formatCurrencyValue(draft.monthlyAmount)}
                  inputMode="decimal"
                  placeholder="0,00"
                  maxLength={14}
                  onChange={(event) =>
                    update(
                      "monthlyAmount",
                      parseAmount(formatCurrencyInput(event.target.value))
                    )
                  }
                />
              </Field>
            </div>
          </ScrollArea>
        ) : null}
        <DialogFooter className="sm:justify-between">
          {onRemove ? (
            <Button variant="destructive" onClick={onRemove}>
              <HugeiconsIcon icon={Delete02Icon} size={16} />
              Remover
            </Button>
          ) : (
            <span />
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={onSave}>Salvar categoria</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PaymentMethodModal({
  mode,
  draft,
  open,
  onOpenChange,
  onChange,
  onSave,
  onRemove,
}: {
  mode: ModalMode
  draft: PaymentMethod | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onChange: (draft: PaymentMethod | null) => void
  onSave: () => void
  onRemove?: () => void
}) {
  function update<Key extends keyof PaymentMethod>(
    key: Key,
    value: PaymentMethod[Key]
  ) {
    onChange(draft ? { ...draft, [key]: value } : draft)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogPanelClass}>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Nova forma de pagamento" : "Editar forma"}
          </DialogTitle>
          <DialogDescription>
            Controle status, taxas, prazos e volume financeiro por forma.
          </DialogDescription>
        </DialogHeader>
        {draft ? (
          <ScrollArea className="min-h-0">
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <Field className="sm:col-span-2" label="Nome">
                <Select
                  value={draft.name}
                  onValueChange={(value) => update("name", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a forma" />
                  </SelectTrigger>
                  <SelectContent>
                    {ensureOption(paymentMethodNameOptions, draft.name).map(
                      (method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </Field>
              <Field className="sm:col-span-2" label="Descrição">
                <Input
                  value={draft.description}
                  placeholder="Ex: Liberação em D+1 com taxa da operadora"
                  maxLength={90}
                  onChange={(event) =>
                    update("description", limitText(event.target.value, 90))
                  }
                />
              </Field>
              <Field label="Status">
                <Select
                  value={draft.status}
                  onValueChange={(value) =>
                    update("status", value as PaymentStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Taxa (%)">
                <Input
                  value={formatPercentValue(draft.fee)}
                  inputMode="decimal"
                  placeholder="0,00"
                  maxLength={6}
                  onChange={(event) =>
                    update(
                      "fee",
                      clampNumber(
                        parseAmount(formatPercentInput(event.target.value)),
                        0,
                        100
                      )
                    )
                  }
                />
              </Field>
              <Field label="Liquidação">
                <Select
                  value={draft.settlement}
                  onValueChange={(value) => update("settlement", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ensureOption(
                      paymentSettlementOptions,
                      draft.settlement
                    ).map((settlement) => (
                      <SelectItem key={settlement} value={settlement}>
                        {settlement}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Valor no mês">
                <Input
                  value={formatCurrencyValue(draft.amount)}
                  inputMode="decimal"
                  placeholder="0,00"
                  maxLength={14}
                  onChange={(event) =>
                    update(
                      "amount",
                      parseAmount(formatCurrencyInput(event.target.value))
                    )
                  }
                />
              </Field>
              <Field label="Transações">
                <Input
                  value={String(draft.transactions)}
                  inputMode="numeric"
                  maxLength={6}
                  onChange={(event) =>
                    update(
                      "transactions",
                      parseIntegerInput(event.target.value, 999999)
                    )
                  }
                />
              </Field>
            </div>
          </ScrollArea>
        ) : null}
        <DialogFooter className="sm:justify-between">
          {onRemove ? (
            <Button variant="destructive" onClick={onRemove}>
              <HugeiconsIcon icon={Delete02Icon} size={16} />
              Remover
            </Button>
          ) : (
            <span />
          )}
          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={onSave}>Salvar forma</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function FeeSimulationModal({
  open,
  methods,
  onOpenChange,
}: {
  open: boolean
  methods: PaymentMethod[]
  onOpenChange: (open: boolean) => void
}) {
  const firstMethod = methods[0]?.name ?? ""
  const [methodName, setMethodName] = useState(firstMethod)
  const [amount, setAmount] = useState("100")
  const selectedMethod =
    methods.find((method) => method.name === methodName) ?? methods[0]
  const gross = parseAmount(amount)
  const fee = selectedMethod ? gross * (selectedMethod.fee / 100) : 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dialogPanelClass}>
        <DialogHeader>
          <DialogTitle>Simular taxa</DialogTitle>
          <DialogDescription>
            Veja quanto entra líquido em cada forma de pagamento.
          </DialogDescription>
        </DialogHeader>
        <div className="grid content-start gap-4 p-4 sm:grid-cols-2">
          <Field label="Forma">
            <Select value={methodName} onValueChange={setMethodName}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {methods.map((method) => (
                  <SelectItem key={method.id} value={method.name}>
                    {method.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Valor bruto">
            <Input
              value={amount}
              inputMode="decimal"
              onChange={(event) => setAmount(event.target.value)}
            />
          </Field>
          <div className="rounded-md border bg-background p-4 sm:col-span-2">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              Resultado
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <InfoPill label="Taxa" value={formatCurrency(fee)} />
              <InfoPill label="Líquido" value={formatCurrency(gross - fee)} />
              <InfoPill
                label="Liquidação"
                value={selectedMethod?.settlement ?? "Imediato"}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Concluir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function ModuleLink({
  href,
  icon,
  title,
  description,
}: {
  href: string
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="premium-card motion-rise grid gap-3 rounded-lg border bg-card p-4 text-card-foreground shadow-sm transition-colors hover:bg-muted/40"
    >
      <span className="flex size-10 items-center justify-center rounded-md bg-primary/15 text-primary">
        {icon}
      </span>
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="mt-1 block text-sm leading-snug text-muted-foreground">
          {description}
        </span>
      </span>
    </Link>
  )
}

function ResponsiveFinancialRows({
  columns,
  rows,
  primaryLabel,
  secondaryLabel,
  tertiaryLabel,
}: {
  columns: string[]
  rows: Array<Array<ReactNode>>
  primaryLabel: string
  secondaryLabel: string
  tertiaryLabel: string
}) {
  return (
    <>
      <div className="grid gap-2 md:hidden">
        {rows.map((row, index) => (
          <div key={index} className="rounded-md border bg-background p-3">
            <p className="text-xs font-medium text-muted-foreground uppercase">
              {primaryLabel}
            </p>
            <p className="mt-1 text-sm font-semibold break-words">{row[0]}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="min-w-0 rounded-md bg-muted/50 px-3 py-2">
                <p className="text-xs text-muted-foreground">
                  {secondaryLabel}
                </p>
                <div className="mt-1 text-sm font-semibold break-words">
                  {row[1]}
                </div>
              </div>
              <div className="min-w-0 rounded-md bg-muted/50 px-3 py-2">
                <p className="text-xs text-muted-foreground">{tertiaryLabel}</p>
                <div className="mt-1 text-sm font-semibold break-words">
                  {row[2]}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <SimpleTable className="hidden md:block" columns={columns} rows={rows} />
    </>
  )
}

function FinanceCard({ children }: { children: ReactNode }) {
  return (
    <article className="w-full max-w-full min-w-0 overflow-hidden rounded-md border bg-background p-3 shadow-sm sm:p-4">
      {children}
    </article>
  )
}

function Field({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md bg-muted/50 px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold break-words">{value}</p>
    </div>
  )
}

function Trend({
  tone,
  value,
}: {
  tone: Extract<Tone, "green" | "red" | "blue">
  value: string
}) {
  const classes = {
    green: "text-primary",
    red: "text-red-600 dark:text-red-400",
    blue: "text-sky-600 dark:text-sky-400",
  }

  return <span className={cn("font-semibold", classes[tone])}>{value}</span>
}

function summarizeMovements(movements: FinancialMovement[]) {
  return movements.reduce(
    (summary, movement) => {
      if (movement.type === "Receita") {
        summary.income += movement.amount
      } else {
        summary.expense += movement.amount
      }

      return summary
    },
    { income: 0, expense: 0 }
  )
}

function getAccountTone(status: AccountStatus): Tone {
  if (status === "Ativa") return "green"
  if (status === "Em uso") return "amber"
  return "neutral"
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

function formatPercent(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value)
}

function parseAmount(value: string) {
  const normalized = value
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "")

  return Number(normalized) || 0
}

function limitText(value: string, maxLength: number) {
  return value.replace(/\s{2,}/g, " ").slice(0, maxLength)
}

function ensureOption(options: string[], value?: string) {
  if (!value || options.includes(value)) return options

  return [value, ...options]
}

function onlyDigits(value: string, maxLength: number) {
  return value.replace(/\D/g, "").slice(0, maxLength)
}

function formatAgency(value: string) {
  const digits = onlyDigits(value, 5)

  if (digits.length <= 4) return digits

  return `${digits.slice(0, 4)}-${digits.slice(4)}`
}

function formatBankAccount(value: string) {
  const digits = onlyDigits(value, 11)

  if (digits.length <= 1) return digits

  return `${digits.slice(0, -1)}-${digits.slice(-1)}`
}

function formatCurrencyInput(value: string) {
  const digits = onlyDigits(value, 11)

  if (!digits) return ""

  const amount = Number(digits) / 100

  return formatCurrencyValue(amount)
}

function formatCurrencyValue(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

function formatPercentInput(value: string) {
  const digits = onlyDigits(value, 4)

  if (!digits) return ""

  return formatPercentValue(Number(digits) / 100)
}

function formatPercentValue(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

function parseIntegerInput(value: string, maxValue: number) {
  return Math.min(
    Number(onlyDigits(value, String(maxValue).length)) || 0,
    maxValue
  )
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

