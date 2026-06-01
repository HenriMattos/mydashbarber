"use client"

import * as React from "react"
import { TriangleAlert } from "lucide-react"

import { AppointmentsScreen } from "@/components/client-portal/appointments-screen"
import { BookingFlow } from "@/components/client-portal/booking-flow/booking-flow"
import { BottomNavigation, type PortalTabKey } from "@/components/client-portal/bottom-navigation"
import { HomeScreen } from "@/components/client-portal/home-screen"
import { PlansScreen } from "@/components/client-portal/plans-screen"
import { PortalDesktopNavigation } from "@/components/client-portal/portal-desktop-navigation"
import { ProfileScreen } from "@/components/client-portal/profile-screen"
import { OnboardingCarousel } from "@/components/client-auth/OnboardingCarousel"
import { WelcomeScreen } from "@/components/client-auth/WelcomeScreen"
import { LoginDrawer } from "@/components/client-auth/LoginDrawer"
import { RegisterDrawer } from "@/components/client-auth/RegisterDrawer"
import { ForgotPasswordDrawer } from "@/components/client-auth/ForgotPasswordDrawer"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  PORTAL_SETTINGS_CHANGED_EVENT,
  defaultPortalSettings,
  getReadableForeground,
  readPortalSettings,
} from "@/lib/client-portal/settings"
import { getPortalAuth, setPortalAuth } from "@/lib/client-portal/portal-auth"
import { database } from "@/components/admin/database"
import type {
  ActivePlan,
  Appointment,
  BookingDraft,
  Client,
  PortalNotificationSettings,
  Plan as PortalPlan,
} from "@/types/client-portal"
import type { Plan as AdminPlan, ServiceCatalogItem, Professional as AdminProfessional } from "@/types"

interface ClientPortalAppProps {
  barbershopSlug: string
}

