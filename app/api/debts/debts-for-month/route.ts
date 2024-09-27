import { NextResponse } from "next/server"
import { getDebtsForMonth } from "@/queries/debt"

export async function GET() {
  try {
    const debts = await getDebtsForMonth()

    return NextResponse.json(debts)
  } catch (error) {
    console.log(error)
    return NextResponse.json([])
  }
}
