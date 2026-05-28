import Link from "next/link"
import {
  Calendar03Icon,
  Message01Icon,
  RepeatOne01Icon,
  UserStar01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { repurchaseClients } from "@/components/admin/clientes-data"
import { EmptyState } from "@/components/admin/empty-state"
import { formatDateForDisplay } from "@/components/admin/date-utils"
import { SectionCard } from "@/components/admin/section-card"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"

export default function ClienteRecomprasPage() {
  return (
    <SectionCard
      title="Clientes para recompra"
      description="Sinalizacao operacional para retorno, reapresentacao de plano e nova oferta"
      action={<Button size="sm">Enviar lembretes</Button>}
    >
      {repurchaseClients.length === 0 ? (
        <EmptyState
          icon={RepeatOne01Icon}
          title="Nenhum cliente para recompra"
          description="Quando a base crescer, os clientes sem retorno e com janela de recompra aparecem aqui."
          actionLabel="Ir para clientes"
          href="/clientes/listagem"
        />
      ) : (
        <div className="grid gap-3">
          {repurchaseClients.map((item) => (
            <article
              key={item.id}
              className="rounded-md border bg-background p-4 shadow-xs"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <HugeiconsIcon
                      icon={UserStar01Icon}
                      size={18}
                      className="text-primary"
                    />
                    <h3 className="font-semibold">{item.client}</h3>
                    <StatusBadge tone="amber">Recompra sugerida</StatusBadge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{item.phone}</p>
                </div>

                <div className="rounded-md border bg-muted/30 px-3 py-2">
                  <p className="text-xs font-medium uppercase text-muted-foreground">
                    Data indicada
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                    <HugeiconsIcon icon={Calendar03Icon} size={16} />
                    {item.dueDate}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                <Info label="Ultima compra" value={item.lastPurchase} />
                <Info
                  label="Ultima visita"
                  value={formatDateForDisplay(item.lastDate)}
                />
                <Info label="Oferta recomendada" value={item.recommended} strong />
              </div>

              <div className="mt-3 rounded-md bg-primary/10 p-3 text-sm">
                <span className="font-medium">Motivo: </span>
                {item.reason}
              </div>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <Button size="sm" asChild variant="outline">
                  <Link href={`/clientes/${item.id}`}>Ver ficha</Link>
                </Button>
                <Button size="sm" asChild variant="outline">
                  <Link href={`https://wa.me/55${item.phone.replace(/\D/g, "")}`} target="_blank">
                    <HugeiconsIcon icon={Message01Icon} size={16} />
                    Chamar no WhatsApp
                  </Link>
                </Button>
                <Button size="sm" asChild variant="outline">
                  <Link href="/clientes/listagem">Revisar na listagem</Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </SectionCard>
  )
}

function Info({
  label,
  value,
  strong,
}: {
  label: string
  value: string
  strong?: boolean
}) {
  return (
    <div className="rounded-md border bg-card px-3 py-2">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={strong ? "mt-1 font-semibold" : "mt-1 text-sm"}>{value}</p>
    </div>
  )
}
