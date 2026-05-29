import type {
  Client,
  ServiceCatalogItem,
  Plan,
  Professional,
  Subscription,
  SubscriptionStatus,
  OverdueSubscription,
  Product,
  AgendaEvent,
  Comanda,
  CashMovement,
  BankAccount,
  FinancialCategory,
  FinancialMovement,
  PaymentMethod,
  Analytics,
  Company,
  Payment,
} from "@/types"
import {
  APPOINTMENT_STATUS,
  ATTENDANCE_STATUS,
  COMMAND_STATUS,
  PAYMENT_STATUS,
  PLAN_STATUS,
  SUBSCRIPTION_STATUS,
} from "@/types"

const today = new Date()

function toDateInputValue(date: Date) {
  return [
    String(date.getFullYear()),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

const demoPlans: Plan[] = [
  {
    id: 1,
    name: "Clube Corte 2x",
    description: "Plano mensal para manter o corte sempre em dia.",
    benefit: "2 cortes por ciclo com prioridade na agenda.",
    price: 89,
    billingCycle: "monthly",
    status: PLAN_STATUS.ACTIVE,
    recurrence: "Mensal",
    servicesLimit: 2,
    includedServices: [
      {
        serviceId: "1",
        serviceName: "Corte masculino",
        quantityPerCycle: 2,
        requiresReservation: true,
      },
    ],
    benefitRule: {
      includedServices: [
        {
          serviceId: "1",
          serviceName: "Corte masculino",
          quantityPerCycle: 2,
          requiresReservation: true,
        },
      ],
      extraDiscountPercent: 10,
      productDiscountPercent: 5,
      customerRulesText: "Inclui 2 cortes masculinos por ciclo mensal.",
      schedulingRulesText: "Exige reserva em agendamento confirmado.",
      usageRulesText:
        "Benefício consumido no atendimento concluido e abatido na comanda.",
    },
    extraDiscountPercent: 10,
    productDiscountPercent: 5,
    commercialText: "Plano enxuto para gerar recorrência sem complicar a operação.",
    subscriberCount: 24,
    estimatedRecurringRevenue: 2136,
    usageRulesText: "Saldo por servico incluso, com reserva no agendamento.",
    schedulingRulesText: "Reserva obrigatoria para confirmar cobertura.",
    churnRisk: "Baixo",
  },
  {
    id: 2,
    name: "Clube Barba e Cabelo",
    description: "Plano mensal para corte e barba com benefícios separados.",
    benefit: "Corte e barba todo mes, com acabamento incluso.",
    price: 129,
    billingCycle: "monthly",
    status: PLAN_STATUS.ACTIVE,
    featured: true,
    recurrence: "Mensal",
    servicesLimit: 3,
    includedServices: [
      {
        serviceId: "1",
        serviceName: "Corte masculino",
        quantityPerCycle: 2,
        requiresReservation: true,
      },
      {
        serviceId: "2",
        serviceName: "Barba completa",
        quantityPerCycle: 1,
        requiresReservation: true,
      },
    ],
    benefitRule: {
      includedServices: [
        {
          serviceId: "1",
          serviceName: "Corte masculino",
          quantityPerCycle: 2,
          requiresReservation: true,
        },
        {
          serviceId: "2",
          serviceName: "Barba completa",
          quantityPerCycle: 1,
          requiresReservation: true,
        },
      ],
      extraDiscountPercent: 15,
      productDiscountPercent: 10,
      customerRulesText: "Inclui 2 cortes e 1 barba por ciclo mensal.",
      schedulingRulesText: "Prioridade de agenda para serviços inclusos.",
      usageRulesText: "Extras e produtos continuam cobrados a parte.",
    },
    extraDiscountPercent: 15,
    productDiscountPercent: 10,
    commercialText: "Plano mais vendido para clientes que alternam corte e barba.",
    subscriberCount: 38,
    estimatedRecurringRevenue: 4902,
    usageRulesText: "2 cortes e 1 barba por ciclo, com extras cobrados a parte.",
    schedulingRulesText: "Benefícios inclusos precisam de reserva para serem abatidos.",
    churnRisk: "Baixo",
  },
  {
    id: 3,
    name: "Clube Premium",
    description: "Plano mensal para clientes com rotina completa.",
    benefit: "Atendimentos recorrentes com benefícios completos.",
    price: 179,
    billingCycle: "monthly",
    status: PLAN_STATUS.ACTIVE,
    recurrence: "Mensal",
    servicesLimit: 0,
    includedServices: [
      {
        serviceId: "1",
        serviceName: "Corte masculino",
        quantityPerCycle: 4,
        requiresReservation: true,
      },
      {
        serviceId: "2",
        serviceName: "Barba completa",
        quantityPerCycle: 2,
        requiresReservation: true,
      },
      {
        serviceId: "4",
        serviceName: "Acabamento",
        quantityPerCycle: 0,
        unlimited: true,
        professionalScope: "any",
        note: "Uso ilimitado no ciclo para acabamento rapido.",
      },
    ],
    benefitRule: {
      includedServices: [
        {
          serviceId: "1",
          serviceName: "Corte masculino",
          quantityPerCycle: 4,
          requiresReservation: true,
        },
        {
          serviceId: "2",
          serviceName: "Barba completa",
          quantityPerCycle: 2,
          requiresReservation: true,
        },
        {
          serviceId: "4",
          serviceName: "Acabamento",
          quantityPerCycle: 0,
          unlimited: true,
          professionalScope: "any",
          note: "Uso ilimitado no ciclo para acabamento rapido.",
        },
      ],
      extraDiscountPercent: 20,
      productDiscountPercent: 15,
      customerRulesText: "Inclui 4 cortes e 2 barbas por ciclo mensal.",
      schedulingRulesText: "Mais flexibilidade para clientes premium.",
      usageRulesText:
        "Acabamento ilimitado e demais serviços com quantidade por ciclo.",
    },
    extraDiscountPercent: 20,
    productDiscountPercent: 15,
    commercialText: "Plano premium para rotina completa e maior previsibilidade de caixa.",
    subscriberCount: 19,
    estimatedRecurringRevenue: 3401,
    usageRulesText:
      "4 cortes, 2 barbas e acabamento ilimitado dentro do ciclo vigente.",
    schedulingRulesText: "Permite maior flexibilidade de horários e encaixes.",
    churnRisk: "Medio",
  },
  {
    id: 4,
    name: "Clube Essencial",
    description: "Plano de entrada com uso controlado e preco acessivel.",
    benefit: "1 corte por ciclo com desconto em produtos.",
    price: 69,
    billingCycle: "monthly",
    status: PLAN_STATUS.INACTIVE,
    recurrence: "Mensal",
    servicesLimit: 1,
    includedServices: [
      {
        serviceId: "1",
        serviceName: "Corte masculino",
        quantityPerCycle: 1,
        requiresReservation: true,
      },
    ],
    benefitRule: {
      includedServices: [
        {
          serviceId: "1",
          serviceName: "Corte masculino",
          quantityPerCycle: 1,
          requiresReservation: true,
        },
      ],
      extraDiscountPercent: 5,
      productDiscountPercent: 5,
      customerRulesText: "Plano simples para entrada na assinatura.",
      schedulingRulesText: "Atende clientes que vao ao balcao com frequencia menor.",
      usageRulesText: "Cobertura limitada a 1 corte por ciclo.",
    },
    extraDiscountPercent: 5,
    productDiscountPercent: 5,
    commercialText: "Plano de entrada para testar adesao sem aumentar a barreira de preco.",
    subscriberCount: 0,
    estimatedRecurringRevenue: 0,
    usageRulesText: "Benefício limitado a 1 corte por ciclo.",
    schedulingRulesText: "Configurado para venda assistida e uso simples.",
    churnRisk: "Alto",
  },
]

const demoServices: ServiceCatalogItem[] = [
  {
    id: 1,
    name: "Corte masculino",
    description: "Corte tradicional com acabamento limpo e consulta rapida.",
    internalDescription: "Serviço base do plano e do agendamento online.",
    category: "Cabelo",
    duration: "45min",
    durationMinutes: 45,
    price: 60,
    credits: 1,
    repurchaseDays: 28,
    professionals: "Rafael, Lucas e Diego",
    professionalIds: [1, 2, 3],
    status: "Ativo",
    createdAt: "2026-01-10",
    updatedAt: "2026-05-01",
    hidden: false,
    fitIn: true,
    startingFrom: false,
    featured: true,
    order: 1,
    portalVisible: true,
    onlineBookable: true,
    canBeInPlan: true,
    requiresProfessionalSelection: false,
    internalNotes: "Principal servico da barbearia.",
    popularityCount: 182,
    revenueGenerated: 10920,
  },
  {
    id: 2,
    name: "Barba completa",
    description: "Barba com toalha quente, alinhamento e acabamento.",
    internalDescription: "Serviço incluso em planos recorrentes e extras.",
    category: "Barba",
    duration: "35min",
    durationMinutes: 35,
    price: 45,
    credits: 1,
    repurchaseDays: 21,
    professionals: "Rafael e Diego",
    professionalIds: [1, 3],
    status: "Ativo",
    createdAt: "2026-01-10",
    updatedAt: "2026-05-01",
    hidden: false,
    fitIn: true,
    startingFrom: false,
    featured: true,
    order: 2,
    portalVisible: true,
    onlineBookable: true,
    canBeInPlan: true,
    requiresProfessionalSelection: true,
    internalNotes: "Melhor combinacao com corte avulso.",
    popularityCount: 124,
    revenueGenerated: 5580,
  },
  {
    id: 3,
    name: "Corte + barba",
    description: "Combo completo para rotina de manutencao.",
    internalDescription: "Serviço premium com ticket maior e agenda longa.",
    category: "Combo",
    duration: "75min",
    durationMinutes: 75,
    price: 95,
    credits: 2,
    repurchaseDays: 28,
    professionals: "Rafael, Lucas e Diego",
    professionalIds: [1, 2, 3],
    status: "Ativo",
    createdAt: "2026-01-10",
    updatedAt: "2026-05-01",
    hidden: false,
    fitIn: false,
    startingFrom: false,
    featured: true,
    order: 3,
    portalVisible: true,
    onlineBookable: true,
    canBeInPlan: false,
    requiresProfessionalSelection: true,
    internalNotes: "Uso para clientes recorrentes e premium.",
    popularityCount: 88,
    revenueGenerated: 8360,
  },
  {
    id: 4,
    name: "Acabamento",
    description: "Finalizacao rapida para manter a aparencia em dia.",
    internalDescription: "Pode entrar em plano premium como uso ilimitado.",
    category: "Cabelo",
    duration: "25min",
    durationMinutes: 25,
    price: 35,
    credits: 1,
    repurchaseDays: 14,
    professionals: "Lucas e Diego",
    professionalIds: [2, 3],
    status: "Ativo",
    createdAt: "2026-01-10",
    updatedAt: "2026-05-01",
    hidden: false,
    fitIn: true,
    startingFrom: true,
    featured: false,
    order: 4,
    portalVisible: true,
    onlineBookable: true,
    canBeInPlan: true,
    requiresProfessionalSelection: false,
    internalNotes: "Bom para encaixe e retorno rapido.",
    popularityCount: 61,
    revenueGenerated: 2135,
  },
  {
    id: 5,
    name: "Sobrancelha",
    description: "Ajuste rapido para acabamento do visual.",
    internalDescription: "Serviço interno, sem agendamento online por enquanto.",
    category: "Finalizacao",
    duration: "20min",
    durationMinutes: 20,
    price: 25,
    credits: 1,
    repurchaseDays: 21,
    professionals: "Rafael e Diego",
    professionalIds: [1, 3],
    status: "Inativo",
    createdAt: "2026-02-12",
    updatedAt: "2026-04-14",
    hidden: true,
    fitIn: true,
    startingFrom: false,
    featured: false,
    order: 5,
    portalVisible: false,
    onlineBookable: false,
    canBeInPlan: false,
    requiresProfessionalSelection: true,
    internalNotes: "Desativado, mantido apenas para histórico.",
    popularityCount: 14,
    revenueGenerated: 350,
  },
]

const demoProfessionals: Professional[] = [
  {
    id: 1,
    name: "Rafael Oliveira",
    role: "Barbeiro fundador",
    phone: "(11) 98888-0100",
    email: "rafael@barbeariavip.com",
    avatarUrl: "/brand/bigood-portal-icon.png?v=3",
    commission: "50%",
    scheduleStart: "09:00",
    scheduleEnd: "19:00",
    status: "Ativo",
    workingDays: ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
    breakStart: "13:00",
    breakEnd: "14:00",
    unit: "Unidade Augusta",
    services: ["Corte masculino", "Barba completa", "Corte + barba"],
    specialties: ["Corte classico", "Visagismo"],
    todayAppointments: 6,
    nextAppointmentAt: "10:30",
    estimatedRevenue: 2480,
    notes: "Agenda cheia e maior faturamento da equipe.",
    portalVisible: true,
  },
  {
    id: 2,
    name: "Lucas Santos",
    role: "Barbeiro senior",
    phone: "(11) 98888-0200",
    email: "lucas@barbeariavip.com",
    avatarUrl: "/brand/bigood-portal-icon.png?v=3",
    commission: "45%",
    scheduleStart: "10:00",
    scheduleEnd: "20:00",
    status: "Ativo",
    workingDays: ["Ter", "Qua", "Qui", "Sex", "Sab"],
    breakStart: "14:00",
    breakEnd: "15:00",
    unit: "Unidade Augusta",
    services: ["Corte masculino", "Corte + barba", "Acabamento"],
    specialties: ["Barba", "Finalizacao rapida"],
    todayAppointments: 4,
    nextAppointmentAt: "11:30",
    estimatedRevenue: 1750,
    notes: "Horários mais tardios e menor disponibilidade de manha.",
    portalVisible: true,
  },
  {
    id: 3,
    name: "Diego Martins",
    role: "Barbeiro",
    phone: "(11) 98888-0300",
    email: "diego@barbeariavip.com",
    avatarUrl: "/brand/bigood-portal-icon.png?v=3",
    commission: "40%",
    scheduleStart: "09:00",
    scheduleEnd: "18:00",
    status: "Ativo",
    workingDays: ["Seg", "Ter", "Qua", "Qui", "Sex"],
    breakStart: "12:30",
    breakEnd: "13:30",
    unit: "Unidade Augusta",
    services: ["Corte masculino", "Barba completa", "Acabamento"],
    specialties: ["Atendimento rapido", "Pacotes mensais"],
    todayAppointments: 5,
    nextAppointmentAt: "09:45",
    estimatedRevenue: 1965,
    notes: "Boa performance em ticket medio e retorno.",
    portalVisible: true,
  },
  {
    id: 4,
    name: "Rafaela Souza",
    role: "Barbeira",
    phone: "(11) 98888-0400",
    email: "rafaela@barbeariavip.com",
    avatarUrl: "/brand/bigood-portal-icon.png?v=3",
    commission: "42%",
    scheduleStart: "11:00",
    scheduleEnd: "18:00",
    status: "Ferias",
    workingDays: ["Qua", "Qui", "Sex", "Sab"],
    breakStart: "15:00",
    breakEnd: "15:30",
    unit: "Unidade Augusta",
    services: ["Corte masculino", "Sobrancelha"],
    specialties: ["Feminino curto", "Detalhamento"],
    todayAppointments: 0,
    nextAppointmentAt: undefined,
    estimatedRevenue: 0,
    notes: "Profissional temporariamente ausente.",
    portalVisible: false,
  },
]

const demoClients: Client[] = [
  {
    id: 1,
    name: "Henrique Demo",
    phone: "(11) 98888-0101",
    email: "cliente@barbeariavip.com",
    visits: 18,
    averageTicket: 112,
    totalSpent: 2016,
    status: "ativo",
    clientType: "assinante_ativo",
    lastVisit: toDateInputValue(addDays(today, -3)),
    nextAppointmentAt: toDateInputValue(addDays(today, 2)),
    favoriteService: "Corte masculino",
    preferredProfessional: "Rafael Oliveira",
    frequencyLabel: "2 visitas por mes",
    origin: "indicacao",
    birthday: "1994-08-12",
    active: true,
    createdAt: toDateInputValue(addDays(today, -220)),
    planName: "Clube Barba e Cabelo",
    subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
    pendingCommandTotal: 0,
    hasOpenCommand: false,
    internalNotes: "Prefere reserva aos sabados e corte curto.",
    preferences: ["Corte baixo", "Barba com toalha quente"],
    tags: ["VIP", "Reserva"],
    history: [
      {
        id: "client-h-001",
        date: toDateInputValue(addDays(today, -3)),
        title: "Atendimento coberto pelo plano",
        detail: "Corte masculino abatido na comanda.",
        kind: "atendimento",
        professional: "Rafael Oliveira",
        amount: 0,
      },
      {
        id: "client-h-002",
        date: toDateInputValue(addDays(today, -10)),
        title: "Comanda paga",
        detail: "Extra de produto quitado via Pix.",
        kind: "comanda",
        professional: "Rafael Oliveira",
        amount: 49,
      },
    ],
    returnRecommendation: "Cliente ideal para manter plano ativo.",
    whatsappEnabled: true,
    noReturnDays: 3,
    lastAttendanceSummary: "Corte masculino com reserva confirmada.",
    planStatus: PLAN_STATUS.ACTIVE,
  },
  {
    id: 2,
    name: "Gabriel Silva",
    phone: "(11) 98880-0002",
    email: "gabriel.silva@barbeariavip.com",
    visits: 14,
    averageTicket: 95,
    totalSpent: 1330,
    status: "ativo",
    clientType: "recorrente",
    lastVisit: toDateInputValue(addDays(today, -5)),
    nextAppointmentAt: toDateInputValue(addDays(today, 4)),
    favoriteService: "Corte + barba",
    preferredProfessional: "Lucas Santos",
    frequencyLabel: "1 visita por semana",
    origin: "instagram",
    birthday: "1991-02-18",
    active: true,
    createdAt: toDateInputValue(addDays(today, -180)),
    pendingCommandTotal: 0,
    hasOpenCommand: false,
    internalNotes: "Boa chance de migrar para assinatura.",
    preferences: ["Barba completa", "Finalizador leve"],
    tags: ["Recorrente", "Potencial plano"],
    history: [
      {
        id: "client-h-003",
        date: toDateInputValue(addDays(today, -5)),
        title: "Atendimento avulso",
        detail: "Corte + barba pago no Pix.",
        kind: "atendimento",
        professional: "Lucas Santos",
        amount: 95,
      },
    ],
    returnRecommendation: "Boa oportunidade para oferecer plano.",
    whatsappEnabled: true,
    noReturnDays: 5,
    lastAttendanceSummary: "Corte + barba pago no Pix.",
  },
  {
    id: 3,
    name: "Marcos Almeida",
    phone: "(11) 98880-0003",
    email: "marcos.almeida@barbeariavip.com",
    visits: 9,
    averageTicket: 103,
    totalSpent: 927,
    status: "em_atencao",
    clientType: "assinante_inadimplente",
    lastVisit: toDateInputValue(addDays(today, -9)),
    nextAppointmentAt: toDateInputValue(addDays(today, 2)),
    favoriteService: "Barba completa",
    preferredProfessional: "Diego Martins",
    frequencyLabel: "1 a cada 2 semanas",
    origin: "whatsapp",
    birthday: "1988-11-05",
    active: true,
    createdAt: toDateInputValue(addDays(today, -245)),
    planName: "Clube Barba e Cabelo",
    subscriptionStatus: SUBSCRIPTION_STATUS.DELINQUENT,
    pendingCommandTotal: 45,
    hasOpenCommand: true,
    internalNotes: "Benefícios bloqueados até regularizacao.",
    preferences: ["Barba com acabamento limpo"],
    tags: ["Inadimplente", "Conferir"],
    history: [
      {
        id: "client-h-004",
        date: toDateInputValue(addDays(today, -9)),
        title: "Atendimento com atenção",
        detail: "Serviço precisa ser cobrado como avulso.",
        kind: "comanda",
        professional: "Diego Martins",
        amount: 45,
      },
    ],
    returnRecommendation: "Cliente assinante inadimplente: conferir antes de atender.",
    whatsappEnabled: true,
    noReturnDays: 9,
    lastAttendanceSummary: "Assinante inadimplente com servico pendente.",
    planStatus: PLAN_STATUS.ACTIVE,
  },
  {
    id: 4,
    name: "Felipe Costa",
    phone: "(11) 98880-0004",
    email: "felipe.costa@barbeariavip.com",
    visits: 12,
    averageTicket: 88,
    totalSpent: 1056,
    status: "ativo",
    clientType: "assinante_ativo",
    lastVisit: toDateInputValue(addDays(today, -2)),
    nextAppointmentAt: toDateInputValue(addDays(today, 1)),
    favoriteService: "Corte masculino",
    preferredProfessional: "Rafael Oliveira",
    frequencyLabel: "2 visitas por mes",
    origin: "portal",
    birthday: "1997-06-22",
    active: true,
    createdAt: toDateInputValue(addDays(today, -160)),
    planName: "Clube Corte 2x",
    subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
    pendingCommandTotal: 0,
    hasOpenCommand: false,
    internalNotes: "Reserva costuma ser feita pelo portal.",
    preferences: ["Corte tradicional", "Atendimento rapido"],
    tags: ["Reserva", "Portal"],
    history: [
      {
        id: "client-h-005",
        date: toDateInputValue(addDays(today, -2)),
        title: "Atendimento coberto pelo plano",
        detail: "Corte abatido no ciclo atual.",
        kind: "assinatura",
        professional: "Rafael Oliveira",
        amount: 0,
      },
    ],
    returnRecommendation: "Cliente ativo com saldo no ciclo.",
    whatsappEnabled: true,
    noReturnDays: 2,
    lastAttendanceSummary: "Corte coberto pelo plano.",
    planStatus: PLAN_STATUS.ACTIVE,
  },
  {
    id: 5,
    name: "Bruno Lima",
    phone: "(11) 98880-0005",
    email: "bruno.lima@barbeariavip.com",
    visits: 10,
    averageTicket: 84,
    totalSpent: 840,
    status: "inativo",
    clientType: "ex_assinante",
    lastVisit: toDateInputValue(addDays(today, -68)),
    nextAppointmentAt: undefined,
    favoriteService: "Corte masculino",
    preferredProfessional: "Lucas Santos",
    frequencyLabel: "1 visita por mes",
    origin: "indicacao",
    birthday: "1990-03-09",
    active: true,
    createdAt: toDateInputValue(addDays(today, -400)),
    planName: "Clube Essencial",
    subscriptionStatus: SUBSCRIPTION_STATUS.CANCELLED,
    pendingCommandTotal: 0,
    hasOpenCommand: false,
    internalNotes: "Ex-assinante com histórico bom de retorno.",
    preferences: ["Corte baixo"],
    tags: ["Ex-assinante", "Reativar"],
    history: [
      {
        id: "client-h-006",
        date: toDateInputValue(addDays(today, -68)),
        title: "Plano cancelado",
        detail: "Cliente saiu mas manteve o histórico.",
        kind: "assinatura",
        professional: "Lucas Santos",
      },
    ],
    returnRecommendation: "Reativar com oferta de plano de entrada.",
    whatsappEnabled: true,
    noReturnDays: 68,
    lastAttendanceSummary: "Plano cancelado, histórico preservado.",
    planStatus: PLAN_STATUS.INACTIVE,
  },
  {
    id: 6,
    name: "Andre Rocha",
    phone: "(11) 98880-0006",
    email: "andre.rocha@barbeariavip.com",
    visits: 6,
    averageTicket: 76,
    totalSpent: 456,
    status: "sem_retorno",
    clientType: "sem_plano",
    lastVisit: toDateInputValue(addDays(today, -96)),
    nextAppointmentAt: undefined,
    favoriteService: "Acabamento",
    preferredProfessional: "Rafael Oliveira",
    frequencyLabel: "1 visita a cada 2 meses",
    origin: "passou_na_frente",
    birthday: "1992-01-14",
    active: true,
    createdAt: toDateInputValue(addDays(today, -430)),
    pendingCommandTotal: 0,
    hasOpenCommand: false,
    internalNotes: "Cliente frio, vale contato por WhatsApp.",
    preferences: ["Acabamento simples"],
    tags: ["Sem retorno", "Reativar"],
    history: [
      {
        id: "client-h-007",
        date: toDateInputValue(addDays(today, -96)),
        title: "Último atendimento",
        detail: "Faz tempo que não volta.",
        kind: "atendimento",
        professional: "Rafael Oliveira",
      },
    ],
    returnRecommendation: "Sem retorno ha mais de 90 dias.",
    whatsappEnabled: true,
    noReturnDays: 96,
    lastAttendanceSummary: "Último atendimento ha mais de 90 dias.",
  },
  {
    id: 7,
    name: "Thiago Souza",
    phone: "(11) 98880-0007",
    email: "thiago.souza@barbeariavip.com",
    visits: 2,
    averageTicket: 70,
    totalSpent: 140,
    status: "ativo",
    clientType: "avulso",
    lastVisit: toDateInputValue(addDays(today, -1)),
    nextAppointmentAt: undefined,
    favoriteService: "Corte masculino",
    preferredProfessional: "Diego Martins",
    frequencyLabel: "Cliente novo",
    origin: "portal",
    birthday: "2000-09-10",
    active: true,
    createdAt: toDateInputValue(addDays(today, -21)),
    pendingCommandTotal: 0,
    hasOpenCommand: false,
    internalNotes: "Cliente novo, observar recorrência.",
    preferences: ["Corte curto"],
    tags: ["Novo", "Avulso"],
    history: [
      {
        id: "client-h-008",
        date: toDateInputValue(addDays(today, -1)),
        title: "Primeiro retorno",
        detail: "Serviço avulso pago normalmente.",
        kind: "atendimento",
        professional: "Diego Martins",
        amount: 60,
      },
    ],
    returnRecommendation: "Acompanhar retorno para possível assinatura.",
    whatsappEnabled: true,
    noReturnDays: 1,
    lastAttendanceSummary: "Primeiro retorno avulso pago normalmente.",
  },
  {
    id: 8,
    name: "Matheus Alves",
    phone: "(11) 98880-0008",
    email: "matheus.alves@barbeariavip.com",
    visits: 20,
    averageTicket: 109,
    totalSpent: 2180,
    status: "ativo",
    clientType: "recorrente",
    lastVisit: toDateInputValue(addDays(today, -4)),
    nextAppointmentAt: toDateInputValue(addDays(today, 7)),
    favoriteService: "Corte + barba",
    preferredProfessional: "Lucas Santos",
    frequencyLabel: "Semanal",
    origin: "campanha",
    birthday: "1989-12-02",
    active: true,
    createdAt: toDateInputValue(addDays(today, -280)),
    pendingCommandTotal: 0,
    hasOpenCommand: false,
    internalNotes: "Potencial para plano premium.",
    preferences: ["Barba completa", "Finalizador premium"],
    tags: ["Alta frequencia", "Plano"],
    history: [
      {
        id: "client-h-009",
        date: toDateInputValue(addDays(today, -4)),
        title: "Serviço recorrente",
        detail: "Corte + barba com pagamento no Pix.",
        kind: "atendimento",
        professional: "Lucas Santos",
        amount: 109,
      },
    ],
    returnRecommendation: "Cliente frequente, ideal para converter em plano.",
    whatsappEnabled: true,
    noReturnDays: 4,
    lastAttendanceSummary: "Corte + barba com pagamento no Pix.",
  },
  {
    id: 9,
    name: "Caio Henrique",
    phone: "(11) 98880-0009",
    email: "caio.henrique@barbeariavip.com",
    visits: 7,
    averageTicket: 92,
    totalSpent: 644,
    status: "em_atencao",
    clientType: "avulso",
    lastVisit: toDateInputValue(addDays(today, -2)),
    nextAppointmentAt: toDateInputValue(addDays(today, 6)),
    favoriteService: "Corte masculino",
    preferredProfessional: "Rafael Oliveira",
    frequencyLabel: "Mensal",
    origin: "whatsapp",
    birthday: "1996-10-27",
    active: true,
    createdAt: toDateInputValue(addDays(today, -150)),
    pendingCommandTotal: 74,
    hasOpenCommand: true,
    internalNotes: "Comanda aberta precisa de conferência.",
    preferences: ["Pagamento no Pix"],
    tags: ["Comanda pendente", "Conferir"],
    history: [
      {
        id: "client-h-010",
        date: toDateInputValue(addDays(today, -2)),
        title: "Comanda pendente",
        detail: "Serviço concluido com pagamento pendente.",
        kind: "comanda",
        professional: "Rafael Oliveira",
        amount: 74,
      },
    ],
    returnRecommendation: "Cobrar a comanda antes do próximo atendimento.",
    whatsappEnabled: true,
    noReturnDays: 2,
    lastAttendanceSummary: "Atendimento concluido com pagamento pendente.",
  },
  {
    id: 10,
    name: "Victor Hugo",
    phone: "(11) 98880-0010",
    email: "victor.hugo@barbeariavip.com",
    visits: 15,
    averageTicket: 118,
    totalSpent: 1770,
    status: "ativo",
    clientType: "assinante_ativo",
    lastVisit: toDateInputValue(addDays(today, -2)),
    nextAppointmentAt: toDateInputValue(addDays(today, 3)),
    favoriteService: "Barba completa",
    preferredProfessional: "Diego Martins",
    frequencyLabel: "Quinzenal",
    origin: "indicacao",
    birthday: "1993-07-19",
    active: true,
    createdAt: toDateInputValue(addDays(today, -210)),
    planName: "Clube Premium",
    subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
    pendingCommandTotal: 0,
    hasOpenCommand: false,
    internalNotes: "Assinante premium com maior ticket medio.",
    preferences: ["Barba quente", "Finalizacao premium"],
    tags: ["Premium", "Reserva"],
    history: [
      {
        id: "client-h-011",
        date: toDateInputValue(addDays(today, -2)),
        title: "Uso do plano",
        detail: "Barba coberta com extra pago.",
        kind: "assinatura",
        professional: "Diego Martins",
        amount: 0,
      },
    ],
    returnRecommendation: "Manter prioridade de agenda.",
    whatsappEnabled: true,
    noReturnDays: 2,
    lastAttendanceSummary: "Plano premium ativo com extras cobrados a parte.",
    planStatus: PLAN_STATUS.ACTIVE,
  },
  {
    id: 11,
    name: "Daniel Costa",
    phone: "(11) 98880-0011",
    email: "daniel.costa@barbeariavip.com",
    visits: 11,
    averageTicket: 86,
    totalSpent: 946,
    status: "em_atencao",
    clientType: "assinante_ativo",
    lastVisit: toDateInputValue(addDays(today, -11)),
    nextAppointmentAt: undefined,
    favoriteService: "Corte masculino",
    preferredProfessional: "Rafael Oliveira",
    frequencyLabel: "Mensal",
    origin: "portal",
    birthday: "1995-04-01",
    active: true,
    createdAt: toDateInputValue(addDays(today, -190)),
    planName: "Clube Corte 2x",
    subscriptionStatus: SUBSCRIPTION_STATUS.PAUSED,
    pendingCommandTotal: 0,
    hasOpenCommand: false,
    internalNotes: "Plano pausado aguardando retorno do cliente.",
    preferences: ["Corte baixo"],
    tags: ["Pausado"],
    history: [
      {
        id: "client-h-012",
        date: toDateInputValue(addDays(today, -11)),
        title: "Plano pausado",
        detail: "Benefícios temporariamente indisponiveis.",
        kind: "assinatura",
        professional: "Rafael Oliveira",
      },
    ],
    returnRecommendation: "Plano pausado: verificar retomada.",
    whatsappEnabled: true,
    noReturnDays: 11,
    lastAttendanceSummary: "Plano pausado aguardando regularizacao.",
    planStatus: PLAN_STATUS.ACTIVE,
  },
  {
    id: 12,
    name: "Paulo Mendes",
    phone: "(11) 98880-0012",
    email: "paulo.mendes@barbeariavip.com",
    visits: 9,
    averageTicket: 80,
    totalSpent: 720,
    status: "inativo",
    clientType: "ex_assinante",
    lastVisit: toDateInputValue(addDays(today, -74)),
    nextAppointmentAt: undefined,
    favoriteService: "Barba completa",
    preferredProfessional: "Lucas Santos",
    frequencyLabel: "1 visita por mes",
    origin: "indicacao",
    birthday: "1987-05-30",
    active: true,
    createdAt: toDateInputValue(addDays(today, -500)),
    planName: "Clube Essencial",
    subscriptionStatus: SUBSCRIPTION_STATUS.EXPIRED,
    pendingCommandTotal: 0,
    hasOpenCommand: false,
    internalNotes: "Contrato expirado sem renovacao.",
    preferences: ["Corte classico"],
    tags: ["Ex-assinante", "Expirado"],
    history: [
      {
        id: "client-h-013",
        date: toDateInputValue(addDays(today, -74)),
        title: "Contrato expirado",
        detail: "Sem renovacao no ciclo anterior.",
        kind: "assinatura",
        professional: "Lucas Santos",
      },
    ],
    returnRecommendation: "Ex-assinante com chance de renovacao.",
    whatsappEnabled: true,
    noReturnDays: 74,
    lastAttendanceSummary: "Contrato expirado sem renovacao.",
    planStatus: PLAN_STATUS.INACTIVE,
  },
  {
    id: 13,
    name: "Rodrigo Carvalho",
    phone: "(11) 98880-0013",
    email: "rodrigo.carvalho@barbeariavip.com",
    visits: 21,
    averageTicket: 132,
    totalSpent: 2772,
    status: "ativo",
    clientType: "recorrente",
    lastVisit: toDateInputValue(addDays(today, -6)),
    nextAppointmentAt: toDateInputValue(addDays(today, 5)),
    favoriteService: "Corte + barba",
    preferredProfessional: "Diego Martins",
    frequencyLabel: "Semanal",
    origin: "whatsapp",
    birthday: "1990-09-08",
    active: true,
    createdAt: toDateInputValue(addDays(today, -260)),
    pendingCommandTotal: 0,
    hasOpenCommand: false,
    internalNotes: "Alta recorrência e ticket acima da media.",
    preferences: ["Corte + barba", "Toalha quente"],
    tags: ["Alta recorrência", "Valor alto"],
    history: [
      {
        id: "client-h-014",
        date: toDateInputValue(addDays(today, -6)),
        title: "Atendimento recorrente",
        detail: "Corte + barba com produto adicional.",
        kind: "atendimento",
        professional: "Diego Martins",
        amount: 132,
      },
    ],
    returnRecommendation: "Mantem boa frequencia; oferecer plano premium.",
    whatsappEnabled: true,
    noReturnDays: 6,
    lastAttendanceSummary: "Atendimento recorrente com ticket alto.",
  },
  {
    id: 14,
    name: "Yuri Barbosa",
    phone: "(11) 98880-0014",
    email: "yuri.barbosa@barbeariavip.com",
    visits: 13,
    averageTicket: 104,
    totalSpent: 1352,
    status: "ativo",
    clientType: "assinante_ativo",
    lastVisit: toDateInputValue(addDays(today, -1)),
    nextAppointmentAt: toDateInputValue(addDays(today, 8)),
    favoriteService: "Corte masculino",
    preferredProfessional: "Rafael Oliveira",
    frequencyLabel: "Quinzenal",
    origin: "portal",
    birthday: "1998-12-12",
    active: true,
    createdAt: toDateInputValue(addDays(today, -170)),
    planName: "Clube Barba e Cabelo",
    subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
    pendingCommandTotal: 0,
    hasOpenCommand: false,
    internalNotes: "Mantem benefício reservado com antecedencia.",
    preferences: ["Reserva cedo", "Corte alinhado"],
    tags: ["Saldo reservado", "Portal"],
    history: [
      {
        id: "client-h-015",
        date: toDateInputValue(addDays(today, -1)),
        title: "Benefício reservado",
        detail: "Próximo corte já reservado no ciclo.",
        kind: "assinatura",
        professional: "Rafael Oliveira",
      },
    ],
    returnRecommendation: "Assinante ativo com boa previsibilidade.",
    whatsappEnabled: true,
    noReturnDays: 1,
    lastAttendanceSummary: "Benefício reservado em agendamento futuro.",
    planStatus: PLAN_STATUS.ACTIVE,
  },
  {
    id: 15,
    name: "Eduardo Ramos",
    phone: "(11) 98880-0015",
    email: "eduardo.ramos@barbeariavip.com",
    visits: 5,
    averageTicket: 74,
    totalSpent: 370,
    status: "sem_retorno",
    clientType: "sem_plano",
    lastVisit: toDateInputValue(addDays(today, -58)),
    nextAppointmentAt: undefined,
    favoriteService: "Corte masculino",
    preferredProfessional: "Lucas Santos",
    frequencyLabel: "Irregular",
    origin: "instagram",
    birthday: "1999-02-24",
    active: true,
    createdAt: toDateInputValue(addDays(today, -360)),
    pendingCommandTotal: 0,
    hasOpenCommand: false,
    internalNotes: "Cliente quente que esfriou recentemente.",
    preferences: ["Corte simples"],
    tags: ["Sem retorno", "Reativar"],
    history: [
      {
        id: "client-h-016",
        date: toDateInputValue(addDays(today, -58)),
        title: "Último atendimento",
        detail: "Sem retorno apos o último corte.",
        kind: "atendimento",
        professional: "Lucas Santos",
        amount: 74,
      },
    ],
    returnRecommendation: "Boa oportunidade para campanha de retorno.",
    whatsappEnabled: true,
    noReturnDays: 58,
    lastAttendanceSummary: "Sem retorno ha quase dois meses.",
  },
  {
    id: 16,
    name: "Alan Pereira",
    phone: "(11) 98880-0016",
    email: "alan.pereira@barbeariavip.com",
    visits: 3,
    averageTicket: 68,
    totalSpent: 204,
    status: "ativo",
    clientType: "sem_plano",
    lastVisit: toDateInputValue(addDays(today, -12)),
    nextAppointmentAt: undefined,
    favoriteService: "Acabamento",
    preferredProfessional: "Diego Martins",
    frequencyLabel: "Curta recorrência",
    origin: "campanha",
    birthday: "2001-05-17",
    active: true,
    createdAt: toDateInputValue(addDays(today, -90)),
    pendingCommandTotal: 0,
    hasOpenCommand: false,
    internalNotes: "Aceitou campanha mas ainda não virou plano.",
    preferences: ["Acabamento rapido"],
    tags: ["Interesse em plano", "Campanha"],
    history: [
      {
        id: "client-h-017",
        date: toDateInputValue(addDays(today, -12)),
        title: "Cliente em acompanhamento",
        detail: "Bom candidato para oferecer assinatura.",
        kind: "nota",
      },
    ],
    returnRecommendation: "Boa oportunidade para oferecer plano.",
    whatsappEnabled: true,
    noReturnDays: 12,
    lastAttendanceSummary: "Cliente em acompanhamento de retorno.",
  },
]

function buildBenefitBalances(
  plan: Plan,
  mode:
    | "normal"
    | "reserved"
    | "consumed"
    | "blocked"
    | "paused"
    | "cancelled"
    | "expired"
    | "reserved_and_consumed"
) {
  return plan.includedServices.map((service, serviceIndex) => {
    const isUnlimited = Boolean(service.unlimited)

    if (mode === "reserved_and_consumed" && serviceIndex === 0 && !isUnlimited) {
      return {
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        available: Math.max(service.quantityPerCycle - 2, 0),
        reserved: 1,
        consumed: 1,
      }
    }

    if (mode === "reserved" && serviceIndex === 0 && !isUnlimited) {
      return {
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        available: Math.max(service.quantityPerCycle - 1, 0),
        reserved: 1,
        consumed: 0,
      }
    }

    if (mode === "consumed" && !isUnlimited) {
      return {
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        available: 0,
        reserved: 0,
        consumed: service.quantityPerCycle,
      }
    }

    if (mode === "blocked" && serviceIndex === 0 && !isUnlimited) {
      return {
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        available: 0,
        reserved: 0,
        consumed: service.quantityPerCycle,
      }
    }

    if (mode === "paused" && serviceIndex === 0 && !isUnlimited) {
      return {
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        available: 0,
        reserved: 0,
        consumed: 0,
      }
    }

    if (mode === "cancelled" || mode === "expired") {
      return {
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        available: 0,
        reserved: 0,
        consumed: 0,
      }
    }

    return {
      serviceId: service.serviceId,
      serviceName: service.serviceName,
      available: isUnlimited ? 0 : service.quantityPerCycle,
      reserved: 0,
      consumed: 0,
    }
  })
}

const subscriptionBlueprints: Record<
  number,
  {
    status: SubscriptionStatus
    mode:
      | "normal"
      | "reserved"
      | "consumed"
      | "blocked"
      | "paused"
      | "cancelled"
      | "expired"
      | "reserved_and_consumed"
    usageHistory?: Subscription["usageHistory"]
    lastUsageAt?: string
    nextAppointmentAt?: string
    alert?: string
    notes: string
  }
> = {
  1: {
    status: SUBSCRIPTION_STATUS.ACTIVE,
    mode: "reserved_and_consumed",
    usageHistory: [
      {
        id: "usage_demo_001",
        serviceId: "1",
        serviceName: "Corte masculino",
        appointmentId: "1",
        attendanceId: "ATT-1001",
        commandId: "CMD-1001",
        quantity: 1,
        status: "consumed",
        occurredAt: toDateInputValue(addDays(today, -7)),
      },
    ],
    lastUsageAt: toDateInputValue(addDays(today, -3)),
    nextAppointmentAt: toDateInputValue(addDays(today, 2)),
    alert: "Benefício reservado e consumido no mesmo ciclo.",
    notes: "Reserva convertida em consumo no atendimento concluido.",
  },
  3: {
    status: SUBSCRIPTION_STATUS.DELINQUENT,
    mode: "blocked",
    usageHistory: [],
    lastUsageAt: toDateInputValue(addDays(today, -9)),
    nextAppointmentAt: toDateInputValue(addDays(today, 2)),
    alert: "Cliente inadimplente: benefícios bloqueados.",
    notes: "Cobrar como avulso até regularizacao.",
  },
  4: {
    status: SUBSCRIPTION_STATUS.ACTIVE,
    mode: "reserved",
    usageHistory: [
      {
        id: "usage_demo_002",
        serviceId: "1",
        serviceName: "Corte masculino",
        appointmentId: "2",
        quantity: 1,
        status: "reserved",
        occurredAt: toDateInputValue(addDays(today, -2)),
      },
    ],
    lastUsageAt: toDateInputValue(addDays(today, -2)),
    nextAppointmentAt: toDateInputValue(addDays(today, 1)),
    alert: "Próximo atendimento já reservado.",
    notes: "Benefício mantido para o próximo horário.",
  },
  5: {
    status: SUBSCRIPTION_STATUS.CANCELLED,
    mode: "cancelled",
    lastUsageAt: toDateInputValue(addDays(today, -68)),
    alert: "Assinatura cancelada pelo cliente.",
    notes: "Contrato encerrado e mantido no histórico.",
  },
  10: {
    status: SUBSCRIPTION_STATUS.ACTIVE,
    mode: "normal",
    lastUsageAt: toDateInputValue(addDays(today, -2)),
    nextAppointmentAt: toDateInputValue(addDays(today, 3)),
    alert: "Plano ativo com saldo disponível.",
    notes: "Benefícios disponiveis para uso no ciclo.",
  },
  11: {
    status: SUBSCRIPTION_STATUS.PAUSED,
    mode: "paused",
    lastUsageAt: toDateInputValue(addDays(today, -11)),
    alert: "Plano pausado temporariamente.",
    notes: "Benefícios suspensos até reativacao.",
  },
  12: {
    status: SUBSCRIPTION_STATUS.EXPIRED,
    mode: "expired",
    lastUsageAt: toDateInputValue(addDays(today, -74)),
    alert: "Plano expirado. Renovacao pendente.",
    notes: "Contrato expirado sem renovacao.",
  },
  14: {
    status: SUBSCRIPTION_STATUS.ACTIVE,
    mode: "consumed",
    lastUsageAt: toDateInputValue(addDays(today, -1)),
    nextAppointmentAt: toDateInputValue(addDays(today, 8)),
    alert: "Benefícios sendo consumidos de forma previsivel.",
    notes: "Saldo em uso no ciclo atual.",
  },
}

const demoSubscriptions: Subscription[] = demoClients
  .filter((client) => client.planName)
  .map((client, index) => {
    const plan = demoPlans.find((item) => item.name === client.planName) ?? demoPlans[0]
    const blueprint =
      subscriptionBlueprints[client.id] ?? subscriptionBlueprints[client.id % 14] ?? {
        status: SUBSCRIPTION_STATUS.ACTIVE,
        mode: "normal" as const,
      }

    return {
      id: index + 1,
      clientId: client.id,
      client: client.name,
      phone: client.phone,
      plan: plan.name,
      value: plan.price,
      nextCharge: toDateInputValue(addDays(today, 12 + index * 3)),
      startedAt: client.createdAt,
      status: blueprint.status,
      benefitBalances: buildBenefitBalances(plan, blueprint.mode),
      usageHistory: blueprint.usageHistory ?? [],
      lastUsageAt: blueprint.lastUsageAt,
      nextAppointmentAt: blueprint.nextAppointmentAt,
      alert: blueprint.alert,
      notes: blueprint.notes,
    }
  })

export function getCompany(): Company {
  return {
    corporateName: "Barbearia VIP Tecnologia e Estilo LTDA",
    tradeName: "Barbearia VIP",
    cnpj: "12.345.678/0001-90",
    email: "contato@barbeariavip.com",
    timezone: "America/Sao_Paulo",
    phone: "(11) 4002-8922",
    slug: "barbearia-vip",
    primaryColor: { r: 145, g: 230, b: 104 },
    logoUrl: "/brand/bigood-portal-icon.png?v=3",
    logoAlt: "Bigood Logo",
    iconUrl: "/brand/bigood-portal-icon.png?v=3",
    chairs: ["Cadeira 1", "Cadeira 2", "Cadeira 3"],
    professionalRoles: ["Barbeiro fundador", "Barbeiro senior", "Barbeiro"],
    serviceCategories: ["Cabelo", "Barba", "Combo"],
    operationalSettings: {
      unitName: "Unidade Augusta",
      openingDays: "Seg a Sab",
      openingStart: "09:00",
      openingEnd: "19:00",
      breakText: "Intervalo principal das 13:00 as 14:00",
      minimumAdvanceHours: 2,
      minimumCancellationHours: 4,
      minimumRescheduleHours: 4,
      allowPortalBooking: true,
      allowWalkIn: true,
      allowChooseProfessional: true,
      allowAnyProfessional: true,
      portalShowPrices: true,
      portalShowDuration: true,
      portalShowProfessionals: true,
      portalShowPlans: true,
      portalShowBalance: true,
      whatsappLabel: "Atendimento via WhatsApp das 09:00 as 19:00",
      welcomeMessage:
        "Agende online, acompanhe seu plano e fale com a barbearia quando precisar.",
      cancellationPolicy:
        "Cancelamento até 4 horas antes do horário reservado.",
      noShowPolicy:
        "Faltas podem impactar o saldo do plano conforme a regra da barbearia.",
      paymentMethods: ["Pix", "Dinheiro", "Cartao de credito", "Cartao de debito"],
      blockedDaysNote: "Domingo fechado e feriados conforme operação da unidade.",
    },
    address: {
      street: "Rua Augusta",
      number: "1240",
      neighborhood: "Consolacao",
      city: "Sao Paulo",
      state: "SP",
      zip: "01304-001",
      mapsUrl: "https://maps.google.com/?q=Rua+Augusta+1240",
    },
    social: {
      instagram: "@barbeariavip",
      whatsapp: "(11) 98888-0100",
      facebook: "barbeariavip",
    },
  }
}

export function getServices(): ServiceCatalogItem[] {
  return demoServices
}

export function getPlans(): Plan[] {
  return demoPlans
}

export function getProfessionals(): Professional[] {
  return demoProfessionals
}

export function getClients(): Client[] {
  return demoClients
}

export function getSubscriptions(): Subscription[] {
  return demoSubscriptions
}

export function getAgendaEvents(): AgendaEvent[] {
  return [
    {
      id: 1,
      barber: "Rafael Oliveira",
      date: toDateInputValue(today),
      start: "09:00",
      end: "09:45",
      title: "Henrique Demo",
      detail: "Corte masculino",
      status: APPOINTMENT_STATUS.CONFIRMED,
      attendanceStatus: ATTENDANCE_STATUS.COMPLETED,
      commandId: "CMD-1001",
      origin: "portal",
      notes: "Assinante ativo com benefício reservado.",
      reservedBenefitServiceId: "1",
      type: "appointment",
    },
    {
      id: 2,
      barber: "Lucas Santos",
      date: toDateInputValue(today),
      start: "10:00",
      end: "11:15",
      title: "Gabriel Silva",
      detail: "Corte + barba",
      status: APPOINTMENT_STATUS.CONFIRMED,
      attendanceStatus: ATTENDANCE_STATUS.COMPLETED,
      commandId: "CMD-1002",
      origin: "manual",
      notes: "Serviço fora da cobertura restante; cobrar como extra.",
      type: "appointment",
    },
    {
      id: 3,
      barber: "Diego Martins",
      date: toDateInputValue(today),
      start: "11:30",
      end: "12:05",
      title: "Marcos Almeida",
      detail: "Barba completa",
      status: APPOINTMENT_STATUS.CONFIRMED,
      attendanceStatus: ATTENDANCE_STATUS.COMPLETED,
      commandId: "CMD-1003",
      origin: "portal",
      notes: "Assinatura inadimplente; benefício bloqueado.",
      type: "appointment",
    },
    {
      id: 4,
      barber: "Rafael Oliveira",
      date: toDateInputValue(today),
      start: "13:30",
      end: "14:15",
      title: "Joao Pedro",
      detail: "Corte masculino",
      status: APPOINTMENT_STATUS.PENDING,
      origin: "portal",
      notes: "Aguardando confirmacao da barbearia.",
      reservedBenefitServiceId: "1",
      type: "appointment",
    },
    {
      id: 5,
      barber: "Rafael Oliveira",
      date: toDateInputValue(today),
      start: "10:30",
      end: "11:15",
      title: "Felipe Costa",
      detail: "Corte masculino",
      status: APPOINTMENT_STATUS.CONFIRMED,
      attendanceStatus: ATTENDANCE_STATUS.IN_PROGRESS,
      commandId: "CMD-1004",
      origin: "manual",
      notes: "Atendimento em andamento; comanda aberta.",
      reservedBenefitServiceId: "1",
      type: "appointment",
    },
    {
      id: 6,
      barber: "Rafael Oliveira",
      date: toDateInputValue(today),
      start: "15:00",
      end: "15:35",
      title: "Bruno Lima",
      detail: "Barba completa",
      status: APPOINTMENT_STATUS.NO_SHOW,
      origin: "portal",
      notes: "Cliente não compareceu. Politica de falta ainda em aberto.",
      reservedBenefitServiceId: "2",
      type: "appointment",
    },
    {
      id: 7,
      barber: "Rafael Oliveira",
      date: toDateInputValue(today),
      start: "16:00",
      end: "16:45",
      title: "Andre Rocha",
      detail: "Corte masculino",
      status: APPOINTMENT_STATUS.CANCELLED,
      origin: "manual",
      cancelReason: "client_cancelled",
      notes: "Cancelado pelo cliente.",
      type: "appointment",
    },
    {
      id: 8,
      barber: "Rafael Oliveira",
      date: toDateInputValue(today),
      start: "17:00",
      end: "17:25",
      title: "Thiago Souza",
      detail: "Acabamento",
      status: APPOINTMENT_STATUS.CONFIRMED,
      attendanceStatus: ATTENDANCE_STATUS.CLIENT_ARRIVED,
      origin: "walk_in",
      notes: "Encaixe manual aguardando inicio.",
      type: "appointment",
    },
  ]
}

function hasStartedAppointment(event: AgendaEvent, referenceDate: Date) {
  if (event.type !== "appointment") return false
  if (event.status === APPOINTMENT_STATUS.CANCELLED) return false
  if (event.status === APPOINTMENT_STATUS.NO_SHOW) return false
  if (event.date !== toDateInputValue(referenceDate)) return false

  const [hour, minute] = event.start.split(":").map(Number)
  const eventMinutes = hour * 60 + minute
  const nowMinutes = referenceDate.getHours() * 60 + referenceDate.getMinutes()

  return nowMinutes >= eventMinutes
}

function buildPaymentMetadata(payment: Payment) {
  const method = payment.method.toLowerCase()
  const isSubscription =
    Boolean(payment.subscriptionId) ||
    method.includes("assinatura") ||
    method.includes("plano")
  const isPlatformCard =
    method.includes("cartao online") ||
    method.includes("checkout plataforma") ||
    method.includes("gateway")

  if (isSubscription) {
    return {
      financialOrigin: "subscription" as const,
      processingChannel: "platform_gateway" as const,
      isPlatformBalanceEligible: true,
      releaseStatus: "available" as const,
    }
  }

  if (isPlatformCard) {
    return {
      financialOrigin: "platform" as const,
      processingChannel: "platform_gateway" as const,
      isPlatformBalanceEligible: true,
      releaseStatus: "pending" as const,
    }
  }

  return {
    financialOrigin: "direct" as const,
    processingChannel: "external" as const,
    isPlatformBalanceEligible: false,
  }
}

function buildAutomaticCommandFromAppointment(
  event: AgendaEvent,
  commandId: string
): Comanda {
  const firstServiceLabel = event.detail.split(",")[0]?.trim() || "Serviço"
  const service = demoServices.find((item) => item.name === firstServiceLabel)
  const client = demoClients.find(
    (item) => item.name.toLowerCase() === event.title.toLowerCase()
  )
  const subscription = client
    ? demoSubscriptions.find((item) => item.clientId === client.id)
    : undefined

  return {
    id: commandId,
    type: "attendance",
    appointmentId: `AG-${event.id}`,
    origin: "agenda",
    clientType:
      client?.clientType === "assinante_ativo" ||
      client?.clientType === "assinante_inadimplente" ||
      client?.clientType === "sem_plano"
        ? client.clientType
        : "avulso",
    client: event.title,
    barber: event.barber,
    status: COMMAND_STATUS.OPEN,
    attendanceStatus: event.attendanceStatus ?? ATTENDANCE_STATUS.IN_PROGRESS,
    subscriptionStatus: subscription?.status,
    mainService: firstServiceLabel,
    appointmentDate: event.date,
    appointmentStart: event.start,
    createdAt: `${event.date}T${event.start}:00`,
    updatedAt: `${event.date}T${event.start}:00`,
    openedAt: `${event.date}T${event.start}:00`,
    payment: "Pendente",
    paymentMethodLabel: "Pendente",
    time: event.start,
    chair: "Cadeira 1",
    items: [
      {
        name: firstServiceLabel,
        quantity: 1,
        unitPrice: service?.price ?? 0,
        category: "servico",
      },
    ],
    notes:
      "Comanda aberta automaticamente no inicio do atendimento (agendamento ativo).",
  }
}

function attachAutomaticCommands(
  baseComandas: Comanda[],
  agendaEvents: AgendaEvent[]
) {
  const byId = new Set(baseComandas.map((comanda) => comanda.id))
  const commands: Comanda[] = baseComandas.map((command) => ({
    ...command,
    type: "attendance" as const,
    mainService:
      command.mainService ??
      command.items.find((item) => item.category === "servico")?.name,
    appointmentDate: command.appointmentDate ?? toDateInputValue(today),
    appointmentStart: command.appointmentStart ?? command.time,
    createdAt:
      command.createdAt ?? `${toDateInputValue(today)}T${command.time}:00`,
    updatedAt:
      command.updatedAt ?? `${toDateInputValue(today)}T${command.time}:00`,
    openedAt:
      command.openedAt ?? `${toDateInputValue(today)}T${command.time}:00`,
    closedAt:
      command.status === COMMAND_STATUS.PAID && !command.closedAt
        ? `${toDateInputValue(today)}T${command.time}:00`
        : command.closedAt,
    payments: (command.payments ?? []).map((payment) => ({
      ...payment,
      ...buildPaymentMetadata(payment),
    })),
  }))

  const maxId = commands.reduce((max, command) => {
    const parsed = Number(command.id.replace(/\D+/g, ""))
    return Number.isFinite(parsed) ? Math.max(max, parsed) : max
  }, 1000)
  let nextId = maxId + 1

  for (const event of agendaEvents) {
    if (!hasStartedAppointment(event, today)) continue

    if (event.commandId && byId.has(event.commandId)) {
      const existing = commands.find((command) => command.id === event.commandId)
      if (existing && !existing.appointmentId) {
        existing.appointmentId = `AG-${event.id}`
        existing.appointmentDate = event.date
        existing.appointmentStart = event.start
        existing.updatedAt = `${event.date}T${event.start}:00`
      }
      continue
    }

    const existingByAppointment = commands.find(
      (command) => command.appointmentId === `AG-${event.id}`
    )
    if (existingByAppointment) {
      event.commandId = existingByAppointment.id
      continue
    }

    const commandId = `CMD-${nextId}`
    nextId += 1

    const automaticCommand = buildAutomaticCommandFromAppointment(event, commandId)
    commands.push(automaticCommand)
    byId.add(commandId)
    event.commandId = commandId
  }

  return commands
}

export function getComandas(
  agendaEvents: AgendaEvent[] = getAgendaEvents()
): Comanda[] {
  const baseComandas: Comanda[] = [
    {
      id: "CMD-1001",
      time: "09:50",
      client: "Henrique Demo",
      clientType: "assinante_ativo",
      origin: "agenda",
      barber: "Rafael Oliveira",
      chair: "Cadeira 1",
      attendanceId: "ATT-1001",
      attendanceStatus: ATTENDANCE_STATUS.COMPLETED,
      subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
      status: COMMAND_STATUS.PAID,
      payment: "Pix",
      paymentMethodLabel: "Pix",
      payments: [
        {
          id: "PAY-1001",
          commandId: "CMD-1001",
          amount: 0,
          method: "Plano",
          status: PAYMENT_STATUS.PAID,
          paidAt: toDateInputValue(today),
          notes: "Serviço coberto pelo plano",
        },
      ] satisfies Payment[],
      items: [
        {
          name: "Corte masculino",
          quantity: 1,
          unitPrice: 0,
          category: "servico",
          coverage: "included_in_plan",
          serviceId: "1",
        },
      ],
      notes: "Incluso no plano; reserva convertida em consumo.",
    },
    {
      id: "CMD-1002",
      time: "10:20",
      client: "Gabriel Silva",
      clientType: "avulso",
      origin: "walk_in",
      barber: "Lucas Santos",
      chair: "Cadeira 2",
      attendanceStatus: ATTENDANCE_STATUS.COMPLETED,
      status: COMMAND_STATUS.PAID,
      payment: "Pix",
      paymentMethodLabel: "Pix",
      payments: [
        {
          id: "PAY-1002",
          commandId: "CMD-1002",
          amount: 95,
          method: "Pix",
          status: PAYMENT_STATUS.PAID,
          paidAt: toDateInputValue(today),
        },
      ] satisfies Payment[],
      items: [
        {
          name: "Corte + barba",
          quantity: 1,
          unitPrice: 95,
          category: "servico",
          coverage: "regular",
        },
      ],
      notes: "Cliente avulso pago no Pix.",
    },
    {
      id: "CMD-1003",
      time: "11:20",
      client: "Marcos Almeida",
      clientType: "assinante_inadimplente",
      origin: "agenda",
      barber: "Diego Martins",
      chair: "Cadeira 3",
      attendanceId: "ATT-1003",
      attendanceStatus: ATTENDANCE_STATUS.COMPLETED,
      subscriptionStatus: SUBSCRIPTION_STATUS.DELINQUENT,
      status: COMMAND_STATUS.PENDING,
      payment: "Pendente",
      paymentMethodLabel: "Pendente",
      items: [
        {
          name: "Barba completa",
          quantity: 1,
          unitPrice: 45,
          category: "servico",
          coverage: "extra_paid",
        },
      ],
      notes: "Assinante inadimplente, benefício bloqueado.",
    },
    {
      id: "CMD-1004",
      time: "12:10",
      client: "Felipe Costa",
      clientType: "assinante_ativo",
      origin: "agenda",
      barber: "Rafael Oliveira",
      chair: "Cadeira 1",
      attendanceId: "ATT-1005",
      attendanceStatus: ATTENDANCE_STATUS.IN_PROGRESS,
      subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
      status: COMMAND_STATUS.OPEN,
      payment: "Pendente",
      paymentMethodLabel: "Pendente",
      items: [
        {
          name: "Corte masculino",
          quantity: 1,
          unitPrice: 0,
          category: "servico",
          coverage: "included_in_plan",
          serviceId: "1",
        },
        {
          name: "Pomada modeladora",
          quantity: 1,
          unitPrice: 49,
          category: "produto",
          coverage: "regular",
        },
      ],
      notes: "Atendimento em andamento com produto extra.",
    },
    {
      id: "CMD-1005",
      time: "13:40",
      client: "Joao Pedro",
      clientType: "assinante_ativo",
      origin: "portal",
      barber: "Rafael Oliveira",
      chair: "Cadeira 1",
      attendanceStatus: ATTENDANCE_STATUS.COMPLETED,
      subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
      status: COMMAND_STATUS.PENDING,
      payment: "Pix + pendente",
      paymentMethodLabel: "Pix + dinheiro",
      payments: [
        {
          id: "PAY-1003",
          commandId: "CMD-1005",
          amount: 49,
          method: "Pix",
          status: PAYMENT_STATUS.PARTIAL,
          paidAt: toDateInputValue(today),
          notes: "Entrada parcial",
        },
        {
          id: "PAY-1004",
          commandId: "CMD-1005",
          amount: 20,
          method: "Dinheiro",
          status: PAYMENT_STATUS.PENDING,
          notes: "Restante pendente",
        },
      ] satisfies Payment[],
      items: [
        {
          name: "Corte masculino",
          quantity: 1,
          unitPrice: 0,
          category: "servico",
          coverage: "included_in_plan",
          serviceId: "1",
        },
        {
          name: "Cera modeladora",
          quantity: 1,
          unitPrice: 69,
          category: "produto",
          coverage: "regular",
        },
      ],
      discount: 0,
      notes: "Serviço incluso no plano com produto adicional e pagamento parcial.",
    },
    {
      id: "CMD-1006",
      time: "14:30",
      client: "Bruno Lima",
      clientType: "avulso",
      origin: "walk_in",
      barber: "Rafael Oliveira",
      chair: "Cadeira 2",
      attendanceStatus: ATTENDANCE_STATUS.COMPLETED,
      status: COMMAND_STATUS.PENDING,
      payment: "Pendente",
      paymentMethodLabel: "Pix ou dinheiro",
      items: [
        {
          name: "Corte + barba",
          quantity: 1,
          unitPrice: 95,
          category: "servico",
          coverage: "regular",
        },
        {
          name: "Pomada modeladora",
          quantity: 1,
          unitPrice: 49,
          category: "produto",
          coverage: "regular",
        },
      ],
      notes: "Cliente avulso com servico e produto com pagamento pendente.",
    },
    {
      id: "CMD-1007",
      time: "15:15",
      client: "Andre Rocha",
      clientType: "assinante_ativo",
      origin: "agenda",
      barber: "Diego Martins",
      chair: "Cadeira 3",
      attendanceStatus: ATTENDANCE_STATUS.COMPLETED,
      subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
      status: COMMAND_STATUS.PAID,
      payment: "Cartao de credito",
      paymentMethodLabel: "Cartao de credito",
      payments: [
        {
          id: "PAY-1005",
          commandId: "CMD-1007",
          amount: 69,
          method: "Cartao de credito",
          status: PAYMENT_STATUS.PAID,
          paidAt: toDateInputValue(today),
        },
      ] satisfies Payment[],
      items: [
        {
          name: "Barba completa",
          quantity: 1,
          unitPrice: 0,
          category: "servico",
          coverage: "included_in_plan",
          serviceId: "2",
        },
        {
          name: "Toalha quente",
          quantity: 1,
          unitPrice: 19,
          category: "servico",
          coverage: "extra_paid",
        },
        {
          name: "Oleo para barba",
          quantity: 1,
          unitPrice: 50,
          category: "produto",
          coverage: "regular",
        },
      ],
      notes: "Plano cobriu a barba; extra e produto pagos a parte.",
    },
    {
      id: "CMD-1008",
      time: "16:00",
      client: "Thiago Souza",
      clientType: "sem_plano",
      origin: "direct_sale",
      barber: "Lucas Santos",
      chair: "Cadeira 1",
      attendanceStatus: ATTENDANCE_STATUS.COMPLETED,
      status: COMMAND_STATUS.PAID,
      payment: "Dinheiro",
      paymentMethodLabel: "Dinheiro",
      payments: [
        {
          id: "PAY-1006",
          commandId: "CMD-1008",
          amount: 55,
          method: "Dinheiro",
          status: PAYMENT_STATUS.PAID,
          paidAt: toDateInputValue(today),
        },
      ] satisfies Payment[],
      items: [
        {
          name: "Acabamento",
          quantity: 1,
          unitPrice: 35,
          category: "servico",
          coverage: "regular",
        },
        {
          name: "Pomada modeladora",
          quantity: 1,
          unitPrice: 20,
          category: "produto",
          coverage: "regular",
        },
      ],
      notes: "Venda direta sem plano ativo.",
    },
    {
      id: "CMD-1009",
      time: "17:10",
      client: "Gabriel Silva",
      clientType: "assinante_ativo",
      origin: "agenda",
      barber: "Rafael Oliveira",
      chair: "Cadeira 2",
      attendanceId: "ATT-1004",
      attendanceStatus: ATTENDANCE_STATUS.COMPLETED,
      subscriptionStatus: SUBSCRIPTION_STATUS.ACTIVE,
      status: COMMAND_STATUS.PAID,
      payment: "Pix + saldo",
      paymentMethodLabel: "Pix",
      payments: [
        {
          id: "PAY-1007",
          commandId: "CMD-1009",
          amount: 49,
          method: "Pix",
          status: PAYMENT_STATUS.PAID,
          paidAt: toDateInputValue(today),
          notes: "Extra pago no Pix",
        },
      ] satisfies Payment[],
      discount: 10,
      items: [
        {
          name: "Corte masculino",
          quantity: 1,
          unitPrice: 0,
          category: "servico",
          coverage: "included_in_plan",
          serviceId: "1",
        },
        {
          name: "Finalizador premium",
          quantity: 1,
          unitPrice: 59,
          category: "produto",
          coverage: "regular",
        },
      ],
      notes: "Serviço coberto pelo plano com produto extra.",
    },
    {
      id: "CMD-1010",
      time: "18:05",
      client: "Marcos Almeida",
      clientType: "assinante_inadimplente",
      origin: "agenda",
      barber: "Diego Martins",
      chair: "Cadeira 3",
      attendanceStatus: ATTENDANCE_STATUS.COMPLETED,
      subscriptionStatus: SUBSCRIPTION_STATUS.DELINQUENT,
      status: COMMAND_STATUS.OPEN,
      payment: "Conferir",
      paymentMethodLabel: "Conferir",
      items: [
        {
          name: "Corte masculino",
          quantity: 1,
          unitPrice: 60,
          category: "servico",
          coverage: "regular",
        },
      ],
      notes: "Assinante inadimplente, cobrar como avulso ou conferir manualmente.",
    },
    {
      id: "CMD-1011",
      time: "18:40",
      client: "Caio Henrique",
      clientType: "avulso",
      origin: "direct_sale",
      barber: "Rafael Oliveira",
      chair: "Cadeira 1",
      status: COMMAND_STATUS.OPEN,
      payment: "Pendente",
      paymentMethodLabel: "Pendente",
      items: [
        {
          name: "Corte masculino",
          quantity: 1,
          unitPrice: 60,
          category: "servico",
          coverage: "regular",
        },
      ],
      notes: "Comanda aberta com pagamento pendente.",
    },
  ]

  return attachAutomaticCommands(baseComandas, agendaEvents)
}

export function getPaymentMethods(): PaymentMethod[] {
  return [
    {
      id: 1,
      name: "Pix",
      description: "Recebimento instantaneo",
      status: "Ativo",
      fee: 0,
      settlement: "Na hora",
      amount: 18640,
      transactions: 218,
    },
    {
      id: 2,
      name: "Cartao de credito",
      description: "Venda presencial e assinatura",
      status: "Ativo",
      fee: 2.99,
      settlement: "D+1",
      amount: 14280,
      transactions: 132,
    },
    {
      id: 3,
      name: "Dinheiro",
      description: "Pagamento no balcao",
      status: "Ativo",
      fee: 0,
      settlement: "Na hora",
      amount: 3680,
      transactions: 46,
    },
  ]
}

export function getAnalytics(): Analytics {
  const monthlyRecurringRevenue = demoSubscriptions.reduce(
    (sum, subscription) => sum + subscription.value,
    0
  )
  const activeClients = demoClients.filter((client) => client.active).length
  const recurringClients = demoClients.filter(
    (client) => client.clientType !== "avulso" && client.clientType !== "sem_plano"
  ).length
  const clientsWithoutPlan = demoClients.filter(
    (client) => !client.planName || client.clientType === "ex_assinante"
  ).length
  const newClientsThisMonth = demoClients.filter((client) => {
    const [year, month, day] = client.createdAt.split("-").map(Number)
    const createdAt = new Date(year, month - 1, day)
    return today.getTime() - createdAt.getTime() <= 1000 * 60 * 60 * 24 * 30
  }).length
  const averageTicket = Math.round(
    demoClients.reduce((sum, client) => sum + client.averageTicket, 0) /
      demoClients.length
  )
  const monthlyServiceRevenue = 24850
  const monthlyProductRevenue = 3620
  const monthlyGrossRevenue =
    monthlyRecurringRevenue + monthlyServiceRevenue + monthlyProductRevenue
  const monthlyExpenses = 17350

  return {
    activeClients,
    newClientsThisMonth,
    recurringClients,
    clientsWithoutPlan,
    activeSubscriptions: demoSubscriptions.filter(
      (subscription) => subscription.status === SUBSCRIPTION_STATUS.ACTIVE
    ).length,
    servicesCompletedThisMonth: 286,
    averageTicket,
    monthlyServiceRevenue,
    monthlyRecurringRevenue,
    monthlyProductRevenue,
    monthlyGrossRevenue,
    monthlyExpenses,
    monthlyNetRevenue: monthlyGrossRevenue - monthlyExpenses,
    paymentFeesEstimated: 742,
    overdueAmount: demoSubscriptions
      .filter((subscription) => subscription.status === SUBSCRIPTION_STATUS.DELINQUENT)
      .reduce((sum, subscription) => sum + subscription.value, 0),
    revenueWeek: [
      {
        day: "Seg",
        weekday: "Segunda",
        gross: 4620,
        net: 3880,
        previous: 4100,
        appointments: 28,
      },
      {
        day: "Ter",
        weekday: "Terca",
        gross: 5180,
        net: 4360,
        previous: 4680,
        appointments: 31,
      },
      {
        day: "Qua",
        weekday: "Quarta",
        gross: 5760,
        net: 4890,
        previous: 5020,
        appointments: 34,
      },
      {
        day: "Qui",
        weekday: "Quinta",
        gross: 6240,
        net: 5290,
        previous: 5600,
        appointments: 37,
      },
      {
        day: "Sex",
        weekday: "Sexta",
        gross: 7480,
        net: 6410,
        previous: 6900,
        appointments: 44,
      },
      {
        day: "Sab",
        weekday: "Sabado",
        gross: 8920,
        net: 7710,
        previous: 8010,
        appointments: 52,
      },
    ],
    revenuePeriod: { label: "Maio 2026", comparison: "+18% vs. abril" },
    peakHours: [
      { time: "10:00", appointments: 36, revenue: 3280, occupancy: 82 },
      { time: "14:00", appointments: 42, revenue: 3940, occupancy: 88 },
      { time: "18:00", appointments: 51, revenue: 4760, occupancy: 94 },
    ],
  }
}

const agendaEvents = getAgendaEvents()
const comandas = getComandas(agendaEvents)

export const adminService = {
  company: getCompany(),
  services: getServices(),
  plans: getPlans(),
  clients: getClients(),
  subscriptions: getSubscriptions(),
  overdueSubscriptions: [] as OverdueSubscription[],
  professionals: getProfessionals(),
  products: [
    { id: 1, name: "Pomada modeladora", category: "Finalizacao", price: 49 },
    { id: 2, name: "Oleo para barba", category: "Barba", price: 59 },
  ] as Product[],
  agendaEvents,
  comandas,
  cashMovements: [
    {
      id: "MOV-1",
      type: "entrada",
      label: "Assinaturas do dia",
      category: "Planos",
      value: 980,
      payment: "Pix",
      time: "09:00",
    },
    {
      id: "MOV-2",
      type: "entrada",
      label: "Comandas pagas",
      category: "Serviços",
      value: 155,
      payment: "Cartao",
      time: "11:30",
    },
    {
      id: "MOV-3",
      type: "saida",
      label: "Reposicao de produtos",
      category: "Estoque",
      value: 320,
      payment: "Pix",
      time: "15:10",
    },
  ] as CashMovement[],
  bankAccounts: [
    {
      id: 1,
      name: "Conta principal",
      agency: "0001",
      account: "12345-6",
      type: "PJ",
      balance: 32840,
      status: "Em uso",
    },
  ] as BankAccount[],
  financialCategories: [
    {
      id: 1,
      name: "Assinaturas",
      description: "Receita recorrente dos planos",
      type: "Receita",
      monthlyAmount: 11650,
      trend: 18,
    },
    {
      id: 2,
      name: "Serviços avulsos",
      description: "Comandas e atendimentos",
      type: "Receita",
      monthlyAmount: 24850,
      trend: 12,
    },
    {
      id: 3,
      name: "Equipe",
      description: "Comissoes e repasses",
      type: "Despesa",
      monthlyAmount: 11200,
      trend: 6,
    },
  ] as FinancialCategory[],
  financialMovements: [
    {
      id: 1,
      date: toDateInputValue(today),
      description: "Receita de assinaturas",
      category: "Assinaturas",
      account: "Conta principal",
      amount: 980,
      type: "Receita",
    },
    {
      id: 2,
      date: toDateInputValue(today),
      description: "Comissoes da equipe",
      category: "Equipe",
      account: "Conta principal",
      amount: 420,
      type: "Despesa",
    },
  ] as FinancialMovement[],
  paymentMethods: getPaymentMethods(),
  analytics: getAnalytics(),
}


