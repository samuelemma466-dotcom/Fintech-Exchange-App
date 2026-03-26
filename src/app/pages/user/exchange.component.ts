import { Component, inject, signal, computed } from '@angular/core';
import { MockDataService } from '../../core/mock-data.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-exchange',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe, DecimalPipe, FormsModule],
  template: `
    <div class="space-y-8 pb-20 md:pb-0 max-w-2xl mx-auto">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Currency Exchange</h1>
        <p class="text-base text-slate-500 mt-2">Convert your funds instantly at competitive bank rates.</p>
      </div>

      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-8">
          <div class="space-y-6">
            <!-- From -->
            <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative">
              <label for="from-currency" class="block text-sm font-medium text-slate-500 mb-2">You Send</label>
              <div class="flex items-center gap-4">
                <select id="from-currency" [(ngModel)]="fromCurrency" class="bg-transparent text-xl font-bold text-slate-900 focus:outline-none border-none p-0 w-24">
                  @for (rate of uniqueCurrencies(); track rate) {
                    <option [value]="rate">{{ rate }}</option>
                  }
                </select>
                <input type="number" [(ngModel)]="amount" class="w-full bg-transparent text-right text-3xl font-bold text-slate-900 focus:outline-none placeholder-slate-300" placeholder="0.00">
              </div>
              <p class="text-xs text-slate-400 mt-2 text-right">Available: {{ (mockData.currentUser().balances[fromCurrency()] || 0) | currency:fromCurrency():'symbol-narrow':'1.2-2' }}</p>
            </div>

            <!-- Swap Icon -->
            <div class="flex justify-center -my-4 relative z-10">
              <button (click)="swapCurrencies()" class="w-12 h-12 bg-white border border-slate-200 rounded-full flex items-center justify-center text-indigo-600 shadow-sm hover:bg-slate-50 transition-colors">
                <mat-icon>swap_vert</mat-icon>
              </button>
            </div>

            <!-- To -->
            <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <label for="to-currency" class="block text-sm font-medium text-slate-500 mb-2">You Receive</label>
              <div class="flex items-center gap-4">
                <select id="to-currency" [(ngModel)]="toCurrency" class="bg-transparent text-xl font-bold text-slate-900 focus:outline-none border-none p-0 w-24">
                  @for (rate of uniqueCurrencies(); track rate) {
                    <option [value]="rate">{{ rate }}</option>
                  }
                </select>
                <div class="w-full text-right text-3xl font-bold text-emerald-600">
                  {{ convertedAmount() | number:'1.2-2' }}
                </div>
              </div>
            </div>

            <!-- Rate Info -->
            <div class="flex flex-col gap-2 p-4 bg-indigo-50 rounded-xl text-indigo-900">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-[20px]">info</mat-icon>
                  <span class="text-sm font-medium">Exchange Rate</span>
                </div>
                <span class="text-sm font-bold">1 {{ fromCurrency() }} = {{ currentRate() | number:'1.2-4' }} {{ toCurrency() }}</span>
              </div>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <mat-icon class="text-[20px]">receipt_long</mat-icon>
                  <span class="text-sm font-medium">Transaction Fee</span>
                </div>
                <span class="text-sm font-bold">{{ currentFeePercent() }}%</span>
              </div>
            </div>

            <button 
              (click)="initiateExchange()"
              [disabled]="!isValidExchange()"
              class="w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
              [class.bg-indigo-600]="isValidExchange()"
              [class.text-white]="isValidExchange()"
              [class.hover:bg-indigo-700]="isValidExchange()"
              [class.bg-slate-100]="!isValidExchange()"
              [class.text-slate-400]="!isValidExchange()">
              @if (amount() > (mockData.currentUser().balances[fromCurrency()] || 0)) {
                Insufficient Balance
              } @else if (fromCurrency() === toCurrency()) {
                Select Different Currencies
              } @else if (!currentRate()) {
                Rate Unavailable
              } @else {
                Confirm Exchange
              }
            </button>
          </div>
        </div>
      </div>

      <!-- PIN Modal -->
      @if (showPinModal()) {
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl border border-slate-200 shadow-xl w-full max-w-sm overflow-hidden text-center p-8">
            <div class="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <mat-icon class="scale-150">lock</mat-icon>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Enter Transaction PIN</h3>
            <p class="text-sm text-slate-500 mb-6">Please enter your 4-digit PIN to confirm this exchange.</p>
            
            <div class="flex justify-center gap-3 mb-6">
              <input type="password" maxlength="4" [(ngModel)]="pin" 
                     class="w-32 text-center text-3xl tracking-[1em] font-bold bg-slate-50 border border-slate-200 rounded-xl py-3 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
            </div>

            @if (pinError()) {
              <p class="text-sm text-red-500 mb-4">{{ pinError() }}</p>
            }

            <div class="flex flex-col gap-3">
              <button (click)="confirmExchange()" class="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
                Verify & Confirm
              </button>
              <button (click)="closePinModal()" class="w-full py-3 text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class UserExchangeComponent {
  mockData = inject(MockDataService);

  fromCurrency = signal('USD');
  toCurrency = signal('NGN');
  amount = signal(100);
  
  showPinModal = signal(false);
  pin = signal('');
  pinError = signal('');

  uniqueCurrencies = computed(() => {
    const rates = this.mockData.exchangeRates();
    const currencies = new Set<string>();
    rates.forEach(r => {
      currencies.add(r.from);
      currencies.add(r.to);
    });
    return Array.from(currencies);
  });

  currentRate = computed(() => {
    const from = this.fromCurrency();
    const to = this.toCurrency();
    const rateObj = this.mockData.exchangeRates().find(r => r.from === from && r.to === to);
    if (rateObj) return rateObj.buyRate;
    
    // Check reverse rate
    const reverseRateObj = this.mockData.exchangeRates().find(r => r.from === to && r.to === from);
    if (reverseRateObj) return 1 / reverseRateObj.sellRate;

    return 0;
  });

  currentFeePercent = computed(() => {
    const from = this.fromCurrency();
    const to = this.toCurrency();
    const rateObj = this.mockData.exchangeRates().find(r => r.from === from && r.to === to);
    if (rateObj) return rateObj.feePercent;
    
    const reverseRateObj = this.mockData.exchangeRates().find(r => r.from === to && r.to === from);
    if (reverseRateObj) return reverseRateObj.feePercent;

    return 0;
  });

  convertedAmount = computed(() => {
    const amount = this.amount();
    const fee = amount * (this.currentFeePercent() / 100);
    const netAmount = amount - fee;
    return netAmount * this.currentRate();
  });

  swapCurrencies() {
    const temp = this.fromCurrency();
    this.fromCurrency.set(this.toCurrency());
    this.toCurrency.set(temp);
  }

  isValidExchange(): boolean {
    return this.amount() > 0 && 
           this.fromCurrency() !== this.toCurrency() && 
           this.currentRate() > 0 &&
           this.amount() <= (this.mockData.currentUser().balances[this.fromCurrency()] || 0);
  }

  initiateExchange() {
    if (this.isValidExchange()) {
      this.showPinModal.set(true);
      this.pin.set('');
      this.pinError.set('');
    }
  }

  closePinModal() {
    this.showPinModal.set(false);
    this.pin.set('');
    this.pinError.set('');
  }

  confirmExchange() {
    if (this.pin() === '1234') {
      this.mockData.exchangeCurrency(this.fromCurrency(), this.toCurrency(), this.amount());
      this.amount.set(0);
      this.closePinModal();
      // Optional: Show success toast/modal here
    } else {
      this.pinError.set('Incorrect PIN. Try 1234.');
    }
  }
}
