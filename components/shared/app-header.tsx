import { auth } from "@/auth"

import { DynamicHeading } from "./dynamic-heading"
import UserMenu from "./user-menu"

export async function AppHeader() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-4 border-b bg-background px-4 lg:px-6">
      {/* <MobileMenu /> */}
      <p className="absolute left-3 shrink-0 font-bold lg:hidden">Lendr</p>
      <DynamicHeading username={session?.user?.name!} />
      <div className="ml-auto flex items-center space-x-4">
        <UserMenu user={session?.user} />
      </div>
    </header>
  )
}
