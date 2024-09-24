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
      className="flex w-max text-foreground items-center text-sm hover:underline px-0"
    >
      <ArrowLeftIcon className="mr-3 size-4" /> Back
    </Button>
  )
}
