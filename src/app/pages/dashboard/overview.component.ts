import { Component, inject, computed } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { FirestoreService } from '../../core/firestore.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe, DatePipe, RouterLink],
  template: `
    <div class="space-y-6 pb-20 md:pb-0">
      <div class="flex justify-between items-end">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p class="text-sm text-slate-500 mt-1">Welcome back, {{ authService.currentUser()?.email }}</p>
        </div>
        <a routerLink="/dashboard/exchange" class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
          <mat-icon class="text-[20px]">add</mat-icon> New Exchange
        </a>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Balance Card -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-10">
            <mat-icon class="scale-[4]">account_balance_wallet</mat-icon>
          </div>
          <p class="text-sm font-medium text-slate-500 mb-1">Total Balance</p>
          <h2 class="text-3xl font-bold text-slate-900">{{ (authService.userProfile()?.balance || 0) | currency:'NGN':'symbol-narrow':'1.2-2' }}</h2>
          <div class="mt-4 flex items-center text-sm text-emerald-600 font-medium">
            <mat-icon class="text-[16px] mr-1">trending_up</mat-icon> Updated just now
          </div>
        </div>

        <!-- Pending Transactions -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-slate-500 mb-1">Pending Exchanges</p>
              <h2 class="text-3xl font-bold text-slate-900">{{ pendingCount() }}</h2>
            </div>
            <div class="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <mat-icon>pending_actions</mat-icon>
            </div>
          </div>
          <div class="mt-4 text-sm text-slate-500">
            Awaiting admin approval
          </div>
        </div>

        <!-- Total Transactions -->
        <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-slate-500 mb-1">Total Transactions</p>
              <h2 class="text-3xl font-bold text-slate-900">{{ firestore.transactions().length }}</h2>
            </div>
            <div class="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <mat-icon>receipt_long</mat-icon>
            </div>
          </div>
          <div class="mt-4 text-sm text-slate-500">
            Lifetime exchanges
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h3 class="text-lg font-semibold text-slate-900">Recent Activity</h3>
          <a routerLink="/dashboard/history" class="text-sm font-medium text-indigo-600 hover:text-indigo-700">View all</a>
        </div>
        
        @if (recentTransactions().length === 0) {
          <div class="p-12 text-center">
            <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <mat-icon>inbox</mat-icon>
            </div>
            <h3 class="text-sm font-medium text-slate-900 mb-1">No transactions yet</h3>
            <p class="text-sm text-slate-500">When you make an exchange, it will appear here.</p>
          </div>
        } @else {
          <div class="divide-y divide-slate-100">
            @for (tx of recentTransactions(); track tx.id) {
              <div class="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full flex items-center justify-center"
                       [class.bg-amber-100]="tx.type === 'crypto'" [class.text-amber-600]="tx.type === 'crypto'"
                       [class.bg-emerald-100]="tx.type === 'fiat'" [class.text-emerald-600]="tx.type === 'fiat'"
                       [class.bg-violet-100]="tx.type === 'giftcard'" [class.text-violet-600]="tx.type === 'giftcard'">
                    <mat-icon>
                      {{ tx.type === 'crypto' ? 'currency_bitcoin' : (tx.type === 'fiat' ? 'currency_exchange' : 'card_giftcard') }}
                    </mat-icon>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-slate-900">Exchange {{ tx.asset }}</p>
                    <p class="text-xs text-slate-500">{{ tx.createdAt | date:'medium' }}</p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-sm font-bold text-slate-900">{{ tx.total | currency:'NGN':'symbol-narrow':'1.2-2' }}</p>
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        [class.bg-amber-100]="tx.status === 'pending'" [class.text-amber-800]="tx.status === 'pending'"
                        [class.bg-emerald-100]="tx.status === 'approved'" [class.text-emerald-800]="tx.status === 'approved'"
                        [class.bg-red-100]="tx.status === 'rejected'" [class.text-red-800]="tx.status === 'rejected'">
                    {{ tx.status }}
                  </span>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class OverviewComponent {
  authService = inject(AuthService);
  firestore = inject(FirestoreService);

  pendingCount = computed(() => {
    return this.firestore.transactions().filter(tx => tx.status === 'pending').length;
  });

  recentTransactions = computed(() => {
    return this.firestore.transactions().slice(0, 5);
  });
}
