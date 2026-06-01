"use client"

import * as React from "react"
import {
  PORTAL_SETTINGS_CHANGED_EVENT,
  getReadableForeground,
  readPortalSettings,
} from "@/lib/client-portal/settings"

export function usePortalTheme() {
  const [settings, setSettings] = React.useState(readPortalSettings())

  React.useEffect(() => {
    function syncSettings() {
      setSettings(readPortalSettings())
    }

    window.addEventListener(PORTAL_SETTINGS_CHANGED_EVENT, syncSettings)
    window.addEventListener("storage", syncSettings)

    return () => {
      window.removeEventListener(PORTAL_SETTINGS_CHANGED_EVENT, syncSettings)
      window.removeEventListener("storage", syncSettings)
    }
  }, [])

  const themeStyle = React.useMemo(() => ({
    "--primary": settings.primaryColor,
    "--ring": settings.primaryColor,
    "--sidebar-primary": settings.primaryColor,
    "--primary-foreground": getReadableForeground(settings.primaryColor),
    "--sidebar-primary-foreground": getReadableForeground(settings.primaryColor),
  } as React.CSSProperties), [settings.primaryColor])

  return { settings, themeStyle }
}
