import React from "react"

import { AuthFooter } from "@/app/(auth)/components/AuthFooter"

import { AppHeader } from "./app-header"
import { AppSideBar } from "./app-sidebar"

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <AppSideBar />
      <div className="flex min-h-full flex-col lg:pl-sidebar">
        <AppHeader />
        <main className="grid flex-1 grid-rows-1 p-3 lg:p-6">{children}</main>
        <AuthFooter />
      </div>
    </div>
  )
}

export default AppLayout
