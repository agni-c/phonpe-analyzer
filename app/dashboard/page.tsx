"use client"

import { motion } from 'framer-motion'
import BudgetOverview from "@/components/BudgetOverview"
import TransactionChart from "@/components/TransactionChart"
import CategoryPieChart from "@/components/CategoryPieChart"
import { MOTION_CONFIG } from "@/config/constants"

export default function DashboardPage() {
  return (
    <div className="h-full space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-7">
        <motion.div 
          className="col-span-full"
          {...MOTION_CONFIG}
        >
          <BudgetOverview
            startBalance={12000}
            endBalance={60933}
            plannedExpenses={27000}
            plannedIncome={58000}
          />
        </motion.div>
        <TransactionChart data={[]} />
        <CategoryPieChart data={[]} />
      </div>
    </div>
  )
} 