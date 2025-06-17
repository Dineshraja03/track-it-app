
import { Category } from '@/types/transaction';

export const defaultCategories: Category[] = [
  // Income Categories
  { id: 'salary', name: 'Salary', icon: '💼', color: '#10B981', type: 'income' },
  { id: 'freelance', name: 'Freelance', icon: '💻', color: '#10B981', type: 'income' },
  { id: 'investment', name: 'Investment', icon: '📈', color: '#10B981', type: 'income' },
  { id: 'business', name: 'Business', icon: '🏢', color: '#10B981', type: 'income' },
  
  // Expense Categories
  { id: 'food', name: 'Food & Dining', icon: '🍽️', color: '#F97316', type: 'expense' },
  { id: 'auto', name: 'Auto/Taxi', icon: '🚗', color: '#8B5CF6', type: 'expense' },
  { id: 'petrol', name: 'Petrol', icon: '⛽', color: '#EF4444', type: 'expense' },
  { id: 'rent', name: 'Rent', icon: '🏠', color: '#6366F1', type: 'expense' },
  { id: 'groceries', name: 'Groceries', icon: '🛒', color: '#059669', type: 'expense' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#EC4899', type: 'expense' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#F59E0B', type: 'expense' },
  { id: 'healthcare', name: 'Healthcare', icon: '🏥', color: '#DC2626', type: 'expense' },
  { id: 'education', name: 'Education', icon: '📚', color: '#7C3AED', type: 'expense' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: '#0EA5E9', type: 'expense' },
  { id: 'upi', name: 'UPI/Online', icon: '📱', color: '#10B981', type: 'both' },
  { id: 'bills', name: 'Bills', icon: '📄', color: '#6B7280', type: 'expense' },
  { id: 'other', name: 'Other', icon: '💳', color: '#6B7280', type: 'both' },
];

export const getCategoryById = (id: string): Category | undefined => {
  return defaultCategories.find(cat => cat.id === id);
};

export const getCategoriesByType = (type: 'income' | 'expense'): Category[] => {
  return defaultCategories.filter(cat => cat.type === type || cat.type === 'both');
};
