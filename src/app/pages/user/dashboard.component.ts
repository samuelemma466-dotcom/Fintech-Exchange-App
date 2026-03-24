import { Component, inject } from '@angular/core';
import { MockDataService } from '../../core/mock-data.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe, DatePipe, RouterLink],
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

      <!-- Recent Transactions -->
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-slate-900">Recent Transactions</h3>
          <a routerLink="/transactions" class="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all</a>
        </div>
        
        <div class="divide-y divide-slate-100">
          @for (tx of mockData.userTransactions().slice(0, 5); track tx.id) {
            <div class="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center"
                     [class.bg-amber-100]="tx.type === 'flip'" [class.text-amber-600]="tx.type === 'flip'"
                     [class.bg-emerald-100]="tx.type === 'exchange'" [class.text-emerald-600]="tx.type === 'exchange'"
                     [class.bg-violet-100]="tx.type.includes('giftcard')" [class.text-violet-600]="tx.type.includes('giftcard')">
                  <mat-icon>
                    {{ tx.type === 'flip' ? 'sync' : (tx.type === 'exchange' ? 'currency_exchange' : 'card_giftcard') }}
                  </mat-icon>
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-900 capitalize">{{ formatType(tx.type) }}</p>
                  <p class="text-xs text-slate-500">{{ tx.date | date:'medium' }}</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-sm font-bold text-slate-900">
                  {{ (tx.type === 'flip' && tx.status === 'pending') || tx.type === 'giftcard_buy' ? '-' : (tx.type === 'exchange' ? '' : '+') }}{{ tx.amount | currency:tx.currency:'symbol-narrow':'1.2-2' }}
                </p>
                <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-1"
                      [class.bg-amber-100]="tx.status === 'pending'" [class.text-amber-800]="tx.status === 'pending'"
                      [class.bg-emerald-100]="tx.status === 'completed'" [class.text-emerald-800]="tx.status === 'completed'"
                      [class.bg-red-100]="tx.status === 'failed'" [class.text-red-800]="tx.status === 'failed'">
                  {{ tx.status }}
                </span>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class UserDashboardComponent {
  mockData = inject(MockDataService);

  formatType(type: string): string {
    return type.replace('_', ' ');
  }
}
