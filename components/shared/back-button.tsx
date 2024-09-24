"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { Button } from "../ui/button"

export function BackButton() {
  const router = useRouter()

  return (
    <Button
      onClick={router.back}
      variant="link"
      className="flex w-max items-center px-0 text-sm text-foreground hover:underline"
    >
      <ArrowLeftIcon className="mr-3 size-4" /> Back
    </Button>
  )
}
