import { Component, inject, computed, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { MockDataService } from '../../core/mock-data.service';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule, CommonModule, DatePipe],
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
      <main class="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto bg-slate-50 relative">
        <!-- Desktop Header (Top Bar) -->
        <header class="hidden md:flex bg-white border-b border-slate-200 px-8 py-4 items-center justify-end sticky top-0 z-20">
          <div class="flex items-center gap-6">
            <!-- Notifications Dropdown -->
            <div class="relative">
              <button (click)="toggleNotifications()" class="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors focus:outline-none">
                <mat-icon>notifications</mat-icon>
                @if (unreadCount() > 0) {
                  <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                }
              </button>
              
              @if (showNotifications()) {
                <div class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
                  <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 class="font-semibold text-slate-800">Notifications</h3>
                    @if (unreadCount() > 0) {
                      <button (click)="markAllRead()" class="text-xs text-indigo-600 font-medium hover:text-indigo-700">Mark all read</button>
                    }
                  </div>
                  <div class="max-h-96 overflow-y-auto">
                    @if (userNotifications().length === 0) {
                      <div class="p-6 text-center text-slate-500 text-sm">No notifications yet.</div>
                    }
                    @for (notif of userNotifications(); track notif.id) {
                      <div tabindex="0" (keyup.enter)="markRead(notif.id)" (click)="markRead(notif.id)" class="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors" [class.bg-indigo-50/30]="!notif.isRead">
                        <div class="flex gap-3">
                          <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                               [ngClass]="{
                                 'bg-emerald-100 text-emerald-600': notif.type === 'deposit',
                                 'bg-amber-100 text-amber-600': notif.type === 'withdraw',
                                 'bg-indigo-100 text-indigo-600': notif.type === 'flip',
                                 'bg-blue-100 text-blue-600': notif.type === 'exchange',
                                 'bg-slate-100 text-slate-600': notif.type === 'system'
                               }">
                            <mat-icon class="text-[18px]">
                              {{ notif.type === 'deposit' ? 'arrow_downward' : 
                                 notif.type === 'withdraw' ? 'arrow_upward' : 
                                 notif.type === 'flip' ? 'sync' : 
                                 notif.type === 'exchange' ? 'currency_exchange' : 'info' }}
                            </mat-icon>
                          </div>
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-slate-900" [class.font-semibold]="!notif.isRead">{{ notif.title }}</p>
                            <p class="text-xs text-slate-500 mt-0.5">{{ notif.message }}</p>
                            <p class="text-[10px] text-slate-400 mt-1">{{ notif.date | date:'short' }}</p>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
            
            <a routerLink="/admin" class="text-sm font-medium text-indigo-600 hover:text-indigo-700">Admin Panel</a>
          </div>
        </header>

        <!-- Mobile Header -->
        <header class="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
              F
            </div>
          </div>
          <div class="flex items-center gap-4">
            <!-- Mobile Notifications -->
            <div class="relative">
              <button (click)="toggleNotifications()" class="relative p-2 text-slate-500">
                <mat-icon>notifications</mat-icon>
                @if (unreadCount() > 0) {
                  <span class="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                }
              </button>
            </div>
            <a routerLink="/admin" class="text-sm font-medium text-indigo-600">Admin</a>
            <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-medium">
              {{ mockData.currentUser().name.charAt(0) }}
            </div>
          </div>
        </header>

        <!-- Mobile Notifications Dropdown (Full width) -->
        @if (showNotifications() && isMobile()) {
          <div class="md:hidden fixed inset-x-0 top-[73px] bottom-[60px] bg-white z-30 overflow-y-auto border-b border-slate-200">
            <div class="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 sticky top-0 z-10">
              <h3 class="font-semibold text-slate-800">Notifications</h3>
              @if (unreadCount() > 0) {
                <button (click)="markAllRead()" class="text-xs text-indigo-600 font-medium">Mark all read</button>
              }
            </div>
            <div class="pb-safe">
              @if (userNotifications().length === 0) {
                <div class="p-6 text-center text-slate-500 text-sm">No notifications yet.</div>
              }
              @for (notif of userNotifications(); track notif.id) {
                <div tabindex="0" (keyup.enter)="markRead(notif.id)" (click)="markRead(notif.id)" class="p-4 border-b border-slate-50" [class.bg-indigo-50/30]="!notif.isRead">
                  <div class="flex gap-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                         [ngClass]="{
                           'bg-emerald-100 text-emerald-600': notif.type === 'deposit',
                           'bg-amber-100 text-amber-600': notif.type === 'withdraw',
                           'bg-indigo-100 text-indigo-600': notif.type === 'flip',
                           'bg-blue-100 text-blue-600': notif.type === 'exchange',
                           'bg-slate-100 text-slate-600': notif.type === 'system'
                         }">
                      <mat-icon class="text-[18px]">
                        {{ notif.type === 'deposit' ? 'arrow_downward' : 
                           notif.type === 'withdraw' ? 'arrow_upward' : 
                           notif.type === 'flip' ? 'sync' : 
                           notif.type === 'exchange' ? 'currency_exchange' : 'info' }}
                      </mat-icon>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-slate-900" [class.font-semibold]="!notif.isRead">{{ notif.title }}</p>
                      <p class="text-xs text-slate-500 mt-0.5">{{ notif.message }}</p>
                      <p class="text-[10px] text-slate-400 mt-1">{{ notif.date | date:'short' }}</p>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }

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
  
  showNotifications = signal(false);

  userNotifications = computed(() => {
    return this.mockData.notifications()
      .filter(n => n.userId === this.mockData.currentUser().id)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  });

  unreadCount = computed(() => {
    return this.userNotifications().filter(n => !n.isRead).length;
  });

  toggleNotifications() {
    this.showNotifications.update(v => !v);
  }

  markRead(id: string) {
    this.mockData.markNotificationRead(id);
  }

  markAllRead() {
    this.mockData.markAllNotificationsRead(this.mockData.currentUser().id);
  }

  isMobile() {
    return window.innerWidth < 768;
  }

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
