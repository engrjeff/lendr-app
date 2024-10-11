import { NextRequest, NextResponse } from "next/server"
import { getDebtsForMonth } from "@/queries/debt"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const month = searchParams.get("month") ?? undefined

    const debts = await getDebtsForMonth({ month })

    return NextResponse.json(debts)
  } catch (error) {
    console.log(error)
    return NextResponse.json([])
  }
}
