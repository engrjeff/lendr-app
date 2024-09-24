"use client"

import { Laptop, MoonStar, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ThemeToggler() {
  const { setTheme, theme } = useTheme()

  return (
    <ToggleGroup
      size="sm"
      type="single"
      className="grow-0 rounded border p-1"
      onValueChange={setTheme}
      value={theme}
    >
      <ToggleGroupItem
        value="system"
        aria-label="Toggle System"
        className="size-8"
      >
        <Laptop className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="light"
        aria-label="Toggle Light mode"
        className="size-8"
      >
        <Sun className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="dark"
        aria-label="Toggle Dark mode"
        className="size-8"
      >
        <MoonStar className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
