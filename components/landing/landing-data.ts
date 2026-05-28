export type { PlanKey } from "@/types"
export type { LandingPlan } from "@/types"

export const plans: import("@/types").LandingPlan[] = []

import {
  Building03Icon,
  Calendar03Icon,
  CashierIcon,
  ChartIncreaseIcon,
  CreditCardIcon,
  DashboardSquare03Icon,
  PaintBoardIcon,
  ScissorIcon,
  SmartPhone01Icon,
  StoreManagement01Icon,
  UserGroupIcon,
  UserMultipleIcon,
} from "@hugeicons/core-free-icons"
import type { IconSvgElement } from "@hugeicons/react"

export const planLabels: Record<import("@/types").PlanKey, string> = {
  "pro-mensal": "Pro Mensal",
  "pro-anual": "Pro Anual",
  personalizado: "Personalizado",
}

export const navLinks = [
  { label: "Ver como funciona", href: "#como-funciona" },
  { label: "Recursos", href: "#recursos" },
  { label: "Dashboard", href: "#dashboard" },
 { label: "DÃºvidas", href: "#duvidas" },
]

export const trustItems = [
  "Agenda online",
  "Caixa e comandas",
  "Planos recorrentes",
  "Gestao de clientes",
]

export const painPoints = [
  {
    title: "Agenda no improviso",
    description:
      "HorÃ¡rio perdido, remarcaÃ§Ã£o manual e cliente esperando no WhatsApp.",
    icon: Calendar03Icon,
  },
  {
    title: "Caixa sem visÃ£o clara",
    description: "Comanda, pagamento e fechamento espalhados no fim do dia.",
    icon: CashierIcon,
  },
  {
    title: "Clientes sem recorrÃªncia",
    description:
      "Sem assinatura, a barbearia depende sÃ³ do atendimento avulso.",
    icon: CreditCardIcon,
  },
  {
    title: "Sistema que nÃ£o entende barbearia",
    description:
      "Tela demais, rotina pesada e pouco foco no dia a dia do barbeiro.",
    icon: DashboardSquare03Icon,
  },
] satisfies Array<{ title: string; description: string; icon: IconSvgElement }>

export const clientPlanExamples = [
  {
    name: "Plano Corte Mensal",
    benefit: "1 ou 2 cortes por mÃªs com valor fixo.",
    frequency: "RenovaÃ§Ã£o mensal",
    status: "Ativo",
    subscriber: "Cliente: Rafael M.",
  },
  {
    name: "Plano Corte + Barba",
    benefit: "2 cortes + 1 barba por mÃªs.",
    frequency: "Renova em 12 dias",
    status: "Renovando",
    subscriber: "Cliente: Diego S.",
  },
  {
    name: "Plano Premium",
    benefit: "Prioridade de horÃ¡rio e serviÃ§os inclusos.",
    frequency: "Ciclo mensal",
    status: "Ativo",
    subscriber: "Cliente: Marcos A.",
  },
  {
    name: "Plano Fidelidade",
    benefit: "Vantagens para clientes recorrentes.",
    frequency: "Vence em breve",
    status: "Vence em breve",
    subscriber: "Cliente: Lucas P.",
  },
]

export const flowSteps = [
  {
    title: "Configure sua barbearia",
    description:
      "Cadastre servicos, profissionais, horarios, unidades e dados operacionais da barbearia.",
    icon: PaintBoardIcon,
  },
  {
    title: "Receba agendamentos",
    description:
      "A equipe organiza agendamentos, servicos, profissionais, data e horario pelo painel.",
    icon: SmartPhone01Icon,
  },
  {
    title: "Controle o atendimento",
    description:
      "Acompanhe agenda, comandas, caixa, clientes e histÃ³rico em um painel Ãºnico.",
    icon: CashierIcon,
  },
  {
    title: "Venda planos recorrentes",
    description:
      "Crie planos de assinatura, controle benefÃ­cios, acompanhe renovaÃ§Ãµes e aumente previsibilidade.",
    icon: CreditCardIcon,
  },
  {
    title: "Acompanhe o crescimento",
    description:
      "Veja receita, clientes ativos, assinaturas, agendamentos e desempenho da operaÃ§Ã£o.",
    icon: ChartIncreaseIcon,
  },
] satisfies Array<{
  title: string
  description: string
  icon: IconSvgElement
}>

