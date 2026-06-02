"use client"

import { useState, useMemo, useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, ScissorIcon, PencilEdit02Icon, Delete02Icon } from "@hugeicons/core-free-icons"
import { SectionCard } from "@/components/admin/section-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Link from "next/link"
import { adminService } from "@/services/admin"

// Simulação de dados
const initialServices = [
  { id: 1, name: "Corte masculino", category: "Cabelo", price: 60, duration: 45 },
  { id: 2, name: "Barba completa", category: "Barba", price: 45, duration: 35 },
]

export function ServicosView() {
  const [items, setItems] = useState(initialServices)
  const [query, setQuery] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)

  const filteredItems = useMemo(() => {
    return items.filter(service => 
      service.name.toLowerCase().includes(query.toLowerCase()) || 
      service.category.toLowerCase().includes(query.toLowerCase())
    )
  }, [items, query])

  return (
    <>
      <SectionCard
        title="Serviços"
        description="Gerencie os serviços oferecidos."
        action={
          <Button size="sm" asChild>
            <Link href="/servicos/cadastrar">
              <HugeiconsIcon icon={ScissorIcon} size={16} className="mr-2" />
              Cadastrar serviço
            </Link>
          </Button>
        }
      >
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <HugeiconsIcon icon={Search01Icon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Pesquisar..." 
              className="pl-9" 
              value={query} 
              onChange={(e) => setQuery(e.target.value)} 
            />
          </div>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Duração</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map(service => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.category}</TableCell>
                  <TableCell>{service.duration} min</TableCell>
                  <TableCell>R$ {service.price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="icon-sm" variant="outline" className="mr-2" onClick={() => setEditingId(service.id)}>
                      <HugeiconsIcon icon={PencilEdit02Icon} size={14} />
                    </Button>
                    <Button size="icon-sm" variant="destructive">
                      <HugeiconsIcon icon={Delete02Icon} size={14} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </SectionCard>

      <EditServiceDialog
        serviceId={editingId}
        onClose={() => setEditingId(null)}
      />
    </>
  )
}

function EditServiceDialog({
  serviceId,
  onClose,
}: {
  serviceId: number | null
  onClose: () => void
}) {
  const service = useMemo(
    () => (serviceId ? adminService.services.find(s => s.id === serviceId) ?? null : null),
    [serviceId]
  )

  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [duration, setDuration] = useState("")
  const [price, setPrice] = useState("")
  const [commission, setCommission] = useState("")
  const [repurchase, setRepurchase] = useState("")
  const [hidden, setHidden] = useState(false)
  const [fitting, setFitting] = useState(false)

  useEffect(() => {
    if (service) {
      setName(service.name)
      setCategory(service.category)
      setDuration(String(service.durationMinutes))
      setPrice(String(service.price))
      setCommission("")
      setRepurchase(String(service.repurchaseDays))
      setHidden(service.hidden)
      setFitting(service.fitIn)
    }
  }, [service])

  return (
    <Dialog
      open={serviceId !== null}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar serviço</DialogTitle>
          <DialogDescription>
            {service ? `Editando "${service.name}".` : ""}
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Nome *</Label>
              <Input required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Input required value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Duração (minutos) *</Label>
              <Input type="number" required value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Valor (R$) *</Label>
              <Input type="number" step="0.01" required value={price} onChange={(e) => setPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Comissão (%) *</Label>
              <Input type="number" value={commission} onChange={(e) => setCommission(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Período de recompra (dias)</Label>
              <Input type="number" value={repurchase} onChange={(e) => setRepurchase(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
              <Checkbox checked={hidden} onCheckedChange={(checked) => setHidden(!!checked)} />
              <Label>Oculto</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox checked={fitting} onCheckedChange={(checked) => setFitting(!!checked)} />
              <Label>Serviço de encaixe</Label>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => { console.log({ name, category, duration, price, commission, repurchase, hidden, fitting }); onClose() }}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
