import { NextResponse } from "next/server"
import { getDebts } from "@/queries/debt"

export async function GET() {
  try {
    const recentDebts = await getDebts({
      limit: 2,
      status: "IN_PROGRESS",
    })

    return NextResponse.json(recentDebts)
  } catch (error) {
    console.log(error)
    return NextResponse.json([])
  }
}
