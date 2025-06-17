
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/hooks/useTransactions';
import { getCategoriesByType } from '@/data/categories';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AddTransactionProps {
  onSuccess?: () => void;
  defaultType?: 'income' | 'expense';
}

const AddTransaction = ({ onSuccess, defaultType }: AddTransactionProps) => {
  const [type, setType] = useState<'income' | 'expense'>(defaultType || 'expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { addTransaction } = useTransactions();
  const { toast } = useToast();

  const categories = getCategoriesByType(type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) {
      toast({
        title: "Missing Information",
        description: "Please fill in amount and category",
        variant: "destructive",
      });
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      });
      return;
    }

    addTransaction({
      amount: numAmount,
      category,
      type,
      date,
      notes: notes.trim() || undefined,
    });

    toast({
      title: "Transaction Added",
      description: `${type === 'income' ? 'Income' : 'Expense'} of ₹${numAmount} added successfully`,
    });

    // Reset form
    setAmount('');
    setCategory('');
    setNotes('');
    setDate(new Date().toISOString().split('T')[0]);

    onSuccess?.();
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <div className="p-4 pb-24 animate-slide-up">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl">Add Transaction</CardTitle>
          
          {/* Income/Expense Toggle */}
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mt-4">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                setCategory('');
              }}
              className={cn(
                "flex-1 py-2 px-4 rounded-md font-medium transition-all",
                type === 'expense' 
                  ? "bg-red-500 text-white shadow-sm" 
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              )}
            >
              💸 Expense
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('');
              }}
              className={cn(
                "flex-1 py-2 px-4 rounded-md font-medium transition-all",
                type === 'income' 
                  ? "bg-green-500 text-white shadow-sm" 
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100"
              )}
            >
              💰 Income
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Amount Input */}
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-base font-medium">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">₹</span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-8 text-lg h-12"
                  step="0.01"
                  min="0"
                />
              </div>
              {amount && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Amount: ₹{formatCurrency(amount)}
                </p>
              )}
            </div>

            {/* Category Selection */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Category</Label>
              <div className="grid grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "p-3 rounded-lg border-2 transition-all flex flex-col items-center space-y-1",
                      category === cat.id
                        ? type === 'income'
                          ? "border-green-500 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : "border-red-500 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    )}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    <span className="text-xs font-medium text-center leading-tight">
                      {cat.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Input */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-base font-medium">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-12"
              />
            </div>

            {/* Notes Input */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-base font-medium">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add a note..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className={cn(
                "w-full h-12 text-lg font-semibold text-white transition-colors",
                type === 'income' 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-red-500 hover:bg-red-600"
              )}
              disabled={!amount || !category}
            >
              Add {type === 'income' ? 'Income' : 'Expense'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTransaction;
