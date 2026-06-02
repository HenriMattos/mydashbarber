"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { SectionCard } from "@/components/admin/section-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { adminService } from "@/services/admin"

export function CadastrarServicoForm({ serviceId }: { serviceId?: number }) {
  const router = useRouter()
  const service = useMemo(
    () => (serviceId ? adminService.services.find(s => s.id === serviceId) : null),
    [serviceId]
  )
  const isEditing = !!service

  const [formData, setFormData] = useState({
    name: service?.name ?? "",
    duration: String(service?.durationMinutes ?? ""),
    price: String(service?.price ?? ""),
    commission: "",
    repurchase: String(service?.repurchaseDays ?? ""),
    category: service?.category ?? "",
    hidden: service?.hidden ?? false,
    fitting: service?.fitIn ?? false,
    paymentMethods: [] as string[]
  })

  const paymentOptions = ["Pix", "Cartão de débito", "Cartão de crédito", "Dinheiro"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(isEditing ? "Editando serviço:" : "Criando serviço:", formData)
    router.push("/servicos")
  }

  if (serviceId && !service) {
    return (
      <SectionCard title="Serviço não encontrado" description="O serviço solicitado não existe.">
        <p className="text-muted-foreground">Volte para a lista de serviços.</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => router.push("/servicos")}>Voltar</Button>
        </div>
      </SectionCard>
    )
  }

  return (
    <SectionCard
      title={isEditing ? "Editar serviço" : "Criar novo serviço"}
      description={isEditing ? `Editando "${service.name}".` : "Dados. Preencha todos os campos obrigatórios."}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Categoria *</Label>
            <Input required value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Duração (minutos) *</Label>
            <Input type="number" required value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Valor (R$) *</Label>
            <Input type="number" step="0.01" required value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Comissão (%) *</Label>
            <Input type="number" value={formData.commission} onChange={(e) => setFormData({...formData, commission: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Período de recompra (dias)</Label>
            <Input type="number" value={formData.repurchase} onChange={(e) => setFormData({...formData, repurchase: e.target.value})} />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <Checkbox checked={formData.hidden} onCheckedChange={(checked) => setFormData({...formData, hidden: !!checked})} />
            <Label>Oculto</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={formData.fitting} onCheckedChange={(checked) => setFormData({...formData, fitting: !!checked})} />
            <Label>Serviço de encaixe</Label>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Formas de Pagamento Aceitas</Label>
          <div className="grid gap-2 sm:grid-cols-2">
            {paymentOptions.map(option => (
              <div key={option} className="flex items-center gap-2">
                <Checkbox 
                  checked={formData.paymentMethods.includes(option)}
                  onCheckedChange={(checked) => {
                    setFormData(prev => ({
                      ...prev,
                      paymentMethods: checked 
                        ? [...prev.paymentMethods, option]
                        : prev.paymentMethods.filter(m => m !== option)
                    }))
                  }}
                />
                <Label>{option}</Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
          <Button type="submit">{isEditing ? "Salvar alterações" : "Salvar serviço"}</Button>
        </div>
      </form>
    </SectionCard>
  )
}
