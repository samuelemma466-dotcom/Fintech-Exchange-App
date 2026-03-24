import { Component, inject, signal, computed } from '@angular/core';
import { MockDataService, GiftCard } from '../../core/mock-data.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-giftcards',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe, PercentPipe, FormsModule],
  template: `
    <div class="space-y-8 pb-20 md:pb-0 max-w-5xl mx-auto">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Global Gift Card Exchange</h1>
        <p class="text-base text-slate-500 mt-2">Trade top global gift cards instantly. Buy or sell with competitive rates.</p>
      </div>

      <!-- Tabs -->
      <div class="flex space-x-2 border-b border-slate-200">
        <button 
          (click)="activeTab.set('sell')"
          [class.border-indigo-600]="activeTab() === 'sell'"
          [class.text-indigo-600]="activeTab() === 'sell'"
          [class.border-transparent]="activeTab() !== 'sell'"
          [class.text-slate-500]="activeTab() !== 'sell'"
          class="px-6 py-3 border-b-2 font-medium text-sm hover:text-indigo-600 transition-colors">
          Sell Gift Cards
        </button>
        <button 
          (click)="activeTab.set('buy')"
          [class.border-indigo-600]="activeTab() === 'buy'"
          [class.text-indigo-600]="activeTab() === 'buy'"
          [class.border-transparent]="activeTab() !== 'buy'"
          [class.text-slate-500]="activeTab() !== 'buy'"
          class="px-6 py-3 border-b-2 font-medium text-sm hover:text-indigo-600 transition-colors">
          Buy Gift Cards
        </button>
        <button 
          (click)="activeTab.set('rates')"
          [class.border-indigo-600]="activeTab() === 'rates'"
          [class.text-indigo-600]="activeTab() === 'rates'"
          [class.border-transparent]="activeTab() !== 'rates'"
          [class.text-slate-500]="activeTab() !== 'rates'"
          class="px-6 py-3 border-b-2 font-medium text-sm hover:text-indigo-600 transition-colors">
          Live Rates
        </button>
      </div>

      @if (activeTab() === 'sell' || activeTab() === 'buy') {
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Form Section -->
          <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
            <h2 class="text-xl font-bold text-slate-900 mb-6">{{ activeTab() === 'sell' ? 'Sell a Gift Card' : 'Buy a Gift Card' }}</h2>
            
            <div class="space-y-6">
              <!-- Brand Selection -->
              <div>
                <label for="brand-select" class="block text-sm font-medium text-slate-700 mb-2">Select Brand</label>
                <div id="brand-select" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  @for (brand of uniqueBrands(); track brand) {
                    <button 
                      (click)="selectBrand(brand)"
                      [class.ring-2]="selectedBrand() === brand"
                      [class.ring-indigo-600]="selectedBrand() === brand"
                      [class.bg-indigo-50]="selectedBrand() === brand"
                      [class.border-transparent]="selectedBrand() === brand"
                      [class.border-slate-200]="selectedBrand() !== brand"
                      class="border rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                      <mat-icon [class.text-indigo-600]="selectedBrand() === brand" class="text-slate-400">
                        {{ getBrandIcon(brand) }}
                      </mat-icon>
                      <span class="text-sm font-medium text-slate-900">{{ brand }}</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Region Selection -->
              @if (selectedBrand()) {
                <div>
                  <label for="region-select" class="block text-sm font-medium text-slate-700 mb-2">Select Region</label>
                  <div id="region-select" class="flex flex-wrap gap-3">
                    @for (card of availableCardsForBrand(); track card.id) {
                      <button 
                        (click)="selectCard(card)"
                        [disabled]="activeTab() === 'buy' && !card.stockAvailability"
                        [class.ring-2]="selectedCard()?.id === card.id"
                        [class.ring-indigo-600]="selectedCard()?.id === card.id"
                        [class.bg-indigo-50]="selectedCard()?.id === card.id"
                        [class.border-transparent]="selectedCard()?.id === card.id"
                        [class.border-slate-200]="selectedCard()?.id !== card.id"
                        [class.opacity-50]="activeTab() === 'buy' && !card.stockAvailability"
                        [class.cursor-not-allowed]="activeTab() === 'buy' && !card.stockAvailability"
                        class="border rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-slate-50 transition-all">
                        <span class="text-sm font-medium text-slate-900">{{ card.region }}</span>
                        <span class="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{{ card.currency }}</span>
                      </button>
                    }
                  </div>
                </div>
              }

              <!-- Amount & Proof -->
              @if (selectedCard()) {
                <div>
                  <label for="amount-input" class="block text-sm font-medium text-slate-700 mb-2">Amount ({{ selectedCard()?.currency }})</label>
                  <div class="relative">
                    <input id="amount-input" type="number" [(ngModel)]="amount" 
                           [min]="selectedCard()?.minValue ?? 0" [max]="selectedCard()?.maxValue ?? 0"
                           class="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                           placeholder="Enter amount">
                  </div>
                  <p class="text-xs text-slate-500 mt-2">Min: {{ selectedCard()?.minValue }} | Max: {{ selectedCard()?.maxValue }}</p>
                </div>

                @if (activeTab() === 'sell') {
                  <div>
                    <label for="proof-input" class="block text-sm font-medium text-slate-700 mb-2">Card Proof (Code or Image URL)</label>
                    <input id="proof-input" type="text" [(ngModel)]="proof" 
                           class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all" 
                           placeholder="e.g. AQB-1234-XYZ or https://...">
                  </div>
                }
              }

              @if (errorMsg()) {
                <div class="p-4 bg-red-50 text-red-700 rounded-xl text-sm flex items-center gap-2">
                  <mat-icon class="text-[20px]">error_outline</mat-icon>
                  {{ errorMsg() }}
                </div>
              }
              
              @if (successMsg()) {
                <div class="p-4 bg-emerald-50 text-emerald-700 rounded-xl text-sm flex items-center gap-2">
                  <mat-icon class="text-[20px]">check_circle</mat-icon>
                  {{ successMsg() }}
                </div>
              }

              <button 
                (click)="submitTransaction()"
                [disabled]="!isValid()"
                class="w-full py-4 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
                [class.bg-indigo-600]="isValid()"
                [class.text-white]="isValid()"
                [class.hover:bg-indigo-700]="isValid()"
                [class.bg-slate-100]="!isValid()"
                [class.text-slate-400]="!isValid()">
                {{ activeTab() === 'sell' ? 'Submit for Review' : 'Purchase Now' }}
              </button>
            </div>
          </div>

          <!-- Summary Section -->
          <div>
            <div class="bg-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl sticky top-24">
              <h3 class="text-lg font-medium text-slate-400 mb-6">Transaction Summary</h3>
              
              @if (selectedCard()) {
                <div class="space-y-4">
                  <div class="flex justify-between items-center pb-4 border-b border-slate-800">
                    <span class="text-slate-400">Card</span>
                    <span class="font-bold">{{ selectedCard()?.brand }} ({{ selectedCard()?.region }})</span>
                  </div>
                  <div class="flex justify-between items-center pb-4 border-b border-slate-800">
                    <span class="text-slate-400">Rate</span>
                    <span class="font-bold text-emerald-400">{{ selectedCard()?.rate | percent:'1.0-2' }}</span>
                  </div>
                  <div class="flex justify-between items-center pb-4 border-b border-slate-800">
                    <span class="text-slate-400">Amount</span>
                    <span class="font-bold">{{ amount() || 0 }} {{ selectedCard()?.currency }}</span>
                  </div>
                  
                  <div class="pt-4 mt-4">
                    <p class="text-sm text-slate-400 mb-1">{{ activeTab() === 'sell' ? 'Estimated Payout' : 'Total Cost' }}</p>
                    <p class="text-4xl font-bold text-white">
                      {{ (activeTab() === 'sell' ? calculatedPayout() : amount()) | currency:mockData.currentUser().currency:'symbol-narrow':'1.2-2' }}
                    </p>
                  </div>
                </div>
              } @else {
                <div class="text-center py-12 text-slate-500 flex flex-col items-center gap-4">
                  <mat-icon class="text-4xl opacity-50">receipt_long</mat-icon>
                  <p>Select a brand and region to see your summary.</p>
                </div>
              }
            </div>
          </div>
        </div>
      }

      @if (activeTab() === 'rates') {
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th class="px-6 py-4">Brand</th>
                  <th class="px-6 py-4">Region</th>
                  <th class="px-6 py-4">Currency</th>
                  <th class="px-6 py-4">Rate</th>
                  <th class="px-6 py-4">Stock</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (card of mockData.giftCards(); track card.id) {
                  <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                          <mat-icon class="text-[18px]">{{ card.image }}</mat-icon>
                        </div>
                        <span class="font-bold text-slate-900">{{ card.brand }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-600">{{ card.region }}</td>
                    <td class="px-6 py-4 text-sm font-medium text-slate-900">{{ card.currency }}</td>
                    <td class="px-6 py-4 text-sm font-bold text-emerald-600">{{ card.rate | percent:'1.0-2' }}</td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                            [class.bg-emerald-100]="card.stockAvailability" [class.text-emerald-800]="card.stockAvailability"
                            [class.bg-red-100]="!card.stockAvailability" [class.text-red-800]="!card.stockAvailability">
                        {{ card.stockAvailability ? 'In Stock' : 'Out of Stock' }}
                      </span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `
})
export class UserGiftCardsComponent {
  mockData = inject(MockDataService);
  
