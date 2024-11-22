"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FileUpload from '@/components/FileUpload'
import TransactionSummary from '@/components/TransactionSummary'
import TransactionChart from '@/components/TransactionChart'
import CategoryPieChart from '@/components/CategoryPieChart'

interface Transaction {
  Date: string;
  Amount: string;
  Description: string;
}

interface TransactionSummary {
  totalTransactions: number;
  totalAmount: number;
  averageAmount: number;
}

interface ChartData {
  date: string;
  amount: number;
}

interface CategoryData {
  name: string;
  value: number;
}

interface AnalysisData {
  summary: TransactionSummary;
  transactionChart: ChartData[];
  categoryPieChart: CategoryData[];
}

export default function Home() {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null)

  const processData = (data: Transaction[]) => {
    // Calculate total transactions and amount
    const totalTransactions = data.length
    const totalAmount = data.reduce((sum, transaction) => sum + parseFloat(transaction.Amount), 0)
    const averageAmount = totalAmount / totalTransactions

    // Process data for transaction chart
    const transactionChartData = data.reduce((acc: Record<string, ChartData>, transaction) => {
      const date = transaction.Date.split(' ')[0]
      if (acc[date]) {
        acc[date].amount += parseFloat(transaction.Amount)
      } else {
        acc[date] = { date, amount: parseFloat(transaction.Amount) }
      }
      return acc
    }, {})

    // Process data for category pie chart
    const categoryData = data.reduce((acc: Record<string, number>, transaction) => {
      const category = transaction.Description.split(' ')[0]
      if (acc[category]) {
        acc[category] += parseFloat(transaction.Amount)
      } else {
        acc[category] = parseFloat(transaction.Amount)
      }
      return acc
    }, {})

    setAnalysisData({
      summary: { totalTransactions, totalAmount, averageAmount },
      transactionChart: Object.values(transactionChartData),
      categoryPieChart: Object.entries(categoryData).map(([name, value]) => ({ name, value })),
    })
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <motion.h1 
        className="text-4xl font-bold mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        PhonePe PDF Statement Analyzer
      </motion.h1>
      <FileUpload onFileUpload={processData} />
      <AnimatePresence>
        {analysisData && (
          <motion.div 
            className="w-full max-w-5xl mt-8 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <TransactionSummary {...analysisData.summary} />
            <div className="grid gap-4 md:grid-cols-7">
              <TransactionChart data={analysisData.transactionChart} />
              <CategoryPieChart data={analysisData.categoryPieChart} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

