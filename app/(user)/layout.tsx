import { ReactNode } from "react"

import AppLayout from "@/components/shared/app-layout"

function ProtectedLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>
}

export default ProtectedLayout