function getPortalData() {
  const demoClient = database.clients.find(c => c.email === "cliente@bigood.com") || database.clients[0]
  
  // Convert Admin database data to Portal format
  const portalClient: Client = {
    id: String(demoClient.id),
    fullName: demoClient.name,
    email: demoClient.email || "",
    phone: demoClient.phone || "",
    birthDate: demoClient.birthday || "",
    cpf: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    city: "",
    district: "",
    state: "",
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(demoClient.name)}&background=random`
  }

  const adminPlan = database.plans.find(p => p.name === demoClient.planName)
  const activePlan: ActivePlan | null = adminPlan ? {
    planId: String(adminPlan.id),
    status: "ativo",
    nextChargeDate: "2026-06-20",
    remainingBenefits: adminPlan.includedServices.map(s => ({
      serviceName: s.serviceName,
      available: s.quantityPerCycle || 1,
      reserved: 0,
      consumed: 0
    }))
  } : null

  const portalPlans: PortalPlan[] = database.plans.map(p => ({
    id: String(p.id),
    name: p.name,
    value: p.price,
    periodicity: p.billingCycle === "monthly" ? "mensal" : "anual",
    slotsAvailable: 10,
    description: p.description,
    benefits: p.includedServices.map((s, idx) => ({
      id: `ben-${p.id}-${idx}`,
      serviceName: s.serviceName,
      originalValue: 0,
      discountPercent: 100,
      cyclesIncluded: s.quantityPerCycle || 0
    }))
  }))

  const portalServices = database.services.map(s => ({
    id: String(s.id),
    name: s.name,
    durationMinutes: s.durationMinutes || 45,
    price: s.price,
    description: s.description
  }))

  const portalProfessionals = database.professionals.map(p => ({
    id: String(p.id),
    name: p.name,
    role: p.role,
    avatarUrl: p.avatarUrl
  }))

  const portalAppointments: Appointment[] = database.agendaEvents
    .filter(e => e.type === "appointment" && e.title === portalClient.fullName)
    .map(e => ({
      id: String(e.id),
      serviceId: String(database.services.find(s => s.name === e.detail)?.id || "1"),
      professionalId: String(database.professionals.find(p => p.name === e.barber)?.id || "1"),
      date: e.date,
      time: e.start,
      status: (e.attendanceStatus === "completed" ? "completed" : e.status === "no_show" ? "cancelled" : e.status) as "confirmed" | "pending" | "completed" | "cancelled",
      valueOriginal: 0,
      valuePaid: 0,
      usedPlanBenefit: !!e.reservedBenefitServiceId,
      notes: e.notes,
      createdAt: new Date().toISOString()
    }))

  return {
    portalClient,
    activePlan,
    portalPlans,
    portalServices,
    portalProfessionals,
    portalAppointments
  }
}

export function ClientPortalApp({ barbershopSlug }: ClientPortalAppProps) {
  const [portalData] = React.useState(() => getPortalData())
  const [activeTab, setActiveTab] = React.useState<PortalTabKey>("home")
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [authChecked, setAuthChecked] = React.useState(false)
  const [showOnboarding, setShowOnboarding] = React.useState(true)
  const [showWelcome, setShowWelcome] = React.useState(false)
  const [activeDrawer, setActiveDrawer] = React.useState<"login" | "register" | "forgot-password" | null>(null)
  const [bookingOpen, setBookingOpen] = React.useState(false)
  const [appointments, setAppointments] = React.useState<Appointment[]>(portalData.portalAppointments)
  const [appointmentsLoading, setAppointmentsLoading] = React.useState(false)
  const [appointmentsError, setAppointmentsError] = React.useState<string | null>(null)
  const [client, setClient] = React.useState<Client>(portalData.portalClient)
  const [currentActivePlan, setCurrentActivePlan] = React.useState<ActivePlan | null>(portalData.activePlan)
  const [portalSettings, setPortalSettings] = React.useState(defaultPortalSettings)
  const [notifications, setNotifications] = React.useState<PortalNotificationSettings>({
    appointmentConfirmation: true,
    appointmentReminder: true,
    offersAndNews: false,
    planUpdates: true,
  })
  const appointmentsLoadingTimerRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    function syncPortalSettings() {
      setPortalSettings(readPortalSettings())
    }

    function checkAuth() {
      const auth = getPortalAuth()
      if (auth) {
        setIsAuthenticated(true)
        setShowOnboarding(false)
        setShowWelcome(false)
      } else {
        setIsAuthenticated(false)
        // Always show onboarding on reload as per request
        setShowOnboarding(true)
        setShowWelcome(false)
      }
      setAuthChecked(true)
    }

    checkAuth()
    syncPortalSettings()
    window.addEventListener("storage", syncPortalSettings)
    window.addEventListener("storage", checkAuth)
    window.addEventListener("bigood_portal_auth_sync", checkAuth)
    window.addEventListener(PORTAL_SETTINGS_CHANGED_EVENT, syncPortalSettings)

    return () => {
      window.removeEventListener("storage", syncPortalSettings)
      window.removeEventListener("storage", checkAuth)
      window.removeEventListener("bigood_portal_auth_sync", checkAuth)
      window.removeEventListener(PORTAL_SETTINGS_CHANGED_EVENT, syncPortalSettings)
      if (appointmentsLoadingTimerRef.current) {
        clearTimeout(appointmentsLoadingTimerRef.current)
      }
    }
  }, [])

  function handleCompleteOnboarding() {
    setShowOnboarding(false)
    setShowWelcome(true)
    setActiveDrawer(null) // Ensure no drawer is open so the user can see the Welcome Screen
  }

  function handleAuthSuccess() {
    const auth = getPortalAuth()
    if (auth) {
      setIsAuthenticated(true)
      setShowOnboarding(false)
      setShowWelcome(false)
      setActiveDrawer(null)
    }
  }

  const resolvedAppointments = React.useMemo(() => {
    return [...appointments]
      .sort(
        (a, b) =>
          new Date(`${b.date}T${b.time}:00`).getTime() -
          new Date(`${a.date}T${a.time}:00`).getTime()
      )
      .map((appointment) => {
        const service = portalData.portalServices.find((item) => item.id === appointment.serviceId)
        const professional = portalData.portalProfessionals.find((item) => item.id === appointment.professionalId)
        return {
          appointment,
          serviceName: service?.name ?? "Serviço indisponível",
          professionalName: professional?.name ?? "Profissional indisponível",
        }
      })
  }, [appointments, portalData.portalServices, portalData.portalProfessionals])

  const latestAppointment = resolvedAppointments[0]?.appointment ?? null
  const latestResolved = latestAppointment
    ? resolvedAppointments.find((item) => item.appointment.id === latestAppointment.id)
    : null

  const isSlugValid = barbershopSlug === portalSettings.slug
  const barbershop = portalSettings
  const portalThemeStyle = {
    "--primary": portalSettings.primaryColor,
    "--ring": portalSettings.primaryColor,
    "--sidebar-primary": portalSettings.primaryColor,
    "--primary-foreground": getReadableForeground(portalSettings.primaryColor),
    "--sidebar-primary-foreground": getReadableForeground(portalSettings.primaryColor),
  } as React.CSSProperties

  function handleTabChange(tab: PortalTabKey) {
    setActiveTab(tab)
    if (tab !== "appointments") {
      return
    }

    setAppointmentsLoading(true)
    setAppointmentsError(null)
    if (appointmentsLoadingTimerRef.current) {
      clearTimeout(appointmentsLoadingTimerRef.current)
    }
    appointmentsLoadingTimerRef.current = setTimeout(() => {
      setAppointmentsLoading(false)
      appointmentsLoadingTimerRef.current = null
    }, 300)
  }

  async function handleConfirmBooking(draft: Required<BookingDraft>) {
    const selectedServices = portalData.portalServices.filter((s) => draft.serviceIds.includes(s.id))

    let totalOriginal = 0
    let totalPaid = 0
    let usedPlanBenefitFlag = false

    for (const service of selectedServices) {
      totalOriginal += service.price
      const discountPercent = getServicePlanDiscount(service.name, portalData.portalPlans, currentActivePlan)
      if (discountPercent !== null) {
        totalPaid += Math.round((service.price * (100 - discountPercent)) / 100)
        usedPlanBenefitFlag = true
      } else {
        totalPaid += service.price
      }
    }

    const createdAppointment: Appointment = {
      id: `apt-${Math.floor(Math.random() * 90000 + 10000)}`,
      serviceId: draft.serviceIds[0],
      professionalId: draft.professionalId,
      date: draft.date,
      time: draft.time,
      status: "confirmed",
      valueOriginal: totalOriginal,
      valuePaid: totalPaid,
      usedPlanBenefit: usedPlanBenefitFlag,
      notes: selectedServices.map((s) => s.name).join(", "),
      createdAt: new Date().toISOString(),
    }

    setAppointments((current) => [createdAppointment, ...current])

    if (currentActivePlan && usedPlanBenefitFlag) {
      let updatedBenefits = [...currentActivePlan.remainingBenefits]
      for (const service of selectedServices) {
        const remaining = updatedBenefits.find((r) => r.serviceName === service.name)
        if (remaining && remaining.available > 0) {
          updatedBenefits = updatedBenefits.map((r) =>
            r.serviceName === service.name
              ? { ...r, available: Math.max(r.available - 1, 0), reserved: r.reserved + 1 }
              : r
          )
        }
      }
      setCurrentActivePlan({ ...currentActivePlan, remainingBenefits: updatedBenefits })
    }
    
    // Also simulate adding it to the dashboard's database (so changes flow back if we wanted to read it again)
    const professional = portalData.portalProfessionals.find(p => p.id === draft.professionalId)
    database.agendaEvents.push({
      id: Math.floor(Math.random() * 90000 + 10000),
      type: "appointment",
      title: client.fullName,
      barber: professional?.name || "Sem profissional",
      date: draft.date,
      start: draft.time,
      end: draft.time, // Simplification
      status: "confirmed",
      reservedBenefitServiceId: usedPlanBenefitFlag ? draft.serviceIds[0] : undefined,
      detail: selectedServices.map((s) => s.name).join(", "),
      notes: "Agendado via Portal do Cliente",
    })

    return new Promise<Appointment>((resolve) => {
      setTimeout(() => resolve(createdAppointment), 500)
    })
  }

  async function handleSaveProfile(nextClient: Client) {
    await new Promise<void>((resolve) => setTimeout(resolve, 500))
    setClient(nextClient)
  }

  async function handleBuyPlan(planId: string) {
    await new Promise<void>((resolve) => setTimeout(resolve, 1000))
    const alreadyActive = currentActivePlan?.planId === planId
    if (alreadyActive) return

    setCurrentActivePlan({
      planId,
      status: "ativo",
      nextChargeDate: "2026-06-27",
      remainingBenefits: [
        {
          serviceName: "Corte masculino",
          available: 2,
          reserved: 0,
          consumed: 0,
        },
      ],
    })
  }
  
  function getServicePlanDiscount(
    serviceName: string,
    plans: PortalPlan[],
    plan: ActivePlan | null
  ): number | null {
    if (!plan) return null
    const matchedPlan = plans.find((p) => p.id === plan.planId)
    if (!matchedPlan) return null
    const benefit = matchedPlan.benefits.find((b) => b.serviceName === serviceName)
    if (!benefit) return null
    const remaining = plan.remainingBenefits.find((r) => r.serviceName === serviceName)
    if (!remaining || remaining.available <= 0) return null
    return benefit.discountPercent
  }

  if (!authChecked) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background" style={portalThemeStyle}>
        <div className="size-8 animate-spin rounded-full border-2 border-[var(--primary)] border-t-transparent" />
      </div>
    )
  }

  return (
    <div style={portalThemeStyle} className="min-h-dvh">
      {!isAuthenticated ? (
        showOnboarding ? (
          <OnboardingCarousel
            barbershopName={barbershop.name}
            slides={barbershop.onboardingSlides}
            onComplete={handleCompleteOnboarding}
          />
        ) : (
          <>
            <WelcomeScreen
              onOpenLogin={() => setActiveDrawer("login")}
              onOpenRegister={() => setActiveDrawer("register")}
            />
            <LoginDrawer
              open={activeDrawer === "login"}
              onOpenChange={(open) => setActiveDrawer(open ? "login" : null)}
              onSwitchToRegister={() => setActiveDrawer("register")}
              onForgotPassword={() => setActiveDrawer("forgot-password")}
              onSuccess={handleAuthSuccess}
            />
            <RegisterDrawer
              open={activeDrawer === "register"}
              onOpenChange={(open) => setActiveDrawer(open ? "register" : null)}
              onSwitchToLogin={() => setActiveDrawer("login")}
              onSuccess={handleAuthSuccess}
            />
            <ForgotPasswordDrawer
              open={activeDrawer === "forgot-password"}
              onOpenChange={(open) => setActiveDrawer(open ? "forgot-password" : null)}
            />
          </>
        )
      ) : (
        <PortalShell
          activeTab={activeTab}
          onTabChange={handleTabChange}
          style={portalThemeStyle}
        >
          {!isSlugValid ? (
            <div className="mb-4 rounded-md border border-destructive/25 bg-destructive/5 px-4 py-2 text-xs text-destructive">
              <p className="flex items-center gap-1.5">
                <TriangleAlert className="size-3.5" />
                Este slug não corresponde ao portal configurado. Acesse /portal/{barbershop.slug}.
              </p>
            </div>
          ) : null}

          {activeTab === "home" ? (
            <HomeScreen
              barbershop={barbershop}
              latestAppointment={latestAppointment}
              appointmentServiceName={latestResolved?.serviceName}
              appointmentProfessionalName={latestResolved?.professionalName}
              isLoading={false}
              onOpenBooking={() => setBookingOpen(true)}
              onViewDetails={() => setActiveTab("appointments")}
              onReschedule={() => setBookingOpen(true)}
            />
          ) : null}

          {activeTab === "appointments" ? (
            <AppointmentsScreen
              items={resolvedAppointments}
              isLoading={appointmentsLoading}
              error={appointmentsError}
              onRetry={() => {
                setAppointmentsError(null)
                setAppointmentsLoading(false)
              }}
              onOpenBooking={() => setBookingOpen(true)}
            />
          ) : null}

          {activeTab === "plans" ? (
            <PlansScreen
              plans={portalData.portalPlans}
              activePlan={currentActivePlan}
              isLoading={false}
              onBuyPlan={handleBuyPlan}
            />
          ) : null}

          {activeTab === "profile" ? (
            <ProfileScreen
              client={client}
              notifications={notifications}
              onSaveProfile={handleSaveProfile}
              onUpdateNotifications={setNotifications}
            />
          ) : null}

          <BottomNavigation activeTab={activeTab} onChange={handleTabChange} />

          <BookingFlow
            open={bookingOpen}
            onOpenChange={setBookingOpen}
            barbershopName={barbershop.name}
            services={portalData.portalServices}
            professionals={portalData.portalProfessionals}
            plans={portalData.portalPlans}
            activePlan={currentActivePlan}
            usesPlanBenefit={Boolean(currentActivePlan)}
            onConfirm={handleConfirmBooking}
            onFinish={() => setActiveTab("home")}
          />
        </PortalShell>
      )}
    </div>
  )
}

function PortalShell({
  activeTab,
  onTabChange,
  style,
  children,
}: {
  activeTab: PortalTabKey
  onTabChange: (tab: PortalTabKey) => void
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <div className="h-svh overflow-hidden bg-muted/40 text-foreground" style={style}>
      <div className="admin-app grid h-svh min-w-0 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <PortalDesktopNavigation
          activeTab={activeTab}
          onChange={onTabChange}
        />

        <div className="flex h-full min-h-0 min-w-0 flex-col">
          <ScrollArea className="min-h-0 flex-1 overflow-x-hidden">
            <main className="admin-shell-main admin-container flex min-w-0 flex-col gap-2 overflow-x-hidden pt-[calc(0.75rem+env(safe-area-inset-top))] pb-24 sm:gap-5 sm:py-5 lg:gap-6 lg:py-6">
              {children}
            </main>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
