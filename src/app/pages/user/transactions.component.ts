import { Component, inject } from '@angular/core';
import { MockDataService } from '../../core/mock-data.service';
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
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @for (tx of mockData.userTransactions(); track tx.id) {
                <tr class="hover:bg-slate-50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                           [class.bg-amber-100]="tx.type === 'flip'" [class.text-amber-600]="tx.type === 'flip'"
                           [class.bg-emerald-100]="tx.type === 'exchange'" [class.text-emerald-600]="tx.type === 'exchange'"
                           [class.bg-violet-100]="tx.type.includes('giftcard')" [class.text-violet-600]="tx.type.includes('giftcard')">
                        <mat-icon class="text-[20px]">
                          {{ tx.type === 'flip' ? 'sync' : (tx.type === 'exchange' ? 'currency_exchange' : 'card_giftcard') }}
                        </mat-icon>
                      </div>
                      <span class="font-bold text-slate-900 capitalize">{{ formatType(tx.type) }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-600">{{ tx.details }}</td>
                  <td class="px-6 py-4 text-sm font-bold text-slate-900">
                    {{ (tx.type === 'flip' && tx.status === 'pending') || tx.type === 'giftcard_buy' ? '-' : (tx.type === 'exchange' ? '' : '+') }}{{ tx.amount | currency:tx.currency:'symbol-narrow':'1.2-2' }}
                  </td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          [class.bg-amber-100]="tx.status === 'pending'" [class.text-amber-800]="tx.status === 'pending'"
                          [class.bg-emerald-100]="tx.status === 'completed'" [class.text-emerald-800]="tx.status === 'completed'"
                          [class.bg-red-100]="tx.status === 'failed'" [class.text-red-800]="tx.status === 'failed'">
                      {{ tx.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-500 text-right">{{ tx.date | date:'medium' }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class UserTransactionsComponent {
  mockData = inject(MockDataService);

  formatType(type: string): string {
    return type.replace('_', ' ');
  }
}
