import { Component, inject, signal } from '@angular/core';
import { MockDataService } from '../../core/mock-data.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-flip',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe, FormsModule],
  template: `
    <div class="space-y-8 pb-20 md:pb-0 max-w-4xl mx-auto">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Flipping Sessions</h1>
        <p class="text-base text-slate-500 mt-2">Join event-based investment sessions to multiply your balance.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        @for (session of mockData.flipSessions(); track session.id) {
          <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative">
            @if (session.status === 'closed') {
              <div class="absolute inset-0 bg-slate-900/5 backdrop-blur-[2px] z-10 flex items-center justify-center">
                <span class="bg-slate-900 text-white px-4 py-2 rounded-full font-bold text-sm tracking-widest uppercase shadow-lg">Closed</span>
              </div>
            }
            
            <div class="p-6 border-b border-slate-100 bg-gradient-to-br from-indigo-50 to-white">
              <div class="flex justify-between items-start mb-4">
                <div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <mat-icon>sync</mat-icon>
                </div>
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                      [class.bg-emerald-100]="session.status === 'open'" [class.text-emerald-800]="session.status === 'open'"
                      [class.bg-slate-100]="session.status === 'closed'" [class.text-slate-800]="session.status === 'closed'">
                  {{ session.status }}
                </span>
              </div>
              <h3 class="text-xl font-bold text-slate-900">{{ session.title }}</h3>
              <p class="text-sm text-slate-500 mt-1 flex items-center gap-1">
                <mat-icon class="text-[16px]">schedule</mat-icon> Duration: {{ session.duration }}
              </p>
            </div>
            
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div class="space-y-4 mb-8">
                <div class="flex justify-between items-center py-3 border-b border-slate-100">
                  <span class="text-sm font-medium text-slate-500">Entry Amount</span>
                  <span class="text-lg font-bold text-slate-900">{{ session.entryAmount | currency:mockData.currentUser().currency:'symbol-narrow':'1.2-2' }}</span>
                </div>
                <div class="flex justify-between items-center py-3 border-b border-slate-100">
                  <span class="text-sm font-medium text-slate-500">Expected Reward</span>
                  <span class="text-lg font-bold text-emerald-600">{{ session.expectedReward | currency:mockData.currentUser().currency:'symbol-narrow':'1.2-2' }}</span>
                </div>
                <div class="flex justify-between items-center py-3">
                  <span class="text-sm font-medium text-slate-500">Participants</span>
                  <span class="text-sm font-bold text-slate-900">{{ session.participants.length }} joined</span>
                </div>
              </div>

              <button 
                (click)="initiateJoin(session.id)"
                [disabled]="session.status !== 'open' || (mockData.currentUser().balances[mockData.currentUser().currency] || 0) < session.entryAmount || hasJoined(session.id)"
                class="w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2"
                [class.bg-indigo-600]="session.status === 'open' && (mockData.currentUser().balances[mockData.currentUser().currency] || 0) >= session.entryAmount && !hasJoined(session.id)"
                [class.text-white]="session.status === 'open' && (mockData.currentUser().balances[mockData.currentUser().currency] || 0) >= session.entryAmount && !hasJoined(session.id)"
                [class.hover:bg-indigo-700]="session.status === 'open' && (mockData.currentUser().balances[mockData.currentUser().currency] || 0) >= session.entryAmount && !hasJoined(session.id)"
                [class.bg-slate-100]="session.status !== 'open' || (mockData.currentUser().balances[mockData.currentUser().currency] || 0) < session.entryAmount || hasJoined(session.id)"
                [class.text-slate-400]="session.status !== 'open' || (mockData.currentUser().balances[mockData.currentUser().currency] || 0) < session.entryAmount || hasJoined(session.id)">
                @if (hasJoined(session.id)) {
                  <mat-icon>check_circle</mat-icon> Joined
                } @else if ((mockData.currentUser().balances[mockData.currentUser().currency] || 0) < session.entryAmount) {
                  Insufficient Balance
                } @else {
                  Join Session
                }
              </button>
            </div>
          </div>
        }
      </div>

      <!-- OTP Modal -->
      @if (showOtpModal()) {
        <div class="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl border border-slate-200 shadow-xl w-full max-w-sm overflow-hidden text-center p-8">
            <div class="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <mat-icon class="scale-150">message</mat-icon>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-2">Verify OTP</h3>
            <p class="text-sm text-slate-500 mb-6">Enter the 6-digit code sent to your registered device.</p>
            
            <div class="flex justify-center gap-3 mb-6">
              <input type="text" maxlength="6" [(ngModel)]="otp" 
                     class="w-40 text-center text-3xl tracking-[0.5em] font-bold bg-slate-50 border border-slate-200 rounded-xl py-3 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
            </div>

            @if (otpError()) {
              <p class="text-sm text-red-500 mb-4">{{ otpError() }}</p>
            }

            <div class="flex flex-col gap-3">
              <button (click)="confirmJoin()" class="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors">
                Verify & Join
              </button>
              <button (click)="closeOtpModal()" class="w-full py-3 text-slate-500 hover:text-slate-700 font-medium text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class UserFlipComponent {
  mockData = inject(MockDataService);

  showOtpModal = signal(false);
  otp = signal('');
  otpError = signal('');
  selectedSessionId = signal<string | null>(null);

  hasJoined(sessionId: string): boolean {
    const session = this.mockData.flipSessions().find(s => s.id === sessionId);
    return session ? session.participants.includes(this.mockData.currentUser().id) : false;
  }

  initiateJoin(sessionId: string) {
    this.selectedSessionId.set(sessionId);
    this.showOtpModal.set(true);
    this.otp.set('');
    this.otpError.set('');
  }

  closeOtpModal() {
    this.showOtpModal.set(false);
    this.selectedSessionId.set(null);
    this.otp.set('');
    this.otpError.set('');
  }

  confirmJoin() {
    if (this.otp() === '123456') {
      const sessionId = this.selectedSessionId();
      if (sessionId) {
        this.mockData.joinFlip(sessionId);
      }
      this.closeOtpModal();
    } else {
      this.otpError.set('Invalid OTP. Try 123456.');
    }
  }
}
