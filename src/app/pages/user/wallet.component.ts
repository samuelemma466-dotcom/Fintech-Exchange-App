import { Component, inject, signal } from '@angular/core';
import { MockDataService } from '../../core/mock-data.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-wallet',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe, FormsModule],
  template: `
    <div class="space-y-8 pb-20 md:pb-0 max-w-5xl mx-auto">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">My Wallets</h1>
        <p class="text-base text-slate-500 mt-2">Manage your multi-currency balances.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (currency of currencies; track currency) {
          <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-colors">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-indigo-50 transition-colors z-0"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                     [class.bg-indigo-100]="currency === 'USD'" [class.text-indigo-700]="currency === 'USD'"
                     [class.bg-emerald-100]="currency === 'NGN'" [class.text-emerald-700]="currency === 'NGN'"
                     [class.bg-blue-100]="currency === 'EUR'" [class.text-blue-700]="currency === 'EUR'"
                     [class.bg-purple-100]="currency === 'GBP'" [class.text-purple-700]="currency === 'GBP'">
                  {{ currency }}
                </div>
                <button class="text-slate-400 hover:text-indigo-600 transition-colors">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </div>
              <p class="text-sm font-medium text-slate-500 mb-1">{{ currency }} Balance</p>
              <h2 class="text-2xl font-bold text-slate-900">
                {{ (mockData.currentUser().balances[currency] || 0) | currency:currency:'symbol-narrow':'1.2-2' }}
              </h2>
            </div>
          </div>
        }
      </div>

      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-8">
        <div class="px-6 py-5 border-b border-slate-100">
          <h3 class="text-lg font-semibold text-slate-900">Quick Actions</h3>
        </div>
        <div class="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button (click)="openDepositModal()" class="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 transition-colors border border-transparent hover:border-indigo-100">
            <div class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-current">
              <mat-icon>add</mat-icon>
            </div>
            <span class="text-sm font-medium">Deposit</span>
          </button>
          <button class="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 transition-colors border border-transparent hover:border-indigo-100">
            <div class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-current">
              <mat-icon>arrow_upward</mat-icon>
            </div>
            <span class="text-sm font-medium">Withdraw</span>
          </button>
          <button class="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 transition-colors border border-transparent hover:border-indigo-100">
            <div class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-current">
              <mat-icon>swap_horiz</mat-icon>
            </div>
            <span class="text-sm font-medium">Transfer</span>
          </button>
          <button class="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 transition-colors border border-transparent hover:border-indigo-100">
            <div class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-current">
              <mat-icon>receipt</mat-icon>
            </div>
            <span class="text-sm font-medium">Statement</span>
          </button>
        </div>
      </div>

      <!-- Deposit Modal -->
      @if (showDepositModal()) {
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 class="text-lg font-bold text-slate-900">Card Deposit</h3>
              <button (click)="closeDepositModal()" class="text-slate-400 hover:text-slate-600 transition-colors">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            
            @if (depositSuccess()) {
              <div class="p-8 text-center">
                <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <mat-icon class="text-[32px]">check_circle</mat-icon>
                </div>
                <h4 class="text-xl font-bold text-slate-900 mb-2">Deposit Requested</h4>
                <p class="text-sm text-slate-500 mb-6">Your deposit request has been submitted and is pending admin approval.</p>
                <button (click)="closeDepositModal()" class="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                  Close
                </button>
              </div>
            } @else {
              <div class="p-6 space-y-5">
                <div>
                  <label for="deposit-currency" class="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                  <select id="deposit-currency" [(ngModel)]="depositCurrency" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                    <option value="USD">USD - US Dollar</option>
                    <option value="NGN">NGN - Nigerian Naira</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
                
                <div>
                  <label for="deposit-amount" class="block text-sm font-medium text-slate-700 mb-2">Amount</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span class="text-slate-500 font-medium">{{ depositCurrency() }}</span>
                    </div>
                    <input id="deposit-amount" type="number" [(ngModel)]="depositAmount" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-16 pr-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="0.00">
                  </div>
                </div>

                <div class="pt-4 border-t border-slate-100">
                  <h4 class="text-sm font-semibold text-slate-900 mb-4">Card Details</h4>
                  
                  <div class="space-y-4">
                    <div>
                      <label for="card-number" class="block text-xs font-medium text-slate-500 mb-1">Card Number</label>
                      <input id="card-number" type="text" [(ngModel)]="cardNumber" placeholder="0000 0000 0000 0000" maxlength="19" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm">
                    </div>
                    
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label for="card-expiry" class="block text-xs font-medium text-slate-500 mb-1">Expiry Date</label>
                        <input id="card-expiry" type="text" [(ngModel)]="cardExpiry" placeholder="MM/YY" maxlength="5" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm">
                      </div>
                      <div>
                        <label for="card-cvv" class="block text-xs font-medium text-slate-500 mb-1">CVV</label>
                        <input id="card-cvv" type="text" [(ngModel)]="cardCvv" placeholder="123" maxlength="4" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm">
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  (click)="submitDeposit()" 
                  [disabled]="!isValidDeposit()"
                  class="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
                  Submit Deposit Request
                </button>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class UserWalletComponent {
  mockData = inject(MockDataService);
  currencies = ['USD', 'NGN', 'EUR', 'GBP'];

  showDepositModal = signal(false);
  depositSuccess = signal(false);
  
  depositCurrency = signal('USD');
  depositAmount = signal<number | null>(null);
  cardNumber = signal('');
  cardExpiry = signal('');
  cardCvv = signal('');

  openDepositModal() {
    this.showDepositModal.set(true);
    this.depositSuccess.set(false);
    this.resetForm();
  }

  closeDepositModal() {
    this.showDepositModal.set(false);
  }

  resetForm() {
    this.depositAmount.set(null);
    this.cardNumber.set('');
    this.cardExpiry.set('');
    this.cardCvv.set('');
  }

  isValidDeposit(): boolean {
    const amount = this.depositAmount();
    const card = this.cardNumber().replace(/\s/g, '');
    const expiry = this.cardExpiry();
    const cvv = this.cardCvv();
    
    return !!amount && amount > 0 && 
           card.length >= 15 && card.length <= 19 &&
           expiry.length === 5 && expiry.includes('/') &&
           cvv.length >= 3 && cvv.length <= 4;
  }

  submitDeposit() {
    if (this.isValidDeposit()) {
      const amount = this.depositAmount()!;
      const currency = this.depositCurrency();
      const card = this.cardNumber();
      
      this.mockData.requestDeposit(amount, currency, card);
      this.depositSuccess.set(true);
    }
  }
}
