/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, type ChangeEvent, type ReactNode } from "react"
import { CheckmarkCircle01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Camera, Info, X } from "lucide-react"

import {
  formatCnpjInput,
  formatNumberInput,
  onlyDigits,
} from "@/components/admin/client-input-formatters"
import {
  FormField,
  FormGrid,
  ResponsiveActions,
} from "@/components/admin/responsive-form"
import { SectionCard } from "@/components/admin/section-card"
import { Button } from "@/components/ui/button"
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
import {
  defaultPortalSettings,
  getPortalUrl,
  normalizePortalSlug,
  readPortalSettings,
  writePortalSettings,
} from "@/lib/client-portal/settings"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { PortalImagePlacement } from "@/types/client-portal"

type PortalImageEditorState = {
  key: "bannerUrl" | "logoUrl"
  placementKey: "bannerPlacement" | "logoPlacement"
  label: "Banner" | "Logo"
  src: string
  placement: PortalImagePlacement
  aspectClassName: string
  imageClassName: string
}

const timezones = [
  "America/Manaus",
  "America/Sao_Paulo",
  "America/Boa_Vista",
  "America/Rio_Branco",
]

const toleranceOptions = ["15 minutos", "30 minutos", "1 hora", "2 horas", "24 horas"]
const penaltyOptions = ["24 horas", "3 dias", "7 dias", "15 dias", "30 dias"]

const initialCompanyForm = {
  corporateName: "Paulo Jean Barros Ferreira Junior",
  tradeName: "Studio Simetria",
  cnpj: "55.540.659/0001-22",
  email: "paulojeanbarbeiro@gmail.com",
  timezone: "America/Manaus",
  phone: "5592994592664",
  cancellationTolerance: toleranceOptions[1],
  penaltyDuration: penaltyOptions[2],
  dpoteCommission: "40",
}

