"use client"

import { type ReactNode, useMemo, useState } from "react"
import Link from "next/link"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"
import {
  Add01Icon,
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Calendar03Icon,
  Cancel01Icon,
  Clock01Icon,
  Delete02Icon,
  InformationCircleIcon,
  UserAdd01Icon,
  UserSearch01Icon,
} from "@hugeicons/core-free-icons"

import { serviceNames } from "@/components/admin/catalog-data"
import { database } from "@/components/admin/database"
import { EmptyState } from "@/components/admin/empty-state"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import {
  APPOINTMENT_STATUS,
  APPOINTMENT_STATUS_LABELS,
  ATTENDANCE_STATUS,
  ATTENDANCE_STATUS_LABELS,
  COMMAND_STATUS,
  COMMAND_STATUS_LABELS,
  SUBSCRIPTION_STATUS,
  SUBSCRIPTION_STATUS_LABELS,
  type AgendaEvent as AdminAgendaEvent,
  type AppointmentStatus,
  type AttendanceStatus,
  type CommandStatus,
  type SubscriptionStatus,
} from "@/types"

type Barber = string
type AgendaEvent = AdminAgendaEvent
type AgendaFilter =
  | "all"
  | "subscribers"
  | "walk_in"
  | "delinquent"
  | "attendance"
  | "pending_command"
  | "needs_attention"
  | "no_show"
  | "cancelled"

type AgendaClient = {
  id: string
  name: string
  phone: string
  email?: string
  notes?: string
  lastVisit: string
}

type NewAgendaClient = {
  name: string
  phone: string
  email: string
  notes?: string
}

const barbers: Barber[] = database.professionals
  .filter((professional) => professional.status === "Ativo")
  .map((professional) => professional.name)
const agendaFilterOptions: { value: AgendaFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "subscribers", label: "Assinantes" },
  { value: "walk_in", label: "Avulsos" },
  { value: "delinquent", label: "Inadimplentes" },
  { value: "needs_attention", label: "Atenção" },
  { value: "attendance", label: "Em atendimento" },
  { value: "pending_command", label: "Comanda pendente" },
  { value: "no_show", label: "Faltas" },
  { value: "cancelled", label: "Cancelados" },
]
const initialClients: AgendaClient[] = database.clients.map((client) => ({
  id: String(client.id),
  name: client.name,
  phone: client.phone,
  email: client.email,
  lastVisit: client.lastVisit,
}))
const services = serviceNames
const recentAppointments = database.agendaEvents
  .filter((event) => event.type === "appointment")
  .slice(0, 3)
  .map((event) => ({
    date: "29/04/2026",
    service: event.detail,
    professional: event.barber,
  }))
const repurchaseItems = database.services.map((service) => ({
  id: String(service.id),
  label: service.name,
  days: service.repurchaseDays,
}))
const timeSlots = buildTimeSlots("09:00", "18:00", 10)
const slotHeight = 38

const initialEvents: AgendaEvent[] = database.agendaEvents

