"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowDown01Icon,
  Calendar03Icon,
  DashboardSquare01Icon,
  Logout03Icon,
  Menu01Icon,
  Notification03Icon,
  Search01Icon,
  UserMultipleIcon,
  Wallet02Icon,
} from "@hugeicons/core-free-icons"
import { useEffect, useMemo, useRef, useState } from "react"
import { database } from "@/components/admin/database"
import { COMPANY_LOGO_STORAGE_KEY } from "@/components/company/company-assets"

import { navItems } from "@/components/admin/nav-items"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BIGOOD_MARK_DARK } from "@/lib/brand-assets"
import { cn } from "@/lib/utils"

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchIndex, setSearchIndex] = useState(0)
  const searchRef = useRef<HTMLDivElement | null>(null)
  const mobileSearchRef = useRef<HTMLDivElement | null>(null)
  const [companyData, setCompanyData] = useState({
    tradeName: database.company.tradeName,
    logoUrl: database.company.logoUrl || "",
  })
  const searchItems = useMemo(() => buildSearchItems(), [])
  const adminRouteHrefs = useMemo(() => getAdminRouteHrefs(), [])
  const searchResults = useMemo(() => {
    const query = normalizeText(searchQuery)

    if (!query) {
      return searchItems.slice(0, 8)
    }

    return searchItems
      .filter((item) => normalizeText(item.searchBlob).includes(query))
      .slice(0, 8)
  }, [searchItems, searchQuery])
  const activeSearchIndex = searchResults.length
    ? Math.min(searchIndex, searchResults.length - 1)
    : 0

  useEffect(() => {
    function sync() {
      setCompanyData({
        tradeName: database.company.tradeName,
        logoUrl:
          window.localStorage.getItem(COMPANY_LOGO_STORAGE_KEY) ||
          database.company.logoUrl ||
          "",
      })
    }

    window.requestAnimationFrame(() => {
      sync()
      setMounted(true)
    })
    window.addEventListener("storage", sync)
    return () => {
      window.removeEventListener("storage", sync)
    }
  }, [])

  useEffect(() => {
    adminRouteHrefs.forEach((href) => router.prefetch(href))
  }, [adminRouteHrefs, router])

  useEffect(() => {
    if (!searchOpen) return

    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      const insideDesktop = searchRef.current?.contains(target)
      const insideMobile = mobileSearchRef.current?.contains(target)

      if (!insideDesktop && !insideMobile) {
        setSearchOpen(false)
      }
    }

    window.addEventListener("pointerdown", onPointerDown)
    return () => window.removeEventListener("pointerdown", onPointerDown)
  }, [searchOpen])

  const activeItem =
    navItems.find((item) => pathname.startsWith(item.href)) ?? navItems[0]

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" })
    window.dispatchEvent(new Event("bigood_auth_sync"))
    router.replace("/")
    router.refresh()
  }

  function navigateFromSearch(href: string) {
    router.push(href)
    setSearchOpen(false)
    setSearchQuery("")
    setSearchIndex(0)
  }

  if (!mounted) return null

  return (
    <div
      className="h-svh overflow-hidden bg-muted/40 text-foreground"
      onPointerDown={(event) => {
        const target = event.target as HTMLElement
        const shineTarget = target.closest(".green-shine")

        if (!(shineTarget instanceof HTMLElement)) return

        shineTarget.classList.remove("shine-run")
        window.requestAnimationFrame(() =>
          shineTarget.classList.add("shine-run")
        )
      }}
      onAnimationEnd={(event) => {
        const target = event.target as HTMLElement
        if (target.classList.contains("green-shine")) {
          target.classList.remove("shine-run")
        }
      }}
    >
      <div className="admin-app grid h-svh min-w-0 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="z-30 hidden h-full min-h-0 border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex lg:flex-col">
          <SidebarContent
            pathname={pathname}
            companyData={companyData}
            onPrefetch={(href) => router.prefetch(href)}
          />
        </aside>

        <div className="flex h-full min-h-0 min-w-0 flex-col">
          <header className="admin-mobile-header z-20 shrink-0 border-b bg-background/95 backdrop-blur">
            <div className="admin-container flex h-14 items-center gap-2 px-0 sm:h-16 sm:gap-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="admin-mobile-menu-button lg:hidden"
                aria-label="Abrir menu"
                onClick={() => setMobileMoreOpen(true)}
              >
                <HugeiconsIcon icon={Menu01Icon} size={20} />
              </Button>

              <div className="min-w-0 flex-1">
                <p className="admin-mobile-kicker truncate text-xs font-medium text-muted-foreground">
                  Painel administrativo
                </p>
                <h1 className="admin-mobile-title truncate text-base font-semibold md:text-lg">
                  {activeItem.title}
                </h1>
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="md:hidden"
                aria-label="Buscar"
                onClick={() => setSearchOpen((current) => !current)}
              >
                <HugeiconsIcon icon={Search01Icon} size={18} />
              </Button>

              <div
                ref={searchRef}
                className="relative hidden w-full max-w-xs md:block xl:max-w-sm"
              >
                <label className="flex h-9 w-full items-center gap-2 rounded-full border bg-background px-3 text-sm text-muted-foreground">
                  <HugeiconsIcon icon={Search01Icon} size={17} />
                  <input
                    value={searchQuery}
                    onFocus={() => setSearchOpen(true)}
                    onChange={(event) => {
                      setSearchQuery(event.target.value)
                      setSearchOpen(true)
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "ArrowDown") {
                        event.preventDefault()
                        setSearchIndex((current) =>
                          Math.min(
                            current + 1,
                            Math.max(searchResults.length - 1, 0)
                          )
                        )
                        return
                      }
                      if (event.key === "ArrowUp") {
                        event.preventDefault()
                        setSearchIndex((current) => Math.max(current - 1, 0))
                        return
                      }
                      if (event.key === "Escape") {
                        setSearchOpen(false)
                        return
                      }
                      if (event.key === "Enter" && searchResults.length) {
                        event.preventDefault()
                        navigateFromSearch(
                          searchResults[activeSearchIndex]?.href ??
                            searchResults[0].href
                        )
                      }
                    }}
                    className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                    placeholder="Buscar cliente, servico, pagina..."
                  />
                </label>

                {searchOpen ? (
                  <div className="absolute top-11 z-40 w-full rounded-xl border bg-background p-1 shadow-lg">
                    {searchResults.length ? (
                      <ul className="max-h-72 overflow-y-auto">
                        {searchResults.map((item, index) => (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => navigateFromSearch(item.href)}
                              className={cn(
                                "flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left",
                                index === activeSearchIndex
                                  ? "bg-muted text-foreground"
                                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                              )}
                            >
                              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary">
                                <HugeiconsIcon icon={Search01Icon} size={12} />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-medium">
                                  {item.title}
                                </span>
                                <span className="block truncate text-xs">
                                  {item.subtitle}
                                </span>
                              </span>
                              {item.actionLabel ? (
                                <span className="ml-auto inline-flex shrink-0 items-center rounded-full border border-primary/35 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                  {item.actionLabel}
                                </span>
                              ) : null}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="px-2 py-3 text-xs text-muted-foreground">
                        Nenhum resultado encontrado.
                      </p>
                    )}
                  </div>
                ) : null}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="hidden sm:inline-flex"
                aria-label="Notificacoes"
              >
                <HugeiconsIcon icon={Notification03Icon} size={19} />
              </Button>

              <span className="hidden size-9 items-center justify-center rounded-full border bg-muted text-muted-foreground sm:flex">
                <HugeiconsIcon icon={DashboardSquare01Icon} size={18} />
              </span>

              <Button
                variant="ghost"
                size="icon"
                aria-label="Sair do painel"
                onClick={logout}
              >
                <HugeiconsIcon icon={Logout03Icon} size={19} />
              </Button>
            </div>

            {searchOpen ? (
              <div
                ref={mobileSearchRef}
                className="admin-container pb-2 md:hidden"
              >
                <div className="relative">
                  <label className="flex h-10 w-full items-center gap-2 rounded-full border bg-background px-3 text-sm text-muted-foreground">
                    <HugeiconsIcon icon={Search01Icon} size={17} />
                    <input
                      autoFocus
                      value={searchQuery}
                      onChange={(event) => {
                        setSearchQuery(event.target.value)
                        setSearchOpen(true)
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "ArrowDown") {
                          event.preventDefault()
                          setSearchIndex((current) =>
                            Math.min(
                              current + 1,
                              Math.max(searchResults.length - 1, 0)
                            )
                          )
                          return
                        }
                        if (event.key === "ArrowUp") {
                          event.preventDefault()
                          setSearchIndex((current) => Math.max(current - 1, 0))
                          return
                        }
                        if (event.key === "Escape") {
                          setSearchOpen(false)
                          return
                        }
                        if (event.key === "Enter" && searchResults.length) {
                          event.preventDefault()
                          navigateFromSearch(
                            searchResults[activeSearchIndex]?.href ??
                              searchResults[0].href
                          )
                        }
                      }}
                      className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                      placeholder="Buscar cliente, servico, pagina..."
                    />
                  </label>

                  <div className="absolute top-11 z-40 w-full rounded-xl border bg-background p-1 shadow-lg">
                    {searchResults.length ? (
                      <ul className="max-h-72 overflow-y-auto">
                        {searchResults.map((item, index) => (
                          <li key={item.id}>
                            <button
                              type="button"
                              onClick={() => navigateFromSearch(item.href)}
                              className={cn(
                                "flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left",
                                index === activeSearchIndex
                                  ? "bg-muted text-foreground"
                                  : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                              )}
                            >
                              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/12 text-primary">
                                <HugeiconsIcon icon={Search01Icon} size={12} />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-medium">
                                  {item.title}
                                </span>
                                <span className="block truncate text-xs">
                                  {item.subtitle}
                                </span>
                              </span>
                              {item.actionLabel ? (
                                <span className="ml-auto inline-flex shrink-0 items-center rounded-full border border-primary/35 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                  {item.actionLabel}
                                </span>
                              ) : null}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="px-2 py-3 text-xs text-muted-foreground">
                        Nenhum resultado encontrado.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </header>

          <ScrollArea className="min-h-0 flex-1 overflow-x-hidden">
            <main className="admin-shell-main admin-container flex min-w-0 flex-col gap-2 overflow-x-hidden py-2 sm:gap-5 sm:py-5 lg:gap-6 lg:py-6">
              {children}
            </main>
          </ScrollArea>
        </div>
      </div>

      <MobileAdminBottomNav
        pathname={pathname}
        onMenu={() => setMobileMoreOpen(true)}
        onSearch={() => setSearchOpen(true)}
        onPrefetch={(href) => router.prefetch(href)}
      />

      <MobileMoreModal
        open={mobileMoreOpen}
        pathname={pathname}
        companyData={companyData}
        onClose={() => setMobileMoreOpen(false)}
        onLogout={logout}
        onNavigate={() => setMobileMoreOpen(false)}
        onPrefetch={(href) => router.prefetch(href)}
      />

      <MobileSearchModal
        open={searchOpen}
        searchRef={mobileSearchRef}
        query={searchQuery}
        results={searchResults}
        activeIndex={activeSearchIndex}
        onQueryChange={(value) => {
          setSearchQuery(value)
          setSearchIndex(0)
        }}
        onClose={() => setSearchOpen(false)}
        onNavigate={navigateFromSearch}
      />
    </div>
  )
}

const mobileAdminNavItems = [
  { title: "Inicio", href: "/dashboard", icon: DashboardSquare01Icon },
  { title: "Agenda", href: "/agenda", icon: Calendar03Icon },
  { title: "Caixa", href: "/caixa", icon: Wallet02Icon },
  { title: "Clientes", href: "/clientes", icon: UserMultipleIcon },
] as const

function MobileAdminBottomNav({
  pathname,
  onMenu,
  onSearch,
  onPrefetch,
}: {
  pathname: string
  onMenu: () => void
  onSearch: () => void
  onPrefetch?: (href: string) => void
}) {
  const hasPrimaryActive = mobileAdminNavItems.some((item) =>
    pathname.startsWith(item.href)
  )

  return (
    <>
      <button
        type="button"
        className="admin-mobile-search-fab lg:hidden"
        onClick={onSearch}
        aria-label="Buscar no painel"
      >
        <HugeiconsIcon icon={Search01Icon} size={21} aria-hidden />
      </button>

      <nav
        className="admin-mobile-bottom-nav lg:hidden"
        aria-label="Navegacao principal do painel"
      >
        <div className="admin-mobile-bottom-shell">
          {mobileAdminNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onMouseEnter={() => onPrefetch?.(item.href)}
                onFocus={() => onPrefetch?.(item.href)}
                className={cn(
                  "admin-mobile-bottom-item",
                  isActive && "is-active"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <HugeiconsIcon icon={item.icon} size={19} aria-hidden />
                <span>{item.title}</span>
              </Link>
            )
          })}

          <button
            type="button"
            className={cn(
              "admin-mobile-bottom-item",
              !hasPrimaryActive && "is-active"
            )}
            onClick={onMenu}
            aria-label="Abrir mais opcoes"
          >
            <HugeiconsIcon icon={ArrowDown01Icon} size={19} aria-hidden />
            <span>Mais</span>
          </button>
        </div>
      </nav>
    </>
  )
}

function MobileMoreModal({
  open,
  pathname,
  companyData,
  onClose,
  onLogout,
  onNavigate,
  onPrefetch,
}: {
  open: boolean
  pathname: string
  companyData: { tradeName: string; logoUrl: string }
  onClose: () => void
  onLogout: () => void
  onNavigate: () => void
  onPrefetch?: (href: string) => void
}) {
  if (!open) return null

  const mainHrefs = new Set<string>(
    mobileAdminNavItems.map((item) => item.href)
  )
  const secondaryItems = navItems.filter((item) => !mainHrefs.has(item.href))

  return (
    <div
      className="admin-mobile-modal lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Mais opcoes do painel"
    >
      <button
        type="button"
        className="admin-mobile-modal-backdrop"
        aria-label="Fechar opcoes"
        onClick={onClose}
      />
      <div className="admin-mobile-modal-panel">
        <div className="admin-mobile-modal-grabber" aria-hidden />
        <div className="flex items-center gap-3 px-1">
          {companyData.logoUrl ? (
            <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-2xl border bg-background">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={companyData.logoUrl}
                alt={companyData.tradeName}
                className="h-full w-full object-cover"
              />
            </span>
          ) : (
            <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-2xl border bg-background">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={BIGOOD_MARK_DARK}
                alt="Bigood"
                className="h-full w-full object-contain"
              />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">
              {companyData.tradeName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              Escolha uma area do painel
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-2">
          {secondaryItems.map((item) => {
            const isActive = pathname.startsWith(item.href)

            return (
              <div key={item.href} className="grid gap-1">
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  onMouseEnter={() => onPrefetch?.(item.href)}
                  onFocus={() => onPrefetch?.(item.href)}
                  className={cn(
                    "admin-mobile-more-link",
                    isActive && "is-active"
                  )}
                >
                  <HugeiconsIcon icon={item.icon} size={20} aria-hidden />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">
                      {item.title}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                </Link>

                {"children" in item && item.children?.length ? (
                  <div className="grid gap-1 pl-3">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onNavigate}
                        onMouseEnter={() => onPrefetch?.(child.href)}
                        onFocus={() => onPrefetch?.(child.href)}
                        className={cn(
                          "admin-mobile-more-child",
                          pathname === child.href && "is-active"
                        )}
                      >
                        <HugeiconsIcon
                          icon={child.icon}
                          size={16}
                          aria-hidden
                        />
                        <span>{child.title}</span>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>

        <div className="mt-4 grid gap-2 border-t pt-4">
          <Link
            href="/conta"
            onClick={onNavigate}
            className="admin-mobile-more-link"
          >
            <HugeiconsIcon icon={DashboardSquare01Icon} size={20} aria-hidden />
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold">
                Configurar perfil
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                Conta, acesso e preferencias
              </span>
            </span>
          </Link>

          <button
            type="button"
            className="admin-mobile-more-link text-left text-destructive"
            onClick={onLogout}
          >
            <HugeiconsIcon icon={Logout03Icon} size={20} aria-hidden />
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold">
                Sair do painel
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                Encerrar sessao atual
              </span>
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

function MobileSearchModal({
  open,
  searchRef,
  query,
  results,
  activeIndex,
  onQueryChange,
  onClose,
  onNavigate,
}: {
  open: boolean
  searchRef: React.RefObject<HTMLDivElement | null>
  query: string
  results: SearchItem[]
  activeIndex: number
  onQueryChange: (value: string) => void
  onClose: () => void
  onNavigate: (href: string) => void
}) {
  if (!open) return null

  return (
    <div
      className="admin-mobile-modal admin-mobile-search-modal lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Buscar no painel"
    >
      <button
        type="button"
        className="admin-mobile-modal-backdrop"
        aria-label="Fechar busca"
        onClick={onClose}
      />
      <div ref={searchRef} className="admin-mobile-search-panel">
        <div className="admin-mobile-modal-grabber" aria-hidden />
        <label className="admin-mobile-search-field">
          <HugeiconsIcon icon={Search01Icon} size={19} aria-hidden />
          <input
            autoFocus
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground"
            placeholder="Buscar cliente, servico, pagina..."
          />
        </label>

        <div className="mt-4 grid max-h-[58dvh] gap-1 overflow-y-auto pr-1">
          {results.length ? (
            results.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.href)}
                className={cn(
                  "admin-mobile-search-result",
                  index === activeIndex && "is-active"
                )}
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <HugeiconsIcon icon={Search01Icon} size={15} aria-hidden />
                </span>
                <span className="min-w-0 text-left">
                  <span className="block truncate text-sm font-bold">
                    {item.title}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {item.subtitle}
                  </span>
                </span>
                {item.actionLabel ? (
                  <span className="ml-auto rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold text-primary">
                    {item.actionLabel}
                  </span>
                ) : null}
              </button>
            ))
          ) : (
            <p className="rounded-2xl bg-muted/55 px-4 py-5 text-center text-sm text-muted-foreground">
              Nenhum resultado encontrado.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

type SearchItem = {
  id: string
  title: string
  subtitle: string
  href: string
  searchBlob: string
  actionLabel?: string
  kind?: "acao" | "pagina" | "dado"
}

function buildSearchItems(): SearchItem[] {
  const navigationItems = navItems.flatMap((item) => {
    const parent: SearchItem = {
      id: `nav:${item.href}`,
      title: item.title,
      subtitle: item.description,
      href: item.href,
      searchBlob: `${item.title} ${item.description} ${item.href}`,
      kind: "pagina",
    }

    if (!("children" in item) || !item.children?.length) return [parent]

    const children = item.children.map((child) => ({
      id: `nav:${child.href}`,
      title: child.title,
      subtitle: item.title,
      href: child.href,
      searchBlob: `${child.title} ${item.title} ${child.href}`,
      kind: "pagina" as const,
    }))

    return [parent, ...children]
  })

  const clientItems: SearchItem[] = database.clients
    .slice(0, 20)
    .map((client) => ({
      id: `client:${client.id}`,
      title: client.name,
      subtitle: `Cliente | ${client.phone}`,
      href: "/clientes",
      searchBlob: `${client.name} ${client.phone} ${client.email ?? ""}`,
      kind: "dado",
    }))

  const serviceItems: SearchItem[] = database.services
    .filter((service) => !service.hidden)
    .slice(0, 20)
    .map((service) => ({
      id: `service:${service.id}`,
      title: service.name,
      subtitle: "Servico",
      href: "/servicos/listagem",
      searchBlob: `${service.name} ${service.category} ${service.professionals}`,
      kind: "dado" as const,
    }))

  const professionalItems: SearchItem[] = database.professionals
    .slice(0, 20)
    .map((pro) => ({
      id: `pro:${pro.id}`,
      title: pro.name,
      subtitle: "Profissional",
      href: "/profissionais",
      searchBlob: `${pro.name} ${pro.role} ${pro.commission}`,
      kind: "dado",
    }))

  const quickActionItems: SearchItem[] = [
    {
      id: "action:new-appointment",
      title: "Novo agendamento",
      subtitle: "Acao rapida | Agenda",
      href: "/agenda",
      searchBlob:
        "novo agendamento agendar agendamento criar agendamento nova reserva agenda",
      actionLabel: "Agendar",
      kind: "acao",
    },
    {
      id: "action:new-client",
      title: "Cadastrar cliente",
      subtitle: "Acao rapida | Clientes",
      href: "/clientes/cadastrar",
      searchBlob: "novo cliente cadastrar cliente criar cliente",
      actionLabel: "Cadastrar",
      kind: "acao",
    },
    {
      id: "action:new-service",
      title: "Cadastrar servico",
      subtitle: "Acao rapida | Servicos",
      href: "/servicos/cadastrar",
      searchBlob: "novo servico cadastrar servico criar servico",
      actionLabel: "Cadastrar",
      kind: "acao",
    },
    {
      id: "action:new-professional",
      title: "Cadastrar profissional",
      subtitle: "Acao rapida | Profissionais",
      href: "/profissionais/cadastrar",
      searchBlob: "novo profissional cadastrar profissional criar profissional",
      actionLabel: "Cadastrar",
      kind: "acao",
    },
    {
      id: "action:new-plan",
      title: "Criar plano",
      subtitle: "Acao rapida | Planos",
      href: "/planos/criar",
      searchBlob: "novo plano criar plano cadastrar plano assinatura",
      actionLabel: "Criar",
      kind: "acao",
    },
    {
      id: "action:open-cash",
      title: "Abrir caixa",
      subtitle: "Acao rapida | Caixa",
      href: "/caixa",
      searchBlob: "abrir caixa iniciar caixa novo caixa",
      actionLabel: "Abrir",
      kind: "acao",
    },
    {
      id: "action:finance",
      title: "Receber pagamento",
      subtitle: "Acao rapida | Financeiro",
      href: "/financeiro",
      searchBlob: "receber pagamento cobrar pagamento nova cobranca",
      actionLabel: "Receber",
      kind: "acao",
    },
    {
      id: "action:comandas",
      title: "Nova comanda",
      subtitle: "Acao rapida | Comandas",
      href: "/caixa/comandas",
      searchBlob: "nova comanda abrir comanda criar comanda",
      actionLabel: "Abrir",
      kind: "acao",
    },
  ]

  return [
    ...quickActionItems,
    ...navigationItems,
    ...clientItems,
    ...serviceItems,
    ...professionalItems,
  ]
}

function getAdminRouteHrefs() {
  const hrefs = new Set<string>()

  navItems.forEach((item) => {
    hrefs.add(item.href)

    if ("children" in item && item.children) {
      item.children.forEach((child) => hrefs.add(child.href))
    }
  })

  return Array.from(hrefs)
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

function SidebarContent({
  pathname,
  companyData,
  onPrefetch,
  onNavigate,
}: {
  pathname: string
  companyData: { tradeName: string; logoUrl: string }
  onPrefetch?: (href: string) => void
  onNavigate?: () => void
}) {
  const activeParentHref = getParentHref(pathname)
  const [openItems, setOpenItems] = useState<string[]>(
    activeParentHref ? [activeParentHref] : []
  )

  function toggleItem(href: string) {
    setOpenItems((current) => (current.includes(href) ? [] : [href]))
  }

  function handleNavigate(href: string) {
    const nextParentHref = getParentHref(href)

    setOpenItems(nextParentHref ? [nextParentHref] : [])
    onNavigate?.()
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Link href="/dashboard" className="mb-6 flex items-center gap-3">
        {companyData.logoUrl ? (
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-background">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={companyData.logoUrl}
              alt={companyData.tradeName}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border bg-background">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={BIGOOD_MARK_DARK}
              alt="Bigood"
              className="h-full w-full object-contain"
            />
          </span>
        )}
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold">
            {companyData.tradeName}
          </span>
          <span className="block truncate text-xs text-sidebar-foreground/60">
            Painel Administrativo
          </span>
        </span>
      </Link>

      <ScrollArea className="min-h-0 flex-1 pr-2">
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            const hasChildren = "children" in item && item.children
            const isOpen = openItems.includes(item.href)

            return (
              <div key={item.href}>
                <div
                  className={cn(
                    "group flex items-center rounded-md text-sm font-medium text-sidebar-foreground/75 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive &&
                      "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                  )}
                >
                  <Link
                    href={item.href}
                    onMouseEnter={() => onPrefetch?.(item.href)}
                    onFocus={() => onPrefetch?.(item.href)}
                    onClick={() => handleNavigate(item.href)}
                    className="flex min-w-0 flex-1 items-center gap-3 px-3 py-2.5"
                  >
                    <HugeiconsIcon icon={item.icon} size={19} />
                    <span className="min-w-0 flex-1">{item.title}</span>
                  </Link>
                  {hasChildren ? (
                    <button
                      type="button"
                      aria-label={
                        isOpen ? "Fechar subopcoes" : "Abrir subopcoes"
                      }
                      onClick={() => toggleItem(item.href)}
                      className={cn(
                        "mr-2 flex size-6 items-center justify-center rounded-full bg-sidebar-accent text-sidebar-foreground/70 transition-all duration-200 hover:bg-background/80",
                        isOpen && "rotate-180",
                        isActive &&
                          isOpen &&
                          "rotate-180 bg-background/65 text-sidebar-primary-foreground"
                      )}
                    >
                      <HugeiconsIcon icon={ArrowDown01Icon} size={13} />
                    </button>
                  ) : null}
                </div>

                {hasChildren ? (
                  <div
                    className={cn(
                      "submenu-panel ml-5 grid gap-1 border-l border-sidebar-border pl-3",
                      isOpen
                        ? "submenu-panel-open mt-1"
                        : "submenu-panel-closed"
                    )}
                  >
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href

                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onMouseEnter={() => onPrefetch?.(child.href)}
                          onFocus={() => onPrefetch?.(child.href)}
                          onClick={() => handleNavigate(child.href)}
                          className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-2 text-xs font-medium text-sidebar-foreground/65 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                            isChildActive &&
                              "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
                          )}
                        >
                          <HugeiconsIcon icon={child.icon} size={16} />
                          <span>{child.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            )
          })}
        </nav>
      </ScrollArea>

      <div className="mt-4 shrink-0 rounded-md border border-sidebar-border bg-background/60 p-3">
        <p className="text-xs font-semibold">Ambiente</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Configuracao generica ativa
        </p>
      </div>
    </div>
  )
}

function getParentHref(pathname: string) {
  return navItems.find(
    (item) =>
      "children" in item && item.children && pathname.startsWith(item.href)
  )?.href
}
