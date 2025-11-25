import { useState, useEffect } from 'react';
import { Friend, FriendTransaction } from '@/types/friend';
import { Transaction } from '@/types/transaction';

const FRIENDS_KEY = 'rupee-sahayak-friends';
const FRIEND_TRANSACTIONS_KEY = 'rupee-sahayak-friend-transactions';
const TRANSACTIONS_KEY = 'rupee-sahayak-transactions';

export const useFriends = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendTransactions, setFriendTransactions] = useState<FriendTransaction[]>([]);

  useEffect(() => {
    const storedFriends = localStorage.getItem(FRIENDS_KEY);
    const storedFriendTransactions = localStorage.getItem(FRIEND_TRANSACTIONS_KEY);
    
    if (storedFriends) {
      try {
        setFriends(JSON.parse(storedFriends));
      } catch (error) {
        console.error('Error loading friends:', error);
      }
    }
    
    if (storedFriendTransactions) {
      try {
        setFriendTransactions(JSON.parse(storedFriendTransactions));
      } catch (error) {
        console.error('Error loading friend transactions:', error);
      }
    }
  }, []);

  const saveFriends = (newFriends: Friend[]) => {
    setFriends(newFriends);
    localStorage.setItem(FRIENDS_KEY, JSON.stringify(newFriends));
  };

  const saveFriendTransactions = (newTransactions: FriendTransaction[]) => {
    setFriendTransactions(newTransactions);
    localStorage.setItem(FRIEND_TRANSACTIONS_KEY, JSON.stringify(newTransactions));
  };

  const addFriend = (name: string) => {
    const newFriend: Friend = {
      id: Date.now().toString(),
      name,
      balance: 0,
      createdAt: new Date().toISOString(),
    };
    saveFriends([...friends, newFriend]);
    return newFriend;
  };

  const deleteFriend = (id: string) => {
    const filtered = friends.filter(f => f.id !== id);
    saveFriends(filtered);
    
    // Also delete all transactions for this friend
    const filteredTransactions = friendTransactions.filter(t => t.friendId !== id);
    saveFriendTransactions(filteredTransactions);
  };

  const addFriendTransaction = (friendId: string, amount: number, type: 'gave' | 'got', notes?: string) => {
    const friend = friends.find(f => f.id === friendId);
    if (!friend) return;

    // Create friend transaction
    const newFriendTransaction: FriendTransaction = {
      id: Date.now().toString(),
      friendId,
      friendName: friend.name,
      amount,
      type,
      date: new Date().toISOString(),
      notes,
    };
    saveFriendTransactions([newFriendTransaction, ...friendTransactions]);

    // Update friend balance
    const balanceChange = type === 'got' ? amount : -amount;
    const updatedFriends = friends.map(f =>
      f.id === friendId ? { ...f, balance: f.balance + balanceChange } : f
    );
    saveFriends(updatedFriends);

    // Add to global transactions
    const globalTransaction: Transaction = {
      id: `friend-${newFriendTransaction.id}`,
      amount,
      category: type === 'got' ? 'Friend Payment' : 'Friend Loan',
      type: type === 'got' ? 'income' : 'expense',
      date: newFriendTransaction.date,
      notes: `${type === 'got' ? 'Got from' : 'Gave to'} ${friend.name}${notes ? ` - ${notes}` : ''}`,
    };
    
    const storedTransactions = localStorage.getItem(TRANSACTIONS_KEY);
    const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify([globalTransaction, ...transactions]));
  };

  const getFriendTransactions = (friendId: string) => {
    return friendTransactions.filter(t => t.friendId === friendId);
  };

  const getFriendBalance = (friendId: string) => {
    const friend = friends.find(f => f.id === friendId);
    return friend?.balance || 0;
  };

  return {
    friends,
    friendTransactions,
    addFriend,
    deleteFriend,
    addFriendTransaction,
    getFriendTransactions,
    getFriendBalance,
  };
};