  activeTab = signal<'sell' | 'buy' | 'rates'>('sell');
  selectedBrand = signal<string | null>(null);
  selectedCard = signal<GiftCard | null>(null);
  amount = signal<number>(0);
  proof = signal<string>('');
  errorMsg = signal<string>('');
  successMsg = signal<string>('');

  uniqueBrands = computed(() => {
    const brands = this.mockData.giftCards().map(c => c.brand);
    return [...new Set(brands)];
  });

  availableCardsForBrand = computed(() => {
    const brand = this.selectedBrand();
    if (!brand) return [];
    return this.mockData.giftCards().filter(c => c.brand === brand);
  });

  calculatedPayout = computed(() => {
    const card = this.selectedCard();
    const amt = this.amount();
    if (!card || !amt) return 0;
    return amt * card.rate;
  });

  getBrandIcon(brand: string): string {
    const card = this.mockData.giftCards().find(c => c.brand === brand);
    return card?.image || 'card_giftcard';
  }

  selectBrand(brand: string) {
    this.selectedBrand.set(brand);
    this.selectedCard.set(null);
    this.amount.set(0);
    this.proof.set('');
    this.errorMsg.set('');
    this.successMsg.set('');
  }

  selectCard(card: GiftCard) {
    if (this.activeTab() === 'buy' && !card.stockAvailability) return;
    this.selectedCard.set(card);
    this.amount.set(0);
    this.proof.set('');
    this.errorMsg.set('');
    this.successMsg.set('');
  }

