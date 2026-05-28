"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  ArrowDown01Icon,
  ArrowUp01Icon,
  EyeIcon,
  File01Icon,
  PlusSignCircleIcon,
  PlusSignIcon,
  ScissorIcon,
  Search01Icon,
  StarIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { database } from "@/components/admin/database"
import { EmptyState } from "@/components/admin/empty-state"
import {
  serviceCatalog,
  type ServiceCatalogItem,
  type ServiceStatus,
} from "@/components/admin/catalog-data"
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { MetricCard } from "@/components/admin/metric-card"
import {
  FormField,
  FormGrid,
  ResponsiveActions,
} from "@/components/admin/responsive-form"
import { SectionCard } from "@/components/admin/section-card"
import { SimpleTable } from "@/components/admin/simple-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const initialCreateForm = {
  name: "",
  description: "",
  internalDescription: "",
  durationMinutes: "",
  price: "",
  credits: "",
  repurchaseDays: "",
  category: "",
  professionalIds: [] as number[],
  portalVisible: true,
  onlineBookable: true,
  canBeInPlan: true,
  requiresProfessionalSelection: false,
  startingFrom: false,
  hidden: false,
  fitIn: false,
  notes: "",
  popularityCount: "",
  revenueGenerated: "",
}

export function ServicosOverview() {
  const activeServices = serviceCatalog.filter(
    (service) => service.status === "Ativo" && !service.hidden
  )
  const portalServices = activeServices.filter(
    (service) => service.portalVisible !== false && service.onlineBookable !== false
  )
  const planEligibleServices = activeServices.filter(
    (service) => service.canBeInPlan !== false
  )
  const featuredServices = serviceCatalog.filter((service) => service.featured)
  const averageDuration = activeServices.length
    ? Math.round(
        activeServices.reduce(
          (sum, service) => sum + service.durationMinutes,
          0
        ) / activeServices.length
      )
    : 0
  const estimatedRevenue = activeServices.reduce(
    (sum, service) => sum + (service.revenueGenerated ?? 0),
    0
  )

  return (
    <>
      <div className="admin-metric-grid">
        <MetricCard
          title="Servicos ativos"
          value={String(activeServices.length)}
          change={`${database.company.serviceCategories.length} categorias cadastradas`}
          icon={ScissorIcon}
          tone="green"
        />
        <MetricCard
          title="Em alta"
          value={String(featuredServices.length)}
          change="Servicos destacados na exibicao"
          icon={StarIcon}
          tone="blue"
        />
        <MetricCard
          title="Portal visivel"
          value={String(portalServices.length)}
          change="Servicos liberados para agendamento online"
          icon={EyeIcon}
          tone="green"
        />
        <MetricCard
          title="Plano elegivel"
          value={String(planEligibleServices.length)}
          change="Servicos que entram em beneficios"
          icon={PlusSignCircleIcon}
          tone="amber"
        />
        <MetricCard
          title="Duracao media"
          value={`${averageDuration} min`}
          change="Base dos atendimentos ativos"
          icon={ScissorIcon}
          tone="blue"
        />
        <MetricCard
          title="Receita estimada"
          value={formatCurrency(estimatedRevenue)}
          change="Somatorio mockado dos servicos ativos"
          icon={ScissorIcon}
          tone="blue"
        />
      </div>

      <SectionCard
        title="Servicos"
        description="Cadastro, exibicao e listagem operacional"
      >
        <div className="grid gap-3 md:grid-cols-3">
          <ModuleLink
            href="/servicos/cadastrar"
            icon={PlusSignCircleIcon}
            title="Cadastrar servicos"
            description="Criar novo servico, preco, fichas e regras."
          />
          <ModuleLink
            href="/servicos/exibicao"
            icon={EyeIcon}
            title="Exibicao de servicos"
            description="Ordenar, ocultar e destacar servicos em alta."
          />
          <ModuleLink
            href="/servicos/listagem"
            icon={File01Icon}
            title="Listagem de servicos"
            description="Pesquisar registros, status e datas de alteracao."
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Catalogo de servicos"
        description="Preco, duracao, portal, planos e profissionais habilitados"
        action={
          <Button size="sm" asChild>
            <Link href="/servicos/cadastrar">
              <HugeiconsIcon icon={PlusSignCircleIcon} size={16} />
              Novo servico
            </Link>
          </Button>
        }
      >
        <SimpleTable
          columns={[
            "Servico",
            "Portal",
            "Plano",
            "Profissionais",
            "Duracao",
            "Status",
          ]}
          rows={activeServices
            .slice(0, 8)
            .map((service) => [
              <div key={service.id} className="space-y-1">
                <p className="font-semibold">{service.name}</p>
                <p className="text-xs text-muted-foreground">{service.category}</p>
              </div>,
              <StatusBadge
                key={`${service.id}-portal`}
                tone={service.portalVisible === false || service.hidden ? "neutral" : "green"}
              >
                {service.portalVisible === false || service.hidden ? "Nao" : "Sim"}
              </StatusBadge>,
              <StatusBadge
                key={`${service.id}-plan`}
                tone={service.canBeInPlan === false ? "neutral" : "amber"}
              >
                {service.canBeInPlan === false ? "Nao" : "Sim"}
              </StatusBadge>,
              service.professionals,
              <div key={`${service.id}-duration`} className="space-y-1">
                <p className="font-semibold">{service.duration}</p>
                <p className="text-xs text-muted-foreground">
                  {service.startingFrom
                    ? `A partir de ${formatCurrency(service.price)}`
                    : formatCurrency(service.price)}
                </p>
              </div>,
              <ServiceStatusBadge key={service.id} status={service.status} />,
            ])}
        />
      </SectionCard>
    </>
  )
}

