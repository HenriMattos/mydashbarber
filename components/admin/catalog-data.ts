export type { ServiceCatalogItem, ServiceStatus } from "@/types"
export { adminService } from "@/services/admin"

import { adminService } from "@/services/admin"

export const serviceCatalog = adminService.services
export const planCatalog = adminService.plans.map((plan) => ({
  name: plan.name,
  value: plan.price,
}))
export const paymentMethodOptions = adminService.paymentMethods.map(
  (method) => method.name
)
export const serviceNames = serviceCatalog
  .filter(
    (service) =>
      service.status === "Ativo" &&
      !service.hidden &&
      service.portalVisible !== false
  )
  .map((service) => service.name)
export const planNames = planCatalog.map((plan) => plan.name)
