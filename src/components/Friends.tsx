import { useState } from 'react';
import { Users, Plus, UserPlus, TrendingUp, TrendingDown } from 'lucide-react';
import { useFriends } from '@/hooks/useFriends';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AddFriend from './AddFriend';
import FriendDetail from './FriendDetail';

const Friends = () => {
  const { friends, getFriendBalance } = useFriends();
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  if (selectedFriendId) {
    return <FriendDetail friendId={selectedFriendId} onBack={() => setSelectedFriendId(null)} />;
  }

  if (showAddFriend) {
    return <AddFriend onBack={() => setShowAddFriend(false)} />;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <Users size={24} />
            </div>
            <h1 className="text-2xl font-bold">Friends</h1>
          </div>
          <Button
            onClick={() => setShowAddFriend(true)}
            size="icon"
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full"
          >
            <UserPlus size={20} />
          </Button>
        </div>
        <p className="text-white/90 text-sm">Track money with friends</p>
      </div>

      {/* Friends List */}
      <div className="p-4 space-y-3">
        {friends.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Friends Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Add friends to track shared expenses
            </p>
            <Button onClick={() => setShowAddFriend(true)} className="rounded-full">
              <Plus size={18} className="mr-2" />
              Add Your First Friend
            </Button>
          </div>
        ) : (
          friends.map((friend) => {
            const balance = getFriendBalance(friend.id);
            const isPositive = balance > 0;
            const isZero = balance === 0;

            return (
              <Card
                key={friend.id}
                className="p-4 cursor-pointer hover:shadow-md transition-all"
                onClick={() => setSelectedFriendId(friend.id)}
              >
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {friend.profilePicture ? (
                      <img
                        src={friend.profilePicture}
                        alt={friend.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                      />
                    ) : (
                      <div className="bg-gradient-to-br from-blue-500 to-purple-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-semibold text-lg">
                        {friend.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {friend.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        {isZero ? (
                          <span className="text-sm text-gray-500 dark:text-gray-400">Settled up</span>
                        ) : (
                          <>
                            {isPositive ? (
                              <TrendingUp size={14} className="text-green-600" />
                            ) : (
                              <TrendingDown size={14} className="text-red-600" />
                            )}
                            <span
                              className={`text-sm font-medium ${
                                isPositive
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}
                            >
                              {isPositive ? 'Gets back' : 'Owes you'} {formatCurrency(balance)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-full font-semibold ${
                      isZero
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                        : isPositive
                        ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}
                  >
                    {formatCurrency(balance)}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Friends;
