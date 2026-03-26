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
  flipStreak?: number;
  hasDoneFirstFlip?: boolean;
  highUrgencyUses?: number;
  
  // Adaptive Engine Fields
  xp?: number;
  level?: 'Beginner' | 'Bronze' | 'Silver' | 'Gold' | 'Elite';
  userScore?: number;
  riskProfile?: 'low' | 'medium' | 'high';
  totalDeposits?: number;
  totalWithdrawals?: number;
  flipWins?: number;
  flipLosses?: number;
  flipPartials?: number;
  consecutiveLosses?: number;
  consecutiveWins?: number;
  highUrgencyAbuseCount?: number;
  preferredPlan?: 'safe' | 'balanced' | 'aggressive' | null;
  accountCreatedAt?: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'flip' | 'exchange' | 'giftcard_buy' | 'giftcard_sell' | 'deposit' | 'withdraw' | 'transfer';
  amount: number;
  fee: number;
  profit: number;
  netAmount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  date: Date;
  details: string;
  proof?: string; // For gift card selling or bank deposit
  cardDetails?: {
    brand: string;
    last4: string;
  };
  depositMethod?: 'card' | 'bank' | 'crypto';
  txHash?: string; // For crypto deposits
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'deposit' | 'withdraw' | 'flip' | 'exchange' | 'system';
  isRead: boolean;
  date: Date;
}

export interface FlipSession {
  id: string;
  title: string;
  entryAmount: number;
  expectedReward: number;
  duration: string;
  status: 'open' | 'closed' | 'completed';
  participants: string[];
  platformFeePercent: number;
}

export interface ExchangeRate {
  id: string;
  from: string;
  to: string;
  buyRate: number; // Platform buys 'from' currency
  sellRate: number; // Platform sells 'from' currency
  marketRate: number; // Real market rate
  feePercent: number;
}

export interface GiftCard {
  id: string;
  brand: string;
  region: string;
  buyRate: number; // Platform buys from user (e.g. 0.85)
  sellRate: number; // Platform sells to user (e.g. 1.0)
  marketRate: number; // Real value (e.g. 1.0)
  feePercent: number;
  currency: string;
  minValue: number;
  maxValue: number;
  stockAvailability: boolean;
  image: string;
}

export interface SystemSettings {
  depositFeePercent: number;
  withdrawalFeeFixed: number;
  transferFeePercent: number;
  minDepositAmount: number;
  maxDepositAmount: number;
  minWithdrawalAmount: number;
  maxWithdrawalAmount: number;
  flipMultiplier: number;
  flipMaxEntry: number;
  exchangeSpreadPercent: number;
  bankDepositDetails: { bankName: string; accountName: string; accountNumber: string; };
  cryptoDepositDetails: { btcAddress: string; usdtAddress: string; };

  // Smart Investment Settings
  investMinAmount: number;
  investMaxAmount: number;
  
  safeSuccessProb: number;
  safePartialProb: number;
  safeReturnMin: number;
  safeReturnMax: number;
  safeLossMin: number;
  
  balancedSuccessProb: number;
  balancedPartialProb: number;
  balancedReturnMin: number;
  balancedReturnMax: number;
  balancedLossMin: number;
  
  aggressiveSuccessProb: number;
  aggressivePartialProb: number;
  aggressiveReturnMin: number;
  aggressiveReturnMax: number;
  aggressiveLossMin: number;
  
  firstTimeBonus: number;
  cashbackPercent: number;
  streakBonus: number;
  highUrgencyProbBoost: number;

  // Intelligent Adaptive Engine Settings
  xpPerFlip: number;
  xpPerWin: number;
  pityTimerBoostPercent: number;
  winNormalizationPercent: number;
  highUrgencyAbuseThreshold: number;
  highUrgencyPenaltyPercent: number;
}

export interface InvestmentResult {
  outcome: 'success' | 'partial' | 'loss';
  originalAmount: number;
  finalAmount: number;
  profit: number;
  rewards: {
    firstTimeBonus?: number;
    cashback?: number;
    streakBonus?: number;
    xpEarned?: number;
  };
  plan: 'safe' | 'balanced' | 'aggressive';
}

