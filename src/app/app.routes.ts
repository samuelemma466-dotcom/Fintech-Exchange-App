import {Routes} from '@angular/router';
import { UserLayoutComponent } from './shared/layout/user-layout.component';
import { AdminLayoutComponent } from './shared/layout/admin-layout.component';

import { UserDashboardComponent } from './pages/user/dashboard.component';
import { UserWalletComponent } from './pages/user/wallet.component';
import { UserFlipComponent } from './pages/user/flip.component';
import { UserExchangeComponent } from './pages/user/exchange.component';
import { UserGiftCardsComponent } from './pages/user/giftcards.component';
import { UserTransactionsComponent } from './pages/user/transactions.component';
import { UserProfileComponent } from './pages/user/profile.component';

import { AdminDashboardComponent } from './pages/admin/dashboard.component';
import { AdminUsersComponent } from './pages/admin/users.component';
import { AdminWalletComponent } from './pages/admin/wallet.component';
import { AdminTransactionsComponent } from './pages/admin/transactions.component';
import { AdminFlipsComponent } from './pages/admin/flips.component';
import { AdminExchangeComponent } from './pages/admin/exchange.component';
import { AdminGiftCardsComponent } from './pages/admin/giftcards.component';
import { AdminSettingsComponent } from './pages/admin/settings.component';

export const routes: Routes = [
  { 
    path: '', 
    component: UserLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: UserDashboardComponent },
      { path: 'wallet', component: UserWalletComponent },
      { path: 'flipping', component: UserFlipComponent },
      { path: 'exchange', component: UserExchangeComponent },
      { path: 'giftcards', component: UserGiftCardsComponent },
      { path: 'transactions', component: UserTransactionsComponent },
      { path: 'profile', component: UserProfileComponent }
    ]
  },
  { 
    path: 'admin', 
    component: AdminLayoutComponent,
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'wallet', component: AdminWalletComponent },
      { path: 'transactions', component: AdminTransactionsComponent },
      { path: 'flipping', component: AdminFlipsComponent },
      { path: 'exchange', component: AdminExchangeComponent },
      { path: 'giftcards', component: AdminGiftCardsComponent },
      { path: 'settings', component: AdminSettingsComponent }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
