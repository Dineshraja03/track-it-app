
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const { getBalance, getTodayTotal, getMonthlyTotal, transactions } = useTransactions();

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

  return (
    <div className="p-4 pb-24 space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="text-center pt-4">
        <h1 className="text-2xl font-bold text-gray-800">Good day! 👋</h1>
        <p className="text-gray-600 mt-1">Manage your expenses smartly</p>
      </div>

      {/* Balance Card */}
      <Card className="bg-gradient-to-r from-rupee-green to-emerald-600 text-white shadow-lg">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-sm opacity-90 mb-1">Total Balance</p>
            <h2 className="text-3xl font-bold">{formatCurrency(balance)}</h2>
          </div>
        </CardContent>
      </Card>

      {/* Today & Monthly Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">Today</p>
                <p className="text-lg font-semibold text-red-600">
                  {formatCurrency(todaySpending)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-xs text-gray-600">This Month</p>
                <p className="text-lg font-semibold text-orange-600">
                  {formatCurrency(monthlySpending)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="grid grid-cols-2 gap-3">
            <button className="p-3 bg-rupee-light rounded-lg text-center hover:bg-emerald-200 transition-colors">
              <span className="text-2xl block mb-1">💰</span>
              <span className="text-sm font-medium text-rupee-dark">Add Income</span>
            </button>
            <button className="p-3 bg-red-50 rounded-lg text-center hover:bg-red-100 transition-colors">
              <span className="text-2xl block mb-1">💸</span>
              <span className="text-sm font-medium text-red-700">Add Expense</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      {recentTransactions.length > 0 && (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {transaction.category === 'food' ? '🍽️' : 
                     transaction.category === 'auto' ? '🚗' : 
                     transaction.category === 'petrol' ? '⛽' : 
                     transaction.category === 'salary' ? '💼' : '💳'}
                  </span>
                  <div>
                    <p className="font-medium text-gray-800 capitalize">{transaction.category}</p>
                    <p className="text-xs text-gray-600">{new Date(transaction.date).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
                <p className={cn(
                  "font-semibold",
                  transaction.type === 'income' ? 'text-rupee-green' : 'text-red-600'
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
