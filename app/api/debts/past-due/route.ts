import { NextResponse } from "next/server"
import { getPastDueDebts } from "@/queries/debt"

export async function GET() {
  try {
    const debts = await getPastDueDebts()

    return NextResponse.json(debts)
  } catch (error) {
    console.log(error)
    return NextResponse.json([])
  }
}
