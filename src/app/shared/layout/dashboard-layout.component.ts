import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  template: `
    <div class="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div class="h-16 flex items-center px-6 border-b border-slate-100">
          <mat-icon class="text-indigo-600 mr-2">account_balance_wallet</mat-icon>
          <span class="text-lg font-bold tracking-tight text-slate-900">FinExchange</span>
        </div>
        
        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <a routerLink="/dashboard" routerLinkActive="bg-indigo-50 text-indigo-600" [routerLinkActiveOptions]="{exact: true}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <mat-icon class="text-[20px]">dashboard</mat-icon> Overview
          </a>
          <a routerLink="/dashboard/exchange" routerLinkActive="bg-indigo-50 text-indigo-600" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <mat-icon class="text-[20px]">swap_horiz</mat-icon> Exchange
          </a>
          <a routerLink="/dashboard/wallet" routerLinkActive="bg-indigo-50 text-indigo-600" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <mat-icon class="text-[20px]">account_balance</mat-icon> Wallet
          </a>
          <a routerLink="/dashboard/history" routerLinkActive="bg-indigo-50 text-indigo-600" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <mat-icon class="text-[20px]">history</mat-icon> History
          </a>
          
          @if (authService.userProfile()?.role === 'admin') {
            <div class="pt-6 pb-2">
              <p class="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Admin</p>
            </div>
            <a routerLink="/admin" routerLinkActive="bg-indigo-50 text-indigo-600" class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <mat-icon class="text-[20px]">admin_panel_settings</mat-icon> Admin Panel
            </a>
          }
        </nav>
        
        <div class="p-4 border-t border-slate-100">
          <button (click)="logout()" class="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors">
            <mat-icon class="text-[20px]">logout</mat-icon> Logout
          </button>
        </div>
      </aside>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Header -->
        <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
          <div class="flex items-center md:hidden">
            <mat-icon class="text-indigo-600 mr-2">account_balance_wallet</mat-icon>
            <span class="text-lg font-bold tracking-tight text-slate-900">FinExchange</span>
          </div>
          <div class="hidden md:block">
            <!-- Breadcrumbs or page title could go here -->
          </div>
          <div class="flex items-center gap-4">
            <button class="p-2 text-slate-400 hover:text-slate-500 rounded-full hover:bg-slate-100 transition-colors">
              <mat-icon>notifications</mat-icon>
            </button>
            <div class="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div class="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm">
                {{ authService.currentUser()?.email?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
              <div class="hidden sm:block">
                <p class="text-sm font-medium text-slate-700">{{ authService.currentUser()?.email }}</p>
                <p class="text-xs text-slate-500 capitalize">{{ authService.userProfile()?.role || 'User' }}</p>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto bg-slate-50 p-6">
          <div class="max-w-6xl mx-auto">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
      
      <!-- Mobile Bottom Nav (Simplified) -->
      <div class="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-20">
        <a routerLink="/dashboard" routerLinkActive="text-indigo-600" [routerLinkActiveOptions]="{exact: true}" class="p-2 text-slate-500 flex flex-col items-center">
          <mat-icon>dashboard</mat-icon>
          <span class="text-[10px] font-medium mt-1">Overview</span>
        </a>
        <a routerLink="/dashboard/exchange" routerLinkActive="text-indigo-600" class="p-2 text-slate-500 flex flex-col items-center">
          <mat-icon>swap_horiz</mat-icon>
          <span class="text-[10px] font-medium mt-1">Exchange</span>
        </a>
        <a routerLink="/dashboard/wallet" routerLinkActive="text-indigo-600" class="p-2 text-slate-500 flex flex-col items-center">
          <mat-icon>account_balance</mat-icon>
          <span class="text-[10px] font-medium mt-1">Wallet</span>
        </a>
        <a routerLink="/dashboard/history" routerLinkActive="text-indigo-600" class="p-2 text-slate-500 flex flex-col items-center">
          <mat-icon>history</mat-icon>
          <span class="text-[10px] font-medium mt-1">History</span>
        </a>
      </div>
    </div>
  `
})
export class DashboardLayoutComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
