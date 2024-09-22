import { AppNavigation } from "./app-navigation"

export async function AppSideBar() {
  return (
    <div className="fixed z-20 hidden h-screen max-h-screen w-[240px] overflow-y-auto border-r bg-background md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center gap-3 border-b px-6">
          <p className="text-xl font-semibold">Lendr</p>
        </div>
        <div className="flex-1">
          <AppNavigation />
        </div>
      </div>
    </div>
  )
}
