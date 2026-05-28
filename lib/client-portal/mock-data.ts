import type {
  ActivePlan,
  Appointment,
  Client,
  Plan,
  PortalNotificationSettings,
  Professional,
  Service,
} from "@/types/client-portal"

export const mockClient: Client = {
  id: "client-1",
  fullName: "Rafael Oliveira",
  email: "rafael.oliveira@email.com",
  phone: "(11) 98888-0101",
  birthDate: "1994-06-18",
  cpf: "123.456.789-00",
  cep: "01310-100",
  street: "Rua Augusta",
  number: "1240",
  complement: "Apto 42",
  city: "Sao Paulo",
  district: "Consolacao",
  state: "SP",
  avatarUrl:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
}

export const mockServices: Service[] = [
  {
    id: "service-1",
    name: "Corte masculino",
    durationMinutes: 45,
    price: 60,
    description: "Corte com finalizacao e modelagem.",
  },
  {
    id: "service-2",
    name: "Barba completa",
    durationMinutes: 35,
    price: 45,
    description: "Alinhamento, hidratacao e acabamento.",
  },
  {
    id: "service-3",
    name: "Corte + barba",
    durationMinutes: 75,
    price: 95,
    description: "Pacote completo com acabamento premium.",
  },
  {
    id: "service-4",
    name: "Sobrancelha",
    durationMinutes: 20,
    price: 25,
    description: "Desenho e limpeza com pinça.",
  },
]

export const mockProfessionals: Professional[] = [
  {
    id: "pro-1",
    name: "Rafael Oliveira",
    role: "Barbeiro senior",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "pro-2",
    name: "Paulo Junior",
    role: "Especialista em barba",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "pro-3",
    name: "Felipe Costa",
    role: "Cortes modernos",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
  },
]

export const mockAppointments: Appointment[] = [
  {
    id: "apt-2003",
    serviceId: "service-1",
    professionalId: "pro-1",
    date: "2026-05-30",
    time: "10:00",
    status: "confirmed",
    valueOriginal: 60,
    valuePaid: 0,
    usedPlanBenefit: true,
    notes: "Beneficio reservado para este horario.",
    createdAt: "2026-05-27T09:02:00.000Z",
  },
  {
    id: "apt-2002",
    serviceId: "service-2",
    professionalId: "pro-2",
    date: "2026-05-16",
    time: "15:30",
    status: "completed",
    valueOriginal: 45,
    valuePaid: 0,
    usedPlanBenefit: true,
    createdAt: "2026-05-10T17:15:00.000Z",
  },
]

export const mockPlans: Plan[] = [
  {
    id: "plan-1",
    name: "Clube Barba e Cabelo",
    value: 129,
    periodicity: "mensal",
    slotsAvailable: 30,
    description: "Plano ideal para manter cabelo e barba em dia.",
    benefits: [
      {
        id: "benefit-1",
        serviceName: "Corte masculino",
        originalValue: 60,
        discountPercent: 100,
        cyclesIncluded: 2,
      },
      {
        id: "benefit-2",
        serviceName: "Barba completa",
        originalValue: 45,
        discountPercent: 100,
        cyclesIncluded: 1,
      },
      {
        id: "benefit-extra-1",
        serviceName: "Sobrancelha",
        originalValue: 25,
        discountPercent: 20,
        cyclesIncluded: 0,
        isExtra: true,
      },
    ],
  },
  {
    id: "plan-2",
    name: "Plano Executivo",
    value: 189,
    periodicity: "mensal",
    slotsAvailable: 12,
    description: "Cobertura ampla para rotina semanal.",
    benefits: [
      {
        id: "benefit-3",
        serviceName: "Corte + barba",
        originalValue: 95,
        discountPercent: 100,
        cyclesIncluded: 2,
      },
      {
        id: "benefit-extra-2",
        serviceName: "Hidratacao",
        originalValue: 40,
        discountPercent: 30,
        cyclesIncluded: 0,
        isExtra: true,
      },
    ],
  },
  {
    id: "plan-3",
    name: "Plano Anual Prime",
    value: 1290,
    periodicity: "anual",
    slotsAvailable: 8,
    description: "Plano anual com desconto e prioridade em horarios.",
    benefits: [
      {
        id: "benefit-4",
        serviceName: "Corte masculino",
        originalValue: 60,
        discountPercent: 100,
        cyclesIncluded: 3,
      },
      {
        id: "benefit-extra-3",
        serviceName: "Barba completa",
        originalValue: 45,
        discountPercent: 25,
        cyclesIncluded: 0,
        isExtra: true,
      },
    ],
  },
]

export const mockActivePlan: ActivePlan = {
  planId: "plan-1",
  status: "ativo",
  nextChargeDate: "2026-06-20",
  remainingBenefits: [
    {
      serviceName: "Corte masculino",
      available: 1,
      reserved: 1,
      consumed: 0,
    },
    {
      serviceName: "Barba completa",
      available: 1,
      reserved: 0,
      consumed: 0,
    },
  ],
}

export const mockNotifications: PortalNotificationSettings = {
  appointmentConfirmation: true,
  appointmentReminder: true,
  offersAndNews: false,
  planUpdates: true,
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
  }).format(new Date(`${value}T00:00:00`))
}

export function formatDateTimeLabel(date: string, time: string) {
  const dateLabel = new Intl.DateTimeFormat("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(new Date(`${date}T00:00:00`))
  return `${dateLabel} as ${time}`
}

export function makeAppointmentId() {
  return `apt-${Math.floor(Math.random() * 90000 + 10000)}`
}
