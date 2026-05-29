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
 { label: "Dúvidas", href: "#duvidas" },
]

export const trustItems = [
  "Agenda online",
  "Caixa e comandas",
  "Planos recorrentes",
  "Gestão de clientes",
]

export const painPoints = [
  {
    title: "Agenda no improviso",
    description:
      "Horário perdido, remarcação manual e cliente esperando no WhatsApp.",
    icon: Calendar03Icon,
  },
  {
    title: "Caixa sem visão clara",
    description: "Comanda, pagamento e fechamento espalhados no fim do dia.",
    icon: CashierIcon,
  },
  {
    title: "Clientes sem recorrência",
    description:
      "Sem assinatura, a barbearia depende só do atendimento avulso.",
    icon: CreditCardIcon,
  },
  {
    title: "Sistema que não entende barbearia",
    description:
      "Tela demais, rotina pesada e pouco foco no dia a dia do barbeiro.",
    icon: DashboardSquare03Icon,
  },
] satisfies Array<{ title: string; description: string; icon: IconSvgElement }>

export const clientPlanExamples = [
  {
    name: "Plano Corte Mensal",
    benefit: "1 ou 2 cortes por mês com valor fixo.",
    frequency: "Renovação mensal",
    status: "Ativo",
    subscriber: "Cliente: Rafael M.",
  },
  {
    name: "Plano Corte + Barba",
    benefit: "2 cortes + 1 barba por mês.",
    frequency: "Renova em 12 dias",
    status: "Renovando",
    subscriber: "Cliente: Diego S.",
  },
  {
    name: "Plano Premium",
    benefit: "Prioridade de horário e serviços inclusos.",
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
      "Cadastre serviços, profissionais, horários, unidades e dados operacionais da barbearia.",
    icon: PaintBoardIcon,
  },
  {
    title: "Receba agendamentos",
    description:
      "A equipe organiza agendamentos, serviços, profissionais, data e horário pelo painel.",
    icon: SmartPhone01Icon,
  },
  {
    title: "Controle o atendimento",
    description:
      "Acompanhe agenda, comandas, caixa, clientes e histórico em um painel único.",
    icon: CashierIcon,
  },
  {
    title: "Venda planos recorrentes",
    description:
      "Crie planos de assinatura, controle benefícios, acompanhe renovações e aumente previsibilidade.",
    icon: CreditCardIcon,
  },
  {
    title: "Acompanhe o crescimento",
    description:
      "Veja receita, clientes ativos, assinaturas, agendamentos e desempenho da operação.",
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
    title: "Gestão de clientes",
    description: "Clientes, planos, histórico e recorrência no painel.",
    icon: SmartPhone01Icon,
  },
  {
    title: "Planos e assinaturas",
    description: "Controle benefícios, status, início e renovação.",
    icon: CreditCardIcon,
  },
  {
    title: "Caixa e comandas",
    description: "Atendimentos, pagamentos e fechamento com mais clareza.",
    icon: CashierIcon,
  },
  {
    title: "Gestão de clientes",
    description: "Histórico, preferências, planos ativos e relacionamento.",
    icon: UserGroupIcon,
  },
  {
    title: "Profissionais e serviços",
    description: "Equipe, horários, valores, serviços e disponibilidade.",
    icon: ScissorIcon,
  },
  {
    title: "Financeiro",
    description: "Faturamento, pagamentos, recorrência e visão geral.",
    icon: ChartIncreaseIcon,
  },
  {
    title: "Multiunidades",
    description: "Até 3 unidades no Pro e operações maiores no Personalizado.",
    icon: Building03Icon,
  },
] satisfies Array<{ title: string; description: string; icon: IconSvgElement }>

export const trustNumbers = [
  { value: "200+", label: "Barbearias ativas" },
  { value: "15mil+", label: "Agendamentos/mês" },
  { value: "R$ 2mi+", label: "Em planos processados" },
  { value: "98%", label: "Satisfação dos barbeiros" },
] satisfies Array<{ value: string; label: string }>

export const testimonials = [
  {
    name: "Carlos A.",
    role: "Barbeiro, SP",
    text: "Antes eu perdia cliente porque não lembrava de renovar plano. O Bigood me avisa e o cliente já sai com o próximo agendado. Minha receita recorrente subiu 40%.",
  },
  {
    name: "Rafael M.",
    role: "Proprietário, MG",
    text: "Tinha agenda no WhatsApp, comanda no papel e planilha no fim do mês. Agora é uma tela só. Economizo umas 10 horas por semana só de conferência.",
  },
  {
    name: "Diego S.",
    role: "Barbeiro, RJ",
    text: "O gestão de clientes mudou tudo. O pessoal agenda direto pelo celular, para de mandar mensagem perguntando horário. Minha agenda lota sozinha.",
  },
] satisfies Array<{ name: string; role: string; text: string }>

export const dashboardMetrics = [
  {
    label: "Agenda de hoje",
    value: "32 horários",
    detail: "Serviços, profissionais e confirmações em uma tela.",
    icon: Calendar03Icon,
  },
  {
    label: "Clientes assinantes",
    value: "86 ativos",
    detail: "Planos, benefícios e status acompanhados.",
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
    label: "Serviços mais vendidos",
    value: "Corte + barba",
    detail: "Histórico para entender demanda e equipe.",
    icon: ScissorIcon,
  },
  {
    label: "Renovações próximas",
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
    question: "O Bigood é só uma agenda online?",
    answer:
      "Não. O Bigood é um sistema completo para gerenciar agenda, clientes, profissionais, serviços, caixa, financeiro e planos de assinatura da barbearia.",
  },
  {
    question: "Consigo vender planos de assinatura para meus clientes?",
    answer:
      "Sim. A barbearia pode criar planos, definir benefícios, acompanhar clientes assinantes, controlar início, renovação e status.",
  },
  {
    question: "O cliente consegue agendar pelo celular?",
    answer:
      "Não. A gestão fica concentrada no painel administrativo da barbearia.",
  },
  {
    question: "O sistema serve para barbearias pequenas?",
    answer:
      "Sim. O Bigood foi pensado para barbearias que querem sair do improviso e organizar a operação desde cedo.",
  },
  {
    question: "Tenho mais de uma unidade. Posso usar?",
    answer:
      "Sim. O Plano Pro cobre até 3 unidades. Operações com 4 ou mais unidades entram no Plano Personalizado.",
  },
  {
    question: "O Bigood foi criado por barbeiros?",
    answer:
      "O Bigood foi desenvolvido com apoio real de um barbeiro consultor, com anos de experiência na própria barbearia e participação direta na validação das necessidades do sistema.",
  },
]
