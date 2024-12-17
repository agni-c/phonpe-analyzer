"use client"

import { createContext, useContext, useReducer, ReactNode } from 'react'
import { 
  Transaction, 
  PhonePeTransaction,
  AnalysisData, 
  Category, 
  Budget 
} from '@/types/finance'

type State = {
  phonePeTransactions: PhonePeTransaction[]
  transactions: Transaction[]
  categories: Category[]
  budgets: Budget[]
  analysisData: AnalysisData | null
}

type Action = 
  | { type: 'ADD_PHONPE_TRANSACTIONS'; payload: PhonePeTransaction[] }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'UPDATE_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'UPDATE_ANALYSIS'; payload: AnalysisData }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'ADD_BUDGET'; payload: Budget }
  | { type: 'UPDATE_BUDGET'; payload: Budget }
  | { type: 'CLEAR_DATA' }

const initialState: State = {
  phonePeTransactions: [],
  transactions: [],
  categories: [],
  budgets: [],
  analysisData: null
}

function transactionReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_PHONPE_TRANSACTIONS': {
      const mergedTransactions = [...state.phonePeTransactions, ...action.payload]
      // Remove duplicates based on Date, Amount, and Description
      const uniqueTransactions = Array.from(
        new Map(
          mergedTransactions.map(t => [
            `${t.Date}-${t.Amount}-${t.Description}`,
            t
          ])
        ).values()
      )
      return { ...state, phonePeTransactions: uniqueTransactions }
    }

    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [...state.transactions, action.payload]
      }

    case 'UPDATE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.map(t => 
          t.id === action.payload.id ? action.payload : t
        )
      }

    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload)
      }
    
    case 'UPDATE_ANALYSIS':
      return { ...state, analysisData: action.payload }
    
    case 'ADD_CATEGORY':
      return { 
        ...state, 
        categories: [...state.categories, action.payload]
      }
    
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category => 
          category.id === action.payload.id ? action.payload : category
        )
      }
    
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
        budgets: state.budgets.filter(budget => budget.categoryId !== action.payload)
      }
    
    case 'ADD_BUDGET':
      return {
        ...state,
        budgets: [...state.budgets, action.payload]
      }
    
    case 'UPDATE_BUDGET':
      return {
        ...state,
        budgets: state.budgets.map(budget => 
          budget.categoryId === action.payload.categoryId &&
          budget.subCategoryId === action.payload.subCategoryId
            ? action.payload
            : budget
        )
      }
    
    case 'CLEAR_DATA':
      return initialState
    
    default:
      return state
  }
}

const TransactionContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
} | undefined>(undefined)

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(transactionReducer, initialState)

  return (
    <TransactionContext.Provider value={{ state, dispatch }}>
      {children}
    </TransactionContext.Provider>
  )
}

export function useTransactions() {
  const context = useContext(TransactionContext)
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider')
  }
  return context
}