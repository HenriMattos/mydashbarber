import { cn } from "@/lib/utils"

type SectionCardProps = {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  headerClassName?: string
  actionClassName?: string
  bodyClassName?: string
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  headerClassName,
  actionClassName,
  bodyClassName,
}: SectionCardProps) {
  return (
    <section
      className={cn(
        "premium-card motion-rise min-w-0 rounded-lg border bg-card shadow-sm",
        "admin-section-card",
        className
      )}
    >
      <div
        className={cn(
          "flex min-w-0 flex-col gap-3 border-b p-3 sm:p-4 md:flex-row md:items-center md:justify-between",
          headerClassName
        )}
      >
        <div className="min-w-0">
          <h2 className="text-base font-semibold break-words">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm leading-snug break-words text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {action ? (
          <div
            className={cn(
              "w-full min-w-0 md:w-auto md:shrink-0 [&_[data-slot=button]]:w-full md:[&_[data-slot=button]]:w-auto",
              actionClassName
            )}
          >
            {action}
          </div>
        ) : null}
      </div>
      <div className={cn("min-w-0 p-3 sm:p-4", bodyClassName)}>
        {children}
      </div>
    </section>
  )
}
