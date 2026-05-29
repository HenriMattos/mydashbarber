"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export function CheckoutActions({ planKey }: { planKey: string }) {
  const router = useRouter()
  const { setAuthenticatedUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleConfirm() {
    setError("")
    setLoading(true)

    const response = await fetch("/api/billing/activate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planKey }),
    })

    setLoading(false)

    if (!response.ok) {
      if (response.status === 401) {
        router.replace(`/login?mode=signup&next=/checkout?plan=${planKey}`)
        return
      }

      const payload = (await response.json().catch(() => null)) as {
        message?: string
      } | null
      setError(payload?.message ?? "Não foi possível ativar o plano.")
      return
    }

    const payload = (await response.json().catch(() => null)) as {
      user?: {
        email: string
        name?: string
        companyName?: string
        hasActivePlan: boolean
        planKey?: string
      }
    } | null

    if (payload?.user) {
      setAuthenticatedUser(payload.user)
    }

    router.replace("/dashboard")
    router.refresh()
  }

  return (
    <div className="mt-6 grid gap-3">
      <Button
        size="lg"
        onClick={handleConfirm}
        className="h-12 w-full rounded-full border border-[rgba(11,51,36,0.18)] bg-[var(--landing-accent)] font-extrabold text-[var(--landing-primary-dark)] shadow-[inset_0_-2px_0_rgba(11,51,36,0.18)] hover:bg-[var(--landing-accent-hover)]"
        disabled={loading}
      >
        {loading ? "Processando..." : "Confirmar plano e ativar painel"}
        {!loading && <HugeiconsIcon icon={ArrowRight01Icon} size={18} aria-hidden="true" />}
      </Button>
      {error ? (
        <p className="rounded-[18px] border border-destructive/20 bg-destructive/10 p-3 text-sm font-bold text-destructive">
          {error}
        </p>
      ) : null}
      <Button
        variant="outline"
        size="lg"
        className="h-12 w-full rounded-full border-[var(--landing-border-strong)] text-[var(--landing-primary-dark)] hover:bg-[var(--landing-primary-soft)]"
        onClick={() => router.back()}
      >
        Voltar
      </Button>
    </div>
  )
}
