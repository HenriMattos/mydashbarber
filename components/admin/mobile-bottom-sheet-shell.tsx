"use client"

import { type ReactNode, type Ref } from "react"
import { type IconSvgElement } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type MobileBottomSheetShellProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  subtitle: string
  icon: IconSvgElement
  children: ReactNode
  footer?: ReactNode
  bodyClassName?: string
  contentClassName?: string
  contentRef?: Ref<HTMLDivElement>
}

export function MobileBottomSheetShell({
  open,
  onOpenChange,
  title,
  subtitle,
  icon,
  children,
  footer,
  bodyClassName,
  contentClassName,
  contentRef,
}: MobileBottomSheetShellProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className={cn(
          "left-1/2 right-auto z-[90] h-[92dvh] max-h-[92dvh] w-[min(100vw-2rem,390px)] -translate-x-1/2 overflow-hidden rounded-t-3xl border-x border-t bg-background shadow-2xl",
          contentClassName
        )}
        contentRef={contentRef}
        overlayClassName="z-[89] bg-black/45 backdrop-blur-sm"
        hideHandle
      >
        <SheetHeader className="border-b px-4 py-3">
          <div className="flex min-w-0 items-start gap-2.5">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
              <HugeiconsIcon icon={icon} size={17} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <SheetTitle className="truncate text-base leading-tight">
                {title}
              </SheetTitle>
              {subtitle ? (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {subtitle}
                </p>
              ) : null}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="-mr-1 rounded-full"
              aria-label="Fechar"
              onClick={() => onOpenChange(false)}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={17} />
            </Button>
          </div>
        </SheetHeader>

        <SheetBody className={cn("px-4 py-3", bodyClassName)}>
          {children}
        </SheetBody>

        {footer ? (
          <SheetFooter className="border-t bg-background/95 px-4 py-3">
            {footer}
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
