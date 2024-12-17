import { useTransactions } from '@/contexts/TransactionContext'
import { Transaction } from '@/types/finance'

export function useTransactionProcessing() {
  const { dispatch } = useTransactions()

  const processTransactions = (data: Transaction[]) => {
    dispatch({ type: 'ADD_TRANSACTIONS', payload: data })

    // Calculate analysis data
    const totalIncome = data
      .filter(t => parseFloat(t.Amount) > 0)
      .reduce((sum, t) => sum + parseFloat(t.Amount), 0)
    
    const totalExpenses = data
      .filter(t => parseFloat(t.Amount) < 0)
      .reduce((sum, t) => sum + Math.abs(parseFloat(t.Amount)), 0)

    const analysisData = {
      summary: {
        totalTransactions: data.length,
        totalAmount: totalIncome - totalExpenses,
        averageAmount: (totalIncome - totalExpenses) / data.length
      },
      transactions: data
    }

    dispatch({ type: 'UPDATE_ANALYSIS', payload: analysisData })
  }

  return { processTransactions }
} 