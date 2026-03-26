import { Component, inject, computed, signal } from '@angular/core';
import { MockDataService, Transaction } from '../../core/mock-data.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe, DatePipe, DecimalPipe, RouterLink],
  template: `
    <div class="space-y-6 pb-20 md:pb-0">
      <div class="flex justify-between items-end">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p class="text-sm text-slate-500 mt-1">Welcome back, {{ mockData.currentUser().name }}</p>
        </div>
      </div>

      <!-- Wallet Card -->
      <div class="bg-indigo-600 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div class="absolute top-0 right-0 p-8 opacity-10">
          <mat-icon class="scale-[8]">account_balance_wallet</mat-icon>
        </div>
        <p class="text-indigo-200 font-medium mb-2">Available Balance</p>
        <h2 class="text-5xl font-bold tracking-tight mb-6">
          {{ (mockData.currentUser().balances[mockData.currentUser().currency] || 0) | currency:mockData.currentUser().currency:'symbol-narrow':'1.2-2' }}
        </h2>
        
        <div class="grid grid-cols-3 gap-4 mt-8">
          <a routerLink="/flipping" class="bg-white/10 hover:bg-white/20 transition-colors rounded-2xl p-4 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
            <mat-icon>sync</mat-icon>
            <span class="text-sm font-medium">Flip</span>
          </a>
          <a routerLink="/exchange" class="bg-white/10 hover:bg-white/20 transition-colors rounded-2xl p-4 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
            <mat-icon>currency_exchange</mat-icon>
            <span class="text-sm font-medium">Exchange</span>
          </a>
          <a routerLink="/giftcards" class="bg-white/10 hover:bg-white/20 transition-colors rounded-2xl p-4 flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
            <mat-icon>card_giftcard</mat-icon>
            <span class="text-sm font-medium">Gift Cards</span>
          </a>
        </div>
      </div>

      <!-- Analytics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <mat-icon>trending_up</mat-icon>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Total Earnings</p>
            <h3 class="text-xl font-bold text-slate-900">{{ totalEarnings() | currency:mockData.currentUser().currency:'symbol-narrow':'1.2-2' }}</h3>
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <mat-icon>trending_down</mat-icon>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Total Spent</p>
            <h3 class="text-xl font-bold text-slate-900">{{ totalSpent() | currency:mockData.currentUser().currency:'symbol-narrow':'1.2-2' }}</h3>
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
            <mat-icon>receipt_long</mat-icon>
          </div>
          <div>
            <p class="text-sm font-medium text-slate-500">Total Transactions</p>
            <h3 class="text-xl font-bold text-slate-900">{{ totalTransactions() | number }}</h3>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-slate-900">Recent Transactions</h3>
          <a routerLink="/transactions" class="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all</a>
        </div>
        
        <div class="divide-y divide-slate-100">
          @for (tx of mockData.userTransactions().slice(0, 5); track tx.id) {
            <div tabindex="0" (keyup.enter)="openReceipt(tx)" (click)="openReceipt(tx)" class="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center"
                     [class.bg-amber-100]="tx.type === 'flip'" [class.text-amber-600]="tx.type === 'flip'"
                     [class.bg-emerald-100]="tx.type === 'exchange'" [class.text-emerald-600]="tx.type === 'exchange'"
                     [class.bg-violet-100]="tx.type.includes('giftcard')" [class.text-violet-600]="tx.type.includes('giftcard')"
                     [class.bg-blue-100]="tx.type === 'deposit'" [class.text-blue-600]="tx.type === 'deposit'"
                     [class.bg-pink-100]="tx.type === 'withdraw'" [class.text-pink-600]="tx.type === 'withdraw'"
                     [class.bg-cyan-100]="tx.type === 'transfer'" [class.text-cyan-600]="tx.type === 'transfer'">
                  <mat-icon>
                    {{ tx.type === 'flip' ? 'sync' : (tx.type === 'exchange' ? 'currency_exchange' : (tx.type.includes('giftcard') ? 'card_giftcard' : (tx.type === 'deposit' ? 'add' : (tx.type === 'withdraw' ? 'arrow_upward' : 'swap_horiz')))) }}
                  </mat-icon>
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-900 capitalize">{{ formatType(tx.type) }}</p>
                  <p class="text-xs text-slate-500">{{ tx.date | date:'medium' }}</p>
                </div>
              </div>
              <div class="text-right flex items-center gap-4">
                <div>
                  <p class="text-sm font-bold text-slate-900">
                    {{ tx.amount | currency:tx.currency:'symbol-narrow':'1.2-2' }}
                  </p>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1"
                        [class.bg-amber-100]="tx.status === 'pending'" [class.text-amber-800]="tx.status === 'pending'"
                        [class.bg-emerald-100]="tx.status === 'completed'" [class.text-emerald-800]="tx.status === 'completed'"
                        [class.bg-red-100]="tx.status === 'failed'" [class.text-red-800]="tx.status === 'failed'">
                    {{ tx.status }}
                  </span>
                </div>
                <mat-icon class="text-slate-400 text-[20px]">chevron_right</mat-icon>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Receipt Modal -->
      @if (selectedReceipt()) {
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <mat-icon class="text-indigo-600">receipt_long</mat-icon>
                Transaction Receipt
              </h3>
              <button (click)="closeReceipt()" class="text-slate-400 hover:text-slate-600 transition-colors">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            
            <div class="p-6 space-y-6">
              <div class="text-center">
                <p class="text-sm text-slate-500 mb-1">Amount</p>
                <h2 class="text-4xl font-bold text-slate-900 tracking-tight">
                  {{ selectedReceipt()!.amount | currency:selectedReceipt()!.currency:'symbol-narrow':'1.2-2' }}
                </h2>
                <div class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-3"
                     [class.bg-amber-100]="selectedReceipt()!.status === 'pending'" [class.text-amber-800]="selectedReceipt()!.status === 'pending'"
                     [class.bg-emerald-100]="selectedReceipt()!.status === 'completed'" [class.text-emerald-800]="selectedReceipt()!.status === 'completed'"
                     [class.bg-red-100]="selectedReceipt()!.status === 'failed'" [class.text-red-800]="selectedReceipt()!.status === 'failed'">
                  {{ selectedReceipt()!.status }}
                </div>
              </div>

              <div class="space-y-3 pt-4 border-t border-slate-100 border-dashed">
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500">Transaction ID</span>
                  <span class="font-mono text-slate-900 font-medium">{{ selectedReceipt()!.id }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500">Date</span>
                  <span class="text-slate-900 font-medium">{{ selectedReceipt()!.date | date:'medium' }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500">Type</span>
                  <span class="text-slate-900 font-medium capitalize">{{ formatType(selectedReceipt()!.type) }}</span>
                </div>
                @if (selectedReceipt()!.fee > 0) {
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-500">Fee</span>
                    <span class="text-slate-900 font-medium">{{ selectedReceipt()!.fee | currency:selectedReceipt()!.currency:'symbol-narrow':'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between text-sm font-bold pt-2 border-t border-slate-100">
                    <span class="text-slate-900">Net Amount</span>
                    <span class="text-slate-900">{{ selectedReceipt()!.netAmount | currency:selectedReceipt()!.currency:'symbol-narrow':'1.2-2' }}</span>
                  </div>
                }
              </div>

              <div class="pt-6">
                <button (click)="closeReceipt()" class="w-full py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors">
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class UserDashboardComponent {
  mockData = inject(MockDataService);

  selectedReceipt = signal<Transaction | null>(null);

  openReceipt(tx: Transaction) {
    this.selectedReceipt.set(tx);
  }

  closeReceipt() {
    this.selectedReceipt.set(null);
  }

  totalEarnings = computed(() => {
    return this.mockData.userTransactions()
      .filter(tx => tx.status === 'completed' && (tx.type === 'giftcard_sell' || tx.type === 'deposit'))
      .reduce((sum, tx) => sum + tx.netAmount, 0);
  });

  totalSpent = computed(() => {
    return this.mockData.userTransactions()
      .filter(tx => tx.status === 'completed' && (tx.type === 'giftcard_buy' || tx.type === 'withdraw' || tx.type === 'transfer' || tx.type === 'flip'))
      .reduce((sum, tx) => sum + tx.amount, 0);
  });

  totalTransactions = computed(() => {
    return this.mockData.userTransactions().length;
  });

  formatType(type: string): string {
    return type.replace('_', ' ');
  }
}
