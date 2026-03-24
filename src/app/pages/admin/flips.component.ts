import { Component, inject, signal } from '@angular/core';
import { MockDataService, FlipSession } from '../../core/mock-data.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-flips',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe, FormsModule],
  template: `
    <div class="space-y-6 pb-20 md:pb-0">
      <div class="flex justify-between items-end">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-white">Flipping Management</h1>
          <p class="text-sm text-slate-400 mt-1">Create and manage investment pools.</p>
        </div>
        <button (click)="openCreateModal()" class="bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors shadow-sm flex items-center gap-2">
          <mat-icon class="text-[20px]">add</mat-icon> New Session
        </button>
      </div>

      <div class="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-900/50 border-b border-slate-700 text-xs uppercase tracking-wider text-slate-400 font-semibold">
                <th class="px-6 py-4">Title</th>
                <th class="px-6 py-4">Entry Amount</th>
                <th class="px-6 py-4">Expected Reward</th>
                <th class="px-6 py-4">Duration</th>
                <th class="px-6 py-4">Status</th>
                <th class="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700">
              @for (session of mockData.flipSessions(); track session.id) {
                <tr class="hover:bg-slate-700/50 transition-colors">
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center text-slate-300">
                        <mat-icon>sync</mat-icon>
                      </div>
                      <div>
                        <p class="text-sm font-bold text-white">{{ session.title }}</p>
                        <p class="text-xs text-slate-400">{{ session.participants.length }} participants</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm font-bold text-white">{{ session.entryAmount | currency:'USD':'symbol-narrow':'1.2-2' }}</td>
                  <td class="px-6 py-4 text-sm font-bold text-emerald-400">{{ session.expectedReward | currency:'USD':'symbol-narrow':'1.2-2' }}</td>
                  <td class="px-6 py-4 text-sm text-slate-300">{{ session.duration }}</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                          [class.bg-emerald-500/10]="session.status === 'open'" [class.text-emerald-400]="session.status === 'open'"
                          [class.bg-slate-700]="session.status === 'closed'" [class.text-slate-400]="session.status === 'closed'"
                          [class.bg-blue-500/10]="session.status === 'completed'" [class.text-blue-400]="session.status === 'completed'">
                      {{ session.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      @if (session.status === 'open') {
                        <button (click)="updateStatus(session.id, 'closed')" class="p-1.5 bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-lg transition-colors" title="Close Session">
                          <mat-icon class="text-[18px]">lock</mat-icon>
                        </button>
                      } @else if (session.status === 'closed') {
                        <button (click)="updateStatus(session.id, 'completed')" class="p-1.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded-lg transition-colors" title="Mark Completed">
                          <mat-icon class="text-[18px]">done_all</mat-icon>
                        </button>
                      }
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create Modal (Simplified inline for demo) -->
      @if (showCreateModal()) {
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-slate-800 rounded-3xl border border-slate-700 shadow-xl w-full max-w-md overflow-hidden">
            <div class="p-6 border-b border-slate-700 flex justify-between items-center">
              <h3 class="text-lg font-bold text-white">New Flip Session</h3>
              <button (click)="closeCreateModal()" class="text-slate-400 hover:text-white transition-colors">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <div class="p-6 space-y-4">
              <div>
                <label for="title-input" class="block text-sm font-medium text-slate-400 mb-2">Title</label>
                <input id="title-input" type="text" [(ngModel)]="newSession.title" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors">
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="entry-input" class="block text-sm font-medium text-slate-400 mb-2">Entry Amount</label>
                  <input id="entry-input" type="number" [(ngModel)]="newSession.entryAmount" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors">
                </div>
                <div>
                  <label for="reward-input" class="block text-sm font-medium text-slate-400 mb-2">Expected Reward</label>
                  <input id="reward-input" type="number" [(ngModel)]="newSession.expectedReward" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors">
                </div>
              </div>
              <div>
                <label for="duration-input" class="block text-sm font-medium text-slate-400 mb-2">Duration</label>
                <input id="duration-input" type="text" [(ngModel)]="newSession.duration" placeholder="e.g. 7 Days" class="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors">
              </div>
              <button (click)="createSession()" class="w-full py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 transition-colors mt-4">
                Create Session
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminFlipsComponent {
  mockData = inject(MockDataService);
  showCreateModal = signal(false);

  newSession: Partial<FlipSession> = {
    title: '',
    entryAmount: 0,
    expectedReward: 0,
    duration: '',
    status: 'open',
    participants: []
  };

  openCreateModal() {
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
    this.newSession = { title: '', entryAmount: 0, expectedReward: 0, duration: '', status: 'open', participants: [] };
  }

  createSession() {
    if (this.newSession.title && this.newSession.entryAmount && this.newSession.expectedReward) {
      const session: FlipSession = {
        id: `flip-${Date.now()}`,
        title: this.newSession.title,
        entryAmount: this.newSession.entryAmount,
        expectedReward: this.newSession.expectedReward,
        duration: this.newSession.duration || 'TBD',
        status: 'open',
        participants: []
      };
      this.mockData.flipSessions.update(sessions => [session, ...sessions]);
      this.closeCreateModal();
    }
  }

  updateStatus(id: string, status: 'closed' | 'completed') {
    this.mockData.flipSessions.update(sessions => 
      sessions.map(s => s.id === id ? { ...s, status } : s)
    );
  }
}
