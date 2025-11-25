export interface Friend {
  id: string;
  name: string;
  balance: number; // positive = they owe me, negative = I owe them
  createdAt: string;
}

export interface FriendTransaction {
  id: string;
  friendId: string;
  friendName: string;
  amount: number;
  type: 'gave' | 'got'; // I gave money to them OR I got money from them
  date: string;
  notes?: string;
}
