
import { TrendingUp, TrendingDown, Download, Trash2 } from 'lucide-react';
import { useTransactions } from '@/hooks/useTransactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface DashboardProps {
  onNavigateToAdd?: (type: 'income' | 'expense') => void;
}

const Dashboard = ({ onNavigateToAdd }: DashboardProps) => {
  const { getBalance, getTodayTotal, getMonthlyTotal, transactions } = useTransactions();
  const [animatingCard, setAnimatingCard] = useState<string | null>(null);
  const { toast } = useToast();

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

  const handleExportData = () => {
    const transactions = localStorage.getItem('rupee-sahayak-transactions');
    if (!transactions) {
      toast({
        title: "No Data",
        description: "No transactions to export",
        variant: "destructive",
      });
      return;
    }

    const dataStr = JSON.stringify(JSON.parse(transactions), null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `track-it-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Data Exported",
      description: "Your data has been downloaded successfully",
    });
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to delete all transactions? This action cannot be undone.')) {
      localStorage.removeItem('rupee-sahayak-transactions');
      toast({
        title: "Data Cleared",
        description: "All transactions have been deleted",
      });
      window.location.reload();
    }
  };

  const handleCreatorLink = () => {
    window.open('https://dineshcreates.vercel.app/', '_blank');
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
      {/* Removed recent transactions section */}

      {/* Data Management */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 dark:text-white">Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button
              onClick={handleExportData}
              className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="mr-2" size={16} />
              Export Data (JSON)
            </Button>

            <Button
              onClick={handleClearData}
              variant="destructive"
              className="w-full justify-start"
            >
              <Trash2 className="mr-2" size={16} />
              Clear All Data
            </Button>
          </div>

          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Backup Reminder:</strong> Your data is stored locally on this device. 
              Export regularly to avoid losing your transaction history.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* App Info */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800 dark:text-white">About</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-center py-4">
            <div className="text-4xl mb-2">
              <img 
                src="/lovable-uploads/cdf04575-1e22-4f1e-9045-25db08ecf765.png" 
                alt="Track It Logo" 
                className="w-16 h-16 mx-auto"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Track It</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Your Smart Expense Manager</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Version 1.0.2</p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-lg font-bold text-green-600 dark:text-green-400">Free</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Forever</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">Offline</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">No Internet</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">Private</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Local Storage</p>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-600">
            <div 
              onClick={handleCreatorLink}
              className="cursor-pointer hover:scale-105 transition-transform"
            >
              <p className="text-sm font-medium mb-1 animate-flowing-gradient bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Crafted by Dinesh Creates
              </p>
              <p className="text-sm font-medium animate-flowing-gradient bg-gradient-to-r from-purple-600 via-red-500 to-blue-600 bg-clip-text text-transparent">
                Click here to get one ✨
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
