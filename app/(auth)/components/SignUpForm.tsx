"use client"

import { useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { registerUser } from "@/actions/auth"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/password-input"
import { Separator } from "@/components/ui/separator"
import { SubmitButton } from "@/components/ui/submit-button"
import { FormError } from "@/components/shared/form-error"

export function SignUpForm() {
  const emailRef = useRef<HTMLInputElement | null>(null)

  const router = useRouter()

  const action = useServerAction(registerUser, {
    onSuccess(args) {
      if (args.data.status === "success") {
        toast.success(args.data.message, { position: "top-center" })

        router.push("/signin")
      }
    },
    onError(args) {
      if (args.err.code === "PRECONDITION_FAILED") {
        toast.error(args.err.message, { position: "top-center" })

        emailRef.current?.focus()
      }

      if (args.err.code === "ERROR") {
        toast.error(args.err.message, { position: "top-center" })
      }
    },
  })

  return (
    <div className="container max-w-md space-y-2">
      <h1 className="text-xl font-semibold">Create a Lendr account</h1>
      <p className="pb-5 text-sm text-muted-foreground">
        {"Already have an account? "}
        <Link
          href="/signin"
          className="font-medium text-blue-500 hover:underline"
        >
          Log in
        </Link>
        .
      </p>
      <form onChange={action.reset} action={action.executeFormAction}>
        <fieldset className="space-y-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              autoFocus
              placeholder="Enter your name"
              name="name"
              id="name"
              className="bg-muted/30"
            />
            <FormError error={action.error?.fieldErrors?.name?.at(0)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              placeholder="youremail@example.com"
              name="email"
              id="email"
              className="bg-muted/30"
              ref={emailRef}
            />
            <FormError error={action.error?.fieldErrors?.email?.at(0)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              name="password"
              id="password"
              placeholder="Enter your password"
              className="bg-muted/30"
            />
            <FormError error={action.error?.fieldErrors?.password?.at(0)} />
          </div>
          <div className="pt-6">
            <SubmitButton loading={action.isPending} className="w-full">
              {action.isPending ? "Please wait..." : "Create Account"}
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
    </div>
  )
}
