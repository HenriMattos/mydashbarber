import Link from "next/link"
import { UserAdd01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { ClientesListManager } from "@/components/admin/clientes-list-manager"
import { SectionCard } from "@/components/admin/section-card"
import { Button } from "@/components/ui/button"

export default function ListagemClientesPage() {
  return (
    <SectionCard
      title="Registros Ativos"
      description="Clientes do sistema."
      action={
        <Button size="sm" asChild>
          <Link href="/clientes/cadastrar">
            <HugeiconsIcon icon={UserAdd01Icon} size={16} />
            Cadastrar
          </Link>
        </Button>
      }
    >
      <ClientesListManager />
    </SectionCard>
  )
}
