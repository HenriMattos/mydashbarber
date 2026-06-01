"use client"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import type { ReactNode } from "react"

interface AuthCardProps {
  children: ReactNode
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-6 sm:p-8">
        {children}
      </CardContent>
    </Card>
  )
}
