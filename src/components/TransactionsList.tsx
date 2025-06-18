
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useTransactions } from '@/hooks/useTransactions';
import { getCategoryById } from '@/data/categories';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Trash2, Search } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import TransactionDetails from './TransactionDetails';

const TransactionsList = () => {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { transactions, deleteTransaction } = useTransactions();
  const { toast } = useToast();

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = searchTerm === '' || 
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (transaction.notes && transaction.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent triggering the transaction details
    setDeletingId(id);
    setTimeout(() => {
      deleteTransaction(id);
      toast({
        title: "Transaction Deleted",
        description: "Transaction has been removed successfully",
      });
      setDeletingId(null);
    }, 200);
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsOpen(true);
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    return category?.icon || '💳';
  };

  return (
    <div className="p-4 pb-24 space-y-4 animate-fade-in">
      <Card className="shadow-sm hover:shadow-md transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl text-gray-800 dark:text-white">Transactions</CardTitle>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-colors duration-300" size={16} />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 transition-all duration-300 focus:scale-[1.02]"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex space-x-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className={cn(
                "transition-all duration-300 hover:scale-105 active:scale-95",
                filter === 'all' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              All
            </Button>
            <Button
              variant={filter === 'income' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('income')}
              className={cn(
                "transition-all duration-300 hover:scale-105 active:scale-95",
                filter === 'income' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              Income
            </Button>
            <Button
              variant={filter === 'expense' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('expense')}
              className={cn(
                "transition-all duration-300 hover:scale-105 active:scale-95",
                filter === 'expense' 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
              )}
            >
              Expense
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 animate-fade-in">
              <p className="text-lg mb-2">No transactions found</p>
              <p className="text-sm">Start by adding your first transaction!</p>
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {filteredTransactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  onClick={() => handleTransactionClick(transaction)}
                  className={cn(
                    "flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-[1.02] animate-fade-in cursor-pointer",
                    deletingId === transaction.id && "scale-95 opacity-50"
                  )}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="text-2xl transition-transform duration-300 hover:scale-110">
                      {getCategoryIcon(transaction.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-300">
                        <span>{new Date(transaction.date).toLocaleDateString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className={cn(
                        "font-semibold transition-colors duration-300",
                        transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      )}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{transaction.type}</p>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDelete(e, transaction.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 transition-all duration-300 hover:scale-110 active:scale-95"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      <TransactionDetails
        transaction={selectedTransaction}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};

export default TransactionsList;
