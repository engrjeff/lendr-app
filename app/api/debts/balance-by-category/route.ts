import { NextRequest, NextResponse } from "next/server"
import { getBalancesByCategory } from "@/queries/debt"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const month = searchParams.get("month") ?? undefined

    const data = await getBalancesByCategory({ month })

    return NextResponse.json(data)
  } catch (error) {
    console.log(error)
    return NextResponse.json([])
  }
}
