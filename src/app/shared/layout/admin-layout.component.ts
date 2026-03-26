import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MockDataService } from '../../core/mock-data.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <div class="min-h-screen bg-slate-900 text-slate-300 flex flex-col md:flex-row">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 bg-slate-800 border-r border-slate-700 flex-shrink-0 flex flex-col h-auto md:h-screen sticky top-0 z-10">
        <div class="p-6 border-b border-slate-700 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
            <span class="text-xl font-bold tracking-tight text-white">Admin Control</span>
          </div>
        </div>

        <nav class="flex-1 p-4 space-y-1 overflow-y-auto hidden md:block">
          @for (item of navigation; track item.path) {
            <a [routerLink]="item.path"
               routerLinkActive="bg-slate-700 text-white font-medium"
               [routerLinkActiveOptions]="{exact: item.exact}"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-700 hover:text-white transition-colors">
              <mat-icon class="text-[20px]">{{ item.icon }}</mat-icon>
              {{ item.label }}
            </a>
          }
        </nav>

        <div class="p-4 border-t border-slate-700 hidden md:block">
          <a routerLink="/dashboard" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:bg-slate-700 hover:text-white transition-colors w-full text-left">
            <mat-icon class="text-[20px]">switch_account</mat-icon>
            Switch to User App
          </a>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <!-- Mobile Header -->
        <header class="md:hidden bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between sticky top-0 z-20">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
          <div class="flex items-center gap-4">
            <a routerLink="/dashboard" class="text-sm font-medium text-emerald-400">User App</a>
          </div>
        </header>

        <div class="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <router-outlet />
        </div>
      </main>

      <!-- Mobile Bottom Nav -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 flex justify-around p-2 z-20 pb-safe">
        @for (item of navigation; track item.path) {
          <a [routerLink]="item.path"
             routerLinkActive="text-emerald-400"
             [routerLinkActiveOptions]="{exact: item.exact}"
             class="flex flex-col items-center gap-1 p-2 text-slate-400">
            <mat-icon class="text-[24px]">{{ item.icon }}</mat-icon>
            <span class="text-[10px] font-medium">{{ item.label }}</span>
          </a>
        }
      </nav>
    </div>
  `
})
export class AdminLayoutComponent {
  mockData = inject(MockDataService);

  navigation = [
    { path: '/admin', label: 'Dashboard', icon: 'dashboard', exact: true },
    { path: '/admin/users', label: 'Users', icon: 'people', exact: false },
    { path: '/admin/wallet', label: 'Wallet', icon: 'account_balance_wallet', exact: false },
    { path: '/admin/flipping', label: 'Flipping', icon: 'sync', exact: false },
    { path: '/admin/exchange', label: 'Exchange Rates', icon: 'currency_exchange', exact: false },
    { path: '/admin/giftcards', label: 'Gift Cards', icon: 'card_giftcard', exact: false },
    { path: '/admin/transactions', label: 'Transactions', icon: 'receipt_long', exact: false },
    { path: '/admin/settings', label: 'Settings', icon: 'settings', exact: false }
  ];
}