export function CriarServicoView() {
  const [form, setForm] = useState(initialCreateForm)
  const [categories, setCategories] = useState<string[]>(
    database.company.serviceCategories
  )
  const [newCategoryModalOpen, setNewCategoryModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [feedback, setFeedback] = useState(
    "Preencha todos os campos obrigatorios."
  )
  const canSubmit =
    form.name.trim().length > 0 &&
    Number(form.durationMinutes) > 0 &&
    Number(form.price) >= 0 &&
    form.category.length > 0

  function update<Key extends keyof typeof form>(
    key: Key,
    value: (typeof form)[Key]
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function addCategory() {
    if (!newCategoryName.trim()) return
    const category = newCategoryName.trim()
    if (!categories.includes(category)) {
      const nextCategories = [...categories, category]
      setCategories(nextCategories)
      database.company.serviceCategories = nextCategories
    }
    update("category", category)
    setNewCategoryName("")
    setNewCategoryModalOpen(false)
  }

  function createService() {
    if (!canSubmit) {
      setFeedback(
        "Nome, duracao, valor e categoria sao obrigatorios. A listagem operacional aparece apos salvar."
      )
      return
    }

    setFeedback(
      `Servico "${form.name.trim()}" preparado: ${form.portalVisible ? "visivel no portal" : "apenas interno"}, ${form.canBeInPlan ? "pode entrar em plano" : "fora do plano"}.`
    )
    setForm(initialCreateForm)
  }

  return (
    <SectionCard
      title="Criar novo servico"
      description="Dados. Preencha todos os campos obrigatorios."
      action={
        <Button size="sm" onClick={createService}>
          <HugeiconsIcon icon={PlusSignCircleIcon} size={16} />
          Criar servico
        </Button>
      }
    >
      <FormGrid>
        <FormField label="Nome *">
          <Input
            value={form.name}
            placeholder="Ex.: Corte e Barba Visagismo"
            onChange={(event) => update("name", event.target.value)}
          />
        </FormField>
        <FormField label="Categoria *">
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex-1 min-w-0">
              <Select
                value={form.category}
                onValueChange={(value) => update("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.length === 0 ? (
                    <div className="p-2 text-xs text-muted-foreground text-center">
                      Nenhuma categoria cadastrada
                    </div>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              className="w-full sm:w-auto shrink-0"
              onClick={() => setNewCategoryModalOpen(true)}
            >
              <HugeiconsIcon icon={PlusSignIcon} size={16} />
              Nova categoria
            </Button>
          </div>
        </FormField>
        <FormField label="Duracao (minutos) *">
          <Input
            value={form.durationMinutes}
            inputMode="numeric"
            type="number"
            min={1}
            placeholder="45"
            onChange={(event) => update("durationMinutes", event.target.value)}
          />
        </FormField>
        <FormField label="Valor *">
          <Input
            value={form.price}
            inputMode="decimal"
            type="number"
            min={0}
            step="0.01"
            placeholder="65,00"
            onChange={(event) => update("price", event.target.value)}
          />
        </FormField>
        <FormField label="Valor em fichas">
          <Input
            value={form.credits}
            inputMode="numeric"
            type="number"
            min={0}
            placeholder="1"
            onChange={(event) => update("credits", event.target.value)}
          />
        </FormField>
        <FormField label="Periodo para recompra (em dias)">
          <Input
            value={form.repurchaseDays}
            inputMode="numeric"
            type="number"
            min={0}
            placeholder="30"
            onChange={(event) => update("repurchaseDays", event.target.value)}
          />
        </FormField>
        <div className="col-span-full">
          <FormField label="Descricao para o cliente">
            <Input
              value={form.description}
              placeholder="Ex.: corte tradicional com acabamento limpo"
              onChange={(event) => update("description", event.target.value)}
            />
          </FormField>
        </div>
        <div className="col-span-full">
          <FormField label="Descricao interna">
            <Input
              value={form.internalDescription}
              placeholder="Uso no painel e no atendimento interno"
              onChange={(event) =>
                update("internalDescription", event.target.value)
              }
            />
          </FormField>
        </div>
        <div className="col-span-full">
          <FormField label="Profissionais que realizam">
            <div className="grid gap-2 md:grid-cols-2">
              {database.professionals
                .filter((professional) => professional.status === "Ativo")
                .map((professional) => {
                  const checked = form.professionalIds.includes(professional.id)

                  return (
                    <label
                      key={professional.id}
                      className="flex min-w-0 items-center gap-2 rounded-md border bg-muted/20 px-3 py-2 text-sm"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() =>
                          setForm((current) => {
                            const nextIds = checked
                              ? current.professionalIds.filter(
                                  (id) => id !== professional.id
                                )
                              : [...current.professionalIds, professional.id]

                            return { ...current, professionalIds: nextIds }
                          })
                        }
                      />
                      <span className="min-w-0">
                        <span className="block font-medium">
                          {professional.name}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          {professional.role}
                        </span>
                      </span>
                    </label>
                  )
                })}
            </div>
          </FormField>
        </div>
        <div className="col-span-full">
          <FormField label="Observacoes e popularidade">
            <div className="grid gap-3 md:grid-cols-3">
              <Input
                value={form.popularityCount}
                inputMode="numeric"
                placeholder="Atendimentos"
                onChange={(event) => update("popularityCount", event.target.value)}
              />
              <Input
                value={form.revenueGenerated}
                inputMode="numeric"
                placeholder="Receita estimada"
                onChange={(event) =>
                  update("revenueGenerated", event.target.value)
                }
              />
              <Textarea
                value={form.notes}
                placeholder="Observacoes internas"
                onChange={(event) => update("notes", event.target.value)}
              />
            </div>
          </FormField>
        </div>
      </FormGrid>

      <div className="mt-5 grid gap-3 border-t pt-5 sm:grid-cols-2 xl:grid-cols-4">
        <BooleanField
          label="Disponivel no portal"
          checked={form.portalVisible}
          onCheckedChange={(checked) => update("portalVisible", checked)}
        />
        <BooleanField
          label="Agendamento online"
          checked={form.onlineBookable}
          onCheckedChange={(checked) => update("onlineBookable", checked)}
        />
        <BooleanField
          label="Pode entrar em plano"
          checked={form.canBeInPlan}
          onCheckedChange={(checked) => update("canBeInPlan", checked)}
        />
        <BooleanField
          label="Exige profissional"
          checked={form.requiresProfessionalSelection}
          onCheckedChange={(checked) =>
            update("requiresProfessionalSelection", checked)
          }
        />
        <BooleanField
          label="A partir de"
          checked={form.startingFrom}
          onCheckedChange={(checked) => update("startingFrom", checked)}
        />
        <BooleanField
          label="Oculto"
          checked={form.hidden}
          onCheckedChange={(checked) => update("hidden", checked)}
        />
        <BooleanField
          label="Servico de encaixe"
          checked={form.fitIn}
          onCheckedChange={(checked) => update("fitIn", checked)}
        />
      </div>

      <div className="mt-5 rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
        {feedback}
      </div>

      <Dialog open={newCategoryModalOpen} onOpenChange={setNewCategoryModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova categoria</DialogTitle>
            <DialogDescription>
              Cadastre uma nova categoria para organizar seus servicos.
            </DialogDescription>
          </DialogHeader>
          <DialogBody>
            <div className="grid gap-2">
              <Label htmlFor="category-name">Nome da categoria</Label>
              <Input
                id="category-name"
                value={newCategoryName}
                placeholder="Ex: Corte de Cabelo"
                onChange={(event) => setNewCategoryName(event.target.value)}
                onKeyDown={(event) =>
                  event.key === "Enter" && addCategory()
                }
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setNewCategoryModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={addCategory}>Adicionar categoria</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SectionCard>
  )
}

export function ExibicaoServicosView() {
  const [items, setItems] = useState(
    serviceCatalog.slice().sort((a, b) => a.order - b.order)
  )
  const activeItems = items.filter((service) => service.status === "Ativo")

  function moveService(id: number, direction: -1 | 1) {
    setItems((current) => {
      const index = current.findIndex((service) => service.id === id)
      const nextIndex = index + direction

      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current
      }

      const next = current.slice()
      const [service] = next.splice(index, 1)
      next.splice(nextIndex, 0, service)

      return next.map((item, itemIndex) => ({ ...item, order: itemIndex + 1 }))
    })
  }

  function toggleFeatured(id: number) {
    setItems((current) =>
      current.map((service) =>
        service.id === id
          ? { ...service, featured: !service.featured }
          : service
      )
    )
  }

  function toggleHidden(id: number) {
    setItems((current) =>
      current.map((service) =>
        service.id === id ? { ...service, hidden: !service.hidden } : service
      )
    )
  }

  return (
    <SectionCard
      title="Ordenar e destacar servicos"
      description="Registros ativos. Servicos no sistema."
    >
      <div className="grid gap-2">
        <div className="hidden grid-cols-[4rem_minmax(0,1fr)_7rem_7rem_7rem_16rem] gap-3 rounded-md bg-muted/60 px-4 py-3 text-xs font-semibold text-muted-foreground uppercase md:grid">
          <span>Ordem</span>
          <span>Nome</span>
          <span>Em alta</span>
          <span>Visivel</span>
          <span>Plano</span>
          <span className="text-right">Opcoes</span>
        </div>

        {activeItems.length === 0 ? (
          <EmptyState
            icon={ScissorIcon}
            title="Nenhum serviço ativo"
            description="Seu cardápio de serviços está vazio. Comece cadastrando um serviço acima."
            className="mt-2"
          />
        ) : (
          activeItems.map((service, index) => (
          <article
            key={service.id}
            className="grid min-w-0 gap-3 rounded-md border bg-background p-3 md:grid-cols-[4rem_minmax(0,1fr)_7rem_7rem_7rem_16rem] md:items-center md:px-4"
          >
            <div className="flex items-center justify-between gap-3 md:block">
              <span className="text-xs font-semibold text-muted-foreground md:hidden">
                Ordem
              </span>
              <span className="font-semibold">#{index + 1}</span>
            </div>

            <div className="min-w-0">
              <p className="font-medium break-words md:truncate">
                {service.name}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {service.category} · {service.duration}
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 md:block">
              <span className="text-xs font-semibold text-muted-foreground md:hidden">
                Em alta
              </span>
              <StatusBadge tone={service.featured ? "amber" : "neutral"}>
                {service.featured ? "Sim" : "Nao"}
              </StatusBadge>
            </div>

            <div className="flex items-center justify-between gap-3 md:block">
              <span className="text-xs font-semibold text-muted-foreground md:hidden">
                Visivel
              </span>
              <StatusBadge tone={service.hidden ? "neutral" : "green"}>
                {service.hidden ? "Oculto" : "Sim"}
              </StatusBadge>
            </div>

            <div className="flex items-center justify-between gap-3 md:block">
              <span className="text-xs font-semibold text-muted-foreground md:hidden">
                Plano
              </span>
              <StatusBadge tone={service.canBeInPlan === false ? "neutral" : "amber"}>
                {service.canBeInPlan === false ? "Nao" : "Sim"}
              </StatusBadge>
            </div>

            <div className="grid min-w-0 grid-cols-2 gap-2 sm:flex sm:flex-wrap md:justify-end">
              <Button
                size="icon-sm"
                variant="outline"
                aria-label={`Subir ${service.name}`}
                disabled={index === 0}
                onClick={() => moveService(service.id, -1)}
              >
                <HugeiconsIcon icon={ArrowUp01Icon} size={14} />
              </Button>
              <Button
                size="icon-sm"
                variant="outline"
                aria-label={`Descer ${service.name}`}
                disabled={index === activeItems.length - 1}
                onClick={() => moveService(service.id, 1)}
              >
                <HugeiconsIcon icon={ArrowDown01Icon} size={14} />
              </Button>
              <Button size="xs" onClick={() => toggleFeatured(service.id)}>
                {service.featured ? "Remover" : "Em alta"}
              </Button>
              <Button
                size="xs"
                variant="outline"
                onClick={() => toggleHidden(service.id)}
              >
                {service.hidden ? "Exibir" : "Ocultar"}
              </Button>
            </div>
          </article>
        )))}
      </div>
    </SectionCard>
  )
}

export function ListagemServicosView() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<"todos" | ServiceStatus>("todos")
  const [showInactive, setShowInactive] = useState(false)
  const [portalFilter, setPortalFilter] = useState<"todos" | "sim" | "nao">(
    "todos"
  )
  const [planFilter, setPlanFilter] = useState<"todos" | "sim" | "nao">("todos")
  const [categoryFilter, setCategoryFilter] = useState("todos")
  const [detailsService, setDetailsService] =
    useState<ServiceCatalogItem | null>(null)

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return serviceCatalog.filter((service) => {
      const matchesInactive = showInactive || service.status === "Ativo"
      const matchesStatus = status === "todos" || service.status === status
      const matchesPortal =
        portalFilter === "todos" ||
        (portalFilter === "sim"
          ? service.portalVisible !== false && !service.hidden
          : service.portalVisible === false || service.hidden)
      const matchesPlan =
        planFilter === "todos" ||
        (planFilter === "sim"
          ? service.canBeInPlan !== false
          : service.canBeInPlan === false)
      const matchesCategory =
        categoryFilter === "todos" || service.category === categoryFilter
      const matchesQuery =
        !normalizedQuery ||
        service.name.toLowerCase().includes(normalizedQuery) ||
        String(service.id).includes(normalizedQuery) ||
        service.category.toLowerCase().includes(normalizedQuery) ||
        service.professionals.toLowerCase().includes(normalizedQuery)

      return (
        matchesInactive &&
        matchesStatus &&
        matchesPortal &&
        matchesPlan &&
        matchesCategory &&
        matchesQuery
      )
    })
  }, [categoryFilter, planFilter, portalFilter, query, showInactive, status])

  return (
    <>
      <SectionCard
        title="Servicos"
        description="Filtros. Preencha os filtros abaixo."
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4 md:items-end">
          <FormField label="Pesquise">
            <div className="flex h-10 items-center gap-2 rounded-md border bg-background px-3">
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                className="shrink-0 text-muted-foreground"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pesquise..."
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
          </FormField>
          <FormField label="Status">
            <Select
              value={status}
              onValueChange={(value) =>
                setStatus(value as "todos" | ServiceStatus)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Portal">
            <Select
              value={portalFilter}
              onValueChange={(value) =>
                setPortalFilter(value as "todos" | "sim" | "nao")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Portal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="sim">Visiveis</SelectItem>
                <SelectItem value="nao">Ocultos</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Plano">
            <Select
              value={planFilter}
              onValueChange={(value) =>
                setPlanFilter(value as "todos" | "sim" | "nao")
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="sim">Entra em plano</SelectItem>
                <SelectItem value="nao">Fora do plano</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Categoria">
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                {database.company.serviceCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </div>
        <label className="mt-4 flex items-center gap-2 text-sm font-medium">
          <Checkbox
            checked={showInactive}
            onCheckedChange={(checked) => setShowInactive(Boolean(checked))}
          />
          Mostrar registros inativos?
        </label>
      </SectionCard>

      <SectionCard title="Registros Ativos" description="Servicos do sistema.">
        <SimpleTable
          columns={[
            "ID",
            "Nome",
            "Portal",
            "Plano",
            "Categoria",
            "Status",
            "Opcoes",
          ]}
          rows={filteredServices.map((service) => [
            service.id,
            service.name,
            <StatusBadge
              key={`${service.id}-portal`}
              tone={service.portalVisible === false || service.hidden ? "neutral" : "green"}
            >
              {service.portalVisible === false || service.hidden ? "Nao" : "Sim"}
            </StatusBadge>,
            <StatusBadge
              key={`${service.id}-plan`}
              tone={service.canBeInPlan === false ? "neutral" : "amber"}
            >
              {service.canBeInPlan === false ? "Nao" : "Sim"}
            </StatusBadge>,
            service.category,
            <ServiceStatusBadge key="status" status={service.status} />,
            <ResponsiveActions key="actions">
              <Button size="xs" variant="outline" onClick={() => setDetailsService(service)}>
                Detalhes
              </Button>
              <Button size="xs" variant="outline">
                Editar
              </Button>
              <Button
                size="xs"
                variant="outline"
                onClick={() => setDetailsService(service)}
              >
                {service.hidden ? "Exibir" : "Ocultar"}
              </Button>
            </ResponsiveActions>,
          ])}
        />
      </SectionCard>

      <Dialog
        open={Boolean(detailsService)}
        onOpenChange={(open) => !open && setDetailsService(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{detailsService?.name}</DialogTitle>
            <DialogDescription>
              Visao operacional do servico, portal, plano e profissionais.
            </DialogDescription>
          </DialogHeader>
          {detailsService ? (
            <DialogBody className="grid gap-4 md:grid-cols-2">
              <InfoBlock label="Categoria" value={detailsService.category} />
              <InfoBlock
                label="Preco"
                value={formatCurrency(detailsService.price)}
              />
              <InfoBlock label="Duracao" value={detailsService.duration} />
              <InfoBlock
                label="Portal"
                value={
                  detailsService.portalVisible === false || detailsService.hidden
                    ? "Nao aparece no portal"
                    : "Aparece no portal"
                }
              />
              <InfoBlock
                label="Plano"
                value={
                  detailsService.canBeInPlan === false
                    ? "Nao entra em plano"
                    : "Pode entrar em plano"
                }
              />
              <InfoBlock
                label="Profissionais"
                value={detailsService.professionals}
              />
              <InfoBlock
                label="Popularidade"
                value={`${detailsService.popularityCount ?? 0} atendimentos`}
              />
              <InfoBlock
                label="Receita estimada"
                value={formatCurrency(detailsService.revenueGenerated ?? 0)}
              />
              <div className="md:col-span-2">
                <InfoBlock
                  label="Descricao"
                  value={detailsService.description || "Sem descricao"}
                />
              </div>
              <div className="md:col-span-2">
                <InfoBlock
                  label="Observacoes"
                  value={detailsService.internalNotes || "Sem observacoes"}
                />
              </div>
            </DialogBody>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDetailsService(null)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ModuleLink({
  href,
  icon,
  title,
  description,
}: {
  href: string
  icon: IconSvgElement
  title: string
  description: string
}) {
  return (
    <Link
      href={href}
      className="premium-card grid min-w-0 gap-3 rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-muted/40"
    >
      <span className="flex size-10 items-center justify-center rounded-md bg-primary/15 text-primary">
        <HugeiconsIcon icon={icon} size={20} />
      </span>
      <span className="min-w-0">
        <span className="block font-semibold">{title}</span>
        <span className="mt-1 block text-sm leading-snug text-muted-foreground">
          {description}
        </span>
      </span>
    </Link>
  )
}

function BooleanField({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <label className="flex min-w-0 items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm font-medium">
      <Checkbox
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(Boolean(value))}
      />
      <span>{label}</span>
    </label>
  )
}

function ServiceStatusBadge({
  status,
}: {
  status: ServiceCatalogItem["status"]
}) {
  return (
    <StatusBadge tone={status === "Ativo" ? "green" : "neutral"}>
      {status}
    </StatusBadge>
  )
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border bg-muted/20 p-3">
      <p className="text-xs font-semibold uppercase text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium break-words">{value}</p>
    </div>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}
