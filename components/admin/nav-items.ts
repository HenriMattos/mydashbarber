import {
  Building02Icon,
  Calendar03Icon,
  ChartIncreaseIcon,
  CrownIcon,
  DashboardSquare01Icon,
  Invoice03Icon,
  ScissorIcon,
  UserAdd01Icon,
  UserListIcon,
  UserMultipleIcon,
  Wallet02Icon,
  BankIcon,
  File01Icon,
  CreditCardIcon,
  EyeIcon,
  PlusSignCircleIcon,
  CancelCircleIcon,
  CheckmarkCircle01Icon,
  CashierIcon,
} from "@hugeicons/core-free-icons"

export const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: DashboardSquare01Icon,
    description: "Visao geral da barbearia",
  },
  {
    title: "Agenda",
    href: "/agenda",
    icon: Calendar03Icon,
    description: "Horarios, barbeiros e confirmacoes",
  },
  {
    title: "Caixa",
    href: "/caixa",
    icon: Wallet02Icon,
    description: "Entradas, saidas e fechamento",
    children: [
      {
        title: "Comandas",
        href: "/caixa/comandas",
        icon: CashierIcon,
      },
    ],
  },
  {
    title: "Clientes",
    href: "/clientes",
    icon: UserMultipleIcon,
    description: "Cadastro, historico e recorrencia",
    children: [
      {
        title: "Cadastrar cliente",
        href: "/clientes/cadastrar",
        icon: UserAdd01Icon,
      },
    ],
  },
  {
    title: "Financeiro",
    href: "/financeiro",
    icon: ChartIncreaseIcon,
    description: "Receitas, despesas e metas",
    children: [
      {
        title: "Contas bancárias",
        href: "/financeiro/contas-bancarias",
        icon: BankIcon,
      },
      {
        title: "Categorias financeiras",
        href: "/financeiro/categorias",
        icon: File01Icon,
      },
      {
        title: "Formas de pagamento",
        href: "/financeiro/formas-pagamento",
        icon: CreditCardIcon,
      },
    ],
  },
  {
    title: "Planos",
    href: "/planos",
    icon: CrownIcon,
    description: "Assinaturas e beneficios",
    children: [
      {
        title: "Criar planos",
        href: "/planos/criar",
        icon: PlusSignCircleIcon,
      },
      {
        title: "Gerenciar planos",
        href: "/planos/gerenciar",
        icon: File01Icon,
      },
    ],
  },
  {
    title: "Assinaturas",
    href: "/assinaturas",
    icon: Invoice03Icon,
    description: "Contratos, cobrancas e inadimplencia",
    children: [
      {
        title: "Gerenciar assinaturas",
        href: "/assinaturas/gerenciar",
        icon: CheckmarkCircle01Icon,
      },
      {
        title: "Inadimplentes",
        href: "/assinaturas/inadimplentes",
        icon: CancelCircleIcon,
      },
    ],
  },
  {
    title: "Profissionais",
    href: "/profissionais",
    icon: UserMultipleIcon,
    description: "Equipe, agenda e comissoes",
    children: [
      {
        title: "Cadastrar profissional",
        href: "/profissionais/cadastrar",
        icon: UserAdd01Icon,
      },
    ],
  },
  {
    title: "Servicos",
    href: "/servicos",
    icon: ScissorIcon,
    description: "Catalogo, precos e duracao",
    children: [
      {
        title: "Cadastrar servicos",
        href: "/servicos/cadastrar",
        icon: PlusSignCircleIcon,
      },
      {
        title: "Exibicao de servicos",
        href: "/servicos/exibicao",
        icon: EyeIcon,
      },
      {
        title: "Listagem de servicos",
        href: "/servicos/listagem",
        icon: UserListIcon,
      },
    ],
  },
  {
    title: "Empresa",
    href: "/empresa",
    icon: Building02Icon,
    description: "Dados comerciais e operacionais",
    children: [
      {
        title: "Filiais",
        href: "/empresa/filiais",
        icon: Building02Icon,
      },
    ],
  },
] as const

export const quickActions = [
  "Novo agendamento",
  "Receber pagamento",
  "Cadastrar cliente",
  "Fechar caixa",
] as const

export const invoiceIcon = Invoice03Icon
