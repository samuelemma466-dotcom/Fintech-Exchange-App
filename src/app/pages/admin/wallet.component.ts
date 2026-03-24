import { Component, inject, signal } from '@angular/core';
import { MockDataService, User } from '../../core/mock-data.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-wallet',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe, FormsModule],
  template: `
    <div class="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-white">Wallet Management</h1>
        <p class="text-sm text-slate-400 mt-1">Adjust user balances and monitor platform liquidity.</p>
      </div>

      <div class="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
        <div class="p-6 border-b border-slate-700 flex justify-between items-center">
          <h3 class="text-lg font-bold text-white">User Wallets</h3>
          <div class="relative">
            <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</mat-icon>
            <input type="text" placeholder="Search users..." 
                   class="pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 w-64">
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-900/50 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                <th class="px-6 py-4">User</th>
                <th class="px-6 py-4">USD Balance</th>
                <th class="px-6 py-4">NGN Balance</th>
                <th class="px-6 py-4">EUR Balance</th>
                <th class="px-6 py-4">GBP Balance</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700">
              @for (user of mockData.allUsers(); track user.id) {
                <tr class="hover:bg-slate-700/50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-medium text-xs">
                        {{ user.name.charAt(0) }}
                      </div>
                      <div>
                        <p class="text-sm font-bold text-white">{{ user.name }}</p>
                        <p class="text-xs text-slate-400">{{ user.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm font-medium text-white">{{ (user.balances['USD'] || 0) | currency:'USD':'symbol-narrow':'1.2-2' }}</td>
                  <td class="px-6 py-4 text-sm font-medium text-white">{{ (user.balances['NGN'] || 0) | currency:'NGN':'symbol-narrow':'1.2-2' }}</td>
                  <td class="px-6 py-4 text-sm font-medium text-white">{{ (user.balances['EUR'] || 0) | currency:'EUR':'symbol-narrow':'1.2-2' }}</td>
                  <td class="px-6 py-4 text-sm font-medium text-white">{{ (user.balances['GBP'] || 0) | currency:'GBP':'symbol-narrow':'1.2-2' }}</td>
                  <td class="px-6 py-4 text-right">
                    <button (click)="openAdjustModal(user)" class="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg text-xs font-medium transition-colors">
                      Adjust
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Adjust Balance Modal -->
      @if (selectedUser()) {
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-slate-800 rounded-3xl border border-slate-700 shadow-xl w-full max-w-md overflow-hidden">
            <div class="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 class="text-lg font-bold text-white">Adjust Balance</h3>
              <button (click)="closeModal()" class="text-slate-400 hover:text-white transition-colors">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-medium">
                  {{ selectedUser()?.name?.charAt(0) }}
                </div>
                <div>
                  <p class="text-sm font-bold text-white">{{ selectedUser()?.name }}</p>
                  <p class="text-xs text-slate-400">{{ selectedUser()?.email }}</p>
                </div>
              </div>

              <div>
                <label for="currency" class="block text-sm font-medium text-slate-400 mb-2">Currency</label>
                <select id="currency" [(ngModel)]="adjustCurrency" (ngModelChange)="onCurrencyChange()" class="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500">
                  <option value="USD">USD</option>
                  <option value="NGN">NGN</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>

              <div>
                <label for="amount" class="block text-sm font-medium text-slate-400 mb-2">New Balance Amount</label>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span class="text-slate-500">{{ adjustCurrency }}</span>
                  </div>
                  <input type="number" id="amount" [(ngModel)]="adjustAmount" 
                         class="w-full bg-slate-900 border border-slate-700 rounded-xl pl-16 pr-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                         placeholder="0.00">
                </div>
              </div>

              <div class="flex justify-end gap-3 mt-8">
                <button (click)="closeModal()" class="px-4 py-2 text-slate-400 hover:text-white font-medium text-sm transition-colors">
                  Cancel
                </button>
                <button (click)="saveBalance()" class="px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium text-sm hover:bg-emerald-600 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminWalletComponent {
  mockData = inject(MockDataService);
  
  selectedUser = signal<User | null>(null);
  adjustCurrency = 'USD';
  adjustAmount = 0;

  openAdjustModal(user: User) {
    this.selectedUser.set(user);
    this.adjustCurrency = 'USD';
    this.adjustAmount = user.balances['USD'] || 0;
  }

  onCurrencyChange() {
    const user = this.selectedUser();
    if (user) {
      this.adjustAmount = user.balances[this.adjustCurrency] || 0;
    }
  }

  closeModal() {
    this.selectedUser.set(null);
  }

  saveBalance() {
    const user = this.selectedUser();
    if (user) {
      this.mockData.allUsers.update(users => users.map(u => {
        if (u.id === user.id) {
          const newBalances = { ...u.balances, [this.adjustCurrency]: this.adjustAmount };
          return { ...u, balances: newBalances, balance: newBalances[u.currency] || 0 };
        }
        return u;
      }));
      
      if (this.mockData.currentUser().id === user.id) {
        this.mockData.currentUser.update(u => {
          const newBalances = { ...u.balances, [this.adjustCurrency]: this.adjustAmount };
          return { ...u, balances: newBalances, balance: newBalances[u.currency] || 0 };
        });
      }
      
      this.closeModal();
    }
  }
}
