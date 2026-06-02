"use client"

import * as React from "react"
import { LogOut } from "lucide-react"

import { AccountSecurityCard } from "@/components/client-portal/profile/account-security-card"
import { NotificationsCard } from "@/components/client-portal/profile/notifications-card"
import { ProfileForm } from "@/components/client-portal/profile/profile-form"
import { Button } from "@/components/ui/button"
import { clearPortalAuth } from "@/lib/client-portal/portal-auth"
import type { Client, PortalNotificationSettings } from "@/types/client-portal"

interface ProfileScreenProps {
  client: Client
  notifications: PortalNotificationSettings
  onSaveProfile: (client: Client) => Promise<void>
  onUpdateNotifications: (value: PortalNotificationSettings) => void
}

export function ProfileScreen({
  client,
  notifications,
  onSaveProfile,
  onUpdateNotifications,
}: ProfileScreenProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false)

  function handleLogout() {
    clearPortalAuth()
  }

  return (
    <div className="space-y-4">
      <ProfileForm client={client} onSave={onSaveProfile} />
      <div className="grid gap-4 lg:grid-cols-2">
        <AccountSecurityCard
          twoFactorEnabled={twoFactorEnabled}
          onToggleTwoFactor={setTwoFactorEnabled}
          onChangePassword={() => {}}
        />
        <NotificationsCard value={notifications} onChange={onUpdateNotifications} />
      </div>

      <div className="pt-4 pb-8">
        <Button
          variant="outline"
          className="w-full h-12 rounded-xl text-destructive border-destructive/20 hover:bg-destructive/5 hover:text-destructive active:scale-[0.98] transition-all"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 size-4" />
          Sair do portal
        </Button>
      </div>
    </div>
  )
}
