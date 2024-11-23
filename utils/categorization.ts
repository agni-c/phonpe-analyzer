// Define category types and their keywords
export const CATEGORY_RULES = {
  'Food & Dining': [
    'swiggy', 'zomato', 'restaurant', 'food', 'dining', 'cafe', 'hotel',
    'pizza', 'burger', 'kitchen', 'eat', 'dhaba'
  ],
  'Shopping': [
    'amazon', 'flipkart', 'myntra', 'ajio', 'retail', 'mart', 'shop',
    'store', 'market', 'mall', 'purchase'
  ],
  'Transportation': [
    'uber', 'ola', 'rapido', 'metro', 'bus', 'auto', 'taxi', 'cab',
    'fuel', 'petrol', 'diesel', 'parking'
  ],
  'Entertainment': [
    'movie', 'netflix', 'prime', 'hotstar', 'theatre', 'cinema',
    'bookmyshow', 'game', 'gaming'
  ],
  'Bills & Utilities': [
    'electricity', 'water', 'gas', 'bill', 'recharge', 'mobile',
    'broadband', 'internet', 'wifi', 'dth', 'maintenance'
  ],
  'Health & Wellness': [
    'medical', 'medicine', 'hospital', 'doctor', 'clinic', 'pharmacy',
    'health', 'fitness', 'gym'
  ],
  'Education': [
    'school', 'college', 'university', 'course', 'class', 'training',
    'workshop', 'books', 'stationery'
  ],
  'Transfer': [
    'transfer', 'sent', 'upi', 'pay', 'payment', 'credited', 'debited'
  ],
  'Others': [] // Add Others category
} as const

export type Category = keyof typeof CATEGORY_RULES

export function categorizeTransaction(description: string): Category {
  const lowerDesc = description.toLowerCase()
  
  for (const [category, keywords] of Object.entries(CATEGORY_RULES)) {
    if (keywords.some(keyword => lowerDesc.includes(keyword))) {
      return category as Category
    }
  }
  
  return 'Others'
}

export function getCategoryColor(category: Category): string {
  const colors: Record<Category, string> = {
    'Food & Dining': '#FF6B6B',
    'Shopping': '#4ECDC4',
    'Transportation': '#45B7D1',
    'Entertainment': '#96CEB4',
    'Bills & Utilities': '#FFEEAD',
    'Health & Wellness': '#D4A5A5',
    'Education': '#9B9B9B',
    'Transfer': '#FFD93D',
    'Others': '#6C757D'
  }
  
  return colors[category]
} 