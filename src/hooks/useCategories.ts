import { useState, useEffect } from 'react';
import { Category } from '@/types/transaction';
import { defaultCategories } from '@/data/categories';

const STORAGE_KEY = 'rupee-sahayak-custom-categories';

export const useCategories = () => {
  const [customCategories, setCustomCategories] = useState<Category[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCustomCategories(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse custom categories:', error);
      }
    }
  }, []);

  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: `custom-${Date.now()}`,
    };
    
    const updated = [...customCategories, newCategory];
    setCustomCategories(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newCategory;
  };

  const deleteCategory = (id: string) => {
    const updated = customCategories.filter(cat => cat.id !== id);
    setCustomCategories(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const getAllCategories = (): Category[] => {
    return [...defaultCategories, ...customCategories];
  };

  const getCategoriesByType = (type: 'income' | 'expense'): Category[] => {
    const allCategories = getAllCategories();
    return allCategories.filter(cat => cat.type === type || cat.type === 'both');
  };

  const getCategoryById = (id: string): Category | undefined => {
    return getAllCategories().find(cat => cat.id === id);
  };

  const isCustomCategory = (id: string): boolean => {
    return id.startsWith('custom-');
  };

  return {
    customCategories,
    addCategory,
    deleteCategory,
    getAllCategories,
    getCategoriesByType,
    getCategoryById,
    isCustomCategory,
  };
};
