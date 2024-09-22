import { auth } from "@/auth"

export default async function IndexPage() {
  const session = await auth()

  return (
    <main className="container flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <h1>Hello World</h1>
    </main>
  )
}
