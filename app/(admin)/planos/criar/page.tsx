"use client"

import { useMemo, useState, type ReactNode } from "react"

import { serviceNames } from "@/components/admin/catalog-data"
import { database } from "@/components/admin/database"
import { SectionCard } from "@/components/admin/section-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  PLAN_STATUS,
  type PlanStatus,
  type BillingCycle,
} from "@/types"
import {
  getStoredCommercialPlans,
  saveCommercialPlans,
} from "@/components/company/commercial-storage"

type IncludedServiceDraft = {
  id: number
  serviceName: string
  quantityPerCycle: number
  unlimited: boolean
  discountPercent: number
  note: string
}

type ProductDiscountDraft = {
  id: number
  productName: string
  discountPercent: number
  note: string
}

const serviceOptions = serviceNames
const productOptions = database.products.map((product) => product.name)
const professionalOptions = database.professionals
  .filter((professional) => professional.status === "Ativo")
  .map((professional) => professional.name)

export default function CriarPlanosPage() {
  const [planName, setPlanName] = useState("")
  const [planDescription, setPlanDescription] = useState("")
  const [planValue, setPlanValue] = useState(0)
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly")
  const [planStatus, setPlanStatus] = useState<PlanStatus>(PLAN_STATUS.ACTIVE)
  const [featured, setFeatured] = useState(true)
  const [planRules, setPlanRules] = useState("")
  const [planNotes, setPlanNotes] = useState("")
  const [serviceLimit, setServiceLimit] = useState(1)
  const [serviceDraft, setServiceDraft] = useState({
    serviceName: "",
    quantityPerCycle: 1,
    unlimited: false,
    discountPercent: 0,
    note: "",
  })
  const [productDraft, setProductDraft] = useState({
    productName: "",
    discountPercent: 0,
    note: "",
  })
  const [serviceItems, setServiceItems] = useState<IncludedServiceDraft[]>([])
  const [productItems, setProductItems] = useState<ProductDiscountDraft[]>([])
  const [selectedProfessionals, setSelectedProfessionals] = useState<string[]>([])
  const [feedback, setFeedback] = useState("Plano ainda nao criado.")

  const totalValue = useMemo(() => formatCurrency(planValue), [planValue])
  const recurringValue = useMemo(
    () => formatCurrency(planValue * Math.max(serviceItems.length, 1)),
    [planValue, serviceItems.length]
  )

  function createPlan() {
    if (!planName.trim() || planValue <= 0) {
      setFeedback("Informe nome e valor para criar o plano.")
      return
    }

    const currentPlans = getStoredCommercialPlans(database.plans)
    const includedServices = serviceItems.map((service) => ({
      serviceId: String(service.id),
      serviceName: service.serviceName,
      quantityPerCycle: service.unlimited ? 0 : service.quantityPerCycle,
      unlimited: service.unlimited,
      requiresReservation: true,
      note: service.note || undefined,
    }))
    const extraDiscountPercent = serviceItems[0]?.discountPercent
    const productDiscountPercent = productItems[0]?.discountPercent
    const estimatedRecurringRevenue = 0

    const nextPlan = {
      id: Date.now(),
      name: planName.trim(),
      description:
        planDescription.trim() ||
        "Plano recorrente com beneficios por servico incluso.",
      benefit:
        planDescription.trim() ||
        `${serviceLimit} atendimento(s) no ciclo com descontos configurados.`,
      price: planValue,
      billingCycle,
      status: planStatus,
      recurrence: billingCycle === "annual" ? "Anual" : "Mensal",
      servicesLimit: includedServices.reduce(
        (sum, service) => sum + service.quantityPerCycle,
        0
      ) || serviceLimit,
      includedServices,
      benefitRule: {
        includedServices,
        extraDiscountPercent,
        productDiscountPercent,
        customerRulesText:
          planRules.trim() ||
          "Beneficios validos dentro do ciclo vigente do plano.",
        schedulingRulesText:
          planRules.trim() ||
          "Agendamento confirmado reserva o beneficio do servico incluso.",
        usageRulesText:
          planRules.trim() ||
          "O beneficio e consumido no atendimento concluido.",
        internalNotes: planNotes.trim() || undefined,
      },
      extraDiscountPercent,
      productDiscountPercent,
      commercialText:
        planDescription.trim() ||
        "Plano recorrente com beneficios por servico incluso.",
      subscriberCount: 0,
      estimatedRecurringRevenue,
      schedulingRulesText:
        planRules.trim() || "Agendamento confirmado reserva o beneficio.",
      usageRulesText:
        planRules.trim() || "Beneficio consumido no atendimento concluido.",
      internalNotes:
        [planNotes.trim(), selectedProfessionals.join(", ")]
          .filter(Boolean)
          .join(" | ") || undefined,
      featured,
      churnRisk: "Baixo" as const,
      subscribers: 0,
    }

    saveCommercialPlans([nextPlan, ...currentPlans])
    setFeedback(`Plano ${nextPlan.name} criado e disponivel para venda.`)
  }

  function addService() {
    if (!serviceDraft.serviceName) return

    setServiceItems((current) => [
      ...current,
      { id: Date.now(), ...serviceDraft },
    ])
    setServiceDraft({
      serviceName: "",
      quantityPerCycle: 1,
      unlimited: false,
      discountPercent: 0,
      note: "",
    })
  }

  function addProduct() {
    if (!productDraft.productName) return

    setProductItems((current) => [
      ...current,
      { id: Date.now(), ...productDraft },
    ])
    setProductDraft({ productName: "", discountPercent: 0, note: "" })
  }

  function toggleProfessional(name: string) {
    setSelectedProfessionals((current) =>
      current.includes(name)
        ? current.filter((item) => item !== name)
        : [...current, name]
    )
  }

  return (
    <div className="grid min-w-0 gap-4">
      <div className="flex min-w-0 flex-col gap-3 rounded-lg border bg-card p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-primary uppercase">
            Planos de assinatura
          </p>
          <h2 className="mt-1 text-xl font-semibold">Criar novo plano</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Configure valores, cobertura, regras e a leitura comercial do plano.
          </p>
        </div>
        <Button className="w-full md:w-auto" onClick={createPlan}>
          Criar plano
        </Button>
      </div>

      <SectionCard title="Dados" description="Informacoes basicas do plano.">
        <div className="grid min-w-0 gap-4 md:grid-cols-2">
          <Field label="Nome *">
            <Input
              value={planName}
              placeholder="Nome do plano"
              onChange={(event) => setPlanName(event.target.value)}
            />
          </Field>
          <Field label="Valor do plano *">
            <MoneyInput value={planValue} onChange={setPlanValue} />
          </Field>
          <Field label="Descricao comercial">
            <Input
              value={planDescription}
              placeholder="Ex: 2 cortes por ciclo com prioridade"
              onChange={(event) => setPlanDescription(event.target.value)}
            />
          </Field>
          <Field label="Recorrencia">
            <Select
              value={billingCycle}
              onValueChange={(value) => setBillingCycle(value as BillingCycle)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Mensal</SelectItem>
                <SelectItem value="annual">Anual</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Status">
            <Select
              value={planStatus}
              onValueChange={(value) => setPlanStatus(value as PlanStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PLAN_STATUS.ACTIVE}>Ativo</SelectItem>
                <SelectItem value={PLAN_STATUS.DRAFT}>Rascunho</SelectItem>
                <SelectItem value={PLAN_STATUS.INACTIVE}>Inativo</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Quantidade total no ciclo">
            <NumberInput
              value={serviceLimit}
              onChange={setServiceLimit}
              placeholder="1"
            />
          </Field>
          <Field label="Observacoes internas">
            <Input
              value={planNotes}
              placeholder="Regras internas da equipe"
              onChange={(event) => setPlanNotes(event.target.value)}
            />
          </Field>
          <label className="flex min-h-10 min-w-0 items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
            <Checkbox
              checked={featured}
              onCheckedChange={(checked) => setFeatured(Boolean(checked))}
            />
            <span className="break-words">Plano destaque</span>
          </label>
        </div>
      </SectionCard>

      <div className="rounded-lg border bg-muted/35 px-4 py-3 text-sm text-muted-foreground">
        {feedback}
      </div>

      <section className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <SectionCard title="Valores" description="Resumo comercial do plano.">
          <div className="plan-premium-card relative overflow-hidden rounded-md border p-4">
            <div className="relative grid gap-2">
              <p className="text-sm font-medium opacity-75">Valor total do plano</p>
              <p className="text-2xl font-semibold">{totalValue}</p>
              <p className="text-sm font-medium opacity-80">
                Recorrencia estimada: {recurringValue}
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Contrato" description="Regras de uso e renovacao.">
          <textarea
            rows={7}
            className="min-h-40 w-full resize-none rounded-md border bg-background px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30"
            placeholder="Escreva as regras do plano, renovacao, cancelamento e falta."
            value={planRules}
            onChange={(event) => setPlanRules(event.target.value)}
          />
        </SectionCard>
      </section>

      <SectionCard
        title="Servicos inclusos"
        description="Cada item define cobertura por ciclo."
      >
        <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(8rem,0.25fr)_minmax(8rem,0.25fr)_minmax(9rem,0.3fr)_auto] md:items-end">
          <Field label="Servico *">
            <OptionSelect
              value={serviceDraft.serviceName}
              options={serviceOptions}
              onValueChange={(value) =>
                setServiceDraft((current) => ({ ...current, serviceName: value }))
              }
            />
          </Field>
          <Field label="Qtd. ciclo *">
            <NumberInput
              value={serviceDraft.quantityPerCycle}
              onChange={(value) =>
                setServiceDraft((current) => ({
                  ...current,
                  quantityPerCycle: value,
                }))
              }
            />
          </Field>
          <Field label="Desconto %">
            <NumberInput
              value={serviceDraft.discountPercent}
              suffix="%"
              onChange={(value) =>
                setServiceDraft((current) => ({
                  ...current,
                  discountPercent: value,
                }))
              }
            />
          </Field>
          <Field label="Nota">
            <Input
              value={serviceDraft.note}
              placeholder="Regras curtas"
              onChange={(event) =>
                setServiceDraft((current) => ({ ...current, note: event.target.value }))
              }
            />
          </Field>
          <Button onClick={addService}>Adicionar</Button>
        </div>
        <label className="mt-3 flex min-h-10 min-w-0 items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm">
          <Checkbox
            checked={serviceDraft.unlimited}
            onCheckedChange={(checked) =>
              setServiceDraft((current) => ({
                ...current,
                unlimited: Boolean(checked),
              }))
            }
          />
          <span className="break-words">Servico ilimitado neste ciclo</span>
        </label>
        <div className="mt-4 grid gap-2">
          {serviceItems.length === 0 ? (
            <EmptyList>Nenhum servico incluso adicionado.</EmptyList>
          ) : (
            serviceItems.map((item) => (
              <div
                key={item.id}
                className="grid gap-2 rounded-md border bg-background px-3 py-2 text-sm sm:grid-cols-[minmax(0,1fr)_auto_auto]"
              >
                <div className="min-w-0">
                  <p className="font-medium break-words">
                    {item.unlimited ? `${item.serviceName} ilimitado` : item.serviceName}
                  </p>
                  {item.note ? (
                    <p className="mt-1 text-xs text-muted-foreground break-words">
                      {item.note}
                    </p>
                  ) : null}
                </div>
                <span className="text-muted-foreground">
                  {item.unlimited ? "Ilimitado" : `${item.quantityPerCycle}x`}
                </span>
                <span className="text-muted-foreground">
                  {item.discountPercent ? `${item.discountPercent}%` : "Sem desconto"}
                </span>
              </div>
            ))
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Beneficios adicionais"
        description="Descontos em produtos e regras complementares."
      >
        <div className="grid min-w-0 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(8rem,0.25fr)_minmax(0,1fr)_auto] md:items-end">
          <Field label="Produto *">
            <OptionSelect
              value={productDraft.productName}
              options={productOptions}
              onValueChange={(value) =>
                setProductDraft((current) => ({
                  ...current,
                  productName: value,
                }))
              }
            />
          </Field>
          <Field label="Desconto %">
            <NumberInput
              value={productDraft.discountPercent}
              suffix="%"
              onChange={(value) =>
                setProductDraft((current) => ({
                  ...current,
                  discountPercent: value,
                }))
              }
            />
          </Field>
          <Field label="Nota">
            <Input
              value={productDraft.note}
              placeholder="Ex: somente para assinantes"
              onChange={(event) =>
                setProductDraft((current) => ({
                  ...current,
                  note: event.target.value,
                }))
              }
            />
          </Field>
          <Button onClick={addProduct}>Adicionar</Button>
        </div>
        <div className="mt-4 grid gap-2">
          {productItems.length === 0 ? (
            <EmptyList>Nenhum desconto em produto adicionado.</EmptyList>
          ) : (
            productItems.map((item) => (
              <ListRow
                key={item.id}
                label={item.productName}
                value={`${item.discountPercent}%`}
              />
            ))
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="Profissionais que atendem o plano"
        description="Opcional no MVP, mas util para leitura comercial."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {professionalOptions.map((professional) => (
            <label
              key={professional}
              className="flex min-h-10 items-center gap-2 rounded-md border bg-background px-3 py-2 text-sm"
            >
              <Checkbox
                checked={selectedProfessionals.includes(professional)}
                onCheckedChange={() => toggleProfessional(professional)}
              />
              <span className="break-words">{professional}</span>
            </label>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}

function Field({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`grid min-w-0 gap-1.5 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function OptionSelect({
  value,
  options,
  onValueChange,
}: {
  value: string
  options: string[]
  onValueChange: (value: string) => void
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Selecione" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function NumberInput({
  value,
  placeholder = "0",
  suffix,
  onChange,
}: {
  value?: number
  placeholder?: string
  suffix?: string
  onChange?: (value: number) => void
}) {
  return (
    <div className="relative min-w-0">
      <Input
        type="text"
        value={value ?? ""}
        inputMode="decimal"
        placeholder={placeholder}
        className={suffix ? "pr-8" : undefined}
        onChange={(event) => onChange?.(parseNumeric(event.target.value))}
      />
      {suffix ? (
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
          {suffix}
        </span>
      ) : null}
    </div>
  )
}

function MoneyInput({
  value,
  onChange,
}: {
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div className="flex h-10 min-w-0 items-center rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring/30">
      <span className="shrink-0 pl-3 text-sm text-muted-foreground">R$</span>
      <Input
        type="text"
        value={value || ""}
        inputMode="decimal"
        placeholder="0,00"
        className="h-full border-0 pl-2 shadow-none focus-visible:ring-0"
        onChange={(event) => onChange(parseNumeric(event.target.value))}
      />
    </div>
  )
}

function EmptyList({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed bg-muted/40 px-3 py-4 text-center text-sm text-muted-foreground">
      {children}
    </div>
  )
}

function ListRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border bg-background px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between">
      <span className="font-medium break-words">{label}</span>
      <span className="text-muted-foreground">{value}</span>
    </div>
  )
}

function parseNumeric(value: string) {
  const normalized = value.replace(",", ".").replace(/[^\d.]/g, "")
  return Number(normalized) || 0
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}