export function AgendaView() {
  const [selectedBarber, setSelectedBarber] = useState<Barber>(barbers[0] ?? "")
  const now = new Date()
  const [selectedDay, setSelectedDay] = useState(String(now.getDate()).padStart(2, "0"))
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1).padStart(2, "0"))
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()))
  const [events, setEvents] = useState(initialEvents)
  const [appointmentClients, setAppointmentClients] = useState(initialClients)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formStart, setFormStart] = useState("09:00")
  const [formEnd, setFormEnd] = useState("09:30")
  const [formClient, setFormClient] = useState("")
  const [formService, setFormService] = useState(serviceNames[0] ?? "")
  const [formAddedServices, setFormAddedServices] = useState<string[]>([])
  const [formNoPreference, setFormNoPreference] = useState(false)
  const [agendaFilter, setAgendaFilter] = useState<AgendaFilter>("all")

  const selectedDate = `${selectedYear}-${selectedMonth}-${selectedDay.padStart(2, "0")}`

  const selectedDateObj = useMemo(
    () =>
      new Date(
        Number(selectedYear),
        Number(selectedMonth) - 1,
        Number(selectedDay)
      ),
    [selectedYear, selectedMonth, selectedDay]
  )

  function handleDateSelect(date: Date | undefined) {
    if (!date) return
    setSelectedDay(String(date.getDate()).padStart(2, "0"))
    setSelectedMonth(String(date.getMonth() + 1).padStart(2, "0"))
    setSelectedYear(String(date.getFullYear()))
  }

  const selectedDateEvents = useMemo(
    () =>
      events
        .filter(
          (event) =>
            event.date === selectedDate && event.barber === selectedBarber
        )
        .sort((a, b) => a.start.localeCompare(b.start)),
    [events, selectedBarber, selectedDate]
  )
  const dayEvents = useMemo(
    () =>
      selectedDateEvents.filter((event) =>
        matchesAgendaFilter(event, agendaFilter)
      ),
    [agendaFilter, selectedDateEvents]
  )
  const agendaSummary = useMemo(
    () => buildAgendaSummary(selectedDateEvents),
    [selectedDateEvents]
  )
  const editingEvent = useMemo(
    () => events.find((event) => event.id === editingId) ?? null,
    [editingId, events]
  )

  function openNewAppointment(slot = "09:00", barber = selectedBarber) {
    setSelectedBarber(barber)
    setEditingId(null)
    setFormStart(slot)
    setFormEnd(nextSlot(slot))
    setFormClient("")
    setFormService(serviceNames[0] ?? "")
    setFormAddedServices([])
    setFormNoPreference(false)
    setModalOpen(true)
  }

  function openSlot(barber: Barber, slot: string) {
    setSelectedBarber(barber)
    const slotMinutes = timeToMinutes(slot)
    const event = events.find(
      (item) =>
        item.barber === barber &&
        item.date === selectedDate &&
        slotMinutes >= timeToMinutes(item.start) &&
        slotMinutes < timeToMinutes(item.end)
    )

    if (event) {
      setEditingId(event.id)
      setFormStart(event.start)
      setFormEnd(event.end)
      setFormClient(event.title)
      setFormService(event.detail || (serviceNames[0] ?? ""))
      setFormAddedServices([event.detail])
      setModalOpen(true)
      return
    }

    openNewAppointment(slot, barber)
  }

  function saveAppointment() {
    const title = formClient.trim() || "Cliente sem nome"
    const eventServices = formAddedServices.length
      ? formAddedServices.join(", ")
      : formService
    const baseId = editingId ?? Date.now()
    const nextEvent: AgendaEvent = {
      id: baseId,
      barber: selectedBarber,
      date: selectedDate,
      start: formStart,
      end: formEnd,
      title,
      detail: eventServices,
      status: APPOINTMENT_STATUS.CONFIRMED,
      origin: "manual",
      reservedBenefitServiceId: getReservableServiceId(title, eventServices),
      type: "appointment",
    }

    setEvents((current) => {
      if (!editingId) {
        return [...current, nextEvent]
      }

      const original = current.find((event) => event.id === editingId)
      const wasRescheduled =
        original &&
        (original.date !== nextEvent.date ||
          original.start !== nextEvent.start ||
          original.end !== nextEvent.end ||
          original.barber !== nextEvent.barber)

      if (!wasRescheduled) {
        return current.map((event) =>
          event.id === editingId
            ? {
                ...event,
                ...nextEvent,
                status: event.status ?? APPOINTMENT_STATUS.CONFIRMED,
                attendanceStatus: event.attendanceStatus,
                commandId: event.commandId,
                notes: event.notes,
              }
            : event
        )
      }

      return current.flatMap((event) =>
        event.id === editingId
          ? [
              {
                ...event,
                status: APPOINTMENT_STATUS.CANCELLED,
                cancelReason: "rescheduled",
                notes: appendEventNote(
                  event.notes,
                  `Remarcado para ${formatShortDate(nextEvent.date)} as ${nextEvent.start}.`
                ),
              },
              {
                ...nextEvent,
                id: Date.now(),
                rescheduledFromId: event.id,
                notes: appendEventNote(
                  nextEvent.notes,
                  "Novo horário criado por remarcacao."
                ),
              },
            ]
          : [event]
      )
    })
    setModalOpen(false)
  }

  function removeSelectedEvent() {
    if (!editingId) return

    setEvents((current) => current.filter((event) => event.id !== editingId))
    setModalOpen(false)
  }

  function updateEditingEvent(patch: Partial<AgendaEvent>) {
    if (!editingId) return

    setEvents((current) =>
      current.map((event) =>
        event.id === editingId ? { ...event, ...patch } : event
      )
    )
  }

  function confirmSelectedEvent() {
    updateEditingEvent({
      status: APPOINTMENT_STATUS.CONFIRMED,
      reservedBenefitServiceId:
        editingEvent?.reservedBenefitServiceId ??
        getReservableServiceId(formClient, formAddedServices.join(", ") || formService),
      notes: appendEventNote(
        editingEvent?.notes,
        "Agendamento confirmado pela equipe."
      ),
    })
  }

  function markClientArrived() {
    updateEditingEvent({
      attendanceStatus: ATTENDANCE_STATUS.CLIENT_ARRIVED,
      notes: appendEventNote(editingEvent?.notes, "Cliente chegou."),
    })
  }

  function startSelectedAttendance() {
    updateEditingEvent({
      attendanceStatus: ATTENDANCE_STATUS.IN_PROGRESS,
      notes: appendEventNote(editingEvent?.notes, "Atendimento iniciado."),
    })
  }

  function completeSelectedAttendance() {
    updateEditingEvent({
      attendanceStatus: ATTENDANCE_STATUS.COMPLETED,
      notes: appendEventNote(editingEvent?.notes, "Atendimento concluido."),
    })
  }

  function markSelectedNoShow() {
    if (!window.confirm("Marcar este cliente como falta?")) return

    updateEditingEvent({
      status: APPOINTMENT_STATUS.NO_SHOW,
      attendanceStatus: undefined,
      notes: appendEventNote(
        editingEvent?.notes,
        "Cliente marcado como falta. Politica de benefício permanece decisao aberta."
      ),
    })
  }

  function cancelSelectedAppointment() {
    if (!window.confirm("Cancelar este agendamento?")) return

    updateEditingEvent({
      status: APPOINTMENT_STATUS.CANCELLED,
      cancelReason: "client_cancelled",
      notes: appendEventNote(editingEvent?.notes, "Agendamento cancelado."),
    })
  }

  function addSelectedService() {
    setFormAddedServices((current) =>
      current.includes(formService) ? current : [...current, formService]
    )
  }

  function removeAddedService(service: string) {
    setFormAddedServices((current) =>
      current.filter((item) => item !== service)
    )
  }

  function createClient(client: NewAgendaClient) {
    const nextClient: AgendaClient = {
      id: `${slugify(client.name)}-${Date.now()}`,
      name: client.name.trim(),
      phone: client.phone.trim(),
      email: client.email.trim() || undefined,
      notes: client.notes?.trim(),
      lastVisit: "Novo cadastro",
    }

    setAppointmentClients((current) => [nextClient, ...current])
    setFormClient(nextClient.name)
  }

  const router = useRouter()

  if (barbers.length === 0) {
    return (
      <EmptyState
        icon={UserAdd01Icon}
        title="Nenhum profissional cadastrado"
        description="A agenda precisa de pelo menos um profissional para funcionar. Cadastre sua equipe para começar."
        actionLabel="Cadastrar Profissional"
        onAction={() => router.push("/profissionais/cadastrar")}
      />
    )
  }

  return (
    <>
      <AgendaDayScreen
        selectedBarber={selectedBarber}
        selectedDateObj={selectedDateObj}
        events={dayEvents}
        agendaFilter={agendaFilter}
        agendaSummary={agendaSummary}
        onBarberChange={setSelectedBarber}
        onDateSelect={handleDateSelect}
        onAgendaFilterChange={setAgendaFilter}
        onPreviousDay={() =>
          shiftDate(
            -1,
            selectedDate,
            setSelectedDay,
            setSelectedMonth,
            setSelectedYear
          )
        }
        onNextDay={() =>
          shiftDate(
            1,
            selectedDate,
            setSelectedDay,
            setSelectedMonth,
            setSelectedYear
          )
        }
        onNewAppointment={() => openNewAppointment(formStart, selectedBarber)}
        onOpenSlot={openSlot}
      />

      <ScheduleModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editing={Boolean(editingId)}
        event={editingEvent}
        barber={selectedBarber}
        start={formStart}
        end={formEnd}
        client={formClient}
        clients={appointmentClients}
        service={formService}
        addedServices={formAddedServices}
        noPreference={formNoPreference}
        selectedDate={selectedDate}
        events={selectedDateEvents}
        onBarberChange={setSelectedBarber}
        onStartChange={(slot) => {
          setFormStart(slot)
          setFormEnd(nextSlot(slot))
        }}
        onEndChange={setFormEnd}
        onClientChange={setFormClient}
        onCreateClient={createClient}
        onServiceChange={setFormService}
        onDateChange={(value) =>
          setDateFromObject(
            parseLocalDate(value),
            setSelectedDay,
            setSelectedMonth,
            setSelectedYear
          )
        }
        onNoPreferenceChange={setFormNoPreference}
        onAddService={addSelectedService}
        onRemoveService={removeAddedService}
        onSaveAppointment={saveAppointment}
        onRemove={removeSelectedEvent}
        onConfirmAppointment={confirmSelectedEvent}
        onClientArrived={markClientArrived}
        onStartAttendance={startSelectedAttendance}
        onCompleteAttendance={completeSelectedAttendance}
        onMarkNoShow={markSelectedNoShow}
        onCancelAppointment={cancelSelectedAppointment}
      />
    </>
  )
}

