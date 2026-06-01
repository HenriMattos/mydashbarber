"use client"

import {
  COMPANY_ICON_STORAGE_KEY,
  COMPANY_LOGO_STORAGE_KEY,
  COMPANY_TRADE_NAME_STORAGE_KEY,
} from "@/services/company"
import { useEffect, useState } from "react"

export function PortalLogo({ className }: { className?: string }) {
  const [tradeName, setTradeName] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [iconUrl, setIconUrl] = useState("")

  useEffect(() => {
    setTradeName(
      typeof window === "undefined"
        ? ""
        : localStorage.getItem(COMPANY_TRADE_NAME_STORAGE_KEY) || ""
    )
    setLogoUrl(
      typeof window === "undefined"
        ? ""
        : localStorage.getItem(COMPANY_LOGO_STORAGE_KEY) || ""
    )
    setIconUrl(
      typeof window === "undefined"
        ? ""
        : localStorage.getItem(COMPANY_ICON_STORAGE_KEY) || ""
    )
  }, [])

  const displayLogo = logoUrl || iconUrl

  return (
    <div className={`flex flex-col items-center gap-3 ${className ?? ""}`}>
      {displayLogo ? (
        <img
          src={displayLogo}
          alt={tradeName || "Logo"}
          className="size-16 rounded-2xl border object-cover shadow-sm"
        />
      ) : (
        <div className="grid size-16 place-items-center rounded-2xl border bg-muted shadow-sm">
          <span className="text-2xl font-bold text-muted-foreground">
            {(tradeName || "B").charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      {tradeName && (
        <h1 className="text-xl font-bold text-foreground">{tradeName}</h1>
      )}
    </div>
  )
}
