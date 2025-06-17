
import { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';

const STORAGE_KEY = 'rupee-sahayak-transactions';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTransactions(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading transactions:', error);
      }
    }
  }, []);

  const saveTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newTransactions));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    saveTransactions([newTransaction, ...transactions]);
  };

  const updateTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    const updated = transactions.map(t => 
      t.id === id ? { ...t, ...updatedTransaction } : t
    );
    saveTransactions(updated);
  };

  const deleteTransaction = (id: string) => {
    const filtered = transactions.filter(t => t.id !== id);
    saveTransactions(filtered);
  };

  const getBalance = () => {
    return transactions.reduce((acc, t) => {
      return t.type === 'income' ? acc + t.amount : acc - t.amount;
    }, 0);
  };

  const getTodayTotal = () => {
    const today = new Date().toDateString();
    return transactions
      .filter(t => new Date(t.date).toDateString() === today && t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const getMonthlyTotal = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear && 
               t.type === 'expense';
      })
      .reduce((acc, t) => acc + t.amount, 0);
  };

  const getCategoryTotals = () => {
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });
    return categoryTotals;
  };

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getBalance,
    getTodayTotal,
    getMonthlyTotal,
    getCategoryTotals,
  };
};
