import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe],
  template: `
    <div class="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">My Wallet</h1>
        <p class="text-sm text-slate-500 mt-1">Manage your funds and withdrawal methods.</p>
      </div>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Main Balance -->
        <div class="bg-indigo-600 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
          <div class="absolute top-0 right-0 p-6 opacity-10">
            <mat-icon class="scale-[6]">account_balance_wallet</mat-icon>
          </div>
          <p class="text-indigo-100 font-medium mb-2">Available Balance</p>
          <h2 class="text-4xl font-bold mb-8">{{ (authService.userProfile()?.balance || 0) | currency:'NGN':'symbol-narrow':'1.2-2' }}</h2>
          
          <div class="flex gap-4">
            <button class="bg-white text-indigo-600 px-6 py-3 rounded-xl text-sm font-bold hover:bg-indigo-50 transition-colors shadow-sm flex items-center gap-2">
              <mat-icon class="text-[20px]">arrow_downward</mat-icon> Withdraw
            </button>
            <button class="bg-indigo-500 text-white border border-indigo-400 px-6 py-3 rounded-xl text-sm font-bold hover:bg-indigo-400 transition-colors shadow-sm flex items-center gap-2">
              <mat-icon class="text-[20px]">add</mat-icon> Add Funds
            </button>
          </div>
        </div>

        <!-- Bank Accounts -->
        <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-slate-900">Saved Accounts</h3>
            <button class="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
              <mat-icon class="text-[18px]">add</mat-icon> Add New
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center text-slate-400">
                  <mat-icon>account_balance</mat-icon>
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-900">Guaranty Trust Bank</p>
                  <p class="text-xs text-slate-500">**** 1234</p>
                </div>
              </div>
              <button class="text-slate-400 hover:text-red-500 transition-colors">
                <mat-icon>delete_outline</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class WalletComponent {
  authService = inject(AuthService);
}
