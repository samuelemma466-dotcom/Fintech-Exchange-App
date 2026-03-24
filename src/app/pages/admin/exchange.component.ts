import { Component, inject, signal } from '@angular/core';
import { MockDataService, ExchangeRate } from '../../core/mock-data.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-admin-exchange',
  standalone: true,
  imports: [MatIconModule, FormsModule, DecimalPipe],
  template: `
    <div class="space-y-6 pb-20 md:pb-0">
      <div class="flex justify-between items-end">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-white">Exchange Rates</h1>
          <p class="text-sm text-slate-400 mt-1">Manage global currency conversion rates.</p>
        </div>
        <button (click)="openCreateModal()" class="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors shadow-sm flex items-center gap-2">
          <mat-icon class="text-[20px]">add</mat-icon> Add Pair
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        @for (rate of mockData.exchangeRates(); track rate.id) {
          <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm relative overflow-hidden group">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-2">
                <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm">
                  {{ rate.from }}
                </div>
                <mat-icon class="text-slate-500">arrow_forward</mat-icon>
                <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm">
                  {{ rate.to }}
                </div>
              </div>
              <button (click)="deleteRate(rate.id)" class="text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                <mat-icon class="text-[20px]">delete</mat-icon>
              </button>
            </div>
            
            <div class="space-y-1">
              <p class="text-sm font-medium text-slate-400">Current Rate</p>
              <div class="flex items-center gap-2">
                <h2 class="text-3xl font-bold text-white">{{ rate.rate | number:'1.2-6' }}</h2>
                <button (click)="editRate(rate)" class="text-emerald-400 hover:text-emerald-300 transition-colors">
                  <mat-icon class="text-[20px]">edit</mat-icon>
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Modal -->
      @if (showModal()) {
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-slate-800 rounded-3xl border border-slate-700 shadow-xl w-full max-w-sm overflow-hidden">
            <div class="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 class="text-lg font-bold text-white">{{ isEditing() ? 'Edit Rate' : 'New Currency Pair' }}</h3>
              <button (click)="closeModal()" class="text-slate-400 hover:text-white transition-colors">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="from-input" class="block text-sm font-medium text-slate-400 mb-2">From</label>
                  <input id="from-input" type="text" [(ngModel)]="currentPair.from" [disabled]="isEditing()" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors uppercase" placeholder="USD">
                </div>
                <div>
                  <label for="to-input" class="block text-sm font-medium text-slate-400 mb-2">To</label>
                  <input id="to-input" type="text" [(ngModel)]="currentPair.to" [disabled]="isEditing()" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors uppercase" placeholder="NGN">
                </div>
              </div>
              <div>
                <label for="rate-input" class="block text-sm font-medium text-slate-400 mb-2">Exchange Rate</label>
                <input id="rate-input" type="number" [(ngModel)]="currentPair.rate" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors" placeholder="0.00">
              </div>
              <button (click)="saveRate()" class="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors mt-4">
                Save Rate
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminExchangeComponent {
  mockData = inject(MockDataService);
  showModal = signal(false);
  isEditing = signal(false);

  currentPair: Partial<ExchangeRate> = {
    from: '',
    to: '',
    rate: 0
  };

  openCreateModal() {
    this.isEditing.set(false);
    this.currentPair = { from: '', to: '', rate: 0 };
    this.showModal.set(true);
  }

  editRate(rate: ExchangeRate) {
    this.isEditing.set(true);
    this.currentPair = { ...rate };
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveRate() {
    if (this.currentPair.from && this.currentPair.to && this.currentPair.rate) {
      if (this.isEditing()) {
        this.mockData.exchangeRates.update(rates => 
          rates.map(r => r.id === this.currentPair.id ? { ...r, rate: this.currentPair.rate! } : r)
        );
      } else {
        const newRate: ExchangeRate = {
          id: `rate-${Date.now()}`,
          from: this.currentPair.from.toUpperCase(),
          to: this.currentPair.to.toUpperCase(),
          rate: this.currentPair.rate
        };
        this.mockData.exchangeRates.update(rates => [...rates, newRate]);
      }
      this.closeModal();
    }
  }

  deleteRate(id: string) {
    if (confirm('Are you sure you want to delete this exchange rate?')) {
      this.mockData.exchangeRates.update(rates => rates.filter(r => r.id !== id));
    }
  }
}
