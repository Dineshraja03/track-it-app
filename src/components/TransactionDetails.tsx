
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Transaction } from '@/types/transaction';
import { getCategoryById } from '@/data/categories';
import { cn } from '@/lib/utils';

interface TransactionDetailsProps {
  transaction: Transaction | null;
  isOpen: boolean;
  onClose: () => void;
}

const TransactionDetails = ({ transaction, isOpen, onClose }: TransactionDetailsProps) => {
  if (!transaction) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    return category?.icon || '💳';
  };

  const getCategoryName = (categoryId: string) => {
    const category = getCategoryById(categoryId);
    return category?.name || categoryId;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-gray-800 dark:text-white">
            Transaction Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 p-1">
          {/* Category Icon and Name */}
          <div className="flex items-center justify-center space-x-3">
            <div className="text-3xl">
              {getCategoryIcon(transaction.category)}
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white capitalize">
                {getCategoryName(transaction.category)}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                {transaction.type}
              </p>
            </div>
          </div>

          {/* Amount */}
          <div className="text-center">
            <p className={cn(
              "text-2xl font-bold",
              transaction.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            )}>
              {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
            </p>
          </div>

          {/* Date */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Date:</span>
              <span className="text-sm text-gray-800 dark:text-white">
                {new Date(transaction.date).toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          {/* Notes */}
          {transaction.notes && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300 block">Notes:</span>
                <p className="text-sm text-gray-800 dark:text-white break-words">
                  {transaction.notes}
                </p>
              </div>
            </div>
          )}

          {/* Transaction ID */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">ID:</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono break-all">
                {transaction.id}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionDetails;
