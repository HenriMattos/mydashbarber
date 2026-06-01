/* eslint-disable @next/next/no-img-element */
"use client"

import Link from "next/link"
import { useMemo, useState, type ChangeEvent, type ReactNode } from "react"
import {
  Delete02Icon,
  PencilEdit02Icon,
  PlusSignIcon,
  Search01Icon,
  UserAdd01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Camera, FileText, X } from "lucide-react"

import {
  formatCepInput,
  formatCnpjCpfInput,
  formatCnpjInput,
  formatCpfInput,
  formatCurrencyInput,
  formatDateInput,
  formatNumberInput,
  formatPhoneInput,
  formatUfInput,
} from "@/components/admin/client-input-formatters"
import { serviceCatalog } from "@/components/admin/catalog-data"
import { database, type Professional } from "@/components/admin/database"
import { SectionCard } from "@/components/admin/section-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type RowAction = "service" | "schedule" | "interval" | "dayOff" | "contact" | "product" | "contract"

type ServiceRow = {
  id: string
  service: string
  commission: string
  duration: string
  value: string
}

type TimeRow = {
  id: string
  day: string
  start: string
  end: string
}

type DayOffRow = {
  id: string
  start: string
  end: string
  vacation: boolean
}

type ContactRow = {
  id: string
  name: string
  phone: string
}

type ProductCommissionRow = {
  id: string
  category: string
  minSaleValue: string
  commission: string
}

type ContractRow = {
  id: string
  name: string
  fileUrl: string
}

type ProfessionalDraft = Pick<
  Professional,
  "email" | "phone" | "status" | "unit"
> & {
  fullName: string
  appName: string
  documentType: "CPF" | "CNPJ"
  document: string
  birthday: string
  type: string
  group: string
  branch: string
  pixKey: string
  servicePeriodicity: string
  branchAccess: boolean
  cep: string
  street: string
  neighborhood: string
  city: string
  state: string
  number: string
  complement: string
  hidden: boolean
  profilePhotoUrl: string
  emergencyName: string
  emergencyPhone: string
  permissions: string[]
  selectedService: string
  serviceCommission: string
  services: ServiceRow[]
  workday: string
  scheduleStart: string
  scheduleEnd: string
  schedules: TimeRow[]
  intervalDay: string
  intervalStart: string
  intervalEnd: string
  intervals: TimeRow[]
  dayOffStart: string
  dayOffEnd: string
  vacation: boolean
  dayOffs: DayOffRow[]
  contacts: ContactRow[]
  productCategory: string
  minSaleValue: string
  productCommission: string
  productCommissions: ProductCommissionRow[]
  contractName: string
  contractFileUrl: string
  contracts: ContractRow[]
}

type EditingService = {
  id: string
  commission: string
  duration: string
  value: string
}

const initialProfessionals: Professional[] = database.professionals
const weekdays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
const permissionOptions = [
  "Cadastro de agendamento",
  "Edição de agendamento",
  "Gerenciar produtos na comanda",
  "Gerenciar serviços na comanda",
  "Cadastrar horário bloqueado",
  "Remoção de folgas",
  "Edição de notas",
]
const professionalTypeOptions = ["PROFISSIONAL", "ADMIN"]
const professionalGroupOptions = ["Profissionais", "Administradores"]
const professionalBranchOptions = ["Matriz", "Unidade principal"]
const initialServiceRows: ServiceRow[] = [
  ["Barba", "40%", "30 min", "R$ 50,00"],
  ["Corte", "40%", "30 min", "R$ 50,00"],
  ["Depilação Nariz (cera)", "40%", "10 min", "R$ 15,00"],
  ["Hidratação", "40%", "10 min", "R$ 40,00"],
  ["Selagem", "40%", "40 min", "R$ 80,00"],
  ["Sobrancelha", "40%", "10 min", "R$ 20,00"],
  ["Terapia Capilar", "40%", "15 min", "R$ 50,00"],
  ["Cone Hindu", "40%", "20 min", "R$ 40,00"],
  ["QUIROPRAXIA", "40%", "40 min", "R$ 150,00"],
  ["Convênio", "0%", "60 min", "N/A"],
  ["Consultoria Visagismo", "50%", "120 min", "R$ 500,00"],
].map(([service, commission, duration, value], index) => ({
  id: `service-${index}`,
  service,
  commission,
  duration,
  value,
}))
const initialScheduleRows: TimeRow[] = [
  ["Sexta", "09:00", "18:00"],
  ["Quinta", "09:00", "17:00"],
  ["Sábado", "09:00", "18:00"],
  ["Terça", "09:00", "17:00"],
  ["Segunda", "09:00", "17:00"],
  ["Quarta", "09:00", "15:00"],
].map(([day, start, end], index) => ({ id: `schedule-${index}`, day, start, end }))
const initialIntervalRows: TimeRow[] = weekdays.map((day, index) => ({
  id: `interval-${index}`,
  day,
  start: "12:00",
  end: "13:00",
}))