export interface InvestmentPlanDetails {
  id: 'safe' | 'balanced' | 'aggressive';
  name: string;
  description: string;
  successProb: number;
  partialProb: number;
  returnMin: number;
  returnMax: number;
  lossMin: number;
  isRecommended: boolean;
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
    isFrozen: false,
    xp: 150,
    level: 'Bronze',
    userScore: 65,
    riskProfile: 'medium',
    totalDeposits: 20000,
    totalWithdrawals: 5000,
    flipWins: 12,
    flipLosses: 8,
    flipPartials: 5,
    consecutiveLosses: 0,
    consecutiveWins: 2,
    highUrgencyAbuseCount: 0,
    preferredPlan: 'balanced',
    accountCreatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
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
    { id: 'tx-1', userId: 'user-1', type: 'exchange', amount: 500, fee: 5, profit: 10, netAmount: 495, currency: 'USD', status: 'completed', date: new Date(Date.now() - 86400000), details: 'Exchanged USD to NGN' },
    { id: 'tx-2', userId: 'user-1', type: 'flip', amount: 100, fee: 5, profit: 5, netAmount: 95, currency: 'USD', status: 'pending', date: new Date(Date.now() - 3600000), details: 'Joined Weekly Flip' },
    { id: 'tx-3', userId: 'user-2', type: 'giftcard_sell', amount: 50, fee: 2.5, profit: 7.5, netAmount: 47.5, currency: 'USD', status: 'completed', date: new Date(Date.now() - 172800000), details: 'Sold Amazon USA Gift Card' }
  ]);

  // Flip Sessions
  flipSessions = signal<FlipSession[]>([
    { id: 'flip-1', title: 'Weekly Flip', entryAmount: 100, expectedReward: 150, duration: '7 Days', status: 'open', participants: [], platformFeePercent: 5 },
    { id: 'flip-2', title: 'Holiday Special Flip', entryAmount: 500, expectedReward: 1000, duration: '14 Days', status: 'open', participants: ['user-2'], platformFeePercent: 5 },
    { id: 'flip-3', title: 'Flash Flip', entryAmount: 50, expectedReward: 80, duration: '24 Hours', status: 'closed', participants: ['user-1', 'user-3'], platformFeePercent: 10 }
  ]);

  // Base Exchange Rates (Market Rates)
  baseExchangeRates = signal<ExchangeRate[]>([
    { id: 'rate-1', from: 'USD', to: 'NGN', buyRate: 1500, sellRate: 1550, marketRate: 1525, feePercent: 1 },
    { id: 'rate-2', from: 'NGN', to: 'USD', buyRate: 0.00064, sellRate: 0.00067, marketRate: 0.00065, feePercent: 1 },
    { id: 'rate-3', from: 'EUR', to: 'USD', buyRate: 1.05, sellRate: 1.10, marketRate: 1.08, feePercent: 1 },
    { id: 'rate-4', from: 'GBP', to: 'USD', buyRate: 1.24, sellRate: 1.28, marketRate: 1.26, feePercent: 1 }
  ]);

  // Computed Exchange Rates with dynamic spread
  exchangeRates = computed(() => {
    const spread = this.systemSettings().exchangeSpreadPercent / 100;
    return this.baseExchangeRates().map(rate => ({
      ...rate,
      buyRate: rate.marketRate * (1 - spread),
      sellRate: rate.marketRate * (1 + spread)
    }));
  });

  // Gift Cards
  giftCards = signal<GiftCard[]>([
    { id: 'gc-1', brand: 'Amazon', region: 'USA', buyRate: 0.85, sellRate: 0.95, marketRate: 1.0, feePercent: 2, currency: 'USD', minValue: 10, maxValue: 500, stockAvailability: true, image: 'shopping_cart' },
    { id: 'gc-2', brand: 'Amazon', region: 'UK', buyRate: 0.80, sellRate: 0.90, marketRate: 1.0, feePercent: 2, currency: 'GBP', minValue: 10, maxValue: 500, stockAvailability: true, image: 'shopping_cart' },
    { id: 'gc-3', brand: 'iTunes', region: 'USA', buyRate: 0.75, sellRate: 0.85, marketRate: 1.0, feePercent: 2, currency: 'USD', minValue: 15, maxValue: 200, stockAvailability: true, image: 'music_note' },
    { id: 'gc-4', brand: 'Steam', region: 'Europe', buyRate: 0.82, sellRate: 0.92, marketRate: 1.0, feePercent: 2, currency: 'EUR', minValue: 20, maxValue: 100, stockAvailability: false, image: 'sports_esports' },
    { id: 'gc-5', brand: 'Google Play', region: 'Canada', buyRate: 0.78, sellRate: 0.88, marketRate: 1.0, feePercent: 2, currency: 'CAD', minValue: 10, maxValue: 250, stockAvailability: true, image: 'play_arrow' }
  ]);

  // System Settings
  systemSettings = signal<SystemSettings>({
    depositFeePercent: 1.5,
    withdrawalFeeFixed: 5,
    transferFeePercent: 1,
    minDepositAmount: 10,
    maxDepositAmount: 10000,
    minWithdrawalAmount: 20,
    maxWithdrawalAmount: 5000,
    flipMultiplier: 1.5,
    flipMaxEntry: 1000,
    exchangeSpreadPercent: 2,
    bankDepositDetails: { bankName: 'Global Bank Inc', accountName: 'Fintech App', accountNumber: '1234567890' },
    cryptoDepositDetails: { btcAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', usdtAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
    
    investMinAmount: 100,
    investMaxAmount: 10000,
    safeSuccessProb: 70,
    safePartialProb: 20,
    safeReturnMin: 1.02,
    safeReturnMax: 1.05,
    safeLossMin: 0.95,
    balancedSuccessProb: 50,
    balancedPartialProb: 30,
    balancedReturnMin: 1.08,
    balancedReturnMax: 1.15,
    balancedLossMin: 0.85,
    aggressiveSuccessProb: 30,
    aggressivePartialProb: 20,
    aggressiveReturnMin: 1.20,
    aggressiveReturnMax: 1.50,
    aggressiveLossMin: 0.50,
    firstTimeBonus: 50,
    cashbackPercent: 5,
    streakBonus: 20,
    highUrgencyProbBoost: 10,
    xpPerFlip: 10,
    xpPerWin: 25,
    pityTimerBoostPercent: 2,
    winNormalizationPercent: 1,
    highUrgencyAbuseThreshold: 5,
    highUrgencyPenaltyPercent: 5
  });

  // Notifications
  notifications = signal<Notification[]>([
    { id: 'notif-1', userId: 'user-1', title: 'Welcome!', message: 'Welcome to the platform.', type: 'system', isRead: false, date: new Date() }
  ]);

  updateSystemSettings(settings: Partial<SystemSettings>) {
    this.systemSettings.update(s => ({ ...s, ...settings }));
  }

  // Computed for current user
  userTransactions = computed(() => {
    return this.transactions().filter(tx => tx.userId === this.currentUser().id).sort((a, b) => b.date.getTime() - a.date.getTime());
  });

  // Actions
  joinFlip(sessionId: string) {
    const session = this.flipSessions().find(s => s.id === sessionId);
    const user = this.currentUser();
    
    if (session && (user.balances[user.currency] || 0) >= session.entryAmount) {
      const fee = session.entryAmount * (session.platformFeePercent / 100);
      const netAmount = session.entryAmount - fee;
      const profit = fee;

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
        fee: fee,
        profit: profit,
        netAmount: netAmount,
        currency: user.currency,
        status: 'pending',
        date: new Date(),
        details: `Joined ${session.title}`
      };
      this.transactions.update(txs => [newTx, ...txs]);
      this.addNotification(user.id, 'Flip Joined', `You joined ${session.title} for ${session.entryAmount} ${user.currency}.`, 'flip');
    }
  }

  joinCustomFlip(amount: number) {
    const user = this.currentUser();
    const settings = this.systemSettings();
    
    if ((user.balances[user.currency] || 0) >= amount && amount <= settings.flipMaxEntry) {
      const fee = amount * 0.05; // 5% platform fee for custom flips
      const netAmount = amount - fee;
      const profit = fee;

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

      // Create transaction
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        userId: user.id,
        type: 'flip',
        amount: amount,
        fee: fee,
        profit: profit,
        netAmount: netAmount,
        currency: user.currency,
        status: 'pending',
        date: new Date(),
        details: `Joined Custom Flip`
      };
      this.transactions.update(txs => [newTx, ...txs]);
      this.addNotification(user.id, 'Custom Flip Joined', `You joined a custom flip for ${amount} ${user.currency}.`, 'flip');
    }
  }

  // --- Adaptive Engine Methods ---
  calculateUserScore(user: User): number {
    let score = 50; // Base score
    
    // Activity frequency (deposits + withdrawals + flips)
    const activityCount = (user.totalDeposits || 0) + (user.totalWithdrawals || 0) + (user.flipWins || 0) + (user.flipLosses || 0);
    score += Math.min(20, activityCount * 0.5);
    
    // Win rate
    const totalFlips = (user.flipWins || 0) + (user.flipLosses || 0) + (user.flipPartials || 0);
    if (totalFlips > 0) {
      const winRate = (user.flipWins || 0) / totalFlips;
      score += (winRate - 0.5) * 20; // -10 to +10 based on win rate
    }
    
    // Account age (up to +10)
    if (user.accountCreatedAt) {
      const daysOld = (Date.now() - user.accountCreatedAt.getTime()) / (1000 * 60 * 60 * 24);
      score += Math.min(10, daysOld * 0.1);
    }
    
    // Penalties
    score -= (user.highUrgencyAbuseCount || 0) * 5;
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  calculateUserLevel(xp: number): 'Beginner' | 'Bronze' | 'Silver' | 'Gold' | 'Elite' {
    if (xp >= 5000) return 'Elite';
    if (xp >= 2000) return 'Gold';
    if (xp >= 500) return 'Silver';
    if (xp >= 100) return 'Bronze';
    return 'Beginner';
  }

  getLevelBonus(level: string) {
    switch (level) {
      case 'Elite': return { prob: 5, return: 0.05 };
      case 'Gold': return { prob: 3, return: 0.03 };
      case 'Silver': return { prob: 1, return: 0.01 };
      case 'Bronze': return { prob: 0, return: 0.00 };
      default: return { prob: 0, return: 0 };
    }
  }

  getPersonalizedPlans(amount: number, urgency: string): InvestmentPlanDetails[] {
    const user = this.currentUser();
    const settings = this.systemSettings();
    
    const levelBonus = this.getLevelBonus(user.level || 'Beginner');
    const pityBoost = (user.consecutiveLosses || 0) * settings.pityTimerBoostPercent;
    const winPenalty = (user.consecutiveWins || 0) * settings.winNormalizationPercent;
    
    let urgencyBoost = 0;
    if (urgency === 'High') {
      if ((user.highUrgencyUses || 0) < settings.highUrgencyAbuseThreshold) {
        urgencyBoost = settings.highUrgencyProbBoost;
      } else {
        urgencyBoost = -settings.highUrgencyPenaltyPercent; // Penalty for abuse
      }
    }

    const applyModifiers = (baseProb: number, baseRetMin: number, baseRetMax: number) => {
      let finalProb = baseProb + pityBoost - winPenalty + urgencyBoost + levelBonus.prob;
      finalProb = Math.max(5, Math.min(95, finalProb)); // Cap 5% - 95%
      return {
        prob: finalProb,
        retMin: baseRetMin + levelBonus.return,
        retMax: baseRetMax + levelBonus.return
      };
    };

    const safeMods = applyModifiers(settings.safeSuccessProb, settings.safeReturnMin, settings.safeReturnMax);
    const balancedMods = applyModifiers(settings.balancedSuccessProb, settings.balancedReturnMin, settings.balancedReturnMax);
    const aggressiveMods = applyModifiers(settings.aggressiveSuccessProb, settings.aggressiveReturnMin, settings.aggressiveReturnMax);

    // Determine recommended plan based on user score and history
    let recommended: 'safe' | 'balanced' | 'aggressive' = 'balanced';
    if (user.preferredPlan) {
      recommended = user.preferredPlan;
    } else if (user.userScore && user.userScore > 70) {
      recommended = 'aggressive';
    } else if (user.userScore && user.userScore < 30) {
      recommended = 'safe';
    }

    return [
      {
        id: 'safe',
        name: 'Safe Plan',
        description: 'Low risk, steady returns. Best for capital preservation.',
        successProb: safeMods.prob,
        partialProb: settings.safePartialProb,
        returnMin: safeMods.retMin,
        returnMax: safeMods.retMax,
        lossMin: settings.safeLossMin,
        isRecommended: recommended === 'safe'
      },
      {
        id: 'balanced',
        name: 'Balanced Plan',
        description: 'Medium risk, moderate returns. Optimal risk-to-reward ratio.',
        successProb: balancedMods.prob,
        partialProb: settings.balancedPartialProb,
        returnMin: balancedMods.retMin,
        returnMax: balancedMods.retMax,
        lossMin: settings.balancedLossMin,
        isRecommended: recommended === 'balanced'
      },
      {
        id: 'aggressive',
        name: 'Aggressive Plan',
        description: 'High risk, maximum returns. For experienced investors.',
        successProb: aggressiveMods.prob,
        partialProb: settings.aggressivePartialProb,
        returnMin: aggressiveMods.retMin,
        returnMax: aggressiveMods.retMax,
        lossMin: settings.aggressiveLossMin,
        isRecommended: recommended === 'aggressive'
      }
    ];
  }

  executeSmartInvestment(amount: number, urgency: string, planId: 'safe' | 'balanced' | 'aggressive'): InvestmentResult {
    const user = this.currentUser();
    const settings = this.systemSettings();
    
    if ((user.balances[user.currency] || 0) < amount || amount < settings.investMinAmount || amount > settings.investMaxAmount) {
      throw new Error('Invalid amount');
    }

    // Get personalized plans to ensure we use the exact same probabilities shown to the user
    const plans = this.getPersonalizedPlans(amount, urgency);
    const plan = plans.find(p => p.id === planId)!;

    if (urgency === 'High') {
      this.currentUser.update(u => {
        const uses = (u.highUrgencyUses || 0) + 1;
        const abuseCount = uses > settings.highUrgencyAbuseThreshold ? (u.highUrgencyAbuseCount || 0) + 1 : (u.highUrgencyAbuseCount || 0);
        return { ...u, highUrgencyUses: uses, highUrgencyAbuseCount: abuseCount };
      });
    }

    const rand = Math.random() * 100;
    let outcome: 'success' | 'partial' | 'loss' = 'loss';
    let multiplier = 1;

    if (rand <= plan.successProb) {
      outcome = 'success';
      multiplier = plan.returnMin + Math.random() * (plan.returnMax - plan.returnMin);
    } else if (rand <= plan.successProb + plan.partialProb) {
      outcome = 'partial';
      multiplier = 1.0 + Math.random() * (plan.returnMin - 1.0);
    } else {
      outcome = 'loss';
      multiplier = plan.lossMin + Math.random() * (1.0 - plan.lossMin);
    }

    let finalAmount = amount * multiplier;
    
    const rewards = {
      firstTimeBonus: 0,
      cashback: 0,
      streakBonus: 0,
      xpEarned: settings.xpPerFlip
    };

    // Apply Rewards & Update Stats
    let newWins = user.flipWins || 0;
    let newLosses = user.flipLosses || 0;
    let newPartials = user.flipPartials || 0;
    let newConsecutiveWins = user.consecutiveWins || 0;
    let newConsecutiveLosses = user.consecutiveLosses || 0;

    if (!user.hasDoneFirstFlip) {
      rewards.firstTimeBonus = settings.firstTimeBonus;
      finalAmount += rewards.firstTimeBonus;
      this.currentUser.update(u => ({ ...u, hasDoneFirstFlip: true }));
    }

    if (outcome === 'loss') {
      rewards.cashback = amount * (settings.cashbackPercent / 100);
      finalAmount += rewards.cashback;
      newLosses++;
      newConsecutiveLosses++;
      newConsecutiveWins = 0;
      this.currentUser.update(u => ({ ...u, flipStreak: 0 }));
    } else {
      if (outcome === 'success') {
        newWins++;
        newConsecutiveWins++;
        newConsecutiveLosses = 0;
        rewards.xpEarned += settings.xpPerWin;
      } else {
        newPartials++;
        newConsecutiveWins = 0;
        newConsecutiveLosses = 0;
      }
      
      const newStreak = (user.flipStreak || 0) + 1;
      if (newStreak >= 3) {
        rewards.streakBonus = settings.streakBonus;
        finalAmount += rewards.streakBonus;
      }
      this.currentUser.update(u => ({ ...u, flipStreak: newStreak }));
    }

    const profit = finalAmount - amount;

    // Update balances and adaptive stats
    this.currentUser.update(u => {
      const newBalances = { ...u.balances };
      newBalances[u.currency] = (newBalances[u.currency] || 0) - amount + finalAmount;
      
      const newXp = (u.xp || 0) + rewards.xpEarned;
      const newLevel = this.calculateUserLevel(newXp);
      
      const updatedUser = { 
        ...u, 
        balances: newBalances,
        balance: newBalances[u.currency] || 0,
        xp: newXp,
        level: newLevel,
        flipWins: newWins,
        flipLosses: newLosses,
        flipPartials: newPartials,
        consecutiveWins: newConsecutiveWins,
        consecutiveLosses: newConsecutiveLosses,
        preferredPlan: planId
      };
      
      updatedUser.userScore = this.calculateUserScore(updatedUser);
      return updatedUser;
    });

    // Create transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: user.id,
      type: 'flip',
      amount: amount,
      fee: 0,
      profit: profit,
      netAmount: finalAmount,
      currency: user.currency,
      status: 'completed',
      date: new Date(),
      details: `Smart Investment (${plan.name}) - ${outcome.toUpperCase()}`
    };
    this.transactions.update(txs => [newTx, ...txs]);
    
    let notifMsg = `Your ${plan.name} investment resulted in a ${outcome}. You received ${finalAmount.toFixed(2)} ${user.currency}.`;
    if (rewards.firstTimeBonus || rewards.cashback || rewards.streakBonus) {
      notifMsg += ` Includes rewards!`;
    }
    this.addNotification(user.id, 'Investment Completed', notifMsg, 'flip');

    return {
      outcome,
      originalAmount: amount,
      finalAmount,
      profit,
      rewards,
      plan: planId
    };
  }

  exchangeCurrency(from: string, to: string, amount: number) {
    const rateObj = this.exchangeRates().find(r => r.from === from && r.to === to);
    const reverseRateObj = this.exchangeRates().find(r => r.from === to && r.to === from);
    const user = this.currentUser();

    if ((rateObj || reverseRateObj) && (user.balances[from] || 0) >= amount) {
      let converted = 0;
      let fee = 0;
      let profit = 0;
      let netAmount = amount;

      if (rateObj) {
        // Platform buys 'from'
        fee = amount * (rateObj.feePercent / 100);
        netAmount = amount - fee;
        converted = netAmount * rateObj.buyRate;
        // Profit is the spread difference + fee
        // Platform bought 'from' at buyRate, real value is marketRate
        // So profit in 'to' currency = netAmount * (marketRate - buyRate)
        // Let's store profit in 'from' currency for simplicity:
        profit = fee + (netAmount * ((rateObj.marketRate - rateObj.buyRate) / rateObj.marketRate));
      } else if (reverseRateObj) {
        // Platform sells 'to' (which is reverseRateObj.from)
        fee = amount * (reverseRateObj.feePercent / 100);
        netAmount = amount - fee;
        converted = netAmount / reverseRateObj.sellRate;
        // Platform sold 'to' at sellRate, real value is marketRate
        // Profit in 'from' currency = netAmount * ((sellRate - marketRate) / sellRate)
        profit = fee + (netAmount * ((reverseRateObj.sellRate - reverseRateObj.marketRate) / reverseRateObj.sellRate));
      }
      
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
        fee: fee,
        profit: profit,
        netAmount: netAmount,
        currency: from,
        status: 'completed',
        date: new Date(),
        details: `Exchanged ${amount} ${from} to ${converted.toFixed(2)} ${to}`
      };
      this.transactions.update(txs => [newTx, ...txs]);
      this.addNotification(user.id, 'Exchange Successful', `You exchanged ${amount} ${from} to ${converted.toFixed(2)} ${to}.`, 'exchange');
    }
  }

  sellGiftCard(cardId: string, amount: number, proof: string) {
    const card = this.giftCards().find(c => c.id === cardId);
    const user = this.currentUser();

    if (card && amount >= card.minValue && amount <= card.maxValue) {
      const fee = amount * (card.feePercent / 100);
      const netAmount = amount - fee;
      const payout = netAmount * card.buyRate;
      const profit = fee + (netAmount * (card.marketRate - card.buyRate));
      
      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        userId: user.id,
        type: 'giftcard_sell',
        amount: amount,
        fee: fee,
        profit: profit,
        netAmount: payout, // User receives payout
        currency: user.currency,
        status: 'pending', // Admin needs to approve
        date: new Date(),
        details: `Sold ${card.brand} ${card.region} Gift Card ($${amount})`,
        proof: proof
      };
      this.transactions.update(txs => [newTx, ...txs]);
      this.addNotification(user.id, 'Gift Card Sold', `Your sale of ${card.brand} gift card is pending approval.`, 'system');
    }
  }

  buyGiftCard(cardId: string, amount: number) {
    const card = this.giftCards().find(c => c.id === cardId);
    const user = this.currentUser();

    if (card && amount >= card.minValue && amount <= card.maxValue && (user.balances[user.currency] || 0) >= amount) {
      const fee = amount * (card.feePercent / 100);
      const netAmount = amount - fee;
      const cost = netAmount * card.sellRate;
      const profit = fee + (netAmount * (card.sellRate - card.marketRate));

      // Deduct balance
      this.currentUser.update(u => {
        const newBalances = { ...u.balances };
        newBalances[u.currency] = (newBalances[u.currency] || 0) - (cost + fee);
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
        fee: fee,
        profit: profit,
        netAmount: netAmount,
        currency: user.currency,
        status: 'completed',
        date: new Date(),
        details: `Bought ${card.brand} ${card.region} Gift Card ($${amount})`
      };
      this.transactions.update(txs => [newTx, ...txs]);
      this.addNotification(user.id, 'Gift Card Bought', `You successfully purchased a ${card.brand} gift card.`, 'system');
      
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

  requestDeposit(amount: number, currency: string, method: 'card' | 'bank' | 'crypto', details: { cardNumber?: string; proof?: string; txHash?: string }) {
    const user = this.currentUser();
    const fee = amount * (this.systemSettings().depositFeePercent / 100);
    const netAmount = amount - fee;
    const profit = fee;

    let txDetails = '';
    let cardDetails;
    let proof;
    let txHash;

    if (method === 'card' && details.cardNumber) {
      const brand = details.cardNumber.startsWith('4') ? 'Visa' : (details.cardNumber.startsWith('5') ? 'Mastercard' : 'Unknown');
      const last4 = details.cardNumber.slice(-4);
      txDetails = `Card Deposit (${brand} **** ${last4})`;
      cardDetails = { brand, last4 };
    } else if (method === 'bank' && details.proof) {
      txDetails = `Bank Transfer Deposit`;
      proof = details.proof;
    } else if (method === 'crypto' && details.txHash) {
      txDetails = `Crypto Deposit`;
      txHash = details.txHash;
    }

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      userId: user.id,
      type: 'deposit',
      amount: amount,
      fee: fee,
      profit: profit,
      netAmount: netAmount,
      currency: currency,
      status: 'pending',
      date: new Date(),
      details: txDetails,
      depositMethod: method,
      cardDetails,
      proof,
      txHash
    };
    this.transactions.update(txs => [newTx, ...txs]);
    this.addNotification(user.id, 'Deposit Requested', `Your deposit of ${amount} ${currency} is pending approval.`, 'deposit');
  }

  addNotification(userId: string, title: string, message: string, type: Notification['type']) {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      userId,
      title,
      message,
      type,
      isRead: false,
      date: new Date()
    };
    this.notifications.update(n => [newNotif, ...n]);
  }

  markNotificationRead(notifId: string) {
    this.notifications.update(n => n.map(notif => notif.id === notifId ? { ...notif, isRead: true } : notif));
  }

  markAllNotificationsRead(userId: string) {
    this.notifications.update(n => n.map(notif => notif.userId === userId ? { ...notif, isRead: true } : notif));
  }

  requestWithdrawal(amount: number, currency: string, bankDetails: { bankName: string, accountNumber: string }) {
    const user = this.currentUser();
    if ((user.balances[currency] || 0) >= amount) {
      const fee = this.systemSettings().withdrawalFeeFixed;
      const netAmount = amount - fee;
      const profit = fee;

      // Deduct balance immediately
      this.adjustUserWallet(user.id, currency, amount, false);

      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        userId: user.id,
        type: 'withdraw',
        amount: amount,
        fee: fee,
        profit: profit,
        netAmount: netAmount,
        currency: currency,
        status: 'pending',
        date: new Date(),
        details: `Withdrawal to ${bankDetails.bankName} (${bankDetails.accountNumber})`
      };
      this.transactions.update(txs => [newTx, ...txs]);
      this.addNotification(user.id, 'Withdrawal Requested', `Your withdrawal of ${amount} ${currency} is pending processing.`, 'withdraw');
    }
  }

  transferFunds(recipientId: string, amount: number, currency: string) {
    const user = this.currentUser();
    if ((user.balances[currency] || 0) >= amount) {
      const fee = amount * (this.systemSettings().transferFeePercent / 100);
      const netAmount = amount - fee;
      const profit = fee;

      // Deduct from sender
      this.adjustUserWallet(user.id, currency, amount, false);
      // Add to recipient
      this.adjustUserWallet(recipientId, currency, netAmount, true);

      const newTx: Transaction = {
        id: `tx-${Date.now()}`,
        userId: user.id,
        type: 'transfer',
        amount: amount,
        fee: fee,
        profit: profit,
        netAmount: netAmount,
        currency: currency,
        status: 'completed',
        date: new Date(),
        details: `Transfer to User ${recipientId}`
      };
      this.transactions.update(txs => [newTx, ...txs]);
      this.addNotification(user.id, 'Transfer Successful', `You transferred ${amount} ${currency} to User ${recipientId}.`, 'system');
      this.addNotification(recipientId, 'Funds Received', `You received ${netAmount} ${currency} from User ${user.id}.`, 'system');
    }
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
        this.adjustUserWallet(tx.userId, tx.currency, tx.netAmount, true);
      } else if (status === 'failed' && tx.type === 'withdraw') {
        // Refund failed withdrawal
        this.adjustUserWallet(tx.userId, tx.currency, tx.amount, true);
      }
      this.transactions.update(txs => txs.map(t => t.id === txId ? { ...t, status } : t));
      
      // Notify user
      const statusText = status === 'completed' ? 'approved' : 'rejected';
      this.addNotification(tx.userId, 'Transaction Update', `Your ${tx.type} transaction of ${tx.amount} ${tx.currency} was ${statusText}.`, 'system');
    }
  }
}
