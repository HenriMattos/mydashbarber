import Image from "next/image"

import { BIGOOD_LOGO, BIGOOD_LOGO_WHITE } from "@/lib/brand-assets"

export function BrandMark({
  compact = false,
  inverse = false,
}: {
  compact?: boolean
  inverse?: boolean
}) {
  const logoSrc = inverse ? BIGOOD_LOGO_WHITE : BIGOOD_LOGO

  return (
    <span
      className={`inline-flex min-w-0 flex-col ${
        inverse ? "text-white" : "text-[var(--landing-primary-dark)]"
      }`}
    >
      <Image
        src={logoSrc}
        alt="Bigood"
        width={320}
        height={92}
        className={`w-auto ${compact ? "h-8 sm:h-9" : "h-10 sm:h-11"}`}
        priority={false}
      />
      {compact ? null : (
        <span
          className={`mt-2 block text-xs font-semibold ${
            inverse ? "text-white/70" : "text-[var(--landing-foreground-soft)]"
          }`}
        >
          Gestão premium para barbearias
        </span>
      )}
    </span>
  )
}
