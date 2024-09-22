import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Transactions",
}

interface PageProps {
  searchParams: Record<string, string>
}

async function TransactionsPage({ searchParams }: PageProps) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Transactions</h1>
          <p className="text-sm text-muted-foreground">
            List of your transactions.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TransactionsPage
