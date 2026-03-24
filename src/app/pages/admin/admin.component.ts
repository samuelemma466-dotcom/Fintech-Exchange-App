import { Component, inject } from '@angular/core';
import { FirestoreService } from '../../core/firestore.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe, DatePipe],
  template: `
    <div class="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900">Admin Panel</h1>
        <p class="text-sm text-slate-500 mt-1">Manage all transactions and users.</p>
      </div>

      <div class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100">
          <h3 class="text-lg font-semibold text-slate-900">All Transactions</h3>
        </div>
        
        @if (firestore.allTransactions().length === 0) {
          <div class="p-12 text-center">
            <div class="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <mat-icon>receipt_long</mat-icon>
            </div>
            <h3 class="text-sm font-medium text-slate-900 mb-1">No transactions</h3>
            <p class="text-sm text-slate-500">There are no transactions in the system yet.</p>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th class="px-6 py-4">User ID</th>
                  <th class="px-6 py-4">Asset</th>
                  <th class="px-6 py-4">Total (NGN)</th>
                  <th class="px-6 py-4">Status</th>
                  <th class="px-6 py-4">Date</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (tx of firestore.allTransactions(); track tx.id) {
                  <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4 text-sm font-mono text-slate-500 truncate max-w-[100px]">{{ tx.userId }}</td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2">
                        <span class="font-medium text-slate-900">{{ tx.asset }}</span>
                        <span class="text-xs text-slate-400 uppercase">({{ tx.type }})</span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-sm font-bold text-slate-900">{{ tx.total | currency:'NGN':'symbol-narrow':'1.2-2' }}</td>
                    <td class="px-6 py-4">
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                            [class.bg-amber-100]="tx.status === 'pending'" [class.text-amber-800]="tx.status === 'pending'"
                            [class.bg-emerald-100]="tx.status === 'approved'" [class.text-emerald-800]="tx.status === 'approved'"
                            [class.bg-red-100]="tx.status === 'rejected'" [class.text-red-800]="tx.status === 'rejected'">
                        {{ tx.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-500">{{ tx.createdAt | date:'short' }}</td>
                    <td class="px-6 py-4 text-right">
                      @if (tx.status === 'pending') {
                        <div class="flex items-center justify-end gap-2">
                          <button (click)="updateStatus(tx.id, 'approved')" class="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors" title="Approve">
                            <mat-icon class="text-[18px]">check</mat-icon>
                          </button>
                          <button (click)="updateStatus(tx.id, 'rejected')" class="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Reject">
                            <mat-icon class="text-[18px]">close</mat-icon>
                          </button>
                        </div>
                      } @else {
                        <span class="text-xs text-slate-400">Processed</span>
                      }
                    </td>
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
export class AdminComponent {
  firestore = inject(FirestoreService);

  async updateStatus(txId: string, status: 'approved' | 'rejected') {
    try {
      await this.firestore.updateTransactionStatus(txId, status);
    } catch (error) {
      console.error('Error updating status', error);
    }
  }
}
