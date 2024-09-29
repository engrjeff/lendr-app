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
        <div className="container flex max-w-screen-lg items-center px-4 lg:grid lg:grid-cols-3">
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
                Go to Dashboard <ChevronRightIcon className="ml-2 size-4" />
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

            <div className="fixed inset-x-0 z-20 hidden h-[70vh] w-screen space-y-3 bg-background p-4 group-has-[:checked]:block">
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
      <main className="container grid max-w-screen-lg flex-1 grid-rows-1 p-4 lg:p-6">
        <section className="flex flex-col items-center gap-6 py-10">
          <Link
            href={session?.user ? "/dashboard" : "/signup"}
            className="flex w-max items-center gap-2 rounded-full border px-3 py-2 text-xs transition-colors hover:bg-muted"
          >
            <span>Free</span>
            <span>- No credit card required</span>
            <ChevronRightIcon className="size-4" />
          </Link>
          <h1 className="mb-3 mt-6 text-center text-5xl font-extrabold md:text-6xl">
            Lendr - Debt & Funds Tracker
          </h1>
          <p className="mb-6 px-4 text-center text-lg text-muted-foreground">
            Consolidate your debt and fund balances in one place.
          </p>

          {session?.user ? (
            <Link
              href="/dashboard"
              className="inline-flex w-max items-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/80"
            >
              Go to Dashboard <ChevronRightIcon className="ml-2 size-4" />
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/register"
                className="inline-flex w-max items-center rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-colors hover:bg-foreground/80"
              >
                Get Started <ChevronRightIcon className="ml-2 size-4" />
              </Link>

              <Link
                href="/signin"
                className="inline-flex w-max items-center rounded-full bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                Sign In <ChevronRightIcon className="ml-2 size-4" />
              </Link>
            </div>
          )}
        </section>
      </main>

      <AuthFooter />
    </div>
  )
}