  isValid(): boolean {
    const card = this.selectedCard();
    const amt = this.amount();
    if (!card || !amt) return false;
    if (amt < card.minValue || amt > card.maxValue) return false;
    
    if (this.activeTab() === 'sell') {
      return this.proof().trim().length > 0;
    } else {
      return (this.mockData.currentUser().balances[this.mockData.currentUser().currency] || 0) >= amt;
    }
  }

  submitTransaction() {
    this.errorMsg.set('');
    this.successMsg.set('');
    
    const card = this.selectedCard();
    const amt = this.amount();
    
    if (!card || !amt || !this.isValid()) return;

    if (this.activeTab() === 'sell') {
      this.mockData.sellGiftCard(card.id, amt, this.proof());
      this.successMsg.set('Gift card submitted successfully! Pending admin approval.');
    } else {
      const code = this.mockData.buyGiftCard(card.id, amt);
      if (code) {
        this.successMsg.set(`Purchase successful! Your code is: ${code}`);
      } else {
        this.errorMsg.set('Purchase failed. Please check your balance.');
      }
    }
    
    // Reset form after a delay
    setTimeout(() => {
      this.selectedBrand.set(null);
      this.selectedCard.set(null);
      this.amount.set(0);
      this.proof.set('');
      this.successMsg.set('');
    }, 5000);
  }
}
