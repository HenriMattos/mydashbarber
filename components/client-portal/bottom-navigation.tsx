"use client"

import { CalendarDays, CircleUserRound, House, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"

export type PortalTabKey = "home" | "appointments" | "plans" | "profile"

export const portalTabs: Array<{
  key: PortalTabKey
  label: string
  icon: React.ComponentType<{ className?: string }>
}> = [
  { key: "home", label: "Inicio", icon: House },
  { key: "appointments", label: "Agendamentos", icon: CalendarDays },
  { key: "plans", label: "Plano", icon: Sparkles },
  { key: "profile", label: "Perfil", icon: CircleUserRound },
]

interface BottomNavigationProps {
  activeTab: PortalTabKey
  onChange: (tab: PortalTabKey) => void
}

export function BottomNavigation({ activeTab, onChange }: BottomNavigationProps) {
  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-30 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
      <div className="pointer-events-auto mx-auto grid max-w-md grid-cols-4 gap-1 rounded-2xl border bg-background/95 p-1 shadow-lg backdrop-blur-sm">
        {portalTabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center rounded-xl px-1 py-2 text-[11px] font-semibold transition-colors",
                isActive
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon className="mb-1 size-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
