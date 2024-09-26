import { NextResponse } from "next/server"
import { getBalancesByCategory } from "@/queries/debt"

export async function GET() {
  try {
    const data = await getBalancesByCategory()

    return NextResponse.json(data)
  } catch (error) {
    console.log(error)
    return NextResponse.json([])
  }
}
