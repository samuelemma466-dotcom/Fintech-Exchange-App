import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FirestoreService } from '../../core/firestore.service';
import { AuthService } from '../../core/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exchange',
  standalone: true,
  imports: [FormsModule, MatIconModule, CurrencyPipe, DecimalPipe],
  template: `
    <div class="max-w-3xl mx-auto space-y-8 pb-20 md:pb-0">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Exchange Assets</h1>
        <p class="text-sm text-slate-500 mt-1">Trade your crypto, fiat, or gift cards instantly.</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-6 md:p-8 space-y-8">
          
          <!-- Type Selection -->
          <div class="grid grid-cols-3 gap-4">
            <button 
              (click)="selectedType.set('crypto')"
              [class.border-indigo-600]="selectedType() === 'crypto'"
              [class.bg-indigo-50]="selectedType() === 'crypto'"
              [class.text-indigo-600]="selectedType() === 'crypto'"
              class="border border-slate-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors">
              <mat-icon>currency_bitcoin</mat-icon>
              <span class="text-sm font-medium">Crypto</span>
            </button>
            <button 
              (click)="selectedType.set('fiat')"
              [class.border-indigo-600]="selectedType() === 'fiat'"
              [class.bg-indigo-50]="selectedType() === 'fiat'"
              [class.text-indigo-600]="selectedType() === 'fiat'"
              class="border border-slate-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors">
              <mat-icon>currency_exchange</mat-icon>
              <span class="text-sm font-medium">Fiat</span>
            </button>
            <button 
              (click)="selectedType.set('giftcard')"
              [class.border-indigo-600]="selectedType() === 'giftcard'"
              [class.bg-indigo-50]="selectedType() === 'giftcard'"
              [class.text-indigo-600]="selectedType() === 'giftcard'"
              class="border border-slate-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-slate-50 transition-colors">
              <mat-icon>card_giftcard</mat-icon>
              <span class="text-sm font-medium">Gift Card</span>
            </button>
          </div>

          <!-- Form -->
          <div class="space-y-6">
            <div>
              <label for="asset-select" class="block text-sm font-medium text-slate-700 mb-2">Select Asset</label>
              <select 
                id="asset-select"
                [(ngModel)]="selectedAsset"
                class="w-full rounded-xl border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 p-3 border text-sm"
              >
                <option value="" disabled>Choose an asset...</option>
                @for (rate of availableRates(); track rate.asset) {
                  <option [value]="rate.asset">{{ rate.asset }} (Rate: ₦{{ rate.rate }})</option>
                }
              </select>
            </div>

            <div>
              <label for="amount-input" class="block text-sm font-medium text-slate-700 mb-2">Amount</label>
              <div class="relative rounded-xl shadow-sm">
                <input 
                  id="amount-input"
                  type="number" 
                  [(ngModel)]="amount"
                  class="w-full rounded-xl border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 p-3 border text-sm"
                  placeholder="0.00"
                >
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span class="text-slate-500 sm:text-sm font-medium">{{ selectedAsset() || 'USD' }}</span>
                </div>
              </div>
            </div>

            <!-- Upload Proof -->
            <div>
              <label for="file-upload" class="block text-sm font-medium text-slate-700 mb-2">Payment Proof (Optional)</label>
              <div class="mt-1 flex justify-center rounded-xl border border-dashed border-slate-300 px-6 py-8 bg-slate-50 hover:bg-slate-100 transition-colors">
                <div class="text-center">
                  <mat-icon class="mx-auto h-12 w-12 text-slate-300">cloud_upload</mat-icon>
                  <div class="mt-4 flex text-sm leading-6 text-slate-600 justify-center">
                    <label for="file-upload" class="relative cursor-pointer rounded-md font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" class="sr-only" (change)="onFileSelected($event)">
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs leading-5 text-slate-500">PNG, JPG, PDF up to 10MB</p>
                  @if (fileName()) {
                    <p class="text-sm font-medium text-indigo-600 mt-2">{{ fileName() }}</p>
                  }
                </div>
              </div>
            </div>

            <!-- Calculation -->
            <div class="bg-indigo-50 rounded-xl p-6 border border-indigo-100">
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-indigo-900">Exchange Rate</span>
                <span class="text-sm font-bold text-indigo-900">₦{{ currentRate() | number:'1.2-2' }}</span>
              </div>
              <div class="flex justify-between items-center pt-4 border-t border-indigo-200/50">
                <span class="text-base font-semibold text-indigo-900">You will receive</span>
                <span class="text-2xl font-bold text-indigo-600">{{ totalValue() | currency:'NGN':'symbol-narrow':'1.2-2' }}</span>
              </div>
            </div>

            <button 
              (click)="submitTransaction()"
              [disabled]="!isValid() || isSubmitting()"
              class="w-full bg-indigo-600 text-white px-4 py-3.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              @if (isSubmitting()) {
                <mat-icon class="animate-spin">autorenew</mat-icon> Processing...
              } @else {
                Submit Exchange Request
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ExchangeComponent {
  firestore = inject(FirestoreService);
  authService = inject(AuthService);
  router = inject(Router);

  selectedType = signal<'crypto' | 'fiat' | 'giftcard'>('crypto');
  selectedAsset = signal<string>('');
  amount = signal<number | null>(null);
  fileName = signal<string>('');
  isSubmitting = signal(false);

  availableRates = computed(() => {
    // In a real app, we'd filter rates by type. For now, just show all or mock some if empty.
    const rates = this.firestore.rates();
    if (rates.length === 0) {
      // Mock rates if none exist
      return [
        { asset: 'BTC', rate: 75000000, updatedAt: '' },
        { asset: 'USDT', rate: 1200, updatedAt: '' },
        { asset: 'USD', rate: 1150, updatedAt: '' },
        { asset: 'Amazon GC', rate: 900, updatedAt: '' }
      ];
    }
    return rates;
  });

  currentRate = computed(() => {
    const asset = this.selectedAsset();
    if (!asset) return 0;
    const rateObj = this.availableRates().find(r => r.asset === asset);
    return rateObj ? rateObj.rate : 0;
  });

  totalValue = computed(() => {
    const amt = this.amount() || 0;
    return amt * this.currentRate();
  });

  isValid = computed(() => {
    return this.selectedAsset() !== '' && (this.amount() || 0) > 0;
  });

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileName.set(file.name);
      // In a real app, upload to Firebase Storage here and get URL
    }
  }

  async submitTransaction() {
    if (!this.isValid()) return;
    
    this.isSubmitting.set(true);
    try {
      const user = this.authService.userProfile();
      if (!user) throw new Error('Not logged in');

      await this.firestore.createTransaction({
        userId: user.uid,
        type: this.selectedType(),
        asset: this.selectedAsset(),
        amount: this.amount()!,
        rate: this.currentRate(),
        total: this.totalValue(),
        status: 'pending',
        proofUrl: this.fileName() ? 'uploaded_proof_url' : undefined
      });

      this.router.navigate(['/dashboard/history']);
    } catch (error) {
      console.error('Error submitting transaction', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }
}
