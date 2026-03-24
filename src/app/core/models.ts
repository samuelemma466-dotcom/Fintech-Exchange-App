export interface UserProfile {
  uid: string;
  email: string;
  balance: number;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'crypto' | 'fiat' | 'giftcard';
  asset: string;
  amount: number;
  rate: number;
  total: number;
  status: 'pending' | 'approved' | 'rejected';
  proofUrl?: string;
  createdAt: string;
}

export interface Rate {
  asset: string;
  rate: number;
  updatedAt: string;
}
