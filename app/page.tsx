import Link from "next/link"
import { auth } from "@/auth"
import { ChevronRightIcon } from "lucide-react"

export default async function IndexPage() {
  const session = await auth()

  return (
    <>
      <header className="border-b py-4">
        <div className="container grid grid-cols-3 items-center">
          <Link href="/" className="text-xl font-bold">
            Lendr
          </Link>

          <nav className="justify-self-center text-muted-foreground">
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

          <div className="ml-auto">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/80"
              >
                Get to Dashboard <ChevronRightIcon className="ml-2 size-4" />
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
                  className="inline-flex items-center rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/80"
                >
                  Get Started <ChevronRightIcon className="ml-2 size-4" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="container flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <h1>Hello World</h1>
      </main>
    </>
  )
}
