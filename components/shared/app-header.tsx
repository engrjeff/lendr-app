import { auth } from "@/auth"

import { DynamicHeading } from "./dynamic-heading"
import { HeaderToolbar } from "./header-toolbar"
import MobileMenu from "./mobile-menu"
import UserMenu from "./user-menu"

export async function AppHeader() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-4 border-b bg-background px-2 lg:px-6">
      <MobileMenu />
      <DynamicHeading username={session?.user?.name!} />
      <div className="ml-auto flex items-center space-x-4">
        <HeaderToolbar />
        <UserMenu user={session?.user} />
      </div>
    </header>
  )
}
