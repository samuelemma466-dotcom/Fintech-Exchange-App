import { Component, inject, signal } from '@angular/core';
import { MockDataService, GiftCard } from '../../core/mock-data.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { PercentPipe } from '@angular/common';

@Component({
  selector: 'app-admin-giftcards',
  standalone: true,
  imports: [MatIconModule, FormsModule, PercentPipe],
  template: `
    <div class="space-y-6 pb-20 md:pb-0">
      <div class="flex justify-between items-end">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-white">Gift Card Management</h1>
          <p class="text-sm text-slate-400 mt-1">Manage global gift cards, regional rates, and stock.</p>
        </div>
        <button (click)="openCreateModal()" class="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors shadow-sm flex items-center gap-2">
          <mat-icon class="text-[20px]">add</mat-icon> Add Card
        </button>
      </div>

      <div class="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-900/50 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                <th class="px-6 py-4">Brand</th>
                <th class="px-6 py-4">Region</th>
                <th class="px-6 py-4">Rate</th>
                <th class="px-6 py-4">Limits</th>
                <th class="px-6 py-4">Stock</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700">
              @for (card of mockData.giftCards(); track card.id) {
                <tr class="hover:bg-slate-700/50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-slate-300">
                        <mat-icon>{{ card.image }}</mat-icon>
                      </div>
                      <span class="text-sm font-bold text-white">{{ card.brand }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-col">
                      <span class="text-sm text-slate-300">{{ card.region }}</span>
                      <span class="text-xs text-slate-500">{{ card.currency }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm font-bold text-emerald-400">{{ card.rate | percent:'1.0-2' }}</td>
                  <td class="px-6 py-4 text-sm text-slate-300">
                    {{ card.minValue }} - {{ card.maxValue }}
                  </td>
                  <td class="px-6 py-4">
                    <button 
                      (click)="toggleStock(card)"
                      class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors"
                      [class.bg-emerald-500/10]="card.stockAvailability" [class.text-emerald-400]="card.stockAvailability"
                      [class.bg-red-500/10]="!card.stockAvailability" [class.text-red-400]="!card.stockAvailability">
                      {{ card.stockAvailability ? 'In Stock' : 'Out of Stock' }}
                    </button>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <button (click)="editCard(card)" class="p-1.5 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-lg transition-colors" title="Edit Card">
                        <mat-icon class="text-[18px]">edit</mat-icon>
                      </button>
                      <button (click)="deleteCard(card.id)" class="p-1.5 bg-slate-700 text-red-400 hover:bg-slate-600 rounded-lg transition-colors" title="Delete Card">
                        <mat-icon class="text-[18px]">delete</mat-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-slate-800 rounded-3xl border border-slate-700 shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
            <div class="p-6 border-b border-slate-700 flex justify-between items-center shrink-0">
              <h3 class="text-lg font-bold text-white">{{ isEditing() ? 'Edit Gift Card' : 'New Gift Card' }}</h3>
              <button (click)="closeModal()" class="text-slate-400 hover:text-white transition-colors">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <div class="p-6 space-y-4 overflow-y-auto">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="brand-input" class="block text-sm font-medium text-slate-400 mb-2">Brand</label>
                  <input id="brand-input" type="text" [(ngModel)]="currentCard.brand" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="e.g. Amazon">
                </div>
                <div>
                  <label for="region-input" class="block text-sm font-medium text-slate-400 mb-2">Region</label>
                  <input id="region-input" type="text" [(ngModel)]="currentCard.region" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="e.g. USA">
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="currency-input" class="block text-sm font-medium text-slate-400 mb-2">Currency</label>
                  <input id="currency-input" type="text" [(ngModel)]="currentCard.currency" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors uppercase" placeholder="USD">
                </div>
                <div>
                  <label for="rate-input" class="block text-sm font-medium text-slate-400 mb-2">Rate (0.0 - 1.0)</label>
                  <input id="rate-input" type="number" step="0.01" [(ngModel)]="currentCard.rate" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="0.85">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="min-input" class="block text-sm font-medium text-slate-400 mb-2">Min Value</label>
                  <input id="min-input" type="number" [(ngModel)]="currentCard.minValue" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="10">
                </div>
                <div>
                  <label for="max-input" class="block text-sm font-medium text-slate-400 mb-2">Max Value</label>
                  <input id="max-input" type="number" [(ngModel)]="currentCard.maxValue" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="500">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4 items-end">
                <div>
                  <label for="icon-input" class="block text-sm font-medium text-slate-400 mb-2">Icon Name (Material)</label>
                  <input id="icon-input" type="text" [(ngModel)]="currentCard.image" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="shopping_cart">
                </div>
                <div class="flex items-center h-[46px] px-2">
                  <label class="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" [(ngModel)]="currentCard.stockAvailability" class="w-5 h-5 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-800">
                    <span class="text-sm font-medium text-slate-300">In Stock</span>
                  </label>
                </div>
              </div>
              
              <button (click)="saveCard()" class="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors mt-6">
                Save Card
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminGiftCardsComponent {
  mockData = inject(MockDataService);
  showModal = signal(false);
  isEditing = signal(false);

  currentCard: Partial<GiftCard> = {
    brand: '',
    region: '',
    rate: 0,
    currency: '',
    minValue: 0,
    maxValue: 0,
    stockAvailability: true,
    image: 'card_giftcard'
  };

  openCreateModal() {
    this.isEditing.set(false);
    this.currentCard = { brand: '', region: '', rate: 0, currency: '', minValue: 0, maxValue: 0, stockAvailability: true, image: 'card_giftcard' };
    this.showModal.set(true);
  }

  editCard(card: GiftCard) {
    this.isEditing.set(true);
    this.currentCard = { ...card };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  toggleStock(card: GiftCard) {
    this.mockData.giftCards.update(cards => 
      cards.map(c => c.id === card.id ? { ...c, stockAvailability: !c.stockAvailability } : c)
    );
  }

  saveCard() {
    if (this.currentCard.brand && this.currentCard.region && this.currentCard.rate && this.currentCard.currency) {
      if (this.isEditing()) {
        this.mockData.giftCards.update(cards => 
          cards.map(c => c.id === this.currentCard.id ? { ...c, ...this.currentCard } as GiftCard : c)
        );
      } else {
        const newCard: GiftCard = {
          id: `gc-${Date.now()}`,
          brand: this.currentCard.brand,
          region: this.currentCard.region,
          rate: this.currentCard.rate,
          currency: this.currentCard.currency,
          minValue: this.currentCard.minValue || 0,
          maxValue: this.currentCard.maxValue || 0,
          stockAvailability: this.currentCard.stockAvailability ?? true,
          image: this.currentCard.image || 'card_giftcard'
        };
        this.mockData.giftCards.update(cards => [...cards, newCard]);
      }
      this.closeModal();
    }
  }

  deleteCard(id: string) {
    if (confirm('Are you sure you want to delete this gift card?')) {
      this.mockData.giftCards.update(cards => cards.filter(c => c.id !== id));
    }
  }
}
