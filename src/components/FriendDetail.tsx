import { useState } from 'react';
import { ArrowLeft, TrendingUp, TrendingDown, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useFriends } from '@/hooks/useFriends';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FriendTransaction from './FriendTransaction';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface FriendDetailProps {
  friendId: string;
  onBack: () => void;
}

const FriendDetail = ({ friendId, onBack }: FriendDetailProps) => {
  const { friends, getFriendBalance, getFriendTransactions, deleteFriend } = useFriends();
  const [showTransaction, setShowTransaction] = useState<'gave' | 'got' | null>(null);

  const friend = friends.find(f => f.id === friendId);
  const balance = getFriendBalance(friendId);
  const transactions = getFriendTransactions(friendId);

  if (!friend) {
    onBack();
    return null;
  }

  if (showTransaction) {
    return (
      <FriendTransaction
        friendId={friendId}
        friendName={friend.name}
        type={showTransaction}
        onBack={() => setShowTransaction(null)}
      />
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const isPositive = balance > 0;
  const isZero = balance === 0;

  const handleDelete = () => {
    deleteFriend(friendId);
    onBack();
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <ArrowLeft size={20} />
            </Button>
            <div className="bg-white text-blue-600 w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
              {friend.name.charAt(0).toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold">{friend.name}</h1>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
              >
                <Trash2 size={20} />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Friend?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete {friend.name} and all related transactions. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Balance Card */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-4">
          <div className="text-center">
            <p className="text-white/80 text-sm mb-1">Current Balance</p>
            <div className="flex items-center justify-center gap-2">
              {!isZero && (
                isPositive ? (
                  <TrendingUp size={24} className="text-green-300" />
                ) : (
                  <TrendingDown size={24} className="text-red-300" />
                )
              )}
              <p className={`text-3xl font-bold ${isZero ? 'text-white' : ''}`}>
                {formatCurrency(balance)}
              </p>
            </div>
            <p className="text-white/80 text-sm mt-1">
              {isZero ? 'All settled up!' : isPositive ? 'They owe you' : 'You owe them'}
            </p>
          </div>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <Button
          onClick={() => setShowTransaction('gave')}
          className="h-auto py-4 flex-col gap-2 bg-red-600 hover:bg-red-700 rounded-2xl"
        >
          <ArrowUpCircle size={24} />
          <span className="text-sm font-medium">I Gave Money</span>
        </Button>
        <Button
          onClick={() => setShowTransaction('got')}
          className="h-auto py-4 flex-col gap-2 bg-green-600 hover:bg-green-700 rounded-2xl"
        >
          <ArrowDownCircle size={24} />
          <span className="text-sm font-medium">I Got Money</span>
        </Button>
      </div>

      {/* Transaction History */}
      <div className="px-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">Transaction History</h2>
        {transactions.length === 0 ? (
          <Card className="p-6 text-center">
            <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <Card key={transaction.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        transaction.type === 'got'
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-red-100 dark:bg-red-900/30'
                      }`}
                    >
                      {transaction.type === 'got' ? (
                        <ArrowDownCircle
                          size={20}
                          className="text-green-600 dark:text-green-400"
                        />
                      ) : (
                        <ArrowUpCircle
                          size={20}
                          className="text-red-600 dark:text-red-400"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {transaction.type === 'got' ? 'Got money' : 'Gave money'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(transaction.date)}
                      </p>
                      {transaction.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {transaction.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  <p
                    className={`font-semibold ${
                      transaction.type === 'got'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {transaction.type === 'got' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendDetail;
