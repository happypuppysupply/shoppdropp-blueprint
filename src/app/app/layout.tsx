'use client'

import { StoreLayout } from '@/components/dashboard/StoreLayout'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <StoreLayout>{children}</StoreLayout>
}
