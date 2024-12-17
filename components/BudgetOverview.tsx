import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"

interface BudgetOverviewProps {
  startBalance: number
  endBalance: number
  plannedExpenses: number
  plannedIncome: number
}

export default function BudgetOverview({
  startBalance,
  endBalance,
  plannedExpenses,
  plannedIncome
}: BudgetOverviewProps) {
  const percentageIncrease = ((endBalance - startBalance) / startBalance) * 100
  const savedAmount = endBalance - startBalance

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-[#FF5722]">Monthly Budget</h1>
        <div className="text-right">
          <span className="text-sm text-muted-foreground">Starting balance: </span>
          <span className="font-medium">₹{startBalance.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Balance Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Start Balance</span>
                <span className="font-medium">₹{startBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">End Balance</span>
                <span className="font-medium">₹{endBalance.toLocaleString()}</span>
              </div>
              <Progress value={(endBalance / (endBalance + startBalance)) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Savings Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">+{percentageIncrease.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Increase in total savings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">₹{savedAmount.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Saved this month</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Planned</span>
              <span className="font-medium">₹{plannedExpenses.toLocaleString()}</span>
            </div>
            <Progress value={70} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Planned</span>
              <span className="font-medium">₹{plannedIncome.toLocaleString()}</span>
            </div>
            <Progress value={85} className="mt-2" />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  )
} 