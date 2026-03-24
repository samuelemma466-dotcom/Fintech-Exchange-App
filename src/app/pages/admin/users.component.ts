import { Component, inject, signal, computed } from '@angular/core';
import { MockDataService, User } from '../../core/mock-data.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe, DatePipe, FormsModule],
  template: `
    <div class="space-y-6 pb-20 md:pb-0">
      @if (!selectedUser()) {
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-white">User Intelligence & KYC</h1>
          <p class="text-sm text-slate-400 mt-1">Manage users, review KYC, and monitor risk.</p>
        </div>

        <div class="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-900/50 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  <th class="px-6 py-4">User</th>
                  <th class="px-6 py-4">Status</th>
                  <th class="px-6 py-4">KYC</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-700">
                @for (user of mockData.allUsers(); track user.id) {
                  <tr class="hover:bg-slate-700/50 transition-colors cursor-pointer" (click)="viewUser(user)">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-medium">
                          {{ user.name.charAt(0) }}
                        </div>
                        <div>
                          <p class="text-sm font-bold text-white">{{ user.name }}</p>
                          <p class="text-xs text-slate-400">{{ user.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      @if (user.isFrozen) {
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-400">Frozen</span>
                      } @else {
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400">Active</span>
                      }
                    </td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                            [class.bg-amber-500/10]="user.kycStatus === 'pending'" [class.text-amber-400]="user.kycStatus === 'pending'"
                            [class.bg-emerald-500/10]="user.kycStatus === 'approved'" [class.text-emerald-400]="user.kycStatus === 'approved'"
                            [class.bg-red-500/10]="user.kycStatus === 'rejected'" [class.text-red-400]="user.kycStatus === 'rejected'"
                            [class.bg-slate-700]="user.kycStatus === 'none'" [class.text-slate-400]="user.kycStatus === 'none'">
                        {{ user.kycStatus }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <button class="px-3 py-1.5 bg-slate-700 text-white hover:bg-slate-600 rounded-lg text-xs font-medium transition-colors">
                        View Details
                      </button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      } @else {
        <!-- User Details View -->
        <div class="space-y-6">
          <div class="flex items-center gap-4">
            <button (click)="closeUser()" class="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors border border-slate-700">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <div>
              <h1 class="text-2xl font-bold tracking-tight text-white">{{ selectedUser()?.name }}</h1>
              <p class="text-sm text-slate-400 mt-1">Account ID: {{ selectedUser()?.id }}</p>
            </div>
            <div class="ml-auto flex gap-2">
              @if (selectedUser()?.isFrozen) {
                <button (click)="toggleFreeze(false)" class="px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                  <mat-icon class="text-[18px]">lock_open</mat-icon> Unfreeze Account
                </button>
              } @else {
                <button (click)="toggleFreeze(true)" class="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                  <mat-icon class="text-[18px]">lock</mat-icon> Freeze Account
                </button>
              }
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <!-- Left Column: Info & Risk -->
            <div class="space-y-6">
              <!-- Basic Info -->
              <div class="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <h3 class="text-lg font-bold text-white mb-4">Basic Information</h3>
                <div class="space-y-4">
                  <div>
                    <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Email</p>
                    <p class="text-sm text-white">{{ selectedUser()?.email }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Phone</p>
                    <p class="text-sm text-white">{{ selectedUser()?.phone || 'Not provided' }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Country</p>
                    <p class="text-sm text-white">{{ selectedUser()?.country || 'Not provided' }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Date Registered</p>
                    <p class="text-sm text-white">{{ selectedUser()?.dateRegistered | date:'mediumDate' }}</p>
                  </div>
                </div>
              </div>

              <!-- Risk & Activity -->
              <div class="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <h3 class="text-lg font-bold text-white mb-4">Activity & Risk</h3>
                <div class="space-y-4">
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-slate-400">Total Transactions</span>
                    <span class="text-sm font-bold text-white">{{ userTransactions().length }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-slate-400">Total Volume</span>
                    <span class="text-sm font-bold text-white">{{ totalVolume() | currency:'USD':'symbol-narrow':'1.0-0' }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-slate-400">Pending Transactions</span>
                    <span class="text-sm font-bold text-amber-400">{{ pendingCount() }}</span>
                  </div>
                  <div class="pt-4 border-t border-slate-700">
                    <div class="flex items-center gap-2">
                      <mat-icon [class.text-red-400]="isSuspicious()" [class.text-emerald-400]="!isSuspicious()">
                        {{ isSuspicious() ? 'warning' : 'verified_user' }}
                      </mat-icon>
                      <span class="text-sm font-bold" [class.text-red-400]="isSuspicious()" [class.text-emerald-400]="!isSuspicious()">
                        {{ isSuspicious() ? 'High Risk / Suspicious' : 'Low Risk / Normal' }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Bank Details -->
              <div class="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <h3 class="text-lg font-bold text-white mb-4">Bank Details</h3>
                @if (selectedUser()?.bankDetails) {
                  <div class="space-y-4">
                    <div>
                      <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Bank Name</p>
                      <p class="text-sm text-white">{{ selectedUser()?.bankDetails?.bankName }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Account Number</p>
                      <p class="text-sm font-mono text-white">{{ selectedUser()?.bankDetails?.accountNumber }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Account Name</p>
                      <p class="text-sm text-white">{{ selectedUser()?.bankDetails?.accountName }}</p>
                    </div>
                  </div>
                } @else {
                  <p class="text-sm text-slate-500">No bank details provided.</p>
                }
              </div>
            </div>

            <!-- Middle Column: KYC & Wallets -->
            <div class="space-y-6">
              <!-- KYC Details -->
              <div class="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-bold text-white">KYC Verification</h3>
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        [class.bg-amber-500/10]="selectedUser()?.kycStatus === 'pending'" [class.text-amber-400]="selectedUser()?.kycStatus === 'pending'"
                        [class.bg-emerald-500/10]="selectedUser()?.kycStatus === 'approved'" [class.text-emerald-400]="selectedUser()?.kycStatus === 'approved'"
                        [class.bg-red-500/10]="selectedUser()?.kycStatus === 'rejected'" [class.text-red-400]="selectedUser()?.kycStatus === 'rejected'"
                        [class.bg-slate-700]="selectedUser()?.kycStatus === 'none'" [class.text-slate-400]="selectedUser()?.kycStatus === 'none'">
                    {{ selectedUser()?.kycStatus }}
                  </span>
                </div>
                
                @if (selectedUser()?.kycDetails) {
                  <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">ID Type</p>
                        <p class="text-sm text-white">{{ selectedUser()?.kycDetails?.idType }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">ID Number</p>
                        <p class="text-sm font-mono text-white">{{ selectedUser()?.kycDetails?.idNumber }}</p>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">ID Document</p>
                        <img [src]="selectedUser()?.kycDetails?.idImage" alt="ID Document" class="w-full h-24 object-cover rounded-lg border border-slate-700" referrerpolicy="no-referrer">
                      </div>
                      <div>
                        <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Selfie</p>
                        <img [src]="selectedUser()?.kycDetails?.selfieImage" alt="Selfie" class="w-full h-24 object-cover rounded-lg border border-slate-700" referrerpolicy="no-referrer">
                      </div>
                    </div>

                    @if (selectedUser()?.kycStatus === 'pending') {
                      <div class="flex gap-3 pt-4 border-t border-slate-700 mt-4">
                        <button (click)="updateKyc('approved')" class="flex-1 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-xl text-sm font-medium transition-colors">
                          Approve KYC
                        </button>
                        <button (click)="updateKyc('rejected')" class="flex-1 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl text-sm font-medium transition-colors">
                          Reject KYC
                        </button>
                      </div>
                    }
                  </div>
                } @else {
                  <p class="text-sm text-slate-500">No KYC documents submitted.</p>
                }
              </div>

              <!-- Wallet Information -->
              <div class="bg-slate-800 rounded-2xl border border-slate-700 p-6">
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-bold text-white">Wallet Balances</h3>
                  <button (click)="showAdjustModal = true" class="text-xs text-indigo-400 hover:text-indigo-300 font-medium">Adjust Funds</button>
                </div>
                <div class="grid grid-cols-2 gap-4">
                  @for (currency of ['USD', 'NGN', 'EUR', 'GBP']; track currency) {
                    <div class="bg-slate-900 p-4 rounded-xl border border-slate-700">
                      <p class="text-xs text-slate-500 font-semibold mb-1">{{ currency }}</p>
                      <p class="text-lg font-bold text-white">{{ (selectedUser()?.balances?.[currency] || 0) | currency:currency:'symbol-narrow':'1.2-2' }}</p>
                    </div>
                  }
                </div>
              </div>
            </div>

            <!-- Right Column: Transactions -->
            <div class="bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col h-full max-h-[800px]">
              <h3 class="text-lg font-bold text-white mb-4">Transaction History</h3>
              <div class="overflow-y-auto flex-1 pr-2 space-y-3">
                @if (userTransactions().length === 0) {
                  <p class="text-sm text-slate-500 text-center py-8">No transactions found.</p>
                }
                @for (tx of userTransactions(); track tx.id) {
                  <div class="p-4 bg-slate-900 rounded-xl border border-slate-700 flex flex-col gap-2">
                    <div class="flex justify-between items-start">
                      <div class="flex items-center gap-2">
                        <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                             [class.bg-amber-500/10]="tx.type === 'flip'" [class.text-amber-400]="tx.type === 'flip'"
                             [class.bg-emerald-500/10]="tx.type === 'exchange'" [class.text-emerald-400]="tx.type === 'exchange'"
                             [class.bg-violet-500/10]="tx.type.includes('giftcard')" [class.text-violet-400]="tx.type.includes('giftcard')"
                             [class.bg-blue-500/10]="tx.type === 'deposit'" [class.text-blue-400]="tx.type === 'deposit'">
                          <mat-icon class="text-[16px]">
                            {{ tx.type === 'flip' ? 'sync' : (tx.type === 'exchange' ? 'currency_exchange' : (tx.type === 'deposit' ? 'account_balance_wallet' : 'card_giftcard')) }}
                          </mat-icon>
                        </div>
                        <div>
                          <p class="text-sm font-bold text-white capitalize">{{ formatType(tx.type) }}</p>
                          <p class="text-[10px] text-slate-500">{{ tx.date | date:'short' }}</p>
                        </div>
                      </div>
                      <div class="text-right">
                        <p class="text-sm font-bold text-white">{{ tx.amount | currency:tx.currency:'symbol-narrow':'1.2-2' }}</p>
                        <span class="text-[10px] font-bold uppercase tracking-wider"
                              [class.text-amber-400]="tx.status === 'pending'"
                              [class.text-emerald-400]="tx.status === 'completed'"
                              [class.text-red-400]="tx.status === 'failed'">
                          {{ tx.status }}
                        </span>
                      </div>
                    </div>
                    @if (tx.details) {
                      <p class="text-xs text-slate-400 mt-1">{{ tx.details }}</p>
                    }
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Adjust Balance Modal -->
      @if (showAdjustModal) {
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-slate-800 rounded-3xl border border-slate-700 shadow-xl w-full max-w-md overflow-hidden">
            <div class="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 class="text-lg font-bold text-white">Adjust Wallet Balance</h3>
              <button (click)="showAdjustModal = false" class="text-slate-400 hover:text-white transition-colors">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label for="action-select" class="block text-sm font-medium text-slate-400 mb-2">Action</label>
                <select id="action-select" [(ngModel)]="adjustAction" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
                  <option value="credit">Credit (Add Funds)</option>
                  <option value="debit">Debit (Remove Funds)</option>
                </select>
              </div>
              <div>
                <label for="currency-select" class="block text-sm font-medium text-slate-400 mb-2">Currency</label>
                <select id="currency-select" [(ngModel)]="adjustCurrency" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500">
                  <option value="USD">USD</option>
                  <option value="NGN">NGN</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
              <div>
                <label for="amount-input" class="block text-sm font-medium text-slate-400 mb-2">Amount</label>
                <input id="amount-input" type="number" [(ngModel)]="adjustAmount" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" placeholder="0.00">
              </div>
              <button (click)="confirmAdjustment()" class="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors mt-4">
                Confirm {{ adjustAction === 'credit' ? 'Credit' : 'Debit' }}
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminUsersComponent {
  mockData = inject(MockDataService);
  
  selectedUser = signal<User | null>(null);
  showAdjustModal = false;
  adjustAction: 'credit' | 'debit' = 'credit';
  adjustCurrency = 'USD';
  adjustAmount = 0;

  userTransactions = computed(() => {
    const user = this.selectedUser();
    if (!user) return [];
    return this.mockData.transactions().filter(t => t.userId === user.id).sort((a, b) => b.date.getTime() - a.date.getTime());
  });

  totalVolume = computed(() => {
    return this.userTransactions().reduce((sum, tx) => sum + (tx.status === 'completed' ? tx.amount : 0), 0);
  });

  pendingCount = computed(() => {
    return this.userTransactions().filter(tx => tx.status === 'pending').length;
  });

  isSuspicious = computed(() => {
    const txs = this.userTransactions();
    const volume = this.totalVolume();
    // Simulate risk logic: > 20 txs or > $50,000 volume or multiple failed txs
    const failedCount = txs.filter(tx => tx.status === 'failed').length;
    return txs.length > 20 || volume > 50000 || failedCount > 3;
  });

  viewUser(user: User) {
    this.selectedUser.set(user);
  }

  closeUser() {
    this.selectedUser.set(null);
  }

  updateKyc(status: 'approved' | 'rejected') {
    const user = this.selectedUser();
    if (user) {
      this.mockData.updateUserKyc(user.id, status);
      // Update local selected user state to reflect changes immediately
      this.selectedUser.set({ ...user, kycStatus: status });
    }
  }

  toggleFreeze(freeze: boolean) {
    const user = this.selectedUser();
    if (user) {
      this.mockData.freezeUser(user.id, freeze);
      this.selectedUser.set({ ...user, isFrozen: freeze });
    }
  }

  confirmAdjustment() {
    const user = this.selectedUser();
    if (user && this.adjustAmount > 0) {
      this.mockData.adjustUserWallet(user.id, this.adjustCurrency, this.adjustAmount, this.adjustAction === 'credit');
      
      // Update local selected user state
      const updatedUser = this.mockData.allUsers().find(u => u.id === user.id);
      if (updatedUser) {
        this.selectedUser.set(updatedUser);
      }
      
      this.showAdjustModal = false;
      this.adjustAmount = 0;
    }
  }

  formatType(type: string): string {
    return type.replace('_', ' ');
  }
}