export const features = [
  {
    title: "Agenda online",
    description: "Clientes agendam pelo celular e a barbearia acompanha tudo.",
    icon: Calendar03Icon,
  },
  {
    title: "Gestao de clientes",
    description: "Clientes, planos, historico e recorrencia no painel.",
    icon: SmartPhone01Icon,
  },
  {
    title: "Planos e assinaturas",
    description: "Controle benefÃ­cios, status, inÃ­cio e renovaÃ§Ã£o.",
    icon: CreditCardIcon,
  },
  {
    title: "Caixa e comandas",
    description: "Atendimentos, pagamentos e fechamento com mais clareza.",
    icon: CashierIcon,
  },
  {
    title: "GestÃ£o de clientes",
    description: "HistÃ³rico, preferÃªncias, planos ativos e relacionamento.",
    icon: UserGroupIcon,
  },
  {
    title: "Profissionais e serviÃ§os",
    description: "Equipe, horÃ¡rios, valores, serviÃ§os e disponibilidade.",
    icon: ScissorIcon,
  },
  {
    title: "Financeiro",
    description: "Faturamento, pagamentos, recorrÃªncia e visÃ£o geral.",
    icon: ChartIncreaseIcon,
  },
  {
    title: "Multiunidades",
    description: "AtÃ© 3 unidades no Pro e operaÃ§Ãµes maiores no Personalizado.",
    icon: Building03Icon,
  },
] satisfies Array<{ title: string; description: string; icon: IconSvgElement }>

export const trustNumbers = [
  { value: "200+", label: "Barbearias ativas" },
  { value: "15mil+", label: "Agendamentos/mÃªs" },
  { value: "R$ 2mi+", label: "Em planos processados" },
  { value: "98%", label: "SatisfaÃ§Ã£o dos barbeiros" },
] satisfies Array<{ value: string; label: string }>

export const testimonials = [
  {
    name: "Carlos A.",
    role: "Barbeiro, SP",
    text: "Antes eu perdia cliente porque nÃ£o lembrava de renovar plano. O Bigood me avisa e o cliente jÃ¡ sai com o prÃ³ximo agendado. Minha receita recorrente subiu 40%.",
  },
  {
    name: "Rafael M.",
    role: "ProprietÃ¡rio, MG",
    text: "Tinha agenda no WhatsApp, comanda no papel e planilha no fim do mÃªs. Agora Ã© uma tela sÃ³. Economizo umas 10 horas por semana sÃ³ de conferÃªncia.",
  },
  {
    name: "Diego S.",
    role: "Barbeiro, RJ",
    text: "O gestao de clientes mudou tudo. O pessoal agenda direto pelo celular, para de mandar mensagem perguntando horÃ¡rio. Minha agenda lota sozinha.",
  },
] satisfies Array<{ name: string; role: string; text: string }>

export const dashboardMetrics = [
  {
    label: "Agenda de hoje",
    value: "32 horÃ¡rios",
    detail: "ServiÃ§os, profissionais e confirmaÃ§Ãµes em uma tela.",
    icon: Calendar03Icon,
  },
  {
    label: "Clientes assinantes",
    value: "86 ativos",
    detail: "Planos, benefÃ­cios e status acompanhados.",
    icon: UserMultipleIcon,
  },
  {
    label: "Planos ativos",
    value: "R$ 7.920",
    detail: "Receita mensal prevista em assinaturas.",
    icon: CreditCardIcon,
  },
  {
    label: "Caixa do dia",
    value: "R$ 2.840",
    detail: "Comandas, pagamentos e fechamento organizados.",
    icon: CashierIcon,
  },
  {
    label: "ServiÃ§os mais vendidos",
    value: "Corte + barba",
    detail: "HistÃ³rico para entender demanda e equipe.",
    icon: ScissorIcon,
  },
  {
    label: "RenovaÃ§Ãµes prÃ³ximas",
    value: "14 clientes",
    detail: "Planos que precisam de acompanhamento.",
    icon: StoreManagement01Icon,
  },
] satisfies Array<{
  label: string
  value: string
  detail: string
  icon: IconSvgElement
}>

export const faqs = [
  {
    question: "O Bigood Ã© sÃ³ uma agenda online?",
    answer:
      "NÃ£o. O Bigood Ã© um sistema completo para gerenciar agenda, clientes, profissionais, serviÃ§os, caixa, financeiro e planos de assinatura da barbearia.",
  },
  {
    question: "Consigo vender planos de assinatura para meus clientes?",
    answer:
      "Sim. A barbearia pode criar planos, definir benefÃ­cios, acompanhar clientes assinantes, controlar inÃ­cio, renovaÃ§Ã£o e status.",
  },
  {
    question: "O cliente consegue agendar pelo celular?",
    answer:
      "Nao. A gestao fica concentrada no painel administrativo da barbearia.",
  },
  {
    question: "O sistema serve para barbearias pequenas?",
    answer:
      "Sim. O Bigood foi pensado para barbearias que querem sair do improviso e organizar a operaÃ§Ã£o desde cedo.",
  },
  {
    question: "Tenho mais de uma unidade. Posso usar?",
    answer:
      "Sim. O Plano Pro cobre atÃ© 3 unidades. OperaÃ§Ãµes com 4 ou mais unidades entram no Plano Personalizado.",
  },
  {
    question: "O Bigood foi criado por barbeiros?",
    answer:
      "O Bigood foi desenvolvido com apoio real de um barbeiro consultor, com anos de experiÃªncia na prÃ³pria barbearia e participaÃ§Ã£o direta na validaÃ§Ã£o das necessidades do sistema.",
  },
]
