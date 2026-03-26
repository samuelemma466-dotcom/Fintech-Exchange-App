import { Component, inject, signal } from '@angular/core';
import { MockDataService, Transaction } from '../../core/mock-data.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-admin-transactions',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe],
  template: `
    <div class="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-white">All Transactions</h1>
        <p class="text-sm text-slate-400 mt-1">Monitor all platform activity.</p>
      </div>

      <div class="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-900/50 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                <th class="px-6 py-4">User ID</th>
                <th class="px-6 py-4">Type</th>
                <th class="px-6 py-4">Details</th>
                <th class="px-6 py-4">Amount</th>
                <th class="px-6 py-4">Fee</th>
                <th class="px-6 py-4">Profit</th>
                <th class="px-6 py-4">Net Amount</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700">
              @for (tx of mockData.transactions(); track tx.id) {
                <tr class="hover:bg-slate-700/50 transition-colors">
                  <td class="px-6 py-4 text-sm font-mono text-slate-400 truncate max-w-[100px]">{{ tx.userId }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <span class="font-bold text-white capitalize">{{ formatType(tx.type) }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-300">
                    {{ tx.details }}
                    @if (tx.type === 'giftcard_sell' && tx.proof) {
                      <button (click)="viewProof(tx)" class="ml-2 text-xs text-emerald-400 hover:text-emerald-300 underline">View Proof</button>
                    }
                  </td>
                  <td class="px-6 py-4 text-sm font-bold text-white">{{ tx.amount | currency:tx.currency:'symbol-narrow':'1.2-2' }}</td>
                  <td class="px-6 py-4 text-sm text-slate-400">{{ (tx.fee || 0) | currency:tx.currency:'symbol-narrow':'1.2-2' }}</td>
                  <td class="px-6 py-4 text-sm text-emerald-400">{{ (tx.profit || 0) | currency:tx.currency:'symbol-narrow':'1.2-2' }}</td>
                  <td class="px-6 py-4 text-sm font-bold text-indigo-300">{{ (tx.netAmount || tx.amount) | currency:tx.currency:'symbol-narrow':'1.2-2' }}</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          [class.bg-amber-500/10]="tx.status === 'pending'" [class.text-amber-400]="tx.status === 'pending'"
                          [class.bg-emerald-500/10]="tx.status === 'completed'" [class.text-emerald-400]="tx.status === 'completed'"
                          [class.bg-red-500/10]="tx.status === 'failed'" [class.text-red-400]="tx.status === 'failed'">
                      {{ tx.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    @if (tx.status === 'pending') {
                      <div class="flex items-center justify-end gap-2">
                        <button (click)="updateStatus(tx.id, 'completed')" class="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors" title="Approve">
                          <mat-icon class="text-[18px]">check</mat-icon>
                        </button>
                        <button (click)="updateStatus(tx.id, 'failed')" class="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors" title="Reject">
                          <mat-icon class="text-[18px]">close</mat-icon>
                        </button>
                      </div>
                    } @else {
                      <span class="text-xs text-slate-500">Processed</span>
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Proof Modal -->
      @if (selectedProofTx()) {
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-slate-800 rounded-3xl border border-slate-700 shadow-xl w-full max-w-md overflow-hidden">
            <div class="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 class="text-lg font-bold text-white">Gift Card Proof</h3>
              <button (click)="closeProof()" class="text-slate-400 hover:text-white transition-colors">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div class="bg-slate-900 p-4 rounded-xl border border-slate-700">
                <p class="text-sm text-slate-300 font-mono break-all">{{ selectedProofTx()?.proof }}</p>
              </div>
              <div class="flex justify-end gap-3 mt-6">
                @if (selectedProofTx()?.status === 'pending') {
                  <button (click)="updateStatus(selectedProofTx()!.id, 'failed'); closeProof()" class="px-4 py-2 bg-red-500/10 text-red-400 rounded-xl font-medium text-sm hover:bg-red-500/20 transition-colors">
                    Reject
                  </button>
                  <button (click)="updateStatus(selectedProofTx()!.id, 'completed'); closeProof()" class="px-4 py-2 bg-emerald-500 text-white rounded-xl font-medium text-sm hover:bg-emerald-600 transition-colors">
                    Approve
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminTransactionsComponent {
  mockData = inject(MockDataService);
  selectedProofTx = signal<Transaction | null>(null);

  updateStatus(txId: string, status: 'completed' | 'failed') {
    this.mockData.updateTransactionStatus(txId, status);
  }

  formatType(type: string): string {
    return type.replace('_', ' ');
  }

  viewProof(tx: Transaction) {
    this.selectedProofTx.set(tx);
  }

  closeProof() {
    this.selectedProofTx.set(null);
  }
}
