import Link from "next/link"
import { auth } from "@/auth"
import { ChevronRightIcon, MenuIcon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import { AuthFooter } from "./(auth)/components/AuthFooter"

export default async function IndexPage() {
  const session = await auth()

  return (
    <div className="flex h-full flex-col">
      <header className="relative border-b py-2 lg:py-4">
        <div className="container flex items-center px-4 lg:grid lg:grid-cols-3">
          <Link href="/" className="inline-block text-xl font-bold">
            Lendr
          </Link>

          <nav className="hidden justify-self-center text-muted-foreground lg:block">
            <Link
              href="/"
              className="px-6 text-sm transition-colors hover:text-white"
            >
              Features
            </Link>
            <Link
              href="/"
              className="px-6 text-sm transition-colors hover:text-white"
            >
              Pricing
            </Link>
            <Link
              href="/"
              className="px-6 text-sm transition-colors hover:text-white"
            >
              About
            </Link>
          </nav>

          <div className="ml-auto hidden lg:block">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/80"
              >
                Dashboard <ChevronRightIcon className="ml-2 size-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="px-6 text-sm text-muted-foreground transition-colors hover:text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/80"
                >
                  Get Started <ChevronRightIcon className="ml-2 size-4" />
                </Link>
              </>
            )}
          </div>

          <div className="group relative ml-auto lg:hidden">
            <label
              htmlFor="menu"
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
            >
              <MenuIcon className="size-6 group-has-[:checked]:hidden" />
              <XIcon className="hidden size-6 group-has-[:checked]:inline" />
              <span className="sr-only">toggle menu</span>
              <input id="menu" type="checkbox" hidden />
            </label>

            <div className="fixed inset-x-0 z-20 hidden h-96 w-screen space-y-3 bg-background p-4 group-has-[:checked]:block">
              <Link
                href="/signin"
                className={cn(
                  buttonVariants({ size: "sm", variant: "secondary" }),
                  "w-full"
                )}
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className={cn(
                  buttonVariants({ size: "sm", variant: "secondary" }),
                  "w-full bg-foreground text-background hover:bg-white/90"
                )}
              >
                Get Started
              </Link>

              <nav className="divide-y">
                <Link
                  href="/"
                  className="block py-4 transition-colors hover:text-white"
                >
                  Features
                </Link>
                <Link
                  href="/"
                  className="block py-4 transition-colors hover:text-white"
                >
                  Pricing
                </Link>
                <Link
                  href="/"
                  className="block py-4 transition-colors hover:text-white"
                >
                  About
                </Link>
              </nav>
            </div>
          </div>
        </div>
      </header>
      <main className="container grid flex-1 grid-rows-1 p-4 lg:p-6">
        <div className="py-10">
          <Link
            href="/signup"
            className="flex w-max items-center gap-2 rounded-full border px-3 py-2 text-xs transition-colors hover:bg-muted"
          >
            <span>Free</span>
            <span>- No credit card required</span>
            <ChevronRightIcon className="size-4" />
          </Link>
          <h1 className="mb-3 mt-6 text-3xl font-extrabold md:text-5xl">
            Lendr - Debt Tracker
          </h1>
          <p className="mb-6 text-muted-foreground">
            Consolidate your debt balances in one place.
          </p>

          <Link
            href="/register"
            className="inline-flex w-max items-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/80"
          >
            Get Started <ChevronRightIcon className="ml-2 size-4" />
          </Link>
        </div>
      </main>

      <AuthFooter />
    </div>
  )
}