export function EmpresaView() {
  const [form, setForm] = useState(initialCompanyForm)
  const [feedback, setFeedback] = useState(
    "Preencha todos os campos obrigatorios."
  )
  const [portalForm, setPortalForm] = useState(() => readPortalSettings())
  const [portalFeedback, setPortalFeedback] = useState(
    "Personalize os dados exibidos no portal do cliente."
  )
  const [imageEditor, setImageEditor] = useState<PortalImageEditorState | null>(
    null
  )

  const requiredFilled =
    form.corporateName.trim().length > 0 &&
    form.tradeName.trim().length > 0 &&
    form.cnpj.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.timezone.trim().length > 0 &&
    form.phone.trim().length > 0

  function update<Key extends keyof typeof form>(
    key: Key,
    value: (typeof form)[Key]
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function saveCompany() {
    if (!requiredFilled) {
      setFeedback("Revise os campos obrigatorios antes de salvar.")
      return
    }

    setFeedback("Dados da empresa salvos.")
  }

  function updatePortal<Key extends keyof typeof portalForm>(
    key: Key,
    value: (typeof portalForm)[Key]
  ) {
    setPortalForm((current) => ({ ...current, [key]: value }))
  }

  function getPreparedPortalSettings() {
    const normalizedSlug =
      normalizePortalSlug(portalForm.slug) || defaultPortalSettings.slug
    const validColor = /^#[0-9a-fA-F]{6}$/.test(portalForm.primaryColor)

    return {
      ...portalForm,
      slug: normalizedSlug,
      name: portalForm.name.trim() || defaultPortalSettings.name,
      slogan: portalForm.slogan.trim() || defaultPortalSettings.slogan,
      description:
        portalForm.description.trim() || defaultPortalSettings.description,
      bannerUrl: portalForm.bannerUrl.trim() || defaultPortalSettings.bannerUrl,
      logoUrl: portalForm.logoUrl.trim() || defaultPortalSettings.logoUrl,
      primaryColor: validColor
        ? portalForm.primaryColor
        : defaultPortalSettings.primaryColor,
    }
  }

  function savePortalSettings() {
    const nextSettings = getPreparedPortalSettings()
    setPortalForm(nextSettings)
    writePortalSettings(nextSettings)
    setPortalFeedback("Personalizacao do portal salva.")
  }

  function openPortal() {
    const nextSettings = getPreparedPortalSettings()
    setPortalForm(nextSettings)
    writePortalSettings(nextSettings)
    setPortalFeedback("Personalizacao do portal salva.")
    window.open(getPortalUrl(nextSettings.slug), "_blank", "noopener,noreferrer")
  }

  function handlePortalImageUpload(
    event: ChangeEvent<HTMLInputElement>,
    key: "bannerUrl" | "logoUrl",
    label: "Banner" | "Logo"
  ) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== "string") return
      openImageEditor(key, label, reader.result)
      event.target.value = ""
    }
    reader.readAsDataURL(file)
  }

  function openImageEditor(
    key: "bannerUrl" | "logoUrl",
    label: "Banner" | "Logo",
    src = portalForm[key]
  ) {
    const isBanner = key === "bannerUrl"
    setImageEditor({
      key,
      placementKey: isBanner ? "bannerPlacement" : "logoPlacement",
      label,
      src,
      placement: isBanner
        ? { ...portalForm.bannerPlacement }
        : { ...portalForm.logoPlacement },
      aspectClassName: isBanner
        ? "aspect-[16/5] w-full"
        : "aspect-square w-full max-w-56",
      imageClassName: isBanner ? "rounded-2xl" : "rounded-[2rem]",
    })
  }

  function applyImageEditor() {
    if (!imageEditor) return

    setPortalForm((current) => ({
      ...current,
      [imageEditor.key]: imageEditor.src,
      [imageEditor.placementKey]: imageEditor.placement,
    }))
    setPortalFeedback(`${imageEditor.label} ajustado. Salve para atualizar o portal.`)
    setImageEditor(null)
  }

  function removePortalImage(key: "bannerUrl" | "logoUrl") {
    const isBanner = key === "bannerUrl"
    setPortalForm((current) => ({
      ...current,
      [key]: isBanner
        ? defaultPortalSettings.bannerUrl
        : defaultPortalSettings.logoUrl,
      [isBanner ? "bannerPlacement" : "logoPlacement"]: isBanner
        ? defaultPortalSettings.bannerPlacement
        : defaultPortalSettings.logoPlacement,
    }))
    setPortalFeedback(
      `${isBanner ? "Banner" : "Logo"} removido. Salve para atualizar o portal.`
    )
  }

  const safePortalPrimaryColor = /^#[0-9a-fA-F]{6}$/.test(
    portalForm.primaryColor
  )
    ? portalForm.primaryColor
    : defaultPortalSettings.primaryColor

  return (
    <>
      <SectionCard
        title="Dados"
        description="Preencha todos os campos obrigatorios."
        action={
          <Button size="sm" onClick={saveCompany}>
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} />
            Salvar alteracoes
          </Button>
        }
      >
        <FormGrid>
          <FormField label="Razao social *">
            <Input
              value={form.corporateName}
              onChange={(event) => update("corporateName", event.target.value)}
            />
          </FormField>
          <FormField label="Nome fantasia *">
            <Input
              value={form.tradeName}
              onChange={(event) => update("tradeName", event.target.value)}
            />
          </FormField>
          <FormField label="CNPJ *">
            <Input
              value={form.cnpj}
              inputMode="numeric"
              onChange={(event) =>
                update("cnpj", formatCnpjInput(event.target.value))
              }
            />
          </FormField>
          <FormField label="Email *">
            <Input
              value={form.email}
              type="email"
              onChange={(event) => update("email", event.target.value)}
            />
          </FormField>
          <FormField label="Fuso horario *">
            <Select
              value={form.timezone}
              onValueChange={(value) => update("timezone", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timezones.map((timezone) => (
                  <SelectItem key={timezone} value={timezone}>
                    {timezone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Telefone *">
            <Input
              value={form.phone}
              inputMode="numeric"
              onChange={(event) =>
                update("phone", onlyDigits(event.target.value, 13))
              }
            />
          </FormField>
        </FormGrid>

        <FeedbackMessage>{feedback}</FeedbackMessage>
      </SectionCard>

      <SectionCard
        title="Personalizacao do portal"
        description="Configure o que o cliente ve ao acessar o portal de agendamento."
        action={
          <Button type="button" size="sm" variant="outline" onClick={openPortal}>
            Acessar portal
          </Button>
        }
      >
        <FormGrid>
          <FormField label="Nome da barbearia *">
            <Input
              value={portalForm.name}
              onChange={(event) => updatePortal("name", event.target.value)}
            />
          </FormField>
          <FormField label="Slug da URL *">
            <Input
              value={portalForm.slug}
              onChange={(event) =>
                updatePortal("slug", normalizePortalSlug(event.target.value))
              }
            />
          </FormField>
          <FormField label="Slogan *">
            <Input
              value={portalForm.slogan}
              onChange={(event) => updatePortal("slogan", event.target.value)}
            />
          </FormField>
          <FormField label="Descricao *" className="sm:col-span-2">
            <Input
              value={portalForm.description}
              onChange={(event) =>
                updatePortal("description", event.target.value)
              }
            />
          </FormField>
          <FormField label="Cor primaria *" className="sm:col-span-2">
            <div className="grid gap-2 sm:grid-cols-[5rem_minmax(0,1fr)]">
              <Input
                type="color"
                value={safePortalPrimaryColor}
                onChange={(event) =>
                  updatePortal("primaryColor", event.target.value)
                }
                className="h-10 w-full p-1"
              />
              <Input
                value={portalForm.primaryColor}
                onChange={(event) =>
                  updatePortal("primaryColor", event.target.value)
                }
              />
            </div>
          </FormField>
        </FormGrid>

        <div className="mt-5 grid gap-5">
          <PortalImageUploadSection
            title="Banner"
            description="O banner deve possuir boa resolucao para ocupar o topo do portal."
            buttonLabel="Adicionar banner"
            imageUrl={portalForm.bannerUrl}
            placement={portalForm.bannerPlacement}
            imageClassName="aspect-[16/5] w-full max-w-2xl rounded-t-lg"
            actionsClassName="w-full max-w-2xl rounded-b-lg"
            onUpload={(event) =>
              handlePortalImageUpload(event, "bannerUrl", "Banner")
            }
            onEdit={() => openImageEditor("bannerUrl", "Banner")}
            onRemove={() => removePortalImage("bannerUrl")}
          />
          <PortalImageUploadSection
            title="Logo"
            description="A logo deve possuir as dimensoes de 1024 x 1024 pixels."
            buttonLabel="Adicionar logo"
            imageUrl={portalForm.logoUrl}
            placement={portalForm.logoPlacement}
            imageClassName="aspect-square w-full max-w-sm rounded-t-lg"
            actionsClassName="w-full max-w-sm rounded-b-lg"
            onUpload={(event) =>
              handlePortalImageUpload(event, "logoUrl", "Logo")
            }
            onEdit={() => openImageEditor("logoUrl", "Logo")}
            onRemove={() => removePortalImage("logoUrl")}
          />
        </div>

        <ResponsiveActions className="mt-5 border-t pt-5">
          <Button type="button" onClick={savePortalSettings}>
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} />
            Salvar personalizacao
          </Button>
        </ResponsiveActions>

        <FeedbackMessage>{portalFeedback}</FeedbackMessage>
      </SectionCard>

      <PortalImageEditorDialog
        editor={imageEditor}
        onEditorChange={setImageEditor}
        onCancel={() => setImageEditor(null)}
        onApply={applyImageEditor}
      />

      <SectionCard
        title="Regras de tolerancia e penalidade"
        description="Preencha todos os campos obrigatorios"
      >
        <FormGrid>
          <FormField label="Tolerancia de cancelamento *">
            <Select
              value={form.cancellationTolerance}
              onValueChange={(value) => update("cancellationTolerance", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {toleranceOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="Duracao da penalidade *">
            <Select
              value={form.penaltyDuration}
              onValueChange={(value) => update("penaltyDuration", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {penaltyOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormField>
        </FormGrid>
      </SectionCard>

      <SectionCard
        title="Configuracoes modulo Dpote"
        description="Apenas para assinantes Dpote"
      >
        <FormGrid>
          <FormField label="Comissao (%) *">
            <Input
              value={form.dpoteCommission}
              inputMode="numeric"
              onChange={(event) =>
                update("dpoteCommission", formatNumberInput(event.target.value))
              }
            />
          </FormField>
        </FormGrid>
      </SectionCard>
    </>
  )
}

function PortalImageEditorDialog({
  editor,
  onEditorChange,
  onCancel,
  onApply,
}: {
  editor: PortalImageEditorState | null
  onEditorChange: (editor: PortalImageEditorState | null) => void
  onCancel: () => void
  onApply: () => void
}) {
  function updatePlacement(key: keyof PortalImagePlacement, value: number) {
    if (!editor) return

    onEditorChange({
      ...editor,
      placement: {
        ...editor.placement,
        [key]: value,
      },
    })
  }

  return (
    <Dialog open={Boolean(editor)} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Ajustar {editor?.label.toLowerCase() ?? "imagem"}
          </DialogTitle>
          <DialogDescription>
            Posicione e aproxime a imagem antes de aplicar no portal.
          </DialogDescription>
        </DialogHeader>

        {editor ? (
          <DialogBody className="space-y-5">
            <div
              className={`mx-auto overflow-hidden border bg-muted shadow-sm ${editor.aspectClassName} ${editor.imageClassName}`}
            >
              <img
                src={editor.src}
                alt={`Edicao de ${editor.label.toLowerCase()}`}
                className="size-full object-cover"
                style={{
                  objectPosition: `${editor.placement.x}% ${editor.placement.y}%`,
                  transform: `scale(${editor.placement.zoom})`,
                }}
              />
            </div>

            <div className="grid gap-4">
              <RangeField
                label="Horizontal"
                value={editor.placement.x}
                min={0}
                max={100}
                step={1}
                onChange={(value) => updatePlacement("x", value)}
              />
              <RangeField
                label="Vertical"
                value={editor.placement.y}
                min={0}
                max={100}
                step={1}
                onChange={(value) => updatePlacement("y", value)}
              />
              <RangeField
                label="Zoom"
                value={editor.placement.zoom}
                min={1}
                max={2}
                step={0.05}
                onChange={(value) => updatePlacement("zoom", value)}
              />
            </div>
          </DialogBody>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="button" onClick={onApply}>
            Aplicar imagem
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function PortalImageUploadSection({
  title,
  description,
  buttonLabel,
  imageUrl,
  placement,
  imageClassName,
  actionsClassName,
  onUpload,
  onEdit,
  onRemove,
}: {
  title: string
  description: string
  buttonLabel: string
  imageUrl: string
  placement: PortalImagePlacement
  imageClassName: string
  actionsClassName: string
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void
  onEdit: () => void
  onRemove: () => void
}) {
  return (
    <section className="overflow-hidden rounded-lg border bg-background">
      <div className="flex flex-wrap items-center gap-1.5 border-b px-4 py-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
        <Info className="size-4 text-muted-foreground" aria-hidden="true" />
      </div>
      <div className="space-y-6 p-4">
        <div>
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
        </div>

        <div className="mx-auto">
          <div className={`mx-auto overflow-hidden ${imageClassName}`}>
            <img
              src={imageUrl}
              alt={title}
              className="size-full object-cover"
              style={{
                objectPosition: `${placement.x}% ${placement.y}%`,
                transform: `scale(${placement.zoom})`,
              }}
            />
          </div>
          <div className={`mx-auto grid ${actionsClassName}`}>
            <button
              type="button"
              onClick={onRemove}
              className="flex min-h-10 items-center justify-center gap-2 bg-pink-500 px-3 text-sm font-semibold text-white transition-colors hover:bg-pink-600"
            >
              <X className="size-4" />
              Remover
            </button>
          </div>
        </div>

        <ResponsiveActions>
          <Button type="button" variant="outline" onClick={onEdit}>
            Editar enquadramento
          </Button>
        </ResponsiveActions>
      </div>
    </section>
  )
}

function RangeField({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  onChange: (value: number) => void
}) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="flex items-center justify-between gap-3">
        <span className="font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">
          {label === "Zoom" ? `${value.toFixed(2)}x` : `${Math.round(value)}%`}
        </span>
      </span>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer accent-primary"
      />
    </label>
  )
}

function FeedbackMessage({ children }: { children: ReactNode }) {
  return (
    <div className="mt-5 rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
      {children}
    </div>
  )
}
