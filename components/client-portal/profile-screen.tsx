"use client"

import * as React from "react"

import { AccountSecurityCard } from "@/components/client-portal/profile/account-security-card"
import { NotificationsCard } from "@/components/client-portal/profile/notifications-card"
import { ProfileForm } from "@/components/client-portal/profile/profile-form"
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

  return (
    <div className="space-y-4">
      <ProfileForm client={client} onSave={onSaveProfile} />
      <div className="grid gap-4 lg:grid-cols-2">
        <AccountSecurityCard
          twoFactorEnabled={twoFactorEnabled}
          onToggleTwoFactor={setTwoFactorEnabled}
          onChangePassword={() => {
            // Fluxo mockado para futura integracao real
          }}
        />
        <NotificationsCard value={notifications} onChange={onUpdateNotifications} />
      </div>
    </div>
  )
}
