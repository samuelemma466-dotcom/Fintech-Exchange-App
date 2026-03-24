import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex justify-center text-indigo-600">
          <mat-icon class="scale-150">account_balance_wallet</mat-icon>
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">Sign in to your account</h2>
        <p class="mt-2 text-center text-sm text-slate-600">
          Or
          <a routerLink="/" class="font-medium text-indigo-600 hover:text-indigo-500">return to home</a>
        </p>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-slate-100">
          <div class="space-y-6">
            <div>
              <button 
                (click)="login()"
                class="flex w-full justify-center items-center gap-3 rounded-xl bg-white px-3 py-3 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus-visible:ring-transparent transition-all"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="h-5 w-5" referrerpolicy="no-referrer" />
                Sign in with Google
              </button>
            </div>
            
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-slate-200"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="bg-white px-2 text-slate-500">Secure authentication</span>
              </div>
            </div>
            
            <p class="text-xs text-center text-slate-500">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  authService = inject(AuthService);

  async login() {
    try {
      await this.authService.loginWithGoogle();
    } catch (error) {
      console.error(error);
    }
  }
}
