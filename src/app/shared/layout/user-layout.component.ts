import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MockDataService } from '../../core/mock-data.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <!-- Sidebar -->
      <aside class="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col h-auto md:h-screen sticky top-0 z-10">
        <div class="p-6 border-b border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              F
            </div>
            <span class="text-xl font-bold tracking-tight text-slate-900">FinExchange</span>
          </div>
        </div>

        <nav class="flex-1 p-4 space-y-1 overflow-y-auto hidden md:block">
          @for (item of navigation; track item.path) {
            <a [routerLink]="item.path"
               routerLinkActive="bg-indigo-50 text-indigo-700 font-medium"
               [routerLinkActiveOptions]="{exact: item.exact}"
               class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              <mat-icon class="text-[20px]">{{ item.icon }}</mat-icon>
              {{ item.label }}
            </a>
          }
        </nav>

        <div class="p-4 border-t border-slate-100 hidden md:block">
          <a routerLink="/admin" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-colors w-full text-left">
            <mat-icon class="text-[20px]">admin_panel_settings</mat-icon>
            Switch to Admin
          </a>
          <div class="mt-4 flex items-center gap-3 px-3 py-2">
            <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
              {{ mockData.currentUser().name.charAt(0) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-900 truncate">{{ mockData.currentUser().name }}</p>
              <p class="text-xs text-slate-500 truncate">{{ mockData.currentUser().email }}</p>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <!-- Mobile Header -->
        <header class="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              F
            </div>
          </div>
          <div class="flex items-center gap-4">
            <a routerLink="/admin" class="text-sm font-medium text-indigo-600">Admin</a>
            <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
              {{ mockData.currentUser().name.charAt(0) }}
            </div>
          </div>
        </header>

        <div class="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <router-outlet />
        </div>
      </main>

      <!-- Mobile Bottom Nav -->
      <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-20 pb-safe">
        @for (item of navigation; track item.path) {
          <a [routerLink]="item.path"
             routerLinkActive="text-indigo-600"
             [routerLinkActiveOptions]="{exact: item.exact}"
             class="flex flex-col items-center gap-1 p-2 text-slate-500">
            <mat-icon class="text-[24px]">{{ item.icon }}</mat-icon>
            <span class="text-[10px] font-medium">{{ item.label }}</span>
          </a>
        }
      </nav>
    </div>
  `
})
export class UserLayoutComponent {
  mockData = inject(MockDataService);

  navigation = [
    { path: '/dashboard', label: 'Dashboard', icon: 'dashboard', exact: true },
    { path: '/wallet', label: 'Wallet', icon: 'account_balance_wallet', exact: false },
    { path: '/flipping', label: 'Flipping', icon: 'sync', exact: false },
    { path: '/exchange', label: 'Exchange', icon: 'currency_exchange', exact: false },
    { path: '/giftcards', label: 'Gift Cards', icon: 'card_giftcard', exact: false },
    { path: '/transactions', label: 'Transactions', icon: 'receipt_long', exact: false },
    { path: '/profile', label: 'Profile (KYC)', icon: 'person', exact: false }
  ];
}
