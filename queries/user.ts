import { auth } from "@/auth"

export async function getUser() {
  try {
    const session = await auth()

    if (!session?.user) throw new Error("User not authenticated")

    return session.user
  } catch (error) {
    return null
  }
}
