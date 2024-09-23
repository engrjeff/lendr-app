"use client"

import { startTransition, useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface StatusFilterProps {
  defaultValue: string
  options: Array<{ label: string; value: string }>
}

export function StatusFilter({ options, defaultValue }: StatusFilterProps) {
  const paramKey = "status"

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const currentStatus = searchParams.get(paramKey)

  const createQueryString = useCallback(
    (status: string) => {
      const params = new URLSearchParams(
        searchParams ? searchParams : undefined
      )

      if (status !== null) {
        params.set(paramKey, status)
      } else {
        params.delete(paramKey)

        return ""
      }

      return params.toString()
    },
    [searchParams]
  )

  function handleFilterEvent(value: string) {
    if (!value) {
      startTransition(() => {
        router.push(pathname)
      })

      return
    }

    const queryString = createQueryString(value)

    startTransition(() => {
      router.push(`${pathname}?${queryString}`)
    })
  }

  return (
    <>
      <Tabs
        defaultValue={currentStatus ?? defaultValue}
        onValueChange={handleFilterEvent}
      >
        <TabsList>
          {options.map((option) => (
            <TabsTrigger key={option.value} value={option.value}>
              {option.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </>
  )
}
