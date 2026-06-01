/* eslint-disable @next/next/no-img-element */
import { AtSign, Globe, MapPin, MessageCircle, Phone } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Barbershop } from "@/types/client-portal"

interface BarbershopHeroProps {
  barbershop: Barbershop
}

export function BarbershopHero({ barbershop }: BarbershopHeroProps) {
  return (
    <section className="premium-card motion-rise min-w-0 overflow-hidden rounded-[1.375rem] border bg-card p-0 text-card-foreground shadow-sm">
      <div className="relative h-44 w-full overflow-hidden sm:h-56 md:h-72 lg:h-[23rem]">
        <img
          src={barbershop.bannerUrl}
          alt={barbershop.name}
          className="size-full object-cover"
          style={{
            objectPosition: `${barbershop.bannerPlacement.x}% ${barbershop.bannerPlacement.y}%`,
            transform: `scale(${barbershop.bannerPlacement.zoom})`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/45 via-transparent to-transparent" />
        <div className="absolute right-4 bottom-6 flex gap-2 sm:right-6">
          <span className="rounded-full bg-background/70 px-5 py-2 text-xs font-bold text-foreground uppercase shadow-sm backdrop-blur-md">
            Portal do cliente
          </span>
        </div>
      </div>
      <div className="space-y-3 px-6 pb-6 md:px-8 md:pb-8">
        <Avatar className="-mt-14 mb-8 size-28 shadow-lg md:size-32">
          <AvatarImage
            src={barbershop.logoUrl}
            alt={barbershop.name}
            style={{
              objectPosition: `${barbershop.logoPlacement.x}% ${barbershop.logoPlacement.y}%`,
              transform: `scale(${barbershop.logoPlacement.zoom})`,
            }}
          />
          <AvatarFallback>{barbershop.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl md:text-4xl">{barbershop.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base md:text-lg">
            {barbershop.slogan}
          </p>
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          {barbershop.description}
        </p>
        <div className="flex flex-wrap gap-2 pt-1 text-xs text-foreground md:text-sm">
          <p className="inline-flex max-w-full items-center gap-1.5 rounded-full border bg-background px-3 py-2">
            <MapPin className="size-3.5" />
            <span className="truncate">{barbershop.address}</span>
          </p>
          <p className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-2">
            <Phone className="size-3.5" />
            <span>{barbershop.phone}</span>
          </p>
          
          {barbershop.social?.instagram && (
            <a
              href={`https://instagram.com/${barbershop.social.instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-2 hover:bg-muted transition-colors"
            >
              <AtSign className="size-3.5" />
              <span className="hidden sm:inline">Instagram</span>
            </a>
          )}
          {barbershop.social?.whatsapp && (
            <a
              href={`https://wa.me/${barbershop.social.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-2 hover:bg-muted transition-colors"
            >
              <MessageCircle className="size-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          )}
          {barbershop.social?.facebook && (
            <a
              href={`https://facebook.com/${barbershop.social.facebook}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-2 hover:bg-muted transition-colors"
            >
              <Globe className="size-3.5" />
              <span className="hidden sm:inline">Facebook</span>
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
