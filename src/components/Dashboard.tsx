
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  onNavigateToAdd?: (type: 'income' | 'expense') => void;
}

const Dashboard = ({ onNavigateToAdd }: DashboardProps) => {
  const { getBalance, getTodayTotal, getMonthlyTotal, transactions } = useTransactions();
  const [animatingCard, setAnimatingCard] = useState<string | null>(null);

  const balance = getBalance();
  const todaySpending = getTodayTotal();
  const monthlySpending = getMonthlyTotal();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const recentTransactions = transactions.slice(0, 3);

  const handleQuickAction = (type: 'income' | 'expense') => {
    setAnimatingCard(type);
    setTimeout(() => {
      setAnimatingCard(null);
      if (onNavigateToAdd) {
        onNavigateToAdd(type);
      }
    }, 200);
  };

  return (
    <div className="p-4 pb-24 space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="text-center pt-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">Track it 📈</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1 transition-colors duration-300">Manage your expenses smartly</p>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-sm opacity-90 mb-1 font-medium">Total Balance</p>
            <h2 className="text-4xl font-bold text-white animate-fade-in">{formatCurrency(balance)}</h2>
            <p className="text-xs opacity-75 mt-1">Available funds</p>
          </div>
        </CardContent>
      </Card>

      {/* Today & Monthly Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-sm border-blue-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg transition-colors duration-300">
                <TrendingDown className="h-4 w-4 text-red-600 transition-transform duration-300 hover:scale-110" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">Today</p>
                <p className="text-lg font-semibold text-red-600 transition-all duration-300">
                  {formatCurrency(todaySpending)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-blue-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg transition-colors duration-300">
                <TrendingUp className="h-4 w-4 text-orange-600 transition-transform duration-300 hover:scale-110" />
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">This Month</p>
                <p className="text-lg font-semibold text-orange-600 transition-all duration-300">
                  {formatCurrency(monthlySpending)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-sm border-blue-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleQuickAction('income')}
              className={cn(
                "p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center transition-all duration-300 hover:bg-green-100 dark:hover:bg-green-900/30 hover:scale-105 active:scale-95",
                animatingCard === 'income' && "scale-95"
              )}
            >
              <span className="text-2xl block mb-1 transition-transform duration-300 hover:scale-110">💰</span>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">Add Income</span>
            </button>
            <button 
              onClick={() => handleQuickAction('expense')}
              className={cn(
                "p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center transition-all duration-300 hover:bg-red-100 dark:hover:bg-red-900/30 hover:scale-105 active:scale-95",
                animatingCard === 'expense' && "scale-95"
              )}
            >
              <span className="text-2xl block mb-1 transition-transform duration-300 hover:scale-110">💸</span>
              <span className="text-sm font-medium text-red-700 dark:text-red-400">Add Expense</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <Card className="shadow-sm border-blue-100 dark:border-gray-700 hover:shadow-md transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            {recentTransactions.map((transaction, index) => (
              <div 
                key={transaction.id} 
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-300 hover:scale-[1.02] animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl transition-transform duration-300 hover:scale-110">
                    {transaction.category === 'food' ? '🍽️' : 
                     transaction.category === 'auto' ? '🚗' : 
                     transaction.category === 'petrol' ? '⛽' : 
                     transaction.category === 'salary' ? '💼' : '💳'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200 capitalize">{transaction.category}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{new Date(transaction.date).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
                <p className={cn(
                  "font-semibold transition-colors duration-300",
                  transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                )}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
