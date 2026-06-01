/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, type ChangeEvent, type ReactNode } from "react"
import { CheckmarkCircle01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Camera, X } from "lucide-react"

import {
  formatCnpjCpfInput,
  isValidCnpj,
  isValidCpf,
  isValidEmail,
  isValidPhone,
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
import { clearPortalAuth } from "@/lib/client-portal/portal-auth"
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
  companyName: "Studio Simetria",
  documentType: "CNPJ" as "CPF" | "CNPJ",
  cnpjCpf: "55.540.659/0001-22",
  email: "paulojeanbarbeiro@gmail.com",
  timezone: "America/Sao_Paulo",
  phone: "5592994592664",
  cancellationTolerance: toleranceOptions[1],
  penaltyDuration: penaltyOptions[2],
  address: {
    street: "Rua Augusta",
    number: "1240",
    neighborhood: "Consolacao",
    city: "Sao Paulo",
    state: "SP",
    zip: "01304-001",
  },
  social: {
    instagram: "@studiosimetria",
    whatsapp: "5592994592664",
    facebook: "studiosimetria",
  },
}


export function EmpresaView() {
  const [form, setForm] = useState(() => ({
    ...initialCompanyForm,
  }))
  const [feedback, setFeedback] = useState(
    "Preencha todos os campos obrigatórios."
  )
  const [portalForm, setPortalForm] = useState(() => readPortalSettings())
  const [portalFeedback, setPortalFeedback] = useState(
    "Personalize os dados exibidos no portal do cliente."
  )
  const [imageEditor, setImageEditor] = useState<PortalImageEditorState | null>(
    null
  )

  const requiredFilled =
    form.companyName.trim().length > 0 &&
    form.cnpjCpf.trim().length > 0 &&
    form.email.trim().length > 0 &&
    form.timezone.trim().length > 0 &&
    form.phone.trim().length > 0 &&
    form.address.street.trim().length > 0 &&
    form.address.number.trim().length > 0

  const fieldErrors = {
    email: form.email && !isValidEmail(form.email) ? "Email inválido" : "",
    phone: form.phone && !isValidPhone(form.phone) ? "Telefone inválido" : "",
    cnpjCpf:
      form.cnpjCpf &&
      (form.documentType === "CPF"
        ? !isValidCpf(form.cnpjCpf)
        : !isValidCnpj(form.cnpjCpf))
        ? form.documentType === "CPF"
          ? "CPF inválido"
          : "CNPJ inválido"
        : "",
  }

  function update<Key extends keyof typeof form>(
    key: Key,
    value: (typeof form)[Key]
  ) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function updateAddress<Key extends keyof typeof form.address>(
    key: Key,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      address: { ...current.address, [key]: value },
    }))
  }

  function updateSocial<Key extends keyof typeof form.social>(
    key: Key,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      social: { ...current.social, [key]: value },
    }))
  }

  function saveCompany() {
    if (!requiredFilled) {
      setFeedback("Revise os campos obrigatórios antes de salvar.")
      return
    }

    const hasErrors = Object.values(fieldErrors).some(Boolean)
    if (hasErrors) {
      setFeedback("Corrija os campos com formatação inválida antes de salvar.")
      return
    }

    // Sync with portal settings automatically for common fields
    const nextPortalSettings = {
      ...portalForm,
      name: form.companyName,
      address: `${form.address.street}, ${form.address.number}, ${form.address.neighborhood}, ${form.address.city}, ${form.address.state}`,
      phone: form.phone,
    }
    setPortalForm(nextPortalSettings)
    writePortalSettings(nextPortalSettings)

    window.dispatchEvent(new Event("bigood_company_sync"))
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
    clearPortalAuth()
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

  function updateOnboardingSlide(index: number, key: "title" | "description" | "imageUrl", value: string) {
    setPortalForm(current => {
      const slides = [...(current.onboardingSlides || defaultPortalSettings.onboardingSlides || [])]
      if (slides[index]) {
        slides[index] = { ...slides[index], [key]: value }
      }
      return { ...current, onboardingSlides: slides }
    })
  }

  function handleSlideImageUpload(event: ChangeEvent<HTMLInputElement>, index: number) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result !== "string") return
      updateOnboardingSlide(index, "imageUrl", reader.result)
      event.target.value = ""
    }
    reader.readAsDataURL(file)
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
        description="Preencha todos os campos obrigatórios."
        action={
          <Button size="sm" onClick={saveCompany}>
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} />
            Salvar alterações
          </Button>
        }
      >
        <FormGrid>
          <FormField label="Nome da empresa *">
            <Input
              value={form.companyName}
              onChange={(event) => update("companyName", event.target.value)}
            />
          </FormField>
          <FormField
            label="CPF / CNPJ *"
            error={fieldErrors.cnpjCpf}
          >
            <div className="flex gap-2">
              <Select
                value={form.documentType}
                onValueChange={(value) =>
                  update("documentType", value as "CPF" | "CNPJ")
                }
              >
                <SelectTrigger className="w-28 shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CPF">CPF</SelectItem>
                  <SelectItem value="CNPJ">CNPJ</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={form.cnpjCpf}
                inputMode="numeric"
                placeholder={form.documentType === "CPF" ? "000.000.000-00" : "00.000.000/0000-00"}
                onChange={(event) =>
                  update("cnpjCpf", formatCnpjCpfInput(event.target.value))
                }
              />
            </div>
          </FormField>
          <FormField
            label="Email *"
            error={fieldErrors.email}
          >
            <Input
              value={form.email}
              type="email"
              onChange={(event) => update("email", event.target.value)}
            />
          </FormField>
          <FormField label="Fuso horário *">
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
          <FormField
            label="Telefone *"
            error={fieldErrors.phone}
          >
            <Input
              value={form.phone}
              inputMode="numeric"
              placeholder="(00) 00000-0000"
              onChange={(event) =>
                update("phone", onlyDigits(event.target.value, 13))
              }
            />
          </FormField>
          
          <FormField label="CEP *" className="sm:col-span-1">
            <Input
              value={form.address.zip}
              onChange={(event) => updateAddress("zip", event.target.value)}
              placeholder="00000-000"
            />
          </FormField>
          <FormField label="Rua *" className="sm:col-span-2">
            <Input
              value={form.address.street}
              onChange={(event) => updateAddress("street", event.target.value)}
            />
          </FormField>
          <FormField label="Número *" className="sm:col-span-1">
            <Input
              value={form.address.number}
              onChange={(event) => updateAddress("number", event.target.value)}
            />
          </FormField>
          <FormField label="Bairro *" className="sm:col-span-1">
            <Input
              value={form.address.neighborhood}
              onChange={(event) => updateAddress("neighborhood", event.target.value)}
            />
          </FormField>
          <FormField label="Cidade *" className="sm:col-span-1">
            <Input
              value={form.address.city}
              onChange={(event) => updateAddress("city", event.target.value)}
            />
          </FormField>
          <FormField label="Estado *" className="sm:col-span-1">
            <Input
              value={form.address.state}
              onChange={(event) => updateAddress("state", event.target.value)}
            />
          </FormField>

          <div className="sm:col-span-3 mt-4 pt-4 border-t">
            <h4 className="text-sm font-semibold mb-4">Redes Sociais</h4>
          </div>

          <FormField label="Instagram">
            <Input
              value={form.social.instagram}
              onChange={(event) => updateSocial("instagram", event.target.value)}
              placeholder="@seuinstagram"
            />
          </FormField>
          <FormField label="WhatsApp">
            <Input
              value={form.social.whatsapp}
              onChange={(event) => updateSocial("whatsapp", event.target.value)}
              placeholder="5599999999999"
            />
          </FormField>
          <FormField label="Facebook">
            <Input
              value={form.social.facebook}
              onChange={(event) => updateSocial("facebook", event.target.value)}
              placeholder="suapagina"
            />
          </FormField>
        </FormGrid>

        <FeedbackMessage>{feedback}</FeedbackMessage>
      </SectionCard>

      <SectionCard
        title="Personalização do portal"
        description="Configure o que o cliente vê ao acessar o portal de agendamento."
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
          <FormField label="Descrição *" className="sm:col-span-2">
            <Input
              value={portalForm.description}
              onChange={(event) =>
                updatePortal("description", event.target.value)
              }
            />
          </FormField>
          <FormField label="Cor primária *" className="sm:col-span-2">
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
            description="O banner deve possuir boa resolução para ocupar o topo do portal."
            buttonLabel="Adicionar banner"
            imageUrl={portalForm.bannerUrl}
            placement={portalForm.bannerPlacement}
            onUpload={(event) =>
              handlePortalImageUpload(event, "bannerUrl", "Banner")
            }
            onRemove={() => removePortalImage("bannerUrl")}
          />
          <PortalImageUploadSection
            title="Logo"
            description="A logo deve possuir as dimensoes de 1024 x 1024 pixels."
            buttonLabel="Adicionar logo"
            imageUrl={portalForm.logoUrl}
            placement={portalForm.logoPlacement}
            onUpload={(event) =>
              handlePortalImageUpload(event, "logoUrl", "Logo")
            }
            onRemove={() => removePortalImage("logoUrl")}
          />
        </div>

        <div className="mt-8 pt-8 border-t">
          <h3 className="text-lg font-semibold mb-2">Carrossel de Boas-vindas (Onboarding)</h3>
          <p className="text-sm text-muted-foreground mb-6">Personalize as fotos e mensagens que aparecem no primeiro acesso do cliente.</p>
          
          <div className="space-y-8">
            {(portalForm.onboardingSlides || defaultPortalSettings.onboardingSlides || []).map((slide, index) => (
              <div key={index} className="grid gap-6 p-6 rounded-xl border bg-muted/20 sm:grid-cols-[auto_minmax(0,1fr)]">
                <div className="flex flex-col gap-3 items-center">
                  <div className="size-32 rounded-lg border overflow-hidden bg-background">
                    <img src={slide.imageUrl} alt={`Slide ${index + 1}`} className="size-full object-cover" />
                  </div>
                  <Button type="button" size="xs" variant="outline" asChild className="w-full">
                    <label className="cursor-pointer">
                      Alterar foto
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="sr-only" 
                        onChange={(e) => handleSlideImageUpload(e, index)} 
                      />
                    </label>
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Título do slide {index + 1}</label>
                    <Input 
                      value={slide.title} 
                      onChange={(e) => updateOnboardingSlide(index, "title", e.target.value)}
                      placeholder="Ex: Bem-vindo"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Descrição do slide {index + 1}</label>
                    <Input 
                      value={slide.description} 
                      onChange={(e) => updateOnboardingSlide(index, "description", e.target.value)}
                      placeholder="Ex: Agende seus serviços com facilidade"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ResponsiveActions className="mt-5 border-t pt-5">
          <Button type="button" onClick={savePortalSettings}>
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} />
            Salvar personalização
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
        title="Regras de tolerância e penalidade"
        description="Preencha todos os campos obrigatórios"
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
          <FormField label="Duração da penalidade *">
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
                alt={`Edição de ${editor.label.toLowerCase()}`}
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
  onUpload,
  onRemove,
}: {
  title: string
  description: string
  buttonLabel: string
  imageUrl: string
  placement: PortalImagePlacement
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
}) {
  const isBanner = title === "Banner"

  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="flex flex-wrap items-baseline gap-2 border-b px-4 py-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-base text-muted-foreground">{description}</p>
      </div>
      <div className="grid gap-5 p-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:p-6">
        <div
          className={`grid place-items-center overflow-hidden rounded-lg border bg-muted/30 ${
            isBanner ? "h-28 w-full max-w-xs sm:h-32 sm:w-72" : "size-28"
          }`}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="size-full object-cover"
              style={{
                objectPosition: `${placement.x}% ${placement.y}%`,
                transform: `scale(${placement.zoom})`,
              }}
            />
          ) : (
            <span className="px-3 text-center text-sm font-medium text-muted-foreground">
              Sem {title.toLowerCase()}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" asChild>
            <label className="cursor-pointer">
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
