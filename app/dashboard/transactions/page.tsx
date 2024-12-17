"use client"

import TransactionDataTable from "@/components/TransactionDataTable"

export default function TransactionsPage() {
  return (
    <div className="h-full space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
      <TransactionDataTable transactions={[]} />
    </div>
  )
} 