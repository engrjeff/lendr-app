"use client"

import { APP_MENU } from "@/lib/constants"

import { NavLink } from "./nav-link"

export function AppNavigation() {
  return (
    <nav className="grid items-start space-y-2 px-2 text-sm lg:px-4">
      <span className="inline-block px-3 py-2 text-[10px] uppercase text-muted-foreground">
        Menu
      </span>

      {APP_MENU.map((menu) => (
        <NavLink key={`app-menu-${menu.label}`} href={menu.href}>
          <menu.Icon className="size-4" />
          {menu.label}
        </NavLink>
      ))}
    </nav>
  )

  // return (
  //   <nav className="grid items-start space-y-1 px-2 text-sm lg:px-4">
  //     {APP_MENU.map((menu) => {
  //       if (menu.type === "simple")
  //         return (
  //           <NavLink
  //             key={`app-menu-${menu.label}`}
  //             href={"/" + segment + menu.href}
  //           >
  //             <menu.Icon className="size-4" />
  //             {menu.label}
  //           </NavLink>
  //         )

  //       return <NestedNavLink key={`app-menu-${menu.label}`} menu={menu} />
  //     })}
  //   </nav>
  // )
}
