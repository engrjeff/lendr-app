"use client"

import { signOutAction } from "@/actions/auth"
import { useServerAction } from "zsa-react"

import { SubmitButton } from "@/components/ui/submit-button"

export function SignOutButton() {
  const action = useServerAction(signOutAction)

  async function handleSignout() {
    try {
      await action.execute()
    } catch (error) {}
  }

  return (
    <SubmitButton
      type="submit"
      onClick={handleSignout}
      loading={action.isPending}
    >
      Sign Out
    </SubmitButton>
  )
}
