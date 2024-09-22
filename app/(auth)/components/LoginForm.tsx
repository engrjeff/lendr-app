"use client"

import Link from "next/link"
import { login } from "@/actions/auth"
import { useServerAction } from "zsa-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { Separator } from "@/components/ui/separator"
import { SubmitButton } from "@/components/ui/submit-button"
import { FormError } from "@/components/shared/form-error"

export function LoginForm() {
  const logInAction = useServerAction(login)

  return (
    <div className="container max-w-sm space-y-3 rounded-md border p-6">
      <h1 className="text-center text-xl font-semibold">Lendr App</h1>
      <p className="text-center text-muted-foreground">
        Log in to your account
      </p>
      <form onChange={logInAction.reset} action={logInAction.executeFormAction}>
        <fieldset className="space-y-2">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              placeholder="youremail@example.com"
              name="email"
              id="email"
            />
            <FormError error={logInAction.error?.fieldErrors?.email?.at(0)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              name="password"
              id="password"
              placeholder="Enter your password"
            />
            <FormError
              error={logInAction.error?.fieldErrors?.password?.at(0)}
            />
            {logInAction.error?.code === "ERROR" ? (
              <FormError error={logInAction.error?.message} />
            ) : null}
          </div>
          <div className="pt-6">
            <SubmitButton loading={logInAction.isPending} className="w-full">
              {logInAction.isPending ? "Please wait..." : "Sign In"}
            </SubmitButton>
          </div>
        </fieldset>
      </form>
      <div className="relative hidden py-4">
        <Separator />
        <span className="absolute left-1/2 top-2.5 -translate-x-1/2 -translate-y-1.5 bg-background px-1 text-sm">
          or continue with
        </span>
      </div>
      <p className="pt-4 text-center text-sm">
        No account yet?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          Create an Account
        </Link>
      </p>
    </div>
  )
}
