import { Component, inject } from '@angular/core';
import { FirestoreService } from '../../core/firestore.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe, DatePipe, DecimalPipe],
  template: `
    <div class="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Transaction History</h1>
        <p class="text-sm text-slate-500 mt-1">View all your past and pending exchanges.</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        @if (firestore.transactions().length === 0) {
          <div class="p-12 text-center">
            <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <mat-icon>history</mat-icon>
            </div>
            <h3 class="text-sm font-medium text-slate-900 mb-1">No transactions found</h3>
            <p class="text-sm text-slate-500">You haven't made any exchanges yet.</p>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th class="px-6 py-4">Asset</th>
                  <th class="px-6 py-4">Amount</th>
                  <th class="px-6 py-4">Rate</th>
                  <th class="px-6 py-4">Total (NGN)</th>
                  <th class="px-6 py-4">Status</th>
                  <th class="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (tx of firestore.transactions(); track tx.id) {
                  <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full flex items-center justify-center"
                             [class.bg-amber-100]="tx.type === 'crypto'" [class.text-amber-600]="tx.type === 'crypto'"
                             [class.bg-emerald-100]="tx.type === 'fiat'" [class.text-emerald-600]="tx.type === 'fiat'"
                             [class.bg-violet-100]="tx.type === 'giftcard'" [class.text-violet-600]="tx.type === 'giftcard'">
                          <mat-icon class="text-[16px]">
                            {{ tx.type === 'crypto' ? 'currency_bitcoin' : (tx.type === 'fiat' ? 'currency_exchange' : 'card_giftcard') }}
                          </mat-icon>
                        </div>
                        <span class="font-medium text-slate-900">{{ tx.asset }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-600">{{ tx.amount }}</td>
                    <td class="px-6 py-4 text-sm text-slate-600">₦{{ tx.rate | number:'1.2-2' }}</td>
                    <td class="px-6 py-4 text-sm font-bold text-slate-900">{{ tx.total | currency:'NGN':'symbol-narrow':'1.2-2' }}</td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                            [class.bg-amber-100]="tx.status === 'pending'" [class.text-amber-800]="tx.status === 'pending'"
                            [class.bg-emerald-100]="tx.status === 'approved'" [class.text-emerald-800]="tx.status === 'approved'"
                            [class.bg-red-100]="tx.status === 'rejected'" [class.text-red-800]="tx.status === 'rejected'">
                        {{ tx.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-500">{{ tx.createdAt | date:'medium' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `
})
export class HistoryComponent {
  firestore = inject(FirestoreService);
}
