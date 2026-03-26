import { Component, inject, signal } from '@angular/core';
import { MockDataService, Transaction } from '../../core/mock-data.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-transactions',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe, DatePipe],
  template: `
    <div class="space-y-8 pb-20 md:pb-0 max-w-5xl mx-auto">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Transaction History</h1>
        <p class="text-base text-slate-500 mt-2">View all your past and pending activities.</p>
      </div>

      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                <th class="px-6 py-4">Type</th>
                <th class="px-6 py-4">Details</th>
                <th class="px-6 py-4">Amount</th>
                <th class="px-6 py-4">Fee</th>
                <th class="px-6 py-4">Net Amount</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (tx of mockData.userTransactions(); track tx.id) {
                <tr (click)="openReceipt(tx)" class="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                           [class.bg-amber-100]="tx.type === 'flip'" [class.text-amber-600]="tx.type === 'flip'"
                           [class.bg-emerald-100]="tx.type === 'exchange'" [class.text-emerald-600]="tx.type === 'exchange'"
                           [class.bg-violet-100]="tx.type.includes('giftcard')" [class.text-violet-600]="tx.type.includes('giftcard')"
                           [class.bg-blue-100]="tx.type === 'deposit'" [class.text-blue-600]="tx.type === 'deposit'"
                           [class.bg-pink-100]="tx.type === 'withdraw'" [class.text-pink-600]="tx.type === 'withdraw'"
                           [class.bg-cyan-100]="tx.type === 'transfer'" [class.text-cyan-600]="tx.type === 'transfer'">
                        <mat-icon class="text-[20px]">
                          {{ tx.type === 'flip' ? 'sync' : (tx.type === 'exchange' ? 'currency_exchange' : (tx.type.includes('giftcard') ? 'card_giftcard' : (tx.type === 'deposit' ? 'add' : (tx.type === 'withdraw' ? 'arrow_upward' : 'swap_horiz')))) }}
                        </mat-icon>
                      </div>
                      <span class="font-bold text-slate-900 capitalize">{{ formatType(tx.type) }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-600">{{ tx.details }}</td>
                  <td class="px-6 py-4 text-sm font-bold text-slate-900">
                    {{ tx.amount | currency:tx.currency:'symbol-narrow':'1.2-2' }}
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-500">
                    {{ (tx.fee || 0) | currency:tx.currency:'symbol-narrow':'1.2-2' }}
                  </td>
                  <td class="px-6 py-4 text-sm font-bold text-indigo-600">
                    {{ (tx.netAmount || tx.amount) | currency:tx.currency:'symbol-narrow':'1.2-2' }}
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          [class.bg-amber-100]="tx.status === 'pending'" [class.text-amber-800]="tx.status === 'pending'"
                          [class.bg-emerald-100]="tx.status === 'completed'" [class.text-emerald-800]="tx.status === 'completed'"
                          [class.bg-red-100]="tx.status === 'failed'" [class.text-red-800]="tx.status === 'failed'">
                      {{ tx.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-500 text-right flex items-center justify-end gap-2">
                    {{ tx.date | date:'medium' }}
                    <mat-icon class="text-slate-400 text-[20px]">chevron_right</mat-icon>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Receipt Modal -->
      @if (selectedReceipt()) {
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 class="text-lg font-bold text-slate-900 flex items-center gap-2">
                <mat-icon class="text-indigo-600">receipt_long</mat-icon>
                Transaction Receipt
              </h3>
              <button (click)="closeReceipt()" class="text-slate-400 hover:text-slate-600 transition-colors">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            
            <div class="p-6 space-y-6">
              <div class="text-center">
                <p class="text-sm text-slate-500 mb-1">Amount</p>
                <h2 class="text-4xl font-bold text-slate-900 tracking-tight">
                  {{ selectedReceipt()!.amount | currency:selectedReceipt()!.currency:'symbol-narrow':'1.2-2' }}
                </h2>
                <div class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-3"
                     [class.bg-amber-100]="selectedReceipt()!.status === 'pending'" [class.text-amber-800]="selectedReceipt()!.status === 'pending'"
                     [class.bg-emerald-100]="selectedReceipt()!.status === 'completed'" [class.text-emerald-800]="selectedReceipt()!.status === 'completed'"
                     [class.bg-red-100]="selectedReceipt()!.status === 'failed'" [class.text-red-800]="selectedReceipt()!.status === 'failed'">
                  {{ selectedReceipt()!.status }}
                </div>
              </div>

              <div class="space-y-3 pt-4 border-t border-slate-100 border-dashed">
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500">Transaction ID</span>
                  <span class="font-mono text-slate-900 font-medium">{{ selectedReceipt()!.id }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500">Date</span>
                  <span class="text-slate-900 font-medium">{{ selectedReceipt()!.date | date:'medium' }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-slate-500">Type</span>
                  <span class="text-slate-900 font-medium capitalize">{{ formatType(selectedReceipt()!.type) }}</span>
                </div>
                @if (selectedReceipt()!.fee > 0) {
                  <div class="flex justify-between text-sm">
                    <span class="text-slate-500">Fee</span>
                    <span class="text-slate-900 font-medium">{{ selectedReceipt()!.fee | currency:selectedReceipt()!.currency:'symbol-narrow':'1.2-2' }}</span>
                  </div>
                  <div class="flex justify-between text-sm font-bold pt-2 border-t border-slate-100">
                    <span class="text-slate-900">Net Amount</span>
                    <span class="text-slate-900">{{ selectedReceipt()!.netAmount | currency:selectedReceipt()!.currency:'symbol-narrow':'1.2-2' }}</span>
                  </div>
                }
              </div>

              <div class="pt-6">
                <button (click)="closeReceipt()" class="w-full py-3 bg-indigo-50 text-indigo-700 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors">
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class UserTransactionsComponent {
  mockData = inject(MockDataService);

  selectedReceipt = signal<Transaction | null>(null);

  openReceipt(tx: Transaction) {
    this.selectedReceipt.set(tx);
  }

  closeReceipt() {
    this.selectedReceipt.set(null);
  }

  formatType(type: string): string {
    return type.replace('_', ' ');
  }
}