export function ProfessionalsView() {
  const [items, setItems] = useState<Professional[]>(initialProfessionals)
  const [query, setQuery] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<ProfessionalDraft | null>(null)
  const [editingService, setEditingService] = useState<EditingService | null>(null)

  const filteredItems = useMemo(() => {
    const term = normalize(query)

    return items.filter((professional) => {
      return (
        !term ||
        String(professional.id).includes(term) ||
        normalize(professional.name).includes(term) ||
        normalize(professional.email ?? "").includes(term) ||
        normalize(professional.role).includes(term)
      )
    })
  }, [items, query])

  function removeProfessional(professional: Professional) {
    if (!window.confirm(`Deseja remover ${professional.name}?`)) return
    setItems((current) => current.filter((item) => item.id !== professional.id))
  }

  function openEditModal(professional: Professional) {
    setEditingId(professional.id)
    setDraft({
      fullName: professional.name,
      appName: professional.name,
      documentType: "CPF",
      document: "703.971.302-01",
      birthday: "30/04/2000",
      email: professional.email ?? "",
      phone: professional.phone ?? "",
      status: professional.status,
      type: formatType(professional.role),
      group: "Profissionais",
      branch: professional.unit ?? "Matriz",
      unit: professional.unit ?? "",
      pixKey: "92994592664",
      servicePeriodicity: "30",
      branchAccess: false,
      cep: "69028-335",
      street: "Rua Pitágoras",
      neighborhood: "Flores",
      city: "Manaus",
      state: "AM",
      number: "81",
      complement: "",
      hidden: false,
      profilePhotoUrl: "",
      emergencyName: "",
      emergencyPhone: "",
      permissions: permissionOptions,
      selectedService: serviceCatalog[0]?.name ?? "",
      serviceCommission: "40",
      services: initialServiceRows,
      workday: "Segunda",
      scheduleStart: "08:00",
      scheduleEnd: "18:00",
      schedules: initialScheduleRows,
      intervalDay: "Segunda",
      intervalStart: "12:00",
      intervalEnd: "13:00",
      intervals: initialIntervalRows,
      dayOffStart: "",
      dayOffEnd: "",
      vacation: false,
      dayOffs: [],
      contacts: [],
      productCategory: "",
      minSaleValue: "",
      productCommission: "",
      productCommissions: [],
      contractName: "",
      contractFileUrl: "",
      contracts: [],
    })
  }

  function closeEditModal() {
    setEditingId(null)
    setDraft(null)
    setEditingService(null)
  }

  function saveProfessionalEdit() {
    if (!draft || editingId === null) return

    setItems((current) =>
      current.map((professional) =>
        professional.id === editingId
          ? {
              ...professional,
              name: draft.fullName.trim(),
              email: draft.email?.trim(),
              phone: draft.phone?.trim(),
              role: draft.type === "ADMIN" ? "Admin" : "Profissional",
              status: draft.status,
              unit: draft.branch?.trim(),
            }
          : professional
      )
    )
    closeEditModal()
  }

  function updateDraft<Key extends keyof ProfessionalDraft>(
    key: Key,
    value: ProfessionalDraft[Key]
  ) {
    setDraft((current) => (current ? { ...current, [key]: value } : current))
  }

  function addService() {
    if (!draft?.selectedService) return
    const service = serviceCatalog.find((item) => item.name === draft.selectedService)
    const nextService: ServiceRow = {
      id: createId("service"),
      service: draft.selectedService,
      commission: `${draft.serviceCommission || "0"}%`,
      duration: service?.duration ?? "30 min",
      value: service ? formatCurrency(service.price) : "N/A",
    }

    updateDraft("services", [...draft.services, nextService])
  }

  function addSchedule() {
    if (!draft) return
    updateDraft("schedules", [
      ...draft.schedules,
      {
        id: createId("schedule"),
        day: draft.workday,
        start: draft.scheduleStart,
        end: draft.scheduleEnd,
      },
    ])
  }

  function addInterval() {
    if (!draft) return
    updateDraft("intervals", [
      ...draft.intervals,
      {
        id: createId("interval"),
        day: draft.intervalDay,
        start: draft.intervalStart,
        end: draft.intervalEnd,
      },
    ])
  }

  function addDayOff() {
    if (!draft || !draft.dayOffStart || !draft.dayOffEnd) return
    updateDraft("dayOffs", [
      ...draft.dayOffs,
      {
        id: createId("day-off"),
        start: draft.dayOffStart,
        end: draft.dayOffEnd,
        vacation: draft.vacation,
      },
    ])
  }

  function addContact() {
    if (!draft || !draft.emergencyName || !draft.emergencyPhone) return
    updateDraft("contacts", [
      ...draft.contacts,
      {
        id: createId("contact"),
        name: draft.emergencyName,
        phone: draft.emergencyPhone,
      },
    ])
  }

  function handleProfilePhotoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== "string") return
      updateDraft("profilePhotoUrl", reader.result)
      event.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  function addContract() {
    if (!draft || !draft.contractName || !draft.contractFileUrl) return
    updateDraft("contracts", [
      ...draft.contracts,
      {
        id: createId("contract"),
        name: draft.contractName,
        fileUrl: draft.contractFileUrl,
      },
    ])
    updateDraft("contractName", "")
    updateDraft("contractFileUrl", "")
  }

  function handleContractFileUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== "string") return
      updateDraft("contractFileUrl", reader.result)
      event.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  function addProductCommission() {
    if (!draft || !draft.productCategory) return
    updateDraft("productCommissions", [
      ...draft.productCommissions,
      {
        id: createId("product-commission"),
        category: draft.productCategory,
        minSaleValue: draft.minSaleValue,
        commission: `${draft.productCommission || "0"}%`,
      },
    ])
  }

  function removeRow(type: RowAction, id: string) {
    if (!draft) return

    const fieldByType: Record<RowAction, keyof Pick<
      ProfessionalDraft,
      "services" | "schedules" | "intervals" | "dayOffs" | "contacts" | "productCommissions" | "contracts"
    >> = {
      service: "services",
      schedule: "schedules",
      interval: "intervals",
      dayOff: "dayOffs",
      contact: "contacts",
      product: "productCommissions",
      contract: "contracts",
    }
    const field = fieldByType[type]
    const nextRows = (draft[field] as Array<{ id: string }>).filter(
      (row) => row.id !== id
    )

    updateDraft(field, nextRows as never)
  }

  function editService(row: ServiceRow) {
    setEditingService({
      id: row.id,
      commission: row.commission.replace("%", ""),
      duration: row.duration.replace(/\D/g, "") || row.duration,
      value: row.value,
    })
  }

  function saveServiceEdit() {
    if (!draft || !editingService) return

    updateDraft(
      "services",
      draft.services.map((service) =>
        service.id === editingService.id
          ? {
              ...service,
              commission: `${editingService.commission || "0"}%`,
              duration: `${editingService.duration || "0"} min`,
              value: editingService.value || "N/A",
            }
          : service
      )
    )
    setEditingService(null)
  }

  return (
    <>
      <SectionCard
        title="Registros Ativos"
        description="Usuários do sistema."
        action={
          <Button size="sm" asChild>
            <Link href="/profissionais/cadastrar">
              <HugeiconsIcon icon={UserAdd01Icon} size={16} />
              Cadastrar
            </Link>
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <div className="relative w-full lg:flex-1 lg:px-2">
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pesquise..."
                className="pl-9"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              className="lg:shrink-0"
              onClick={() => exportProfessionalsCsv(filteredItems, "profissionais.csv")}
            >
              Exportar dados
            </Button>
          </div>
        </div>

        <div className="mt-4 grid gap-2 md:hidden">
          {filteredItems.length === 0 ? (
            <div className="rounded-md border bg-muted/20 px-3 py-6 text-center text-sm text-muted-foreground">
              Nenhum usuário encontrado.
            </div>
          ) : (
            filteredItems.map((professional, index) => (
              <article
                key={professional.id}
                className="min-w-0 rounded-md border bg-background p-3"
              >
                <div className="flex min-w-0 items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-muted-foreground">
                      ID {professional.id}
                    </p>
                    <h3 className="mt-1 truncate text-sm font-semibold">
                      {professional.name}
                    </h3>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {professional.email || "-"}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1.5">
                    <Button
                      size="icon-sm"
                      variant="outline"
                      onClick={() => openEditModal(professional)}
                      aria-label={`Editar ${professional.name}`}
                    >
                      <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
                    </Button>
                    <Button
                      size="icon-sm"
                      variant="destructive"
                      onClick={() => removeProfessional(professional)}
                      aria-label={`Remover ${professional.name}`}
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={14} />
                    </Button>
                  </div>
                </div>

                <div className="mt-3 grid gap-2 text-xs text-muted-foreground">
                  <ProfessionalMobileInfoLine
                    label="Status"
                    value={formatStatus(professional.status)}
                  />
                  <ProfessionalMobileInfoLine
                    label="Tipo"
                    value={formatType(professional.role)}
                  />
                  <ProfessionalMobileInfoLine
                    label="Criado em"
                    value={getCreatedAt(professional.id, index)}
                  />
                  <ProfessionalMobileInfoLine
                    label="Atualizado em"
                    value={getUpdatedAt(professional.id, index)}
                  />
                </div>
              </article>
            ))
          )}
        </div>

        <div className="mt-4 hidden rounded-md border md:block md:overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/30 text-left">
              <tr>
                <TableHead>ID</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead>Atualizado em</TableHead>
                <TableHead className="text-right">Opções</TableHead>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td className="px-3 py-6 text-center text-muted-foreground" colSpan={8}>
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                filteredItems.map((professional, index) => (
                  <tr key={professional.id} className="border-t">
                    <TableCell>{professional.id}</TableCell>
                    <TableCell className="font-medium">{professional.name}</TableCell>
                    <TableCell>{professional.email || "-"}</TableCell>
                    <TableCell>{formatStatus(professional.status)}</TableCell>
                    <TableCell>{formatType(professional.role)}</TableCell>
                    <TableCell>{getCreatedAt(professional.id, index)}</TableCell>
                    <TableCell>{getUpdatedAt(professional.id, index)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button
                          size="icon-sm"
                          variant="outline"
                          onClick={() => openEditModal(professional)}
                          aria-label={`Editar ${professional.name}`}
                        >
                          <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="destructive"
                          onClick={() => removeProfessional(professional)}
                          aria-label={`Remover ${professional.name}`}
                        >
                          <HugeiconsIcon icon={Delete02Icon} size={14} />
                        </Button>
                      </div>
                    </TableCell>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <Dialog
        open={editingId !== null}
        onOpenChange={(open) => !open && closeEditModal()}
      >
        <DialogContent className="sm:h-[min(46rem,calc(100dvh-2rem))] sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Editar usuário</DialogTitle>
            <DialogDescription>
              Dados. Preencha todos os campos obrigatórios.
            </DialogDescription>
          </DialogHeader>

          {draft ? (
            <DialogBody className="space-y-5">
              <FormSection title="Dados">
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  <EditField label="Nome Completo *">
                    <Input value={draft.fullName} onChange={(event) => updateDraft("fullName", event.target.value)} />
                  </EditField>
                  <EditField label="Nome no APP *">
                    <Input value={draft.appName} onChange={(event) => updateDraft("appName", event.target.value)} />
                  </EditField>
                  <EditField label="CPF / CNPJ">
                    <div className="flex gap-2">
                      <Select value={draft.documentType} onValueChange={(value) => updateDraft("documentType", value as "CPF" | "CNPJ")}>
                        <SelectTrigger className="w-20 shrink-0"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="CPF">CPF</SelectItem>
                          <SelectItem value="CNPJ">CNPJ</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        value={draft.document}
                        inputMode="numeric"
                        placeholder={draft.documentType === "CPF" ? "000.000.000-00" : "00.000.000/0000-00"}
                        onChange={(event) => updateDraft("document", formatCnpjCpfInput(event.target.value))}
                      />
                    </div>
                  </EditField>
                  <EditField label="Data de nascimento">
                    <Input value={draft.birthday} inputMode="numeric" placeholder="dd/mm/aaaa" onChange={(event) => updateDraft("birthday", formatDateInput(event.target.value))} />
                  </EditField>
                  <EditField label="Email *">
                    <Input value={draft.email ?? ""} type="email" onChange={(event) => updateDraft("email", event.target.value)} />
                  </EditField>
                  <EditField label="Status *">
                    <Select value={draft.status} onValueChange={(value) => updateDraft("status", value as Professional["status"])}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Ferias">Férias</SelectItem>
                        <SelectItem value="Inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </EditField>
                  <EditField label="Tipo *">
                    <Select value={draft.type} onValueChange={(value) => updateDraft("type", value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {professionalTypeOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </EditField>
                  <EditField label="Grupo *">
                    <Select value={draft.group} onValueChange={(value) => updateDraft("group", value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {professionalGroupOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </EditField>
                  <EditField label="Filial *">
                    <Select value={draft.branch} onValueChange={(value) => { updateDraft("branch", value); updateDraft("unit", value) }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {professionalBranchOptions.map((option) => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </EditField>
                  <EditField label="Telefone *">
                    <Input value={draft.phone ?? ""} inputMode="tel" onChange={(event) => updateDraft("phone", formatPhoneInput(event.target.value))} />
                  </EditField>
                  <EditField label="Chave Pix *">
                    <Input value={draft.pixKey} onChange={(event) => updateDraft("pixKey", event.target.value)} />
                  </EditField>
                  <EditField label="Periodicidade de atendimento (dias) *">
                    <Input value={draft.servicePeriodicity} inputMode="numeric" onChange={(event) => updateDraft("servicePeriodicity", formatNumberInput(event.target.value))} />
                  </EditField>
                  <CheckField label="Possui acesso à dados de filiais?" checked={draft.branchAccess} onCheckedChange={(checked) => updateDraft("branchAccess", checked)} />
                  <EditField label="CEP *">
                    <Input value={draft.cep} inputMode="numeric" onChange={(event) => updateDraft("cep", formatCepInput(event.target.value))} />
                  </EditField>
                  <EditField label="Logradouro *">
                    <Input value={draft.street} onChange={(event) => updateDraft("street", event.target.value)} />
                  </EditField>
                  <EditField label="Bairro *">
                    <Input value={draft.neighborhood} onChange={(event) => updateDraft("neighborhood", event.target.value)} />
                  </EditField>
                  <EditField label="Cidade *">
                    <Input value={draft.city} onChange={(event) => updateDraft("city", event.target.value)} />
                  </EditField>
                  <EditField label="UF *">
                    <Input value={draft.state} onChange={(event) => updateDraft("state", formatUfInput(event.target.value))} />
                  </EditField>
                  <EditField label="Número *">
                    <Input value={draft.number} inputMode="numeric" onChange={(event) => updateDraft("number", formatNumberInput(event.target.value))} />
                  </EditField>
                  <EditField label="Complemento">
                    <Input value={draft.complement} onChange={(event) => updateDraft("complement", event.target.value)} />
                  </EditField>
                  <CheckField label="Oculto" checked={draft.hidden} onCheckedChange={(checked) => updateDraft("hidden", checked)} />
                </div>
              </FormSection>

              <PhotoUploadSection
                title="Foto"
                description="Foto de perfil."
                buttonLabel="Adicionar foto"
                imageUrl={draft.profilePhotoUrl}
                onUpload={handleProfilePhotoUpload}
                onRemove={() => updateDraft("profilePhotoUrl", "")}
              />

              <FormSection title="Segurança" description="Gerenciar senha de acesso.">
                <div className="grid gap-3 rounded-md border bg-muted/20 p-3">
                  <p className="text-sm text-muted-foreground">
                    Utilize esta opção para redefinir a senha de acesso do profissional. Após a redefinição, todas as sessões ativas serão encerradas.
                  </p>
                  <Button variant="outline" className="w-full sm:w-fit">Redefinir senha</Button>
                </div>
              </FormSection>

              <FormSection title="Contatos de emergência" description="Contatos de emergência adicionados.">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_3rem]">
                  <EditField label="Nome *">
                    <Input value={draft.emergencyName} onChange={(event) => updateDraft("emergencyName", event.target.value)} />
                  </EditField>
                  <EditField label="Telefone *">
                    <Input value={draft.emergencyPhone} inputMode="tel" onChange={(event) => updateDraft("emergencyPhone", formatPhoneInput(event.target.value))} />
                  </EditField>
                  <AddButton onClick={addContact} label="Adicionar contato" />
                </div>
                {draft.contacts.length === 0 ? (
                  <EmptyLine>Nenhum contato adicionado!</EmptyLine>
                ) : (
                  <DataTable
                    columns={["Nome", "Telefone", "Opções"]}
                    rows={draft.contacts.map((contact) => [
                      contact.name,
                      contact.phone,
                      <RowActions
                        key={contact.id}
                        onEdit={() => {
                          updateDraft("emergencyName", contact.name)
                          updateDraft("emergencyPhone", contact.phone)
                          removeRow("contact", contact.id)
                        }}
                        onDelete={() => removeRow("contact", contact.id)}
                      />,
                    ])}
                  />
                )}
              </FormSection>

              <FormSection title="Contratos" description="Contratos adicionados.">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(10rem,1fr)_3rem]">
                  <EditField label="Nome do contrato *">
                    <Input value={draft.contractName} onChange={(event) => updateDraft("contractName", event.target.value)} />
                  </EditField>
                  <div className="flex items-end gap-2">
                    {draft.contractFileUrl ? (
                      <span className="truncate text-sm text-muted-foreground">{draft.contractFileUrl.split(",")[0].slice(0, 30)}...</span>
                    ) : null}
                    <Button type="button" variant="outline" size="sm" asChild className="shrink-0">
                      <label>
                        <FileText className="size-4" />
                        {draft.contractFileUrl ? "Trocar" : "Selecionar"}
                        <input type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" className="sr-only" onChange={handleContractFileUpload} />
                      </label>
                    </Button>
                  </div>
                  <AddButton onClick={addContract} label="Adicionar contrato" />
                </div>
                {draft.contracts.length === 0 ? (
                  <EmptyLine>Nenhum contrato adicionado!</EmptyLine>
                ) : (
                  <DataTable
                    columns={["Nome", "Arquivo", "Opções"]}
                    rows={draft.contracts.map((contract) => [
                      contract.name,
                      <a key={contract.id} href={contract.fileUrl} download={contract.name} className="text-blue-600 underline text-sm">Download</a>,
                      <DeleteAction key={contract.id} onDelete={() => removeRow("contract", contract.id)} />,
                    ])}
                  />
                )}
              </FormSection>

              <FormSection title="Permissões" description="Escolha as permissões do Profissional">
                <div className="grid gap-2 sm:grid-cols-2">
                  {permissionOptions.map((permission) => (
                    <CheckField
                      key={permission}
                      label={permission}
                      checked={draft.permissions.includes(permission)}
                      onCheckedChange={(checked) => updateDraft("permissions", checked ? [...draft.permissions, permission] : draft.permissions.filter((item) => item !== permission))}
                    />
                  ))}
                </div>
              </FormSection>

              <FormSection title="Serviços" description="Serviços adicionados.">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(12rem,18rem)_3rem]">
                  <EditField label="Serviços *">
                    <Select value={draft.selectedService} onValueChange={(value) => updateDraft("selectedService", value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {serviceCatalog.map((service) => (
                          <SelectItem key={service.id} value={service.name}>{service.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </EditField>
                  <EditField label="Comissão (%)">
                    <Input value={draft.serviceCommission} inputMode="numeric" onChange={(event) => updateDraft("serviceCommission", formatNumberInput(event.target.value))} />
                  </EditField>
                  <AddButton onClick={addService} label="Adicionar serviço" />
                </div>
                <DataTable
                  columns={["Serviço", "Comissão", "Duração", "Valor", "Opções"]}
                  rows={draft.services.map((service) => [
                    service.service,
                    service.commission,
                    service.duration,
                    service.value,
                    <RowActions
                      key={service.id}
                      onEdit={() => editService(service)}
                      onDelete={() => removeRow("service", service.id)}
                    />,
                  ])}
                />
              </FormSection>

              <FormSection title="Horários" description="Horários adicionados.">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_3rem]">
                  <EditField label="Dias da semana *">
                    <Select value={draft.workday} onValueChange={(value) => updateDraft("workday", value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{weekdays.map((day) => <SelectItem key={day} value={day}>{day}</SelectItem>)}</SelectContent>
                    </Select>
                  </EditField>
                  <EditField label="Hora início *">
                    <Input type="time" value={draft.scheduleStart} onChange={(event) => updateDraft("scheduleStart", event.target.value)} />
                  </EditField>
                  <EditField label="Hora fim *">
                    <Input type="time" value={draft.scheduleEnd} onChange={(event) => updateDraft("scheduleEnd", event.target.value)} />
                  </EditField>
                  <AddButton onClick={addSchedule} label="Adicionar horário" />
                </div>
                <DataTable
                  columns={["Dia semana", "Hora Início", "Hora fim", "Opções"]}
                  rows={draft.schedules.map((schedule) => [
                    schedule.day,
                    schedule.start,
                    schedule.end,
                    <DeleteAction
                      key={schedule.id}
                      onDelete={() => removeRow("schedule", schedule.id)}
                    />,
                  ])}
                />
              </FormSection>

              <FormSection title="Intervalos" description="Intervalos adicionados.">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_3rem]">
                  <EditField label="Dias da semana *">
                    <Select value={draft.intervalDay} onValueChange={(value) => updateDraft("intervalDay", value)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{weekdays.map((day) => <SelectItem key={day} value={day}>{day}</SelectItem>)}</SelectContent>
                    </Select>
                  </EditField>
                  <EditField label="Hora início *">
                    <Input type="time" value={draft.intervalStart} onChange={(event) => updateDraft("intervalStart", event.target.value)} />
                  </EditField>
                  <EditField label="Hora fim *">
                    <Input type="time" value={draft.intervalEnd} onChange={(event) => updateDraft("intervalEnd", event.target.value)} />
                  </EditField>
                  <AddButton onClick={addInterval} label="Adicionar intervalo" />
                </div>
                <DataTable
                  columns={["Dia semana", "Hora início intervalo", "Hora fim intervalo", "Opções"]}
                  rows={draft.intervals.map((interval) => [
                    interval.day,
                    interval.start,
                    interval.end,
                    <DeleteAction
                      key={interval.id}
                      onDelete={() => removeRow("interval", interval.id)}
                    />,
                  ])}
                />
              </FormSection>

              <FormSection title="Folgas" description="Folgas adicionadas.">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_10rem_3rem]">
                  <EditField label="Data inicial *">
                    <Input type="date" value={draft.dayOffStart} onChange={(event) => updateDraft("dayOffStart", event.target.value)} />
                  </EditField>
                  <EditField label="Data final *">
                    <Input type="date" value={draft.dayOffEnd} onChange={(event) => updateDraft("dayOffEnd", event.target.value)} />
                  </EditField>
                  <CheckField label="Férias?" checked={draft.vacation} onCheckedChange={(checked) => updateDraft("vacation", checked)} />
                  <AddButton onClick={addDayOff} label="Adicionar folga" />
                </div>
                {draft.dayOffs.length > 0 ? (
                  <DataTable
                    columns={["Data inicial", "Data final", "Férias", "Opções"]}
                    rows={draft.dayOffs.map((dayOff) => [
                      dayOff.start,
                      dayOff.end,
                      dayOff.vacation ? "Sim" : "Não",
                      <RowActions
                        key={dayOff.id}
                        onEdit={() => {
                          updateDraft("dayOffStart", dayOff.start)
                          updateDraft("dayOffEnd", dayOff.end)
                          updateDraft("vacation", dayOff.vacation)
                          removeRow("dayOff", dayOff.id)
                        }}
                        onDelete={() => removeRow("dayOff", dayOff.id)}
                      />,
                    ])}
                  />
                ) : null}
              </FormSection>

              <FormSection title="Comissões sobre produtos" description="Comissões adicionadas.">
                <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_3rem]">
                  <EditField label="Categoria *">
                    <Select value={draft.productCategory} onValueChange={(value) => updateDraft("productCategory", value)}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cosméticos">Cosméticos</SelectItem>
                        <SelectItem value="Barbearia">Barbearia</SelectItem>
                      </SelectContent>
                    </Select>
                  </EditField>
                  <EditField label="Valor mínimo de venda *">
                    <Input value={draft.minSaleValue} inputMode="numeric" onChange={(event) => updateDraft("minSaleValue", formatCurrencyInput(event.target.value))} />
                  </EditField>
                  <EditField label="Comissão (%) *">
                    <Input value={draft.productCommission} inputMode="numeric" onChange={(event) => updateDraft("productCommission", formatNumberInput(event.target.value))} />
                  </EditField>
                  <AddButton onClick={addProductCommission} label="Adicionar comissão" />
                </div>
                {draft.productCommissions.length === 0 ? (
                  <EmptyLine>Nenhum horário adicionado!</EmptyLine>
                ) : (
                  <DataTable
                    columns={["Categoria", "Valor mínimo", "Comissão", "Opções"]}
                    rows={draft.productCommissions.map((commission) => [
                      commission.category,
                      commission.minSaleValue || "R$ 0,00",
                      commission.commission,
                      <RowActions
                        key={commission.id}
                        onEdit={() => {
                          updateDraft("productCategory", commission.category)
                          updateDraft("minSaleValue", commission.minSaleValue)
                          updateDraft("productCommission", commission.commission.replace("%", ""))
                          removeRow("product", commission.id)
                        }}
                        onDelete={() => removeRow("product", commission.id)}
                      />,
                    ])}
                  />
                )}
              </FormSection>

            </DialogBody>
          ) : null}

          <DialogFooter>
            <Button variant="outline" onClick={closeEditModal}>
              Cancelar
            </Button>
            <Button onClick={saveProfessionalEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editingService)} onOpenChange={(open) => !open && setEditingService(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar serviço</DialogTitle>
          </DialogHeader>
          {editingService ? (
            <DialogBody className="grid gap-3 sm:grid-cols-3">
              <EditField label="Comissão">
                <Input
                  value={editingService.commission}
                  inputMode="numeric"
                  onChange={(event) =>
                    setEditingService((current) =>
                      current
                        ? {
                            ...current,
                            commission: formatNumberInput(event.target.value),
                          }
                        : current
                    )
                  }
                />
              </EditField>
              <EditField label="Duração *">
                <Input
                  value={editingService.duration}
                  inputMode="numeric"
                  onChange={(event) =>
                    setEditingService((current) =>
                      current
                        ? {
                            ...current,
                            duration: formatNumberInput(event.target.value),
                          }
                        : current
                    )
                  }
                />
              </EditField>
              <EditField label="Valor *">
                <Input
                  value={editingService.value}
                  inputMode="numeric"
                  onChange={(event) =>
                    setEditingService((current) =>
                      current
                        ? {
                            ...current,
                            value: `R$ ${formatCurrencyInput(event.target.value)}`,
                          }
                        : current
                    )
                  }
                />
              </EditField>
            </DialogBody>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingService(null)}>
              Cancelar
            </Button>
            <Button onClick={saveServiceEdit}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      type="button"
      size="icon-sm"
      className="mt-auto w-full lg:w-8"
      onClick={onClick}
      aria-label={label}
    >
      <HugeiconsIcon icon={PlusSignIcon} size={14} />
    </Button>
  )
}

function RowActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void
  onDelete: () => void
}) {
  return (
    <div className="flex gap-2">
      <Button size="icon-sm" variant="outline" onClick={onEdit} aria-label="Editar">
        <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
      </Button>
      <Button size="icon-sm" variant="destructive" onClick={onDelete} aria-label="Remover">
        <HugeiconsIcon icon={Delete02Icon} size={14} />
      </Button>
    </div>
  )
}

function DeleteAction({ onDelete }: { onDelete: () => void }) {
  return (
    <Button size="icon-sm" variant="destructive" onClick={onDelete} aria-label="Remover">
      <HugeiconsIcon icon={Delete02Icon} size={14} />
    </Button>
  )
}

function TableHead({ className, children }: { className?: string; children: ReactNode }) {
  return <th className={`px-3 py-2 font-semibold ${className ?? ""}`}>{children}</th>
}

function TableCell({ className, children }: { className?: string; children: ReactNode }) {
  return <td className={`px-3 py-2 align-middle ${className ?? ""}`}>{children}</td>
}

function ProfessionalMobileInfoLine({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3 rounded-md bg-muted/30 px-2.5 py-2">
      <span className="shrink-0">{label}</span>
      <span className="min-w-0 truncate text-right font-medium text-foreground">
        {value}
      </span>
    </div>
  )
}

function EditField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function CheckField({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <label className="flex min-h-10 items-center gap-2 rounded-md border bg-muted/20 px-3 py-2 text-sm font-medium">
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(value === true)}
      />
      <span>{label}</span>
    </label>
  )
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="grid gap-3 rounded-md border bg-muted/10 p-3">
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  )
}

function PhotoUploadSection({
  title,
  description,
  buttonLabel,
  imageUrl,
  onUpload,
  onRemove,
}: {
  title: string
  description: string
  buttonLabel: string
  imageUrl: string
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
}) {
  return (
    <section className="overflow-hidden rounded-lg border bg-muted/10">
      <div className="flex flex-wrap items-center gap-1.5 border-b px-4 py-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
        <div className="grid size-24 place-items-center overflow-hidden rounded-md border bg-background">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="size-full object-cover"
            />
          ) : (
            <span className="text-xs font-medium text-muted-foreground">
              Sem foto
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <Button type="button" asChild>
            <label>
              <Camera className="size-4" />
              {buttonLabel}
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={onUpload}
              />
            </label>
          </Button>
          <Button type="button" variant="outline" onClick={onRemove}>
            <X className="size-4" />
            Remover
          </Button>
        </div>
      </div>
    </section>
  )
}

function DataTable({
  columns,
  rows,
}: {
  columns: string[]
  rows: Array<Array<ReactNode>>
}) {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="min-w-full text-sm">
        <thead className="bg-muted/30 text-left">
          <tr>
            {columns.map((column) => (
              <TableHead key={column}>{column}</TableHead>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t">
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>{cell}</TableCell>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EmptyLine({ children }: { children: ReactNode }) {
  return (
    <p className="py-6 text-center text-sm font-semibold text-muted-foreground">
      {children}
    </p>
  )
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}

function formatType(role: string) {
  return normalize(role).includes("admin") ? "ADMIN" : "PROFISSIONAL"
}

function formatStatus(status: Professional["status"]) {
  if (status === "Ferias") return "Férias"
  return status
}

function getCreatedAt(id: number, index: number) {
  const date = new Date(2025, 6, 10, 13, 0, 0)
  date.setDate(date.getDate() + (id % 5))
  date.setMinutes(date.getMinutes() + index * 7)
  return formatDateTime(date)
}

function getUpdatedAt(id: number, index: number) {
  const date = new Date(2026, 0, 14, 9, 30, 0)
  date.setDate(date.getDate() + (id % 11))
  date.setMinutes(date.getMinutes() + index * 5)
  return formatDateTime(date)
}

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function exportProfessionalsCsv(professionals: Professional[], filename: string) {
  const header = [
    "ID",
    "Nome",
    "Email",
    "Status",
    "Tipo",
    "Criado em",
    "Atualizado em",
  ]
  const rows = professionals.map((professional, index) => [
    professional.id,
    professional.name,
    professional.email ?? "",
    formatStatus(professional.status),
    formatType(professional.role),
    getCreatedAt(professional.id, index),
    getUpdatedAt(professional.id, index),
  ])
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => escapeCsvCell(String(cell))).join(";"))
    .join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")

  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function escapeCsvCell(value: string) {
  const escaped = value.replace(/"/g, '""')
  return `"${escaped}"`
}
