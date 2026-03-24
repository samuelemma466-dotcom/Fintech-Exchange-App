import { Injectable, signal, computed } from '@angular/core';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  dateRegistered: Date;
  balance: number;
  balances: Record<string, number>;
  currency: string;
  kycStatus: 'pending' | 'approved' | 'rejected' | 'none';
  kycDetails?: {
    idType?: string;
    idNumber?: string;
    idImage?: string;
    selfieImage?: string;
  };
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  isFrozen?: boolean;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'flip' | 'exchange' | 'giftcard_buy' | 'giftcard_sell' | 'deposit';
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  date: Date;
  details: string;
  proof?: string; // For gift card selling
  cardDetails?: {
    brand: string;
    last4: string;
  };
}

export interface FlipSession {
  id: string;
  title: string;
  entryAmount: number;
  expectedReward: number;
  duration: string;
  status: 'open' | 'closed' | 'completed';
  participants: string[];
}

export interface ExchangeRate {
  id: string;
  from: string;
  to: string;
  rate: number;
}

export interface GiftCard {
  id: string;
  brand: string;
  region: string;
  rate: number;
  currency: string;
  minValue: number;
  maxValue: number;
  stockAvailability: boolean;
  image: string;
}

@Injectable({ providedIn: 'root' })
export class MockDataService {
  // Current User State
  currentUser = signal<User>({
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    country: 'United States',
    dateRegistered: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    balance: 15000.00,
    balances: { 'USD': 15000.00, 'NGN': 50000.00, 'EUR': 250.00, 'GBP': 0 },
    currency: 'USD',
    kycStatus: 'none',
    isFrozen: false
  });

