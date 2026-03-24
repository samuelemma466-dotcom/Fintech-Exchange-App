import { Component, inject } from '@angular/core';
import { MockDataService } from '../../core/mock-data.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="space-y-6 pb-20 md:pb-0">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-white">Admin Dashboard</h1>
        <p class="text-sm text-slate-400 mt-1">System overview and quick stats.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-slate-400 mb-1">Total Users</p>
              <h2 class="text-3xl font-bold text-white">{{ mockData.allUsers().length }}</h2>
            </div>
            <div class="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <mat-icon>people</mat-icon>
            </div>
          </div>
        </div>

        <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-slate-400 mb-1">Total Transactions</p>
              <h2 class="text-3xl font-bold text-white">{{ mockData.transactions().length }}</h2>
            </div>
            <div class="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <mat-icon>receipt_long</mat-icon>
            </div>
          </div>
        </div>

        <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-sm">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-sm font-medium text-slate-400 mb-1">Active Flips</p>
              <h2 class="text-3xl font-bold text-white">{{ activeFlips() }}</h2>
            </div>
            <div class="w-10 h-10 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <mat-icon>sync</mat-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {
  mockData = inject(MockDataService);

  activeFlips() {
    return this.mockData.flipSessions().filter(s => s.status === 'open').length;
  }
}
