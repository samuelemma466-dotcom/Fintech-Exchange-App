import { Component, inject, computed, signal } from '@angular/core';
import { MockDataService } from '../../core/mock-data.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe, DatePipe, FormsModule],
  template: `
    <div class="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-white">Admin Dashboard</h1>
        <p class="text-sm text-slate-400 mt-1">System overview and quick stats.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-slate-400 mb-1">Total Users</p>
              <h2 class="text-3xl font-bold text-white">{{ mockData.allUsers().length }}</h2>
            </div>
            <div class="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <mat-icon>people</mat-icon>
            </div>
          </div>
        </div>

        <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-slate-400 mb-1">Total Transactions</p>
              <h2 class="text-3xl font-bold text-white">{{ mockData.transactions().length }}</h2>
            </div>
            <div class="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <mat-icon>receipt_long</mat-icon>
            </div>
          </div>
        </div>

        <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-slate-400 mb-1">Active Flips</p>
              <h2 class="text-3xl font-bold text-white">{{ activeFlips() }}</h2>
            </div>
            <div class="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <mat-icon>sync</mat-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Profit Analytics Section -->
      <div class="mt-8">
        <h2 class="text-xl font-bold tracking-tight text-white mb-4">Profit Analytics</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div class="bg-indigo-900/50 p-6 rounded-2xl border border-indigo-500/30 shadow-sm">
            <p class="text-sm font-medium text-indigo-300 mb-1">Total Revenue</p>
            <h2 class="text-3xl font-bold text-white">{{ totalRevenue() | currency:'USD' }}</h2>
          </div>
          <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
            <p class="text-sm font-medium text-slate-400 mb-1">Daily Earnings</p>
            <h2 class="text-2xl font-bold text-white">{{ dailyEarnings() | currency:'USD' }}</h2>
          </div>
          <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
            <p class="text-sm font-medium text-slate-400 mb-1">Weekly Earnings</p>
            <h2 class="text-2xl font-bold text-white">{{ weeklyEarnings() | currency:'USD' }}</h2>
          </div>
          <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
            <p class="text-sm font-medium text-slate-400 mb-1">Total Volume</p>
            <h2 class="text-2xl font-bold text-white">{{ totalVolume() | currency:'USD' }}</h2>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-400 mb-1">Exchange Profit</p>
              <h3 class="text-xl font-bold text-white">{{ revenueBySystem().exchange | currency:'USD' }}</h3>
            </div>
            <div class="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <mat-icon>currency_exchange</mat-icon>
            </div>
          </div>
          <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-400 mb-1">Gift Card Profit</p>
              <h3 class="text-xl font-bold text-white">{{ revenueBySystem().giftcard | currency:'USD' }}</h3>
            </div>
            <div class="w-12 h-12 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center">
              <mat-icon>card_giftcard</mat-icon>
            </div>
          </div>
          <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-400 mb-1">Flipping Profit</p>
              <h3 class="text-xl font-bold text-white">{{ revenueBySystem().flip | currency:'USD' }}</h3>
            </div>
            <div class="w-12 h-12 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <mat-icon>casino</mat-icon>
            </div>
          </div>
        </div>
      </div>
      <!-- Pending Deposits Section -->
      <div class="mt-8">
        <h2 class="text-xl font-bold tracking-tight text-white mb-4">Pending Deposits</h2>
        
        @if (pendingDeposits().length === 0) {
          <div class="bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center">
            <div class="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <mat-icon>check_circle</mat-icon>
            </div>
            <h3 class="text-lg font-medium text-white mb-1">All caught up!</h3>
            <p class="text-slate-400 text-sm">There are no pending deposit requests.</p>
          </div>
        } @else {
          <div class="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead class="bg-slate-900/50 text-slate-400">
                  <tr>
                    <th class="px-6 py-4 font-medium">User ID</th>
                    <th class="px-6 py-4 font-medium">Method</th>
                    <th class="px-6 py-4 font-medium">Amount</th>
                    <th class="px-6 py-4 font-medium">Details</th>
                    <th class="px-6 py-4 font-medium">Date</th>
                    <th class="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-700/50">
                  @for (deposit of pendingDeposits(); track deposit.id) {
                    <tr class="hover:bg-slate-700/20 transition-colors">
                      <td class="px-6 py-4">
                        <span class="text-white font-mono text-xs">{{ deposit.userId.substring(0, 8) }}...</span>
                      </td>
                      <td class="px-6 py-4">
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                              [class.bg-blue-500/10]="deposit.depositMethod === 'card'" [class.text-blue-400]="deposit.depositMethod === 'card'"
                              [class.bg-emerald-500/10]="deposit.depositMethod === 'bank'" [class.text-emerald-400]="deposit.depositMethod === 'bank'"
                              [class.bg-amber-500/10]="deposit.depositMethod === 'crypto'" [class.text-amber-400]="deposit.depositMethod === 'crypto'">
                          {{ deposit.depositMethod }}
                        </span>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-white font-medium">{{ deposit.amount | currency:deposit.currency }}</div>
                        <div class="text-xs text-slate-400">Net: {{ deposit.netAmount | currency:deposit.currency }}</div>
                      </td>
                      <td class="px-6 py-4">
                        @if (deposit.depositMethod === 'card' && deposit.cardDetails) {
                          <div class="text-slate-300 text-xs flex items-center gap-1">
                            <mat-icon class="text-[16px] w-4 h-4">credit_card</mat-icon>
                            •••• {{ deposit.cardDetails.last4 }}
                          </div>
                        } @else if (deposit.depositMethod === 'bank' && deposit.proof) {
                          <div class="text-slate-300 text-xs truncate max-w-[150px]" title="{{ deposit.proof }}">
                            Ref: {{ deposit.proof }}
                          </div>
                        } @else if (deposit.depositMethod === 'crypto' && deposit.txHash) {
                          <div class="text-slate-300 text-xs font-mono truncate max-w-[150px]" title="{{ deposit.txHash }}">
                            Tx: {{ deposit.txHash }}
                          </div>
                        }
                      </td>
                      <td class="px-6 py-4 text-slate-400 text-xs">
                        {{ deposit.date | date:'MMM d, y, h:mm a' }}
                      </td>
                      <td class="px-6 py-4 text-right">
                        <div class="flex items-center justify-end gap-2">
                          <button (click)="approveDeposit(deposit.id)" class="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors" title="Approve">
                            <mat-icon class="text-[20px] w-5 h-5">check</mat-icon>
                          </button>
                          <button (click)="rejectDeposit(deposit.id)" class="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors" title="Reject">
                            <mat-icon class="text-[20px] w-5 h-5">close</mat-icon>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>

      <!-- Pending Withdrawals Section -->
      <div class="mt-8">
        <h2 class="text-xl font-bold tracking-tight text-white mb-4">Pending Withdrawals</h2>
        
        @if (pendingWithdrawals().length === 0) {
          <div class="bg-slate-800 p-8 rounded-2xl border border-slate-700 text-center">
            <div class="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <mat-icon>check_circle</mat-icon>
            </div>
            <h3 class="text-lg font-medium text-white mb-1">All caught up!</h3>
            <p class="text-slate-400 text-sm">There are no pending withdrawal requests.</p>
          </div>
        } @else {
          <div class="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead class="bg-slate-900/50 text-slate-400">
                  <tr>
                    <th class="px-6 py-4 font-medium">User ID</th>
                    <th class="px-6 py-4 font-medium">Amount</th>
                    <th class="px-6 py-4 font-medium">Details</th>
                    <th class="px-6 py-4 font-medium">Date</th>
                    <th class="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-700/50">
                  @for (withdrawal of pendingWithdrawals(); track withdrawal.id) {
                    <tr class="hover:bg-slate-700/20 transition-colors">
                      <td class="px-6 py-4">
                        <span class="text-white font-mono text-xs">{{ withdrawal.userId.substring(0, 8) }}...</span>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-white font-medium">{{ withdrawal.amount | currency:withdrawal.currency }}</div>
                        <div class="text-xs text-slate-400">Net: {{ withdrawal.netAmount | currency:withdrawal.currency }}</div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="text-slate-300 text-xs truncate max-w-[200px]" title="{{ withdrawal.details }}">
                          {{ withdrawal.details }}
                        </div>
                      </td>
                      <td class="px-6 py-4 text-slate-400 text-xs">
                        {{ withdrawal.date | date:'MMM d, y, h:mm a' }}
                      </td>
                      <td class="px-6 py-4 text-right">
                        <div class="flex items-center justify-end gap-2">
                          <button (click)="approveWithdrawal(withdrawal.id)" class="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors" title="Approve">
                            <mat-icon class="text-[20px] w-5 h-5">check</mat-icon>
                          </button>
                          <button (click)="rejectWithdrawal(withdrawal.id)" class="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors" title="Reject">
                            <mat-icon class="text-[20px] w-5 h-5">close</mat-icon>
                          </button>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>

      <!-- System Settings Section -->
      <div class="mt-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold tracking-tight text-white">System Settings</h2>
          <button (click)="openSettingsModal()" class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors">
            <mat-icon class="text-[20px]">settings</mat-icon>
            Configure Fees
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-400 mb-1">Deposit Fee</p>
              <h2 class="text-2xl font-bold text-white">{{ mockData.systemSettings().depositFeePercent }}%</h2>
            </div>
            <div class="w-12 h-12 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400">
              <mat-icon>account_balance_wallet</mat-icon>
            </div>
          </div>
          <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-400 mb-1">Withdrawal Fee</p>
              <h2 class="text-2xl font-bold text-white">{{ mockData.systemSettings().withdrawalFeeFixed | currency:'USD' }}</h2>
            </div>
            <div class="w-12 h-12 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400">
              <mat-icon>arrow_upward</mat-icon>
            </div>
          </div>
          <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-400 mb-1">Transfer Fee</p>
              <h2 class="text-2xl font-bold text-white">{{ mockData.systemSettings().transferFeePercent }}%</h2>
            </div>
            <div class="w-12 h-12 rounded-full bg-amber-900/50 flex items-center justify-center text-amber-400">
              <mat-icon>swap_horiz</mat-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Investment Engine Settings Section -->
      <div class="mt-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold tracking-tight text-white">Investment Engine</h2>
          <button (click)="openInvestSettingsModal()" class="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors">
            <mat-icon class="text-[20px]">trending_up</mat-icon>
            Configure Engine
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-400 mb-1">Safe Win Rate</p>
              <h2 class="text-2xl font-bold text-white">{{ mockData.systemSettings().safeSuccessProb }}%</h2>
            </div>
            <div class="w-12 h-12 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400">
              <mat-icon>shield</mat-icon>
            </div>
          </div>
          <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-400 mb-1">Balanced Win Rate</p>
              <h2 class="text-2xl font-bold text-white">{{ mockData.systemSettings().balancedSuccessProb }}%</h2>
            </div>
            <div class="w-12 h-12 rounded-full bg-indigo-900/50 flex items-center justify-center text-indigo-400">
              <mat-icon>balance</mat-icon>
            </div>
          </div>
          <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-400 mb-1">Aggressive Win Rate</p>
              <h2 class="text-2xl font-bold text-white">{{ mockData.systemSettings().aggressiveSuccessProb }}%</h2>
            </div>
            <div class="w-12 h-12 rounded-full bg-pink-900/50 flex items-center justify-center text-pink-400">
              <mat-icon>trending_up</mat-icon>
            </div>
          </div>
          <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-400 mb-1">First-Time Bonus</p>
              <h2 class="text-2xl font-bold text-white">{{ mockData.systemSettings().firstTimeBonus | currency:'USD' }}</h2>
            </div>
            <div class="w-12 h-12 rounded-full bg-amber-900/50 flex items-center justify-center text-amber-400">
              <mat-icon>redeem</mat-icon>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Modal -->
      @if (showSettingsModal()) {
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-slate-800 rounded-3xl border border-slate-700 shadow-xl w-full max-w-md overflow-hidden">
            <div class="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 class="text-lg font-bold text-white">Configure System Fees</h3>
              <button (click)="closeSettingsModal()" class="text-slate-400 hover:text-white transition-colors">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            
            <div class="p-6 space-y-4">
              <div>
                <label for="deposit-fee" class="block text-sm font-medium text-slate-300 mb-2">Deposit Fee (%)</label>
                <input id="deposit-fee" type="number" [(ngModel)]="editDepositFee" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors">
              </div>
              
              <div>
                <label for="withdrawal-fee" class="block text-sm font-medium text-slate-300 mb-2">Withdrawal Fee (Fixed USD)</label>
                <input id="withdrawal-fee" type="number" [(ngModel)]="editWithdrawalFee" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors">
              </div>

              <div>
                <label for="transfer-fee" class="block text-sm font-medium text-slate-300 mb-2">Transfer Fee (%)</label>
                <input id="transfer-fee" type="number" [(ngModel)]="editTransferFee" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors">
              </div>

              <div>
                <label for="exchange-spread" class="block text-sm font-medium text-slate-300 mb-2">Exchange Spread (%)</label>
                <input id="exchange-spread" type="number" step="0.1" [(ngModel)]="editExchangeSpread" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors">
              </div>

              <div class="pt-4 flex gap-3">
                <button (click)="closeSettingsModal()" class="flex-1 py-3 bg-slate-700 text-white rounded-xl font-bold text-sm hover:bg-slate-600 transition-colors">
                  Cancel
                </button>
                <button (click)="saveSettings()" class="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- Investment Settings Modal -->
      @if (showInvestSettingsModal()) {
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-slate-800 rounded-3xl border border-slate-700 shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div class="p-6 border-b border-slate-700 flex justify-between items-center shrink-0">
              <h3 class="text-lg font-bold text-white">Configure Investment Engine</h3>
              <button (click)="closeInvestSettingsModal()" class="text-slate-400 hover:text-white transition-colors">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            
            <div class="p-6 overflow-y-auto space-y-6">
              <!-- General Settings -->
              <div>
                <h4 class="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider">General & Rewards</h4>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="editInvestMinAmount" class="block text-xs font-medium text-slate-400 mb-1">Min Amount</label>
                    <input id="editInvestMinAmount" type="number" [(ngModel)]="editInvestMinAmount" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editInvestMaxAmount" class="block text-xs font-medium text-slate-400 mb-1">Max Amount</label>
                    <input id="editInvestMaxAmount" type="number" [(ngModel)]="editInvestMaxAmount" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editFirstTimeBonus" class="block text-xs font-medium text-slate-400 mb-1">First-Time Bonus</label>
                    <input id="editFirstTimeBonus" type="number" [(ngModel)]="editFirstTimeBonus" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editCashbackPercent" class="block text-xs font-medium text-slate-400 mb-1">Cashback (%)</label>
                    <input id="editCashbackPercent" type="number" [(ngModel)]="editCashbackPercent" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editStreakBonus" class="block text-xs font-medium text-slate-400 mb-1">Streak Bonus</label>
                    <input id="editStreakBonus" type="number" [(ngModel)]="editStreakBonus" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editHighUrgencyProbBoost" class="block text-xs font-medium text-slate-400 mb-1">Urgency Boost (%)</label>
                    <input id="editHighUrgencyProbBoost" type="number" [(ngModel)]="editHighUrgencyProbBoost" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                </div>
              </div>

              <!-- Adaptive Engine -->
              <div class="border-t border-slate-700 pt-6">
                <h4 class="text-sm font-bold text-amber-400 mb-4 uppercase tracking-wider">Adaptive Engine</h4>
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <label for="editXpPerFlip" class="block text-xs font-medium text-slate-400 mb-1">XP Per Flip</label>
                    <input id="editXpPerFlip" type="number" [(ngModel)]="editXpPerFlip" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editXpPerWin" class="block text-xs font-medium text-slate-400 mb-1">XP Per Win</label>
                    <input id="editXpPerWin" type="number" [(ngModel)]="editXpPerWin" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editPityTimerBoostPercent" class="block text-xs font-medium text-slate-400 mb-1">Pity Boost (%)</label>
                    <input id="editPityTimerBoostPercent" type="number" [(ngModel)]="editPityTimerBoostPercent" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editWinNormalizationPercent" class="block text-xs font-medium text-slate-400 mb-1">Win Normalization (%)</label>
                    <input id="editWinNormalizationPercent" type="number" [(ngModel)]="editWinNormalizationPercent" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editHighUrgencyAbuseThreshold" class="block text-xs font-medium text-slate-400 mb-1">Urgency Abuse Threshold</label>
                    <input id="editHighUrgencyAbuseThreshold" type="number" [(ngModel)]="editHighUrgencyAbuseThreshold" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editHighUrgencyPenaltyPercent" class="block text-xs font-medium text-slate-400 mb-1">Urgency Penalty (%)</label>
                    <input id="editHighUrgencyPenaltyPercent" type="number" [(ngModel)]="editHighUrgencyPenaltyPercent" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                </div>
              </div>

              <!-- Safe Plan -->
              <div class="border-t border-slate-700 pt-6">
                <h4 class="text-sm font-bold text-emerald-400 mb-4 uppercase tracking-wider">Safe Plan</h4>
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <label for="editSafeSuccessProb" class="block text-xs font-medium text-slate-400 mb-1">Success Prob (%)</label>
                    <input id="editSafeSuccessProb" type="number" [(ngModel)]="editSafeSuccessProb" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editSafePartialProb" class="block text-xs font-medium text-slate-400 mb-1">Partial Prob (%)</label>
                    <input id="editSafePartialProb" type="number" [(ngModel)]="editSafePartialProb" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editSafeReturnMin" class="block text-xs font-medium text-slate-400 mb-1">Min Return (e.g. 1.02)</label>
                    <input id="editSafeReturnMin" type="number" step="0.01" [(ngModel)]="editSafeReturnMin" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editSafeReturnMax" class="block text-xs font-medium text-slate-400 mb-1">Max Return (e.g. 1.05)</label>
                    <input id="editSafeReturnMax" type="number" step="0.01" [(ngModel)]="editSafeReturnMax" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editSafeLossMin" class="block text-xs font-medium text-slate-400 mb-1">Loss Multiplier (e.g. 0.95)</label>
                    <input id="editSafeLossMin" type="number" step="0.01" [(ngModel)]="editSafeLossMin" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                </div>
              </div>

              <!-- Balanced Plan -->
              <div class="border-t border-slate-700 pt-6">
                <h4 class="text-sm font-bold text-indigo-400 mb-4 uppercase tracking-wider">Balanced Plan</h4>
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <label for="editBalancedSuccessProb" class="block text-xs font-medium text-slate-400 mb-1">Success Prob (%)</label>
                    <input id="editBalancedSuccessProb" type="number" [(ngModel)]="editBalancedSuccessProb" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editBalancedPartialProb" class="block text-xs font-medium text-slate-400 mb-1">Partial Prob (%)</label>
                    <input id="editBalancedPartialProb" type="number" [(ngModel)]="editBalancedPartialProb" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editBalancedReturnMin" class="block text-xs font-medium text-slate-400 mb-1">Min Return (e.g. 1.08)</label>
                    <input id="editBalancedReturnMin" type="number" step="0.01" [(ngModel)]="editBalancedReturnMin" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editBalancedReturnMax" class="block text-xs font-medium text-slate-400 mb-1">Max Return (e.g. 1.15)</label>
                    <input id="editBalancedReturnMax" type="number" step="0.01" [(ngModel)]="editBalancedReturnMax" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editBalancedLossMin" class="block text-xs font-medium text-slate-400 mb-1">Loss Multiplier (e.g. 0.85)</label>
                    <input id="editBalancedLossMin" type="number" step="0.01" [(ngModel)]="editBalancedLossMin" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                </div>
              </div>

              <!-- Aggressive Plan -->
              <div class="border-t border-slate-700 pt-6">
                <h4 class="text-sm font-bold text-pink-400 mb-4 uppercase tracking-wider">Aggressive Plan</h4>
                <div class="grid grid-cols-3 gap-4">
                  <div>
                    <label for="editAggressiveSuccessProb" class="block text-xs font-medium text-slate-400 mb-1">Success Prob (%)</label>
                    <input id="editAggressiveSuccessProb" type="number" [(ngModel)]="editAggressiveSuccessProb" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editAggressivePartialProb" class="block text-xs font-medium text-slate-400 mb-1">Partial Prob (%)</label>
                    <input id="editAggressivePartialProb" type="number" [(ngModel)]="editAggressivePartialProb" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editAggressiveReturnMin" class="block text-xs font-medium text-slate-400 mb-1">Min Return (e.g. 1.20)</label>
                    <input id="editAggressiveReturnMin" type="number" step="0.01" [(ngModel)]="editAggressiveReturnMin" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editAggressiveReturnMax" class="block text-xs font-medium text-slate-400 mb-1">Max Return (e.g. 1.50)</label>
                    <input id="editAggressiveReturnMax" type="number" step="0.01" [(ngModel)]="editAggressiveReturnMax" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                  <div>
                    <label for="editAggressiveLossMin" class="block text-xs font-medium text-slate-400 mb-1">Loss Multiplier (e.g. 0.50)</label>
                    <input id="editAggressiveLossMin" type="number" step="0.01" [(ngModel)]="editAggressiveLossMin" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500">
                  </div>
                </div>
              </div>

            </div>
            <div class="p-6 border-t border-slate-700 shrink-0 flex gap-3">
              <button (click)="closeInvestSettingsModal()" class="flex-1 py-3 bg-slate-700 text-white rounded-xl font-bold text-sm hover:bg-slate-600 transition-colors">
                Cancel
              </button>
              <button (click)="saveInvestSettings()" class="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
                Save Engine Settings
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminDashboardComponent {
  mockData = inject(MockDataService);

  showSettingsModal = signal(false);
  editDepositFee = signal(0);
  editWithdrawalFee = signal(0);
  editTransferFee = signal(0);
  editExchangeSpread = signal(0);

  showInvestSettingsModal = signal(false);
  editInvestMinAmount = signal(0);
  editInvestMaxAmount = signal(0);
  editSafeSuccessProb = signal(0);
  editSafePartialProb = signal(0);
  editSafeReturnMin = signal(0);
  editSafeReturnMax = signal(0);
  editSafeLossMin = signal(0);
  editBalancedSuccessProb = signal(0);
  editBalancedPartialProb = signal(0);
  editBalancedReturnMin = signal(0);
  editBalancedReturnMax = signal(0);
  editBalancedLossMin = signal(0);
  editAggressiveSuccessProb = signal(0);
  editAggressivePartialProb = signal(0);
  editAggressiveReturnMin = signal(0);
  editAggressiveReturnMax = signal(0);
  editAggressiveLossMin = signal(0);
  editFirstTimeBonus = signal(0);
  editCashbackPercent = signal(0);
  editStreakBonus = signal(0);
  editHighUrgencyProbBoost = signal(0);
  editXpPerFlip = signal(0);
  editXpPerWin = signal(0);
  editPityTimerBoostPercent = signal(0);
  editWinNormalizationPercent = signal(0);
  editHighUrgencyAbuseThreshold = signal(0);
  editHighUrgencyPenaltyPercent = signal(0);

  openSettingsModal() {
    const settings = this.mockData.systemSettings();
    this.editDepositFee.set(settings.depositFeePercent);
    this.editWithdrawalFee.set(settings.withdrawalFeeFixed);
    this.editTransferFee.set(settings.transferFeePercent);
    this.editExchangeSpread.set(settings.exchangeSpreadPercent);
    this.showSettingsModal.set(true);
  }

  closeSettingsModal() {
    this.showSettingsModal.set(false);
  }

  saveSettings() {
    this.mockData.updateSystemSettings({
      depositFeePercent: this.editDepositFee(),
      withdrawalFeeFixed: this.editWithdrawalFee(),
      transferFeePercent: this.editTransferFee(),
      exchangeSpreadPercent: this.editExchangeSpread()
    });
    this.closeSettingsModal();
  }

  openInvestSettingsModal() {
    const settings = this.mockData.systemSettings();
    this.editInvestMinAmount.set(settings.investMinAmount);
    this.editInvestMaxAmount.set(settings.investMaxAmount);
    this.editSafeSuccessProb.set(settings.safeSuccessProb);
    this.editSafePartialProb.set(settings.safePartialProb);
    this.editSafeReturnMin.set(settings.safeReturnMin);
    this.editSafeReturnMax.set(settings.safeReturnMax);
    this.editSafeLossMin.set(settings.safeLossMin);
    this.editBalancedSuccessProb.set(settings.balancedSuccessProb);
    this.editBalancedPartialProb.set(settings.balancedPartialProb);
    this.editBalancedReturnMin.set(settings.balancedReturnMin);
    this.editBalancedReturnMax.set(settings.balancedReturnMax);
    this.editBalancedLossMin.set(settings.balancedLossMin);
    this.editAggressiveSuccessProb.set(settings.aggressiveSuccessProb);
    this.editAggressivePartialProb.set(settings.aggressivePartialProb);
    this.editAggressiveReturnMin.set(settings.aggressiveReturnMin);
    this.editAggressiveReturnMax.set(settings.aggressiveReturnMax);
    this.editAggressiveLossMin.set(settings.aggressiveLossMin);
    this.editFirstTimeBonus.set(settings.firstTimeBonus);
    this.editCashbackPercent.set(settings.cashbackPercent);
    this.editStreakBonus.set(settings.streakBonus);
    this.editHighUrgencyProbBoost.set(settings.highUrgencyProbBoost);
    this.editXpPerFlip.set(settings.xpPerFlip);
    this.editXpPerWin.set(settings.xpPerWin);
    this.editPityTimerBoostPercent.set(settings.pityTimerBoostPercent);
    this.editWinNormalizationPercent.set(settings.winNormalizationPercent);
    this.editHighUrgencyAbuseThreshold.set(settings.highUrgencyAbuseThreshold);
    this.editHighUrgencyPenaltyPercent.set(settings.highUrgencyPenaltyPercent);
    this.showInvestSettingsModal.set(true);
  }

  closeInvestSettingsModal() {
    this.showInvestSettingsModal.set(false);
  }

  saveInvestSettings() {
    this.mockData.updateSystemSettings({
      investMinAmount: this.editInvestMinAmount(),
      investMaxAmount: this.editInvestMaxAmount(),
      safeSuccessProb: this.editSafeSuccessProb(),
      safePartialProb: this.editSafePartialProb(),
      safeReturnMin: this.editSafeReturnMin(),
      safeReturnMax: this.editSafeReturnMax(),
      safeLossMin: this.editSafeLossMin(),
      balancedSuccessProb: this.editBalancedSuccessProb(),
      balancedPartialProb: this.editBalancedPartialProb(),
      balancedReturnMin: this.editBalancedReturnMin(),
      balancedReturnMax: this.editBalancedReturnMax(),
      balancedLossMin: this.editBalancedLossMin(),
      aggressiveSuccessProb: this.editAggressiveSuccessProb(),
      aggressivePartialProb: this.editAggressivePartialProb(),
      aggressiveReturnMin: this.editAggressiveReturnMin(),
      aggressiveReturnMax: this.editAggressiveReturnMax(),
      aggressiveLossMin: this.editAggressiveLossMin(),
      firstTimeBonus: this.editFirstTimeBonus(),
      cashbackPercent: this.editCashbackPercent(),
      streakBonus: this.editStreakBonus(),
      highUrgencyProbBoost: this.editHighUrgencyProbBoost(),
      xpPerFlip: this.editXpPerFlip(),
      xpPerWin: this.editXpPerWin(),
      pityTimerBoostPercent: this.editPityTimerBoostPercent(),
      winNormalizationPercent: this.editWinNormalizationPercent(),
      highUrgencyAbuseThreshold: this.editHighUrgencyAbuseThreshold(),
      highUrgencyPenaltyPercent: this.editHighUrgencyPenaltyPercent()
    });
    this.closeInvestSettingsModal();
  }

  pendingDeposits = computed(() => {
    return this.mockData.transactions().filter(tx => tx.type === 'deposit' && tx.status === 'pending');
  });

  approveDeposit(id: string) {
    this.mockData.updateTransactionStatus(id, 'completed');
  }

  rejectDeposit(id: string) {
    this.mockData.updateTransactionStatus(id, 'failed');
  }

  pendingWithdrawals = computed(() => {
    return this.mockData.transactions().filter(tx => tx.type === 'withdraw' && tx.status === 'pending');
  });

  approveWithdrawal(id: string) {
    this.mockData.updateTransactionStatus(id, 'completed');
  }

  rejectWithdrawal(id: string) {
    this.mockData.updateTransactionStatus(id, 'failed');
  }

  activeFlips = computed(() => {
    return this.mockData.flipSessions().filter(s => s.status === 'open').length;
  });

  totalRevenue = computed(() => {
    return this.mockData.transactions().reduce((sum, tx) => sum + (tx.profit || 0), 0);
  });

  totalVolume = computed(() => {
    return this.mockData.transactions().reduce((sum, tx) => sum + (tx.amount || 0), 0);
  });

  dailyEarnings = computed(() => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    return this.mockData.transactions()
      .filter(tx => tx.date >= oneDayAgo)
      .reduce((sum, tx) => sum + (tx.profit || 0), 0);
  });

  weeklyEarnings = computed(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return this.mockData.transactions()
      .filter(tx => tx.date >= oneWeekAgo)
      .reduce((sum, tx) => sum + (tx.profit || 0), 0);
  });

  revenueBySystem = computed(() => {
    const txs = this.mockData.transactions();
    let exchange = 0;
    let giftcard = 0;
    let flip = 0;

    txs.forEach(tx => {
      if (tx.type === 'exchange') exchange += (tx.profit || 0);
      else if (tx.type === 'giftcard_buy' || tx.type === 'giftcard_sell') giftcard += (tx.profit || 0);
      else if (tx.type === 'flip') flip += (tx.profit || 0);
    });

    return { exchange, giftcard, flip };
  });
}