  // All Users (Admin view)
  allUsers = signal<User[]>([
    { 
      id: 'user-1', name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 8900', country: 'United States', dateRegistered: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 
      balance: 15000.00, balances: { 'USD': 15000.00, 'NGN': 50000.00, 'EUR': 250.00, 'GBP': 0 }, currency: 'USD', kycStatus: 'none', isFrozen: false 
    },
    { 
      id: 'user-2', name: 'Jane Smith', email: 'jane@example.com', phone: '+44 7700 900077', country: 'United Kingdom', dateRegistered: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), 
      balance: 250.00, balances: { 'USD': 250.00, 'NGN': 0, 'EUR': 0, 'GBP': 0 }, currency: 'USD', kycStatus: 'approved',
      kycDetails: { idType: 'Passport', idNumber: 'P123456789', idImage: 'https://picsum.photos/seed/id1/400/250', selfieImage: 'https://picsum.photos/seed/selfie1/200/200' },
      bankDetails: { bankName: 'Barclays', accountNumber: '20456789', accountName: 'Jane Smith' }, isFrozen: false
    },
    { 
      id: 'user-3', name: 'Mike Johnson', email: 'mike@example.com', phone: '+234 801 234 5678', country: 'Nigeria', dateRegistered: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), 
      balance: 50000.00, balances: { 'USD': 0, 'NGN': 50000.00, 'EUR': 0, 'GBP': 0 }, currency: 'NGN', kycStatus: 'pending',
      kycDetails: { idType: 'National ID', idNumber: 'NIN987654321', idImage: 'https://picsum.photos/seed/id2/400/250', selfieImage: 'https://picsum.photos/seed/selfie2/200/200' },
      isFrozen: false
    }
  ]);

  // Transactions
  transactions = signal<Transaction[]>([
    { id: 'tx-1', userId: 'user-1', type: 'exchange', amount: 500, currency: 'USD', status: 'completed', date: new Date(Date.now() - 86400000), details: 'Exchanged USD to NGN' },
    { id: 'tx-2', userId: 'user-1', type: 'flip', amount: 100, currency: 'USD', status: 'pending', date: new Date(Date.now() - 3600000), details: 'Joined Weekly Flip' },
    { id: 'tx-3', userId: 'user-2', type: 'giftcard_sell', amount: 50, currency: 'USD', status: 'completed', date: new Date(Date.now() - 172800000), details: 'Sold Amazon USA Gift Card' }
  ]);

  // Flip Sessions
  flipSessions = signal<FlipSession[]>([
    { id: 'flip-1', title: 'Weekly Flip', entryAmount: 100, expectedReward: 150, duration: '7 Days', status: 'open', participants: [] },
    { id: 'flip-2', title: 'Holiday Special Flip', entryAmount: 500, expectedReward: 1000, duration: '14 Days', status: 'open', participants: ['user-2'] },
    { id: 'flip-3', title: 'Flash Flip', entryAmount: 50, expectedReward: 80, duration: '24 Hours', status: 'closed', participants: ['user-1', 'user-3'] }
  ]);

  // Exchange Rates
  exchangeRates = signal<ExchangeRate[]>([
    { id: 'rate-1', from: 'USD', to: 'NGN', rate: 1500 },
    { id: 'rate-2', from: 'NGN', to: 'USD', rate: 0.00067 },
    { id: 'rate-3', from: 'EUR', to: 'USD', rate: 1.08 },
    { id: 'rate-4', from: 'GBP', to: 'USD', rate: 1.26 }
  ]);

  // Gift Cards
  giftCards = signal<GiftCard[]>([
    { id: 'gc-1', brand: 'Amazon', region: 'USA', rate: 0.85, currency: 'USD', minValue: 10, maxValue: 500, stockAvailability: true, image: 'shopping_cart' },
    { id: 'gc-2', brand: 'Amazon', region: 'UK', rate: 0.80, currency: 'GBP', minValue: 10, maxValue: 500, stockAvailability: true, image: 'shopping_cart' },
    { id: 'gc-3', brand: 'iTunes', region: 'USA', rate: 0.75, currency: 'USD', minValue: 15, maxValue: 200, stockAvailability: true, image: 'music_note' },
    { id: 'gc-4', brand: 'Steam', region: 'Europe', rate: 0.82, currency: 'EUR', minValue: 20, maxValue: 100, stockAvailability: false, image: 'sports_esports' },
    { id: 'gc-5', brand: 'Google Play', region: 'Canada', rate: 0.78, currency: 'CAD', minValue: 10, maxValue: 250, stockAvailability: true, image: 'play_arrow' }
  ]);

  // Computed for current user
  userTransactions = computed(() => {
    return this.transactions().filter(tx => tx.userId === this.currentUser().id).sort((a, b) => b.date.getTime() - a.date.getTime());
  });

  // Actions
  joinFlip(sessionId: string) {
    const session = this.flipSessions().find(s => s.id === sessionId);
    const user = this.currentUser();
    
    if (session && (user.balances[user.currency] || 0) >= session.entryAmount) {
      // Deduct balance
      this.currentUser.update(u => {
        const newBalances = { ...u.balances };
        newBalances[u.currency] = (newBalances[u.currency] || 0) - session.entryAmount;
        return { 
          ...u, 
          balances: newBalances,
          balance: newBalances[u.currency] || 0
        };
      });
      
      // Add participant
      this.flipSessions.update(sessions => sessions.map(s => {
        if (s.id === sessionId) {
          return { ...s, participants: [...s.participants, user.id] };
        }
        return s;
      }));

      // Create transaction
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        userId: user.id,
        type: 'flip',
        amount: session.entryAmount,
        currency: user.currency,
        status: 'pending',
        date: new Date(),
        details: `Joined ${session.title}`
      };
      this.transactions.update(txs => [newTx, ...txs]);
    }
  }

  exchangeCurrency(from: string, to: string, amount: number) {
    const rateObj = this.exchangeRates().find(r => r.from === from && r.to === to);
    const user = this.currentUser();

    if (rateObj && (user.balances[from] || 0) >= amount) {
      const converted = amount * rateObj.rate;
      
      this.currentUser.update(u => {
        const newBalances = { ...u.balances };
        newBalances[from] = (newBalances[from] || 0) - amount;
        newBalances[to] = (newBalances[to] || 0) + converted;
        
        return { 
          ...u, 
          balances: newBalances,
          balance: newBalances[u.currency] || 0 // Update primary balance for backward compatibility
        };
      });

      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        userId: user.id,
        type: 'exchange',
        amount: amount,
        currency: from,
        status: 'completed',
        date: new Date(),
        details: `Exchanged ${amount} ${from} to ${converted.toFixed(2)} ${to}`
      };
      this.transactions.update(txs => [newTx, ...txs]);
    }
  }

  sellGiftCard(cardId: string, amount: number, proof: string) {
    const card = this.giftCards().find(c => c.id === cardId);
    const user = this.currentUser();

    if (card && amount >= card.minValue && amount <= card.maxValue) {
      const payout = amount * card.rate;
      
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        userId: user.id,
        type: 'giftcard_sell',
        amount: payout,
        currency: user.currency,
        status: 'pending', // Admin needs to approve
        date: new Date(),
        details: `Sold ${card.brand} ${card.region} Gift Card ($${amount})`,
        proof: proof
      };
      this.transactions.update(txs => [newTx, ...txs]);
    }
  }

  buyGiftCard(cardId: string, amount: number) {
    const card = this.giftCards().find(c => c.id === cardId);
    const user = this.currentUser();

    if (card && amount >= card.minValue && amount <= card.maxValue && (user.balances[user.currency] || 0) >= amount) {
      // Deduct balance
      this.currentUser.update(u => {
        const newBalances = { ...u.balances };
        newBalances[u.currency] = (newBalances[u.currency] || 0) - amount;
        return { 
          ...u, 
          balances: newBalances,
          balance: newBalances[u.currency] || 0
        };
      });

      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        userId: user.id,
        type: 'giftcard_buy',
        amount: amount,
        currency: user.currency,
        status: 'completed',
        date: new Date(),
        details: `Bought ${card.brand} ${card.region} Gift Card ($${amount})`
      };
      this.transactions.update(txs => [newTx, ...txs]);
      
      return `MOCK-CODE-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    }
    return null;
  }

  submitKyc(details: NonNullable<User['kycDetails']>) {
    this.currentUser.update(u => ({
      ...u,
      kycStatus: 'pending',
      kycDetails: details
    }));
  }

  requestDeposit(amount: number, currency: string, cardNumber: string) {
    const user = this.currentUser();
    const brand = cardNumber.startsWith('4') ? 'Visa' : (cardNumber.startsWith('5') ? 'Mastercard' : 'Unknown');
    const last4 = cardNumber.slice(-4);

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: user.id,
      type: 'deposit',
      amount: amount,
      currency: currency,
      status: 'pending',
      date: new Date(),
      details: `Card Deposit (${brand} **** ${last4})`,
      cardDetails: { brand, last4 }
    };
    this.transactions.update(txs => [newTx, ...txs]);
  }

  // Admin Actions
  updateUserKyc(userId: string, status: 'approved' | 'rejected') {
    this.allUsers.update(users => users.map(u => u.id === userId ? { ...u, kycStatus: status } : u));
    if (this.currentUser().id === userId) {
      this.currentUser.update(u => ({ ...u, kycStatus: status }));
    }
  }

  freezeUser(userId: string, freeze: boolean) {
    this.allUsers.update(users => users.map(u => u.id === userId ? { ...u, isFrozen: freeze } : u));
    if (this.currentUser().id === userId) {
      this.currentUser.update(u => ({ ...u, isFrozen: freeze }));
    }
  }

  adjustUserWallet(userId: string, currency: string, amount: number, isCredit: boolean) {
    this.allUsers.update(users => users.map(u => {
      if (u.id === userId) {
        const newBalances = { ...u.balances };
        const currentBal = newBalances[currency] || 0;
        newBalances[currency] = isCredit ? currentBal + amount : Math.max(0, currentBal - amount);
        return { ...u, balances: newBalances, balance: newBalances[u.currency] || 0 };
      }
      return u;
    }));

    if (this.currentUser().id === userId) {
      this.currentUser.update(u => {
        const newBalances = { ...u.balances };
        const currentBal = newBalances[currency] || 0;
        newBalances[currency] = isCredit ? currentBal + amount : Math.max(0, currentBal - amount);
        return { ...u, balances: newBalances, balance: newBalances[u.currency] || 0 };
      });
    }
  }

  updateTransactionStatus(txId: string, status: 'completed' | 'failed') {
    const tx = this.transactions().find(t => t.id === txId);
    if (tx && tx.status === 'pending') {
      if (status === 'completed' && (tx.type === 'giftcard_sell' || tx.type === 'deposit')) {
        // Add funds to user wallet
        this.adjustUserWallet(tx.userId, tx.currency, tx.amount, true);
      }
      this.transactions.update(txs => txs.map(t => t.id === txId ? { ...t, status } : t));
    }
  }
}
