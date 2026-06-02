import {
  Building02Icon,
  Calendar03Icon,
  ChartIncreaseIcon,
  CrownIcon,
  DashboardSquare01Icon,
  Invoice03Icon,
  ScissorIcon,
  UserAdd01Icon,
  UserMultipleIcon,
  Wallet02Icon,
  CashierIcon,
  AddSquareIcon,
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
    description: "Horários, barbeiros e confirmações",
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
    description: "Cadastro, histórico e recorrência",
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
  },
  {
    title: "Planos",
    href: "/planos",
    icon: CrownIcon,
    description: "Assinaturas e benefícios",
  },
  {
    title: "Assinaturas",
    href: "/assinaturas",
    icon: Invoice03Icon,
    description: "Contratos, cobranças e inadimplencia",
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
    title: "Serviços",
    href: "/servicos",
    icon: ScissorIcon,
    description: "Catalogo, precos e duracao",
    children: [
      {
        title: "Listar serviços",
        icon: ScissorIcon,
        href: "/servicos",
      },
      {
        title: "Cadastrar serviço",
        icon: AddSquareIcon,
        href: "/servicos/cadastrar",
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
