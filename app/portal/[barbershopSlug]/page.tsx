import { ClientPortalApp } from "@/components/client-portal/client-portal-app"

export default async function ClientPortalPage({
  params,
}: {
  params: Promise<{ barbershopSlug: string }>
}) {
  const { barbershopSlug } = await params
  return <ClientPortalApp barbershopSlug={barbershopSlug} />
}
