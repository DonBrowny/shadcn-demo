'use client'
import * as React from 'react'
import { SessionProvider } from 'next-auth/react'

export interface ProvidersProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: ProvidersProps) {
  return <SessionProvider>{children}</SessionProvider>
}
