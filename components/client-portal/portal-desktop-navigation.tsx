"use client"

import {
  portalTabs,
  type PortalTabKey,
} from "@/components/client-portal/bottom-navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface PortalDesktopNavigationProps {
  activeTab: PortalTabKey
  onChange: (tab: PortalTabKey) => void
}

export function PortalDesktopNavigation({
  activeTab,
  onChange,
}: PortalDesktopNavigationProps) {
  return (
    <aside className="z-30 hidden h-full min-h-0 border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex lg:flex-col">
      <ScrollArea className="min-h-0 flex-1 pr-2">
        <nav className="flex flex-col gap-1">
          {portalTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onChange(tab.key)}
                className={cn(
                  "group flex min-w-0 items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-sidebar-foreground/75 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive &&
                    "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                )}
              >
                <Icon className="size-5 shrink-0" />
                <span className="min-w-0 flex-1 truncate">{tab.label}</span>
              </button>
            )
          })}
        </nav>
      </ScrollArea>

    </aside>
  )
}
