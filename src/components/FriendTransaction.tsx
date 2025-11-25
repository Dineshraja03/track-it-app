import { useState } from 'react';
import { ArrowLeft, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useFriends } from '@/hooks/useFriends';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface FriendTransactionProps {
  friendId: string;
  friendName: string;
  type: 'gave' | 'got';
  onBack: () => void;
}

const FriendTransaction = ({ friendId, friendName, type, onBack }: FriendTransactionProps) => {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const { addFriendTransaction } = useFriends();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    if (!amount || amountNum <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    addFriendTransaction(friendId, amountNum, type, notes.trim() || undefined);
    toast({
      title: 'Success',
      description: `Transaction added with ${friendName}`,
    });
    onBack();
  };

  const isGave = type === 'gave';

  return (
    <div className="pb-20">
      {/* Header */}
      <div
        className={`${
          isGave
            ? 'bg-gradient-to-br from-red-600 to-orange-600'
            : 'bg-gradient-to-br from-green-600 to-teal-600'
        } text-white p-6 rounded-b-3xl shadow-lg`}
      >
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
            {isGave ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{isGave ? 'I Gave Money' : 'I Got Money'}</h1>
            <p className="text-white/90 text-sm">{isGave ? 'to' : 'from'} {friendName}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-4">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                  ₹
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-2xl font-semibold pl-8"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add a note..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className={`w-full rounded-full ${
                isGave
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
              size="lg"
            >
              {isGave ? (
                <ArrowUpCircle size={20} className="mr-2" />
              ) : (
                <ArrowDownCircle size={20} className="mr-2" />
              )}
              Add Transaction
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default FriendTransaction;
