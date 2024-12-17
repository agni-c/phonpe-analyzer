// Legacy types for PhonePe statement
export interface PhonePeTransaction {
  Date: string;
  Amount: string;
  Description: string;
}

// New types for money manager
export interface Category {
  id: string;
  name: string;
  budget: number;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  budget: number;
  parentCategoryId: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  description: string;
  categoryId?: string;
  subCategoryId?: string;
  type: 'INCOME' | 'EXPENSE';
  paymentMethod: string;
  notes?: string;
}

export interface Budget {
  categoryId: string;
  subCategoryId?: string;
  plannedAmount: number;
  period: 'MONTHLY' | 'YEARLY';
  startDate: string;
}

export interface CategoryBreakdown {
  total: number;
  count: number;
  subCategories: {
    [subCategoryId: string]: {
      total: number;
      count: number;
    }
  }
}

export interface BudgetUtilization {
  planned: number;
  actual: number;
  subCategories: {
    [subCategoryId: string]: {
      planned: number;
      actual: number;
    }
  }
}

export interface TransactionSummary {
  totalTransactions: number;
  totalAmount: number;
  averageAmount: number;
  categoryBreakdown: {
    [categoryId: string]: CategoryBreakdown;
  };
  budgetUtilization: {
    [categoryId: string]: BudgetUtilization;
  };
}

export interface AnalysisData {
  summary: TransactionSummary;
  transactions: PhonePeTransaction[];
  categories: Category[];
}