"use client"

import * as React from "react"
import { TriangleAlert } from "lucide-react"

import { AppointmentsScreen } from "@/components/client-portal/appointments-screen"
import { AuthScreen } from "@/components/client-portal/auth-screen"
import { BookingFlow } from "@/components/client-portal/booking-flow/booking-flow"
import { BottomNavigation, type PortalTabKey } from "@/components/client-portal/bottom-navigation"
import { HomeScreen } from "@/components/client-portal/home-screen"
import { PlansScreen } from "@/components/client-portal/plans-screen"
import { PortalDesktopNavigation } from "@/components/client-portal/portal-desktop-navigation"
import { ProfileScreen } from "@/components/client-portal/profile-screen"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  PORTAL_SETTINGS_CHANGED_EVENT,
  defaultPortalSettings,
  getReadableForeground,
  readPortalSettings,
} from "@/lib/client-portal/settings"
import {
  makeAppointmentId,
  mockActivePlan,
  mockAppointments,
  mockClient,
  mockNotifications,
  mockPlans,
  mockProfessionals,
  mockServices,
} from "@/lib/client-portal/mock-data"
import type {
  ActivePlan,
  Appointment,
  BookingDraft,
  Client,
  PortalNotificationSettings,
} from "@/types/client-portal"

interface ClientPortalAppProps {
  barbershopSlug: string
}

export function ClientPortalApp({ barbershopSlug }: ClientPortalAppProps) {
  const [activeTab, setActiveTab] = React.useState<PortalTabKey>("home")
  const [isAuthLoading, setIsAuthLoading] = React.useState(false)
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [bookingOpen, setBookingOpen] = React.useState(false)
  const [appointments, setAppointments] = React.useState<Appointment[]>(mockAppointments)
  const [appointmentsLoading, setAppointmentsLoading] = React.useState(false)
  const [appointmentsError, setAppointmentsError] = React.useState<string | null>(null)
  const [client, setClient] = React.useState<Client>(mockClient)
  const [activePlan, setActivePlan] = React.useState<ActivePlan | null>(mockActivePlan)
  const [portalSettings, setPortalSettings] = React.useState(defaultPortalSettings)
  const [notifications, setNotifications] =
    React.useState<PortalNotificationSettings>(mockNotifications)
  const appointmentsLoadingTimerRef = React.useRef<NodeJS.Timeout | null>(null)

  React.useEffect(() => {
    function syncPortalSettings() {
      setPortalSettings(readPortalSettings())
    }

    syncPortalSettings()
    window.addEventListener("storage", syncPortalSettings)
    window.addEventListener(PORTAL_SETTINGS_CHANGED_EVENT, syncPortalSettings)

    return () => {
      window.removeEventListener("storage", syncPortalSettings)
      window.removeEventListener(PORTAL_SETTINGS_CHANGED_EVENT, syncPortalSettings)
      if (appointmentsLoadingTimerRef.current) {
        clearTimeout(appointmentsLoadingTimerRef.current)
      }
    }
  }, [])

  const resolvedAppointments = React.useMemo(() => {
    return [...appointments]
      .sort(
        (a, b) =>
          new Date(`${b.date}T${b.time}:00`).getTime() -
          new Date(`${a.date}T${a.time}:00`).getTime()
      )
      .map((appointment) => {
        const service = mockServices.find((item) => item.id === appointment.serviceId)
        const professional = mockProfessionals.find((item) => item.id === appointment.professionalId)
        return {
          appointment,
          serviceName: service?.name ?? "Servico indisponivel",
          professionalName: professional?.name ?? "Profissional indisponivel",
        }
      })
  }, [appointments])

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

  function startAuthenticatedSession() {
    setIsAuthenticated(true)
    setActiveTab("home")
  }

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

  function handleLogin() {
    setIsAuthLoading(true)
    setTimeout(() => {
      setIsAuthLoading(false)
      startAuthenticatedSession()
    }, 700)
  }

  function handleSignup() {
    setIsAuthLoading(true)
    setTimeout(() => {
      setIsAuthLoading(false)
      startAuthenticatedSession()
    }, 900)
  }

  async function handleConfirmBooking(draft: Required<BookingDraft>) {
    const selectedService = mockServices.find((service) => service.id === draft.serviceId)
    const usePlanBenefit = Boolean(activePlan && selectedService && selectedService.price <= 95)

    const createdAppointment: Appointment = {
      id: makeAppointmentId(),
      serviceId: draft.serviceId,
      professionalId: draft.professionalId,
      date: draft.date,
      time: draft.time,
      status: "confirmed",
      valueOriginal: selectedService?.price ?? 0,
      valuePaid: usePlanBenefit ? 0 : selectedService?.price ?? 0,
      usedPlanBenefit: usePlanBenefit,
      notes: usePlanBenefit ? "Beneficio reservado para este agendamento." : undefined,
      createdAt: new Date().toISOString(),
    }

    setAppointments((current) => [createdAppointment, ...current])

    if (activePlan && usePlanBenefit && selectedService) {
      setActivePlan({
        ...activePlan,
        remainingBenefits: activePlan.remainingBenefits.map((benefit) =>
          benefit.serviceName === selectedService.name
            ? {
                ...benefit,
                available: Math.max(benefit.available - 1, 0),
                reserved: benefit.reserved + 1,
              }
            : benefit
        ),
      })
    }

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
    const alreadyActive = activePlan?.planId === planId
    if (alreadyActive) return

    setActivePlan({
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

  if (!isAuthenticated) {
    return (
      <PortalAuthFrame style={portalThemeStyle}>
        <AuthScreen
          title={barbershop.name}
          description="Entre ou crie sua conta para acessar seus agendamentos."
          isLoading={isAuthLoading}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
      </PortalAuthFrame>
    )
  }

  return (
      <PortalShell
        activeTab={activeTab}
        onTabChange={handleTabChange}
        style={portalThemeStyle}
      >
      {!isSlugValid ? (
        <div className="mb-4 rounded-md border border-destructive/25 bg-destructive/5 px-4 py-2 text-xs text-destructive">
          <p className="flex items-center gap-1.5">
            <TriangleAlert className="size-3.5" />
            Este slug nao corresponde ao portal configurado. Acesse /portal/{barbershop.slug}.
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
          plans={mockPlans}
          activePlan={activePlan}
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
        services={mockServices}
        professionals={mockProfessionals}
        usesPlanBenefit={Boolean(activePlan)}
        onConfirm={handleConfirmBooking}
        onFinish={() => setActiveTab("home")}
      />
    </PortalShell>
  )
}

function PortalAuthFrame({
  style,
  children,
}: {
  style?: React.CSSProperties
  children: React.ReactNode
}) {
  return (
    <div
      className="min-h-[100dvh] bg-muted/25 px-4 pt-[calc(1.5rem+env(safe-area-inset-top))] pb-6 sm:py-6"
      style={style}
    >
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-md rounded-2xl border bg-background shadow-sm">
        {children}
      </div>
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
