import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MockDataService, SystemSettings } from '../../core/mock-data.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  template: `
    <div class="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">System Settings</h1>
        <p class="text-slate-500">Configure global platform rules and fees.</p>
      </div>

      <!-- Success Message -->
      @if (showSuccess()) {
        <div class="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 border border-emerald-100">
          <mat-icon class="text-emerald-500">check_circle</mat-icon>
          <p class="font-medium">Settings updated successfully.</p>
        </div>
      }

      <form (ngSubmit)="saveSettings()" class="space-y-6">
        <!-- Fees & Spread -->
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 class="font-semibold text-slate-800 flex items-center gap-2">
              <mat-icon class="text-slate-400">payments</mat-icon>
              Global Fees & Spread
            </h2>
          </div>
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label for="depositFee" class="block text-sm font-medium text-slate-700 mb-2">Deposit Fee (%)</label>
              <input id="depositFee" type="number" step="0.1" [(ngModel)]="settings().depositFeePercent" name="depositFee" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
            </div>
            <div>
              <label for="withdrawFee" class="block text-sm font-medium text-slate-700 mb-2">Withdrawal Fee (Fixed)</label>
              <input id="withdrawFee" type="number" [(ngModel)]="settings().withdrawalFeeFixed" name="withdrawFee" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
            </div>
            <div>
              <label for="transferFee" class="block text-sm font-medium text-slate-700 mb-2">Transfer Fee (%)</label>
              <input id="transferFee" type="number" step="0.1" [(ngModel)]="settings().transferFeePercent" name="transferFee" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
            </div>
            <div>
              <label for="exchangeSpread" class="block text-sm font-medium text-slate-700 mb-2">Exchange Spread (%)</label>
              <input id="exchangeSpread" type="number" step="0.1" [(ngModel)]="settings().exchangeSpreadPercent" name="exchangeSpread" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
            </div>
          </div>
        </div>

        <!-- Transaction Limits -->
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 class="font-semibold text-slate-800 flex items-center gap-2">
              <mat-icon class="text-slate-400">tune</mat-icon>
              Transaction Limits
            </h2>
          </div>
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-slate-900 border-b border-slate-100 pb-2">Deposits</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="minDeposit" class="block text-xs text-slate-500 mb-1">Min Amount</label>
                  <input id="minDeposit" type="number" [(ngModel)]="settings().minDepositAmount" name="minDeposit" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                </div>
                <div>
                  <label for="maxDeposit" class="block text-xs text-slate-500 mb-1">Max Amount</label>
                  <input id="maxDeposit" type="number" [(ngModel)]="settings().maxDepositAmount" name="maxDeposit" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                </div>
              </div>
            </div>
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-slate-900 border-b border-slate-100 pb-2">Withdrawals</h3>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="minWithdraw" class="block text-xs text-slate-500 mb-1">Min Amount</label>
                  <input id="minWithdraw" type="number" [(ngModel)]="settings().minWithdrawalAmount" name="minWithdraw" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                </div>
                <div>
                  <label for="maxWithdraw" class="block text-xs text-slate-500 mb-1">Max Amount</label>
                  <input id="maxWithdraw" type="number" [(ngModel)]="settings().maxWithdrawalAmount" name="maxWithdraw" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Flipping Rules -->
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 class="font-semibold text-slate-800 flex items-center gap-2">
              <mat-icon class="text-slate-400">casino</mat-icon>
              Flipping Rules
            </h2>
          </div>
          <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="flipMultiplier" class="block text-sm font-medium text-slate-700 mb-2">Global Multiplier</label>
              <input id="flipMultiplier" type="number" step="0.1" [(ngModel)]="settings().flipMultiplier" name="flipMultiplier" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
            </div>
            <div>
              <label for="flipMaxEntry" class="block text-sm font-medium text-slate-700 mb-2">Max Entry Amount</label>
              <input id="flipMaxEntry" type="number" [(ngModel)]="settings().flipMaxEntry" name="flipMaxEntry" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
            </div>
          </div>
        </div>

        <!-- Deposit Methods Details -->
        <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h2 class="font-semibold text-slate-800 flex items-center gap-2">
              <mat-icon class="text-slate-400">account_balance</mat-icon>
              Deposit Methods Details
            </h2>
          </div>
          <div class="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Bank Details -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-slate-900 border-b border-slate-100 pb-2">Bank Transfer Details</h3>
              <div>
                <label for="bankName" class="block text-xs text-slate-500 mb-1">Bank Name</label>
                <input id="bankName" type="text" [(ngModel)]="settings().bankDepositDetails.bankName" name="bankName" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
              </div>
              <div>
                <label for="accountName" class="block text-xs text-slate-500 mb-1">Account Name</label>
                <input id="accountName" type="text" [(ngModel)]="settings().bankDepositDetails.accountName" name="accountName" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
              </div>
              <div>
                <label for="accountNumber" class="block text-xs text-slate-500 mb-1">Account Number</label>
                <input id="accountNumber" type="text" [(ngModel)]="settings().bankDepositDetails.accountNumber" name="accountNumber" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
              </div>
            </div>
            
            <!-- Crypto Details -->
            <div class="space-y-4">
              <h3 class="text-sm font-medium text-slate-900 border-b border-slate-100 pb-2">Crypto Addresses</h3>
              <div>
                <label for="btcAddress" class="block text-xs text-slate-500 mb-1">BTC Address</label>
                <input id="btcAddress" type="text" [(ngModel)]="settings().cryptoDepositDetails.btcAddress" name="btcAddress" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
              </div>
              <div>
                <label for="usdtAddress" class="block text-xs text-slate-500 mb-1">USDT (ERC20) Address</label>
                <input id="usdtAddress" type="text" [(ngModel)]="settings().cryptoDepositDetails.usdtAddress" name="usdtAddress" class="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button type="submit" class="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm shadow-indigo-200">
            <mat-icon class="text-sm">save</mat-icon>
            Save Settings
          </button>
        </div>
      </form>
    </div>
  `
})
export class AdminSettingsComponent {
  mockData = inject(MockDataService);
  
  // Create a local copy to edit
  settings = signal<SystemSettings>(JSON.parse(JSON.stringify(this.mockData.systemSettings())));
  showSuccess = signal(false);

  saveSettings() {
    this.mockData.updateSystemSettings(this.settings());
    this.showSuccess.set(true);
    setTimeout(() => this.showSuccess.set(false), 3000);
  }
}
