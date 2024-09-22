import * as React from "react"

import { cn } from "@/lib/utils"

import { Button } from "./button"
import { Spinner } from "./spinner"

interface SubmitButtonProps extends React.ComponentProps<typeof Button> {
  loading?: boolean
}

export function SubmitButton({
  children,
  className,
  loading,
  type = "submit",
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      disabled={loading || props.disabled}
      className={cn("relative", className)}
      type={type}
      {...props}
    >
      {loading ? (
        <span className="absolute inset-0 left-1/2 top-1/2 flex w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
          <Spinner />
        </span>
      ) : null}
      <span className={loading ? "invisible" : ""}>{children}</span>
    </Button>
  )
}