function AgendaDayScreen({
  selectedBarber,
  selectedDateObj,
  events,
  agendaFilter,
  agendaSummary,
  onBarberChange,
  onDateSelect,
  onAgendaFilterChange,
  onPreviousDay,
  onNextDay,
  onNewAppointment,
  onOpenSlot,
}: {
  selectedBarber: Barber
  selectedDateObj: Date
  events: AgendaEvent[]
  agendaFilter: AgendaFilter
  agendaSummary: AgendaSummary
  onBarberChange: (barber: Barber) => void
  onDateSelect: (date: Date | undefined) => void
  onAgendaFilterChange: (filter: AgendaFilter) => void
  onPreviousDay: () => void
  onNextDay: () => void
  onNewAppointment: () => void
  onOpenSlot: (barber: Barber, slot: string) => void
}) {
  return (
    <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="shrink-0 border-b p-3 sm:p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-[minmax(0,15rem)_2rem_2rem_minmax(10rem,1fr)] xl:w-auto">
            <div className="min-w-0">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-11 w-full justify-between gap-2 text-left font-normal sm:h-10"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <HugeiconsIcon
                        icon={Calendar03Icon}
                        size={16}
                        className="shrink-0"
                      />
                      <span className="min-w-0 truncate">
                        {format(selectedDateObj, "PPP", { locale: ptBR })}
                      </span>
                    </span>
                    <HugeiconsIcon
                      icon={ArrowDown01Icon}
                      size={16}
                      className="shrink-0 opacity-50"
                    />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDateObj}
                    onSelect={onDateSelect}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button
              size="icon-sm"
              variant="outline"
              className="hidden shrink-0 rounded-full text-[0px] text-foreground sm:inline-flex sm:size-8"
              aria-label="Dia anterior"
              onClick={onPreviousDay}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />‹
            </Button>
            <Button
              size="icon-sm"
              variant="outline"
              className="hidden shrink-0 rounded-full text-[0px] text-foreground sm:inline-flex sm:size-8"
              aria-label="Próximo dia"
              onClick={onNextDay}
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} />›
            </Button>
            <Select value={selectedBarber} onValueChange={onBarberChange}>
              <SelectTrigger className="h-11 w-full bg-background sm:h-10">
                <SelectValue placeholder="Barbeiro" />
              </SelectTrigger>
              <SelectContent>
                {barbers.map((barber) => (
                  <SelectItem key={barber} value={barber}>
                    {barber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="h-11 w-full justify-center text-sm font-semibold sm:h-8 sm:w-auto"
            onClick={onNewAppointment}
          >
            <HugeiconsIcon icon={Add01Icon} size={16} />
            Novo agendamento
          </Button>
        </div>

        <div className="mt-3 flex min-w-0 flex-wrap gap-1.5 sm:gap-2">
          {agendaFilterOptions.map((option) => (
            <Button
              key={option.value}
              type="button"
              size="sm"
              variant={agendaFilter === option.value ? "default" : "outline"}
              className="h-8 min-w-0 shrink px-2 text-[10px] sm:px-3 sm:text-xs"
              onClick={() => onAgendaFilterChange(option.value)}
            >
              {option.label}
              {option.value === "all" ? ` (${agendaSummary.total})` : null}
              {option.value === "attendance" && agendaSummary.inAttendance
                ? ` (${agendaSummary.inAttendance})`
                : null}
              {option.value === "pending_command" &&
              agendaSummary.pendingCommands
                ? ` (${agendaSummary.pendingCommands})`
                : null}
              {option.value === "needs_attention" &&
              agendaSummary.needsAttention
                ? ` (${agendaSummary.needsAttention})`
                : null}
            </Button>
          ))}
        </div>
      </div>

      <div className="min-h-0 flex-1">
        <ScheduleBoard
          barber={selectedBarber}
          events={events}
          onOpenSlot={onOpenSlot}
        />
      </div>
    </section>
  )
}

function ScheduleBoard({
  barber,
  events,
  onOpenSlot,
}: {
  barber: Barber
  events: AgendaEvent[]
  onOpenSlot: (barber: Barber, slot: string) => void
}) {
  return (
    <div className="flex h-full min-w-0 flex-col overflow-hidden bg-background">
      {events.length === 0 ? (
        <div className="shrink-0 border-b bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
          Nenhum horário agendado para este filtro.
        </div>
      ) : null}
      <div className="min-h-0 md:hidden">
        <MobileScheduleList
          barber={barber}
          events={events}
          onOpenSlot={onOpenSlot}
        />
      </div>

      <ScrollArea className="hidden h-[min(34rem,calc(100svh-18rem))] min-h-[24rem] w-full md:block">
        <div
          className="min-w-[560px]"
          style={{
            display: "grid",
            gridTemplateColumns: "4.25rem minmax(32rem, 1fr)",
          }}
        >
          <div className="border-r border-b bg-background" />
          <div className="border-b bg-background px-4 py-3" />
        </div>

        <div
          className="min-w-[560px]"
          style={{
            display: "grid",
            gridTemplateColumns: "4.25rem minmax(32rem, 1fr)",
          }}
        >
          <TimeRail />
          <BarberScheduleColumn
            barber={barber}
            events={events}
            onOpenSlot={onOpenSlot}
          />
        </div>
      </ScrollArea>
    </div>
  )
}

function MobileScheduleList({
  barber,
  events,
  onOpenSlot,
}: {
  barber: Barber
  events: AgendaEvent[]
  onOpenSlot: (barber: Barber, slot: string) => void
}) {
  const visibleSlots = timeSlots.filter((slot) => {
    const event = events.find((item) => isSlotInsideEvent(slot, item))

    return !event || event.start === slot
  })

  return (
    <ScrollArea className="h-[min(36rem,calc(100dvh-16rem))] min-h-[24rem]">
      <div className="space-y-2 bg-muted/15 p-2.5 sm:p-3">
        {visibleSlots.map((slot) => {
          const event = events.find((item) => isSlotInsideEvent(slot, item))
          const startsHere = event?.start === slot

          return (
            <button
              key={slot}
              type="button"
              onClick={() => onOpenSlot(barber, slot)}
              className={cn(
                "grid w-full grid-cols-[2.75rem_minmax(0,1fr)] gap-1.5 rounded-lg border bg-card p-1.5 text-left shadow-xs transition-colors hover:bg-muted/50 min-[380px]:grid-cols-[3.25rem_minmax(0,1fr)] min-[380px]:gap-2 min-[380px]:p-2",
                event && "border-primary/20 bg-primary/5"
              )}
            >
              <span className="pt-2 text-xs font-semibold text-muted-foreground min-[380px]:text-sm">
                {slot}
              </span>
              {event && startsHere ? (
                <AgendaEventCard event={event} />
              ) : (
                <span className="flex min-h-11 items-center rounded-md border border-dashed bg-background/70 px-3 text-sm text-muted-foreground">
                  Livre
                </span>
              )}
            </button>
          )
        })}
      </div>
    </ScrollArea>
  )
}

function TimeRail() {
  return (
    <div className="border-r">
      {timeSlots.map((slot) => (
        <div
          key={slot}
          className="border-b px-2 pt-1 text-right text-xs text-muted-foreground"
          style={{ height: slotHeight }}
        >
          {slot}
        </div>
      ))}
    </div>
  )
}

function BarberScheduleColumn({
  barber,
  events,
  onOpenSlot,
}: {
  barber: Barber
  events: AgendaEvent[]
  onOpenSlot: (barber: Barber, slot: string) => void
}) {
  return (
    <div
      className="relative border-r last:border-r-0"
      style={{ height: timeSlots.length * slotHeight }}
    >
      {timeSlots.map((slot) => (
        <button
          key={slot}
          type="button"
          aria-label={`${barber} ${slot}`}
          onClick={() => onOpenSlot(barber, slot)}
          className="block w-full border-b transition-colors hover:bg-muted/50"
          style={{ height: slotHeight }}
        />
      ))}

      {events.map((event) => (
        <button
          key={event.id}
          type="button"
          onClick={() => onOpenSlot(barber, event.start)}
          className="absolute right-1 left-1 text-left"
          style={eventPosition(event)}
        >
          <AgendaEventCard event={event} />
        </button>
      ))}
    </div>
  )
}

function AgendaEventCard({ event }: { event: AgendaEvent }) {
  const info = getAgendaOperationalInfo(event)
  const tone = {
    appointment: "border-primary/40 bg-primary/15 text-foreground",
    blocked: "border-red-500/35 bg-red-500/15 text-red-950",
    break: "border-sky-500/35 bg-sky-500/15 text-sky-950",
    unavailable: "border-zinc-300 bg-zinc-200 text-zinc-700",
  }[event.type]
  const icon = {
    appointment: Calendar03Icon,
    blocked: AlertCircleIcon,
    break: Clock01Icon,
    unavailable: InformationCircleIcon,
  }[event.type]

  return (
    <span
      className={cn(
        "block h-full overflow-hidden rounded-md border px-2.5 py-2 sm:px-3",
        tone
      )}
    >
      <span className="flex h-full flex-col gap-1.5">
        <span className="min-w-0">
          <span className="flex min-w-0 items-center gap-1.5 text-xs font-medium min-[380px]:text-sm">
            <HugeiconsIcon icon={icon} size={14} />
            <span className="min-w-0 truncate">{event.title}</span>
          </span>
          <span
            className={cn(
              "block truncate text-[11px] min-[380px]:text-xs",
              event.type === "blocked"
                ? "text-red-950/75"
                : event.type === "break"
                  ? "text-sky-950/75"
                  : "text-muted-foreground"
            )}
          >
            {event.detail}
          </span>
        </span>
        <span className="flex flex-wrap items-center gap-1 sm:hidden [&>span]:px-2 [&>span]:py-0.5 [&>span]:text-[10px]">
          <StatusBadge tone="neutral">{event.start} - {event.end}</StatusBadge>
          {event.type === "appointment" ? (
            <StatusBadge tone={info.appointmentTone}>
              {info.appointmentLabel}
            </StatusBadge>
          ) : null}
        </span>
        <span className="hidden flex-wrap items-center gap-1 sm:flex">
          <StatusBadge tone="neutral">
            {event.start} - {event.end}
          </StatusBadge>
          {event.type === "appointment" ? (
            <>
              <StatusBadge tone={info.appointmentTone}>
                {info.appointmentLabel}
              </StatusBadge>
              <StatusBadge tone={info.clientTone}>{info.clientLabel}</StatusBadge>
              {info.coverageLabel ? (
                <StatusBadge tone={info.coverageTone}>
                  {info.coverageLabel}
                </StatusBadge>
              ) : null}
              {info.attendanceLabel ? (
                <StatusBadge tone={info.attendanceTone}>
                  {info.attendanceLabel}
                </StatusBadge>
              ) : null}
              {info.commandLabel ? (
                <StatusBadge tone={info.commandTone}>
                  {info.commandLabel}
                </StatusBadge>
              ) : null}
            </>
          ) : null}
        </span>
        {event.type === "appointment" && info.microcopy ? (
          <span className="truncate text-[11px] text-muted-foreground">
            {info.microcopy}
          </span>
        ) : null}
      </span>
    </span>
  )
}

function ScheduleModal({
  open,
  onOpenChange,
  editing,
  event,
  barber,
  selectedDate,
  start,
  end,
  client,
  clients,
  service,
  noPreference,
  addedServices,
  events,
  onBarberChange,
  onDateChange,
  onStartChange,
  onEndChange,
  onClientChange,
  onCreateClient,
  onServiceChange,
  onNoPreferenceChange,
  onAddService,
  onRemoveService,
  onSaveAppointment,
  onRemove,
  onConfirmAppointment,
  onClientArrived,
  onStartAttendance,
  onCompleteAttendance,
  onMarkNoShow,
  onCancelAppointment,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  editing: boolean
  event: AgendaEvent | null
  barber: Barber
  selectedDate: string
  start: string
  end: string
  client: string
  clients: AgendaClient[]
  service: string
  noPreference: boolean
  addedServices: string[]
  events: AgendaEvent[]
  onBarberChange: (barber: Barber) => void
  onDateChange: (date: string) => void
  onStartChange: (slot: string) => void
  onEndChange: (slot: string) => void
  onClientChange: (value: string) => void
  onCreateClient: (client: NewAgendaClient) => void
  onServiceChange: (value: string) => void
  onNoPreferenceChange: (checked: boolean) => void
  onAddService: () => void
  onRemoveService: (service: string) => void
  onSaveAppointment: () => void
  onRemove: () => void
  onConfirmAppointment: () => void
  onClientArrived: () => void
  onStartAttendance: () => void
  onCompleteAttendance: () => void
  onMarkNoShow: () => void
  onCancelAppointment: () => void
}) {
  const [step, setStep] = useState(0)
  const [newClientOpen, setNewClientOpen] = useState(false)
  const [newClientName, setNewClientName] = useState("")
  const [newClientPhone, setNewClientPhone] = useState("")
  const [newClientEmail, setNewClientEmail] = useState("")
  const [newClientNotes, setNewClientNotes] = useState("")
  const steps = ["Dados", "Cliente", "Serviços", "Confirmar"]
  const lastStep = steps.length - 1
  const selectedClient = clients.find((item) => item.name === client)
  const operationalInfo =
    event && event.type === "appointment"
      ? getAgendaOperationalInfo(event)
      : null

  function goNext() {
    setStep((current) => Math.min(current + 1, lastStep))
  }

  function goBack() {
    setStep((current) => Math.max(current - 1, 0))
  }

  function finishSchedule() {
    setStep(0)
    onSaveAppointment()
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setStep(0)
    onOpenChange(nextOpen)
  }

  function openNewClientRegistration() {
    onOpenChange(true)
    setNewClientOpen(true)
  }

  function returnToScheduleModal() {
    setNewClientOpen(false)
    onOpenChange(true)
  }

  function saveNewClient() {
    const name = newClientName.trim()

    if (!name) return

    onCreateClient({
      name,
      phone: newClientPhone,
      email: newClientEmail,
      notes: newClientNotes,
    })
    setNewClientName("")
    setNewClientPhone("")
    setNewClientEmail("")
    setNewClientNotes("")
    returnToScheduleModal()
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="grid grid-rows-[auto_auto_auto_minmax(0,1fr)_auto] sm:h-[min(42rem,calc(100dvh-1rem))] sm:max-w-3xl">
          <DialogHeader className="flex-row items-start justify-between gap-2 border-b-0 p-3 pb-2 sm:gap-3 sm:border-b sm:p-4">
            <div className="min-w-0">
              <DialogTitle className="flex items-center gap-2 text-[17px] leading-tight sm:text-lg">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary sm:size-auto sm:bg-transparent sm:text-foreground">
                  <HugeiconsIcon icon={Calendar03Icon} size={17} />
                </span>
                {editing ? "Editar agendamento" : "Novo agendamento"}
              </DialogTitle>
              <DialogDescription className="mt-1 flex items-center gap-2 text-xs leading-snug sm:block sm:text-sm">
                <span className="rounded-full bg-muted px-2 py-0.5 font-medium text-foreground sm:bg-transparent sm:px-0 sm:py-0 sm:font-normal">
                  {step + 1}/{steps.length}
                </span>
                <span>{steps[step]}</span>
              </DialogDescription>
            </div>
            <DialogClose asChild>
              <Button
                size="icon-sm"
                variant="ghost"
                className="rounded-full"
                aria-label="Fechar modal"
              >
                <span className="sr-only">Fechar</span>
                <HugeiconsIcon icon={Cancel01Icon} size={18} />
              </Button>
            </DialogClose>
          </DialogHeader>

          <div className="px-3 pt-0 pb-2 sm:border-b sm:px-4 sm:py-2">
            <ModalStepper steps={steps} currentStep={step} />
          </div>

          {event && operationalInfo ? (
            <OperationalAgendaPanel
              event={event}
              info={operationalInfo}
              onConfirmAppointment={onConfirmAppointment}
              onClientArrived={onClientArrived}
              onStartAttendance={onStartAttendance}
              onCompleteAttendance={onCompleteAttendance}
              onMarkNoShow={onMarkNoShow}
              onCancelAppointment={onCancelAppointment}
            />
          ) : null}

          <ScrollArea className="h-full min-h-0">
            <div className="min-h-0 space-y-3 px-3 pt-1 pb-3 sm:space-y-4 sm:p-4">
              {step === 0 ? (
                <>
                  <div className="grid gap-2.5 sm:gap-3">
                    <div className="grid grid-cols-[minmax(0,1fr)_2.75rem] gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
                      <div className="grid gap-1 sm:gap-1.5">
                        <FieldLabel required icon={UserSearch01Icon}>
                          Cliente
                        </FieldLabel>
                        <Select value={client} onValueChange={onClientChange}>
                          <SelectTrigger className="h-12 scroll-mt-28 items-center text-left text-sm sm:h-10 [&>span]:min-w-0 [&>span]:flex-1">
                            {selectedClient ? (
                              <span className="flex min-w-0 flex-col leading-tight sm:block">
                                <span className="truncate font-medium">
                                  {selectedClient.name}
                                </span>
                                <span className="truncate text-[11px] text-muted-foreground sm:hidden">
                                  {selectedClient.phone} - última visita:{" "}
                                  {selectedClient.lastVisit}
                                </span>
                              </span>
                            ) : (
                              <SelectValue placeholder="Selecionar cliente" />
                            )}
                          </SelectTrigger>
                          <SelectContent>
                            {clients.map((item) => (
                              <SelectItem key={item.id} value={item.name}>
                                <span className="flex min-w-0 flex-col gap-0.5">
                                  <span className="truncate font-medium">
                                    {item.name}
                                  </span>
                                  <span className="truncate text-xs text-muted-foreground">
                                    {item.phone} - última visita:{" "}
                                    {item.lastVisit}
                                  </span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="mt-5 size-9 sm:mt-0 sm:h-9 sm:w-auto sm:px-3"
                        aria-label="Novo cliente"
                        onClick={openNewClientRegistration}
                      >
                        <HugeiconsIcon icon={UserAdd01Icon} size={16} />
                        <span className="hidden sm:inline">Novo cliente</span>
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-2.5 sm:gap-3">
                    <div className="grid gap-1 sm:gap-1.5">
                      <FieldLabel required icon={UserSearch01Icon}>
                        Profissional
                      </FieldLabel>
                      <Select
                        value={barber}
                        onValueChange={(value) =>
                          onBarberChange(value as Barber)
                        }
                        disabled={noPreference}
                      >
                        <SelectTrigger className="h-9 text-sm sm:h-10">
                          <SelectValue placeholder="Profissional" />
                        </SelectTrigger>
                        <SelectContent>
                          {barbers.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <label className="flex items-center gap-2 text-[11px] text-muted-foreground sm:text-xs">
                      <input
                        type="checkbox"
                        checked={noPreference}
                        onChange={(event) =>
                          onNoPreferenceChange(event.target.checked)
                        }
                        className="size-4 rounded border accent-primary"
                      />
                      Sem preferência por profissional
                    </label>
                  </div>

                  {(noPreference || barber.trim()) ? (
                    <div className="grid gap-1 sm:gap-1.5">
                      <FieldLabel required icon={Calendar03Icon}>
                        Data
                      </FieldLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="h-9 w-full justify-between text-left font-normal sm:h-10"
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              <HugeiconsIcon
                                icon={Calendar03Icon}
                                size={16}
                                className="text-muted-foreground"
                              />
                              <span className="truncate">
                                {format(parseLocalDate(selectedDate), "PPP", {
                                  locale: ptBR,
                                })}
                              </span>
                            </span>
                            <HugeiconsIcon
                              icon={ArrowDown01Icon}
                              size={16}
                              className="opacity-50"
                            />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={parseLocalDate(selectedDate)}
                            onSelect={(date) => {
                              if (!date) return
                              onDateChange(toDateInputValue(date))
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  ) : null}

                  {selectedDate ? (
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3">
                      <div className="grid gap-1 sm:gap-1.5">
                        <FieldLabel required icon={Clock01Icon}>
                          Inicio
                        </FieldLabel>
                        <Select value={start} onValueChange={onStartChange}>
                          <SelectTrigger className="h-9 text-sm sm:h-10">
                            <SelectValue placeholder="Inicio" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots
                              .filter((slot) => {
                                const activeBarber = noPreference ? null : barber
                                return activeBarber
                                  ? !events.some(
                                      (ev) =>
                                        ev.date === selectedDate &&
                                        ev.barber === activeBarber &&
                                        isSlotInsideEvent(slot, ev)
                                    )
                                  : true
                              })
                              .map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-1 sm:gap-1.5">
                        <FieldLabel required icon={Clock01Icon}>
                          Fim
                        </FieldLabel>
                        <Select value={end} onValueChange={onEndChange}>
                          <SelectTrigger className="h-9 text-sm sm:h-10">
                            <SelectValue placeholder="Fim" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots
                              .filter((slot) => {
                                const activeBarber = noPreference ? null : barber
                                return activeBarber
                                  ? !events.some(
                                      (ev) =>
                                        ev.date === selectedDate &&
                                        ev.barber === activeBarber &&
                                        isSlotInsideEvent(slot, ev)
                                    )
                                  : true
                              })
                              .map((slot) => (
                                <SelectItem key={slot} value={slot}>
                                  {slot}
                                </SelectItem>
                              ))}
                            <SelectItem value="19:10">19:10</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : null}

              {step === 1 ? (
                <>
                  <InfoBlock
                    title="Últimos 3 agendamentos"
                    icon={InformationCircleIcon}
                  >
                    {client.trim() ? (
                      <div className="grid gap-2">
                        {recentAppointments.map((item) => (
                          <div
                            key={`${item.date}-${item.service}`}
                            className="flex items-center justify-between gap-3 rounded-md border bg-background px-3 py-2 text-xs"
                          >
                            <span className="min-w-0">
                              <span className="block font-medium">
                                {item.service}
                              </span>
                              <span className="text-muted-foreground">
                                {item.date} com {item.professional}
                              </span>
                            </span>
                            <HugeiconsIcon
                              icon={Calendar03Icon}
                              size={16}
                              className="shrink-0 text-muted-foreground"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={InformationCircleIcon}
                        title="Nenhum cliente selecionado"
                        description="Selecione ou digite um cliente para ver os registros."
                        className="min-h-40"
                      />
                    )}
                  </InfoBlock>

                  <InfoBlock
                    title="Itens para recompra"
                    icon={InformationCircleIcon}
                  >
                    {client.trim() ? (
                      <div className="flex flex-wrap gap-2">
                        {repurchaseItems.map((item) => (
                          <span
                            key={item.id}
                            className="rounded-full border bg-background px-3 py-1 text-xs font-medium"
                          >
                            {item.label} em {item.days} dias
                          </span>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={InformationCircleIcon}
                        title="Sem recompras"
                        description="Cliente não possui itens para recompra."
                        className="min-h-40"
                      />
                    )}
                  </InfoBlock>
                </>
              ) : null}

              {step === 2 ? (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold">Serviços</h3>
                  <div className="mt-3 grid grid-cols-[minmax(0,1fr)_2.25rem] gap-2 sm:grid-cols-[minmax(0,1fr)_2.5rem]">
                    <div className="grid gap-1 sm:gap-1.5">
                      <FieldLabel required>Adicionar servico</FieldLabel>
                      <Select value={service} onValueChange={onServiceChange}>
                        <SelectTrigger className="h-9 text-sm sm:h-10">
                          <SelectValue placeholder="Selecionar servico" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      className="mt-5 size-9 sm:mt-6 sm:w-10"
                      aria-label="Adicionar servico"
                      onClick={onAddService}
                    >
                      <HugeiconsIcon icon={Add01Icon} size={18} />
                    </Button>
                  </div>

                  <div className="mt-3 min-h-14 rounded-md border border-dashed bg-muted/30 p-2">
                    {addedServices.length ? (
                      <div className="grid gap-2">
                        {addedServices.map((item) => (
                          <div
                            key={item}
                            className="flex items-center justify-between gap-3 rounded-md bg-background px-3 py-2 text-sm"
                          >
                            <span>{item}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              aria-label={`Remover ${item}`}
                              onClick={() => onRemoveService(item)}
                            >
                              <HugeiconsIcon icon={Delete02Icon} size={15} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState
                        icon={InformationCircleIcon}
                        title="Lista vazia"
                        description="Nenhum servico adicionado."
                        className="min-h-32"
                      />
                    )}
                  </div>

                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="rounded-lg border bg-card p-2.5 sm:rounded-md sm:bg-muted/30 sm:p-3">
                    <h3 className="flex items-center gap-2 text-[13px] font-semibold sm:text-sm">
                      <span className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <HugeiconsIcon icon={Calendar03Icon} size={15} />
                      </span>
                      Resumo
                    </h3>
                    <div className="mt-2 grid gap-1.5 text-sm sm:mt-3 sm:gap-2">
                      <SummaryRow
                        label="Cliente"
                        value={client || "Cliente não selecionado"}
                      />
                      <SummaryRow
                        label="Data"
                        value={formatShortDate(selectedDate)}
                      />
                      <SummaryRow label="Horário" value={`${start} - ${end}`} />
                      <SummaryRow
                        label="Profissional"
                        value={noPreference ? "Sem preferência" : barber}
                      />
                      <SummaryRow
                        label="Serviços"
                        value={
                          addedServices.length
                            ? addedServices.join(", ")
                            : service
                        }
                      />
                    </div>
                  </div>
                  <div className="rounded-lg border border-primary/30 bg-primary/10 p-2.5 text-xs leading-snug text-foreground sm:rounded-md sm:p-3">
                    Revise os dados antes de concluir. Você pode voltar e
                    ajustar qualquer etapa.
                  </div>
                </div>
              ) : null}
            </div>
          </ScrollArea>

          <DialogFooter className="border-t bg-background p-3 sm:justify-between sm:p-4">
            <div className="w-full sm:w-auto">
              {editing ? (
                <Button
                  className="w-full sm:w-auto"
                  variant="outline"
                  onClick={() => {
                    setStep(0)
                    onRemove()
                  }}
                >
                  <HugeiconsIcon icon={Delete02Icon} size={16} />
                  Desbloquear/remover
                </Button>
              ) : null}
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <div
                className={cn(
                  "grid gap-2 sm:contents",
                  step > 0 ? "grid-cols-2" : "grid-cols-1"
                )}
              >
                <DialogClose asChild>
                  <Button className="w-full sm:w-auto" variant="outline">
                    Cancelar
                  </Button>
                </DialogClose>
                {step > 0 ? (
                  <Button
                    className="w-full sm:w-auto"
                    variant="outline"
                    onClick={goBack}
                  >
                    <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                    Voltar
                  </Button>
                ) : null}
              </div>
              {step < lastStep ? (
                <Button className="h-10 w-full sm:w-auto" onClick={goNext}>
                  Próximo
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
                </Button>
              ) : (
                <Button
                  className="h-10 w-full sm:w-auto"
                  onClick={finishSchedule}
                >
                  <HugeiconsIcon icon={Calendar03Icon} size={16} />
                  {editing ? "Salvar agendamento" : "Concluir agendamento"}
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={newClientOpen}
        onOpenChange={(nextOpen) => {
          if (nextOpen) {
            openNewClientRegistration()
            return
          }

          returnToScheduleModal()
        }}
      >
        <DialogContent className="grid grid-rows-[auto_auto_minmax(0,1fr)_auto] sm:h-[min(34rem,calc(100dvh-1rem))] sm:max-w-md">
          <DialogHeader className="flex-row items-start justify-between gap-3 border-b p-3 sm:p-4">
            <div className="min-w-0">
              <DialogTitle className="flex items-center gap-2 text-base">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <HugeiconsIcon icon={UserAdd01Icon} size={16} />
                </span>
                Novo cliente
              </DialogTitle>
              <DialogDescription className="mt-1 text-xs sm:text-sm">
                Cadastro rapido para usar neste agendamento.
              </DialogDescription>
            </div>
            <Button
              type="button"
              size="icon-sm"
              variant="ghost"
              className="rounded-full"
              aria-label="Voltar ao agendamento"
              onClick={returnToScheduleModal}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} />
            </Button>
          </DialogHeader>

          <ScrollArea className="h-full min-h-0">
            <div className="grid gap-3 p-3 sm:p-4">
              <div className="grid gap-1.5">
                <FieldLabel required icon={UserSearch01Icon}>
                  Nome
                </FieldLabel>
                <Input
                  value={newClientName}
                  onChange={(event) => setNewClientName(event.target.value)}
                  placeholder="Ex.: Joao Pereira"
                  autoFocus
                  enterKeyHint="next"
                  className="scroll-mt-28"
                />
              </div>
              <div className="grid gap-1.5">
                <FieldLabel icon={Calendar03Icon}>Telefone</FieldLabel>
                <Input
                  value={newClientPhone}
                  onChange={(event) => setNewClientPhone(event.target.value)}
                  placeholder="(11) 90000-0000"
                  inputMode="tel"
                  enterKeyHint="next"
                  className="scroll-mt-28"
                />
              </div>
              <div className="grid gap-1.5">
                <FieldLabel>E-mail</FieldLabel>
                <Input
                  value={newClientEmail}
                  onChange={(event) => setNewClientEmail(event.target.value)}
                  placeholder="cliente@email.com"
                  type="email"
                  inputMode="email"
                  enterKeyHint="next"
                  className="scroll-mt-28"
                />
              </div>
              <div className="grid gap-1.5">
                <FieldLabel>Observacao</FieldLabel>
                <Input
                  value={newClientNotes}
                  onChange={(event) => setNewClientNotes(event.target.value)}
                  placeholder="Preferências, alergias, observações..."
                  enterKeyHint="done"
                  className="scroll-mt-28"
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="grid grid-cols-2 gap-2 border-t bg-background/95 p-3 sm:flex sm:p-4">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full sm:w-auto"
              onClick={returnToScheduleModal}
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
              Voltar
            </Button>
            <Button
              type="button"
              className="h-11 w-full sm:w-auto"
              disabled={!newClientName.trim()}
              onClick={saveNewClient}
            >
              Salvar cliente
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function OperationalAgendaPanel({
  event,
  info,
  onConfirmAppointment,
  onClientArrived,
  onStartAttendance,
  onCompleteAttendance,
  onMarkNoShow,
  onCancelAppointment,
}: {
  event: AgendaEvent
  info: AgendaOperationalInfo
  onConfirmAppointment: () => void
  onClientArrived: () => void
  onStartAttendance: () => void
  onCompleteAttendance: () => void
  onMarkNoShow: () => void
  onCancelAppointment: () => void
}) {
  const canConfirm = event.status === APPOINTMENT_STATUS.PENDING
  const canArrive =
    event.status === APPOINTMENT_STATUS.CONFIRMED && !event.attendanceStatus
  const canStart = event.attendanceStatus === ATTENDANCE_STATUS.CLIENT_ARRIVED
  const canComplete = event.attendanceStatus === ATTENDANCE_STATUS.IN_PROGRESS
  const canMarkNoShow =
    event.status !== APPOINTMENT_STATUS.NO_SHOW &&
    event.status !== APPOINTMENT_STATUS.CANCELLED &&
    !event.attendanceStatus
  const canCancel =
    event.status !== APPOINTMENT_STATUS.CANCELLED &&
    event.attendanceStatus !== ATTENDANCE_STATUS.COMPLETED

  return (
    <div className="border-y bg-muted/20 px-3 py-2 sm:px-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge tone={info.appointmentTone}>
            {info.appointmentLabel}
          </StatusBadge>
          <StatusBadge tone={info.clientTone}>{info.clientLabel}</StatusBadge>
          {info.subscriptionLabel ? (
            <StatusBadge tone={info.subscriptionTone}>
              {info.subscriptionLabel}
            </StatusBadge>
          ) : null}
          {info.coverageLabel ? (
            <StatusBadge tone={info.coverageTone}>
              {info.coverageLabel}
            </StatusBadge>
          ) : null}
          {info.attendanceLabel ? (
            <StatusBadge tone={info.attendanceTone}>
              {info.attendanceLabel}
            </StatusBadge>
          ) : null}
          {info.commandLabel ? (
            <StatusBadge tone={info.commandTone}>{info.commandLabel}</StatusBadge>
          ) : null}
        </div>

        <p className="text-xs leading-snug text-muted-foreground">
          {info.detailsCopy}
        </p>

        <div className="flex flex-wrap gap-2">
          {canConfirm ? (
            <Button size="sm" variant="outline" onClick={onConfirmAppointment}>
              Confirmar
            </Button>
          ) : null}
          {canArrive ? (
            <Button size="sm" variant="outline" onClick={onClientArrived}>
              Cliente chegou
            </Button>
          ) : null}
          {canStart ? (
            <Button size="sm" variant="outline" onClick={onStartAttendance}>
              Iniciar atendimento
            </Button>
          ) : null}
          {canComplete ? (
            <Button size="sm" variant="outline" onClick={onCompleteAttendance}>
              Concluir atendimento
            </Button>
          ) : null}
          <Button size="sm" variant="outline" asChild>
            <Link href="/caixa/comandas">Abrir comanda</Link>
          </Button>
          {canMarkNoShow ? (
            <Button size="sm" variant="outline" onClick={onMarkNoShow}>
              Marcar falta
            </Button>
          ) : null}
          {canCancel ? (
            <Button size="sm" variant="outline" onClick={onCancelAppointment}>
              Cancelar
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function ModalStepper({
  steps,
  currentStep,
}: {
  steps: string[]
  currentStep: number
}) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {steps.map((item, index) => {
        const isActive = index === currentStep
        const isDone = index < currentStep

        return (
          <div key={item} className="min-w-0">
            <div
              className={cn(
                "h-1 rounded-full bg-muted",
                (isActive || isDone) && "bg-primary"
              )}
            />
            <p
              className={cn(
                "mt-1 hidden truncate text-[11px] font-medium text-muted-foreground sm:block",
                isActive && "text-foreground"
              )}
            >
              {item}
            </p>
          </div>
        )
      })}
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-start gap-2 rounded-md bg-muted/40 px-2.5 py-2 text-xs sm:flex sm:justify-between sm:bg-background sm:px-3 sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right leading-snug font-medium sm:max-w-[65%]">
        {value}
      </span>
    </div>
  )
}

function FieldLabel({
  children,
  icon,
  required,
}: {
  children: ReactNode
  icon?: IconSvgElement
  required?: boolean
}) {
  return (
    <Label className="flex items-center gap-1 text-[11px] font-medium sm:gap-1.5 sm:text-xs">
      {icon ? (
        <HugeiconsIcon
          icon={icon}
          size={13}
          className="text-muted-foreground"
        />
      ) : null}
      <span>{children}</span>
      {required ? <span className="text-destructive">*</span> : null}
    </Label>
  )
}

function InfoBlock({
  title,
  icon,
  children,
}: {
  title: string
  icon: IconSvgElement
  children: ReactNode
}) {
  return (
    <section className="border-t pt-4">
      <h3 className="flex items-center gap-2 text-sm font-semibold">
        <HugeiconsIcon
          icon={icon}
          size={16}
          className="text-muted-foreground"
        />
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </section>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function LegacyScheduleModal({
  editing,
  barber,
  start,
  end,
  client,
  service,
  blockReason,
  onStartChange,
  onEndChange,
  onClientChange,
  onServiceChange,
  onBlockReasonChange,
  onClose,
  onSaveAppointment,
  onBlock,
  onRemove,
}: {
  editing: boolean
  barber: Barber
  start: string
  end: string
  client: string
  service: string
  blockReason: string
  onStartChange: (slot: string) => void
  onEndChange: (slot: string) => void
  onClientChange: (value: string) => void
  onServiceChange: (value: string) => void
  onBlockReasonChange: (value: string) => void
  onClose: () => void
  onSaveAppointment: () => void
  onBlock: () => void
  onRemove: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-lg border bg-background shadow-xl">
        <div className="flex items-center justify-between gap-3 border-b p-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold">
              {editing ? "Editar horário" : "Novo agendamento"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {barber} · agende, bloqueie ou desbloqueie este horário.
            </p>
          </div>
          <Button size="icon-sm" variant="ghost" onClick={onClose}>
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </Button>
        </div>

        <div className="space-y-4 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium">
              Inicio
              <select
                value={start}
                onChange={(event) => onStartChange(event.target.value)}
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none"
              >
                {timeSlots.map((slot) => (
                  <option key={slot}>{slot}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1 text-sm font-medium">
              Fim
              <select
                value={end}
                onChange={(event) => onEndChange(event.target.value)}
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none"
              >
                {timeSlots.map((slot) => (
                  <option key={slot}>{slot}</option>
                ))}
                <option>19:10</option>
              </select>
            </label>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium">
              Cliente
              <input
                value={client}
                onChange={(event) => onClientChange(event.target.value)}
                placeholder="Nome do cliente"
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none"
              />
            </label>
            <label className="grid gap-1 text-sm font-medium">
              Serviço
              <select
                value={service}
                onChange={(event) => onServiceChange(event.target.value)}
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none"
              >
                {services.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-1 text-sm font-medium">
            Motivo do bloqueio
            <input
              value={blockReason}
              onChange={(event) => onBlockReasonChange(event.target.value)}
              placeholder="Almoco, pausa, compromisso..."
              className="h-10 rounded-md border bg-background px-3 text-sm outline-none"
            />
          </label>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t p-4 sm:flex-row sm:justify-between">
          <div>
            {editing ? (
              <Button variant="outline" onClick={onRemove}>
                Desbloquear/remover
              </Button>
            ) : null}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={onBlock}>
              Bloquear horário
            </Button>
            <Button onClick={onSaveAppointment}>
              {editing ? "Salvar agendamento" : "Agendar cliente"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

type StatusTone = "green" | "amber" | "red" | "blue" | "neutral"

type AgendaSummary = {
  total: number
  inAttendance: number
  pendingCommands: number
  needsAttention: number
}

type AgendaOperationalInfo = {
  appointmentLabel: string
  appointmentTone: StatusTone
  clientLabel: string
  clientTone: StatusTone
  subscriptionLabel?: string
  subscriptionTone: StatusTone
  coverageLabel?: string
  coverageTone: StatusTone
  attendanceLabel?: string
  attendanceTone: StatusTone
  commandLabel?: string
  commandTone: StatusTone
  microcopy: string
  detailsCopy: string
  hasSubscription: boolean
  isDelinquent: boolean
  hasPendingCommand: boolean
  needsAttention: boolean
}

function getAgendaOperationalInfo(event: AgendaEvent): AgendaOperationalInfo {
  const client = getClientForEvent(event)
  const subscription = client
    ? database.subscriptions.find((item) => item.clientId === client.id)
    : undefined
  const command = getCommandForEvent(event)
  const primaryService = getPrimaryService(event)
  const balance = subscription?.benefitBalances.find((item) =>
    primaryService
      ? item.serviceId === String(primaryService.id) ||
        item.serviceName === primaryService.name
      : event.reservedBenefitServiceId
        ? item.serviceId === event.reservedBenefitServiceId
        : event.detail.includes(item.serviceName)
  )
  const appointmentStatus = event.status ?? APPOINTMENT_STATUS.CONFIRMED
  const isDelinquent = subscription?.status === SUBSCRIPTION_STATUS.DELINQUENT
  const hasIncludedCommandItem = command?.items.some(
    (item) => item.coverage === "included_in_plan"
  )
  const hasExtraCommandItem = command?.items.some(
    (item) => item.coverage === "extra_paid" || item.coverage === "regular"
  )
  const hasPendingCommand =
    command?.status === COMMAND_STATUS.OPEN ||
    command?.status === COMMAND_STATUS.PENDING
  const hasReservedBenefit = Boolean(event.reservedBenefitServiceId)
  const clientLabel = getClientLabel(subscription?.status, event.origin)
  const coverage = getCoverageInfo({
    subscriptionStatus: subscription?.status,
    balanceAvailable: balance?.available ?? 0,
    hasReservedBenefit,
    hasIncludedCommandItem: Boolean(hasIncludedCommandItem),
    hasExtraCommandItem: Boolean(hasExtraCommandItem),
    hasSubscription: Boolean(subscription),
  })
  const attendanceLabel = event.attendanceStatus
    ? ATTENDANCE_STATUS_LABELS[event.attendanceStatus]
    : undefined
  const commandLabel = command ? COMMAND_STATUS_LABELS[command.status] : undefined
  const microcopy = [
    event.origin ? getOriginLabel(event.origin) : null,
    event.notes,
  ]
    .filter(Boolean)
    .join(" - ")
  const detailsCopy = [
    `${event.title} - ${event.detail} - ${event.start} as ${event.end}`,
    clientLabel.label,
    subscription
      ? `${subscription.plan}: ${SUBSCRIPTION_STATUS_LABELS[subscription.status]}`
      : "Sem assinatura ativa",
    coverage.label,
    command ? `Comanda ${command.id}: ${COMMAND_STATUS_LABELS[command.status]}` : null,
  ]
    .filter(Boolean)
    .join(" | ")

  return {
    appointmentLabel: APPOINTMENT_STATUS_LABELS[appointmentStatus],
    appointmentTone: getAppointmentTone(appointmentStatus),
    clientLabel: clientLabel.label,
    clientTone: clientLabel.tone,
    subscriptionLabel: subscription
      ? SUBSCRIPTION_STATUS_LABELS[subscription.status]
      : undefined,
    subscriptionTone: getSubscriptionTone(subscription?.status),
    coverageLabel: coverage.label,
    coverageTone: coverage.tone,
    attendanceLabel,
    attendanceTone: getAttendanceTone(event.attendanceStatus),
    commandLabel,
    commandTone: getCommandTone(command?.status),
    microcopy,
    detailsCopy,
    hasSubscription: Boolean(subscription),
    isDelinquent,
    hasPendingCommand,
    needsAttention:
      appointmentStatus === APPOINTMENT_STATUS.PENDING ||
      appointmentStatus === APPOINTMENT_STATUS.NO_SHOW ||
      isDelinquent ||
      hasPendingCommand,
  }
}

function getClientForEvent(event: AgendaEvent) {
  return database.clients.find(
    (client) => client.name.toLowerCase() === event.title.toLowerCase()
  )
}

function getCommandForEvent(event: AgendaEvent) {
  return event.commandId
    ? database.comandas.find((command) => command.id === event.commandId)
    : undefined
}

function getPrimaryService(event: AgendaEvent) {
  return database.services.find((service) => event.detail.includes(service.name))
}

function getReservableServiceId(clientName: string, detail: string) {
  const client = database.clients.find(
    (item) => item.name.toLowerCase() === clientName.trim().toLowerCase()
  )
  const subscription = client
    ? database.subscriptions.find(
        (item) =>
          item.clientId === client.id && item.status === SUBSCRIPTION_STATUS.ACTIVE
      )
    : undefined

  if (!subscription) return undefined

  const balance = subscription.benefitBalances.find(
    (item) =>
      detail.includes(item.serviceName) &&
      item.available > 0 &&
      item.reserved >= 0
  )

  return balance?.serviceId
}

function matchesAgendaFilter(event: AgendaEvent, filter: AgendaFilter) {
  if (filter === "all") return true

  const info = getAgendaOperationalInfo(event)

  if (filter === "subscribers") return info.hasSubscription
  if (filter === "walk_in") return !info.hasSubscription || event.origin === "walk_in"
  if (filter === "delinquent") return info.isDelinquent
  if (filter === "attendance") {
    return (
      event.attendanceStatus === ATTENDANCE_STATUS.CLIENT_ARRIVED ||
      event.attendanceStatus === ATTENDANCE_STATUS.IN_PROGRESS
    )
  }
  if (filter === "pending_command") return info.hasPendingCommand
  if (filter === "needs_attention") return info.needsAttention
  if (filter === "no_show") return event.status === APPOINTMENT_STATUS.NO_SHOW
  if (filter === "cancelled") return event.status === APPOINTMENT_STATUS.CANCELLED

  return true
}

function buildAgendaSummary(events: AgendaEvent[]): AgendaSummary {
  return events.reduce(
    (summary, event) => {
      const info = getAgendaOperationalInfo(event)

      return {
        total: summary.total + 1,
        inAttendance:
          summary.inAttendance +
          (event.attendanceStatus === ATTENDANCE_STATUS.CLIENT_ARRIVED ||
          event.attendanceStatus === ATTENDANCE_STATUS.IN_PROGRESS
            ? 1
            : 0),
        pendingCommands:
          summary.pendingCommands + (info.hasPendingCommand ? 1 : 0),
        needsAttention: summary.needsAttention + (info.needsAttention ? 1 : 0),
      }
    },
    { total: 0, inAttendance: 0, pendingCommands: 0, needsAttention: 0 }
  )
}

function getClientLabel(
  status: SubscriptionStatus | undefined,
  origin: AgendaEvent["origin"]
) {
  if (status === SUBSCRIPTION_STATUS.ACTIVE) {
    return { label: "Assinante ativo", tone: "green" as const }
  }

  if (status === SUBSCRIPTION_STATUS.DELINQUENT) {
    return { label: "Assinante inadimplente", tone: "red" as const }
  }

  if (status) {
    return { label: `Assinante ${SUBSCRIPTION_STATUS_LABELS[status]}`, tone: "amber" as const }
  }

  if (origin === "walk_in") {
    return { label: "Encaixe avulso", tone: "blue" as const }
  }

  return { label: "Cliente avulso", tone: "neutral" as const }
}

function getCoverageInfo({
  subscriptionStatus,
  balanceAvailable,
  hasReservedBenefit,
  hasIncludedCommandItem,
  hasExtraCommandItem,
  hasSubscription,
}: {
  subscriptionStatus?: SubscriptionStatus
  balanceAvailable: number
  hasReservedBenefit: boolean
  hasIncludedCommandItem: boolean
  hasExtraCommandItem: boolean
  hasSubscription: boolean
}) {
  if (!hasSubscription) {
    return { label: "Avulso", tone: "neutral" as const }
  }

  if (subscriptionStatus === SUBSCRIPTION_STATUS.DELINQUENT) {
    return { label: "Benefício bloqueado", tone: "red" as const }
  }

  if (hasIncludedCommandItem) {
    return { label: "Incluso no plano", tone: "green" as const }
  }

  if (hasReservedBenefit) {
    return { label: "Benefício reservado", tone: "blue" as const }
  }

  if (hasExtraCommandItem || balanceAvailable <= 0) {
    return { label: "Extra pago", tone: "amber" as const }
  }

  return { label: "Cobertura disponível", tone: "green" as const }
}

function getAppointmentTone(status: AppointmentStatus): StatusTone {
  if (status === APPOINTMENT_STATUS.CONFIRMED) return "green"
  if (status === APPOINTMENT_STATUS.PENDING) return "amber"
  if (status === APPOINTMENT_STATUS.NO_SHOW) return "red"
  return "neutral"
}

function getAttendanceTone(status?: AttendanceStatus): StatusTone {
  if (status === ATTENDANCE_STATUS.COMPLETED) return "green"
  if (status === ATTENDANCE_STATUS.IN_PROGRESS) return "blue"
  if (status === ATTENDANCE_STATUS.CLIENT_ARRIVED) return "amber"
  if (status === ATTENDANCE_STATUS.CANCELLED) return "red"
  return "neutral"
}

function getCommandTone(status?: CommandStatus): StatusTone {
  if (status === COMMAND_STATUS.PAID) return "green"
  if (status === COMMAND_STATUS.OPEN) return "blue"
  if (status === COMMAND_STATUS.PENDING) {
    return "amber"
  }
  return "neutral"
}

function getSubscriptionTone(status?: SubscriptionStatus): StatusTone {
  if (status === SUBSCRIPTION_STATUS.ACTIVE) return "green"
  if (status === SUBSCRIPTION_STATUS.DELINQUENT) return "red"
  if (status === SUBSCRIPTION_STATUS.PAUSED) return "amber"
  return "neutral"
}

function getOriginLabel(origin: NonNullable<AgendaEvent["origin"]>) {
  const labels: Record<NonNullable<AgendaEvent["origin"]>, string> = {
    portal: "Portal",
    manual: "Manual",
    walk_in: "Encaixe",
    recurring: "Recorrente",
  }

  return labels[origin]
}

function appendEventNote(current: string | undefined, next: string) {
  return current ? `${current} ${next}` : next
}

function eventPosition(event: AgendaEvent) {
  const dayStart = timeToMinutes(timeSlots[0])
  const start = timeToMinutes(event.start)
  const end = timeToMinutes(event.end)
  const top = ((start - dayStart) / 10) * slotHeight + 3
  const height = Math.max(((end - start) / 10) * slotHeight - 6, slotHeight - 6)

  return {
    top,
    height,
  }
}

function isSlotInsideEvent(slot: string, event: AgendaEvent) {
  const slotMinutes = timeToMinutes(slot)

  return (
    slotMinutes >= timeToMinutes(event.start) &&
    slotMinutes < timeToMinutes(event.end)
  )
}

function formatShortDate(dateValue: string) {
  const date = parseLocalDate(dateValue)

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

function toDateInputValue(date: Date) {
  return [
    String(date.getFullYear()),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

function shiftDate(
  amount: number,
  dateValue: string,
  setDay: (day: string) => void,
  setMonth: (month: string) => void,
  setYear: (year: string) => void
) {
  const date = parseLocalDate(dateValue)
  date.setDate(date.getDate() + amount)
  setDateFromObject(date, setDay, setMonth, setYear)
}

function setDateFromObject(
  date: Date,
  setDay: (day: string) => void,
  setMonth: (month: string) => void,
  setYear: (year: string) => void
) {
  setDay(String(date.getDate()).padStart(2, "0"))
  setMonth(String(date.getMonth() + 1).padStart(2, "0"))
  setYear(String(date.getFullYear()))
}

function parseLocalDate(dateValue: string) {
  const [year, month, day] = dateValue.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function buildTimeSlots(start: string, end: string, stepMinutes: number) {
  const slots: string[] = []
  let cursor = timeToMinutes(start)
  const limit = timeToMinutes(end)

  while (cursor <= limit) {
    slots.push(minutesToTime(cursor))
    cursor += stepMinutes
  }

  return slots
}

function nextSlot(slot: string) {
  const index = timeSlots.indexOf(slot)
  return timeSlots[index + 1] ?? "19:10"
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value.split(":").map(Number)
  return hours * 60 + minutes
}

function minutesToTime(value: number) {
  const hours = Math.floor(value / 60)
  const minutes = value % 60
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}
