import { Component, inject, signal, computed } from '@angular/core';
import { MockDataService, InvestmentResult, InvestmentPlanDetails } from '../../core/mock-data.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe, DecimalPipe, PercentPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-flip',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe, DecimalPipe, PercentPipe, FormsModule],
  template: `
    <div class="space-y-8 pb-20 md:pb-0 max-w-5xl mx-auto">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Intelligent Adaptive Engine</h1>
        <p class="text-base text-slate-500 mt-2">Personalized investment plans powered by your behavior and risk profile.</p>
      </div>

      <!-- User Profile & Analytics Dashboard -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Level & XP -->
        <div class="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-sm relative overflow-hidden">
          <div class="absolute top-0 right-0 p-4 opacity-10">
            <mat-icon class="scale-[4]">military_tech</mat-icon>
          </div>
          <p class="text-indigo-200 text-sm font-medium mb-1">Current Level</p>
          <h2 class="text-3xl font-bold mb-4">{{ mockData.currentUser().level || 'Beginner' }}</h2>
          <div class="space-y-2">
            <div class="flex justify-between text-xs font-medium text-indigo-200">
              <span>{{ mockData.currentUser().xp || 0 }} XP</span>
              <span>Next Level</span>
            </div>
            <div class="h-2 bg-indigo-950 rounded-full overflow-hidden">
              <div class="h-full bg-indigo-500 rounded-full" [style.width.%]="xpProgress()"></div>
            </div>
          </div>
        </div>

        <!-- User Score & Risk -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-center">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-slate-500 text-sm font-medium mb-1">User Score</p>
              <h2 class="text-3xl font-bold text-slate-900">{{ mockData.currentUser().userScore || 50 }}<span class="text-lg text-slate-400 font-normal">/100</span></h2>
            </div>
            <div class="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
              <mat-icon>psychology</mat-icon>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-slate-500">Risk Profile:</span>
            <span class="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  [class.bg-emerald-100]="mockData.currentUser().riskProfile === 'low'" [class.text-emerald-800]="mockData.currentUser().riskProfile === 'low'"
                  [class.bg-indigo-100]="mockData.currentUser().riskProfile === 'medium'" [class.text-indigo-800]="mockData.currentUser().riskProfile === 'medium'"
                  [class.bg-pink-100]="mockData.currentUser().riskProfile === 'high'" [class.text-pink-800]="mockData.currentUser().riskProfile === 'high'">
              {{ mockData.currentUser().riskProfile || 'Medium' }}
            </span>
          </div>
        </div>

        <!-- Analytics -->
        <div class="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col justify-center space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-slate-500">Win Rate</span>
            <span class="text-sm font-bold text-emerald-600">{{ winRate() | percent:'1.0-1' }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm font-medium text-slate-500">Loss Rate</span>
            <span class="text-sm font-bold text-red-600">{{ lossRate() | percent:'1.0-1' }}</span>
          </div>
          <div class="flex justify-between items-center pt-4 border-t border-slate-100">
            <span class="text-sm font-medium text-slate-500">Total Flips</span>
            <span class="text-sm font-bold text-slate-900">{{ totalFlips() }}</span>
          </div>
          <div class="flex justify-between items-center pt-4 border-t border-slate-100">
            <span class="text-sm font-medium text-slate-500">Preferred Plan</span>
            <span class="text-sm font-bold text-slate-900 uppercase">{{ mockData.currentUser().preferredPlan || 'None' }}</span>
          </div>
          @if (mockData.currentUser().highUrgencyAbuseCount && mockData.currentUser().highUrgencyAbuseCount! > 0) {
            <div class="flex justify-between items-center pt-4 border-t border-slate-100">
              <span class="text-sm font-medium text-red-500 flex items-center gap-1"><mat-icon class="text-[16px]">warning</mat-icon> System Warning</span>
              <span class="text-xs font-bold text-red-600">Urgency Abuse Detected</span>
            </div>
          }
        </div>
      </div>

      @if (step() === 1) {
        <!-- Step 1: Input -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <h2 class="text-xl font-bold text-slate-900 mb-6">Investment Profile</h2>
          <div class="space-y-6">
            <div>
              <label for="purpose" class="block text-sm font-medium text-slate-700 mb-2">Purpose of Investment</label>
              <div id="purpose" class="grid grid-cols-2 md:grid-cols-4 gap-3">
                @for (p of ['Bills', 'Emergency', 'Business', 'Personal']; track p) {
                  <button (click)="purpose.set(p)" 
                          class="py-3 px-4 rounded-xl border font-medium text-sm transition-colors"
                          [class.bg-indigo-50]="purpose() === p"
                          [class.border-indigo-200]="purpose() === p"
                          [class.text-indigo-700]="purpose() === p"
                          [class.bg-white]="purpose() !== p"
                          [class.border-slate-200]="purpose() !== p"
                          [class.text-slate-600]="purpose() !== p">
                    {{ p }}
                  </button>
                }
              </div>
            </div>

            <div>
              <label for="urgency" class="block text-sm font-medium text-slate-700 mb-2">Urgency Level</label>
              <div id="urgency" class="grid grid-cols-3 gap-3">
                @for (u of ['Low', 'Medium', 'High']; track u) {
                  <button (click)="urgency.set(u)" 
                          class="py-3 px-4 rounded-xl border font-medium text-sm transition-colors"
                          [class.bg-indigo-50]="urgency() === u"
                          [class.border-indigo-200]="urgency() === u"
                          [class.text-indigo-700]="urgency() === u"
                          [class.bg-white]="urgency() !== u"
                          [class.border-slate-200]="urgency() !== u"
                          [class.text-slate-600]="urgency() !== u">
                    {{ u }}
                  </button>
                }
              </div>
              @if (urgency() === 'High') {
                <p class="text-xs text-amber-600 mt-2 flex items-center gap-1">
                  <mat-icon class="text-[14px]">bolt</mat-icon> High urgency unlocks probability boosts (limited uses).
                </p>
              }
            </div>

            <div>
              <label for="amount" class="block text-sm font-medium text-slate-700 mb-2">Investment Amount (Min: {{ mockData.systemSettings().investMinAmount | currency:mockData.currentUser().currency:'symbol-narrow':'1.0-0' }})</label>
              <input id="amount" type="number" [(ngModel)]="amount" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors">
              <p class="text-xs text-slate-500 mt-2 text-right">Available: {{ (mockData.currentUser().balances[mockData.currentUser().currency] || 0) | currency:mockData.currentUser().currency:'symbol-narrow':'1.2-2' }}</p>
            </div>

            <button (click)="generatePlans()" 
                    [disabled]="!isValidAmount()"
                    class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed">
              Generate Personalized Plans
            </button>
          </div>
        </div>
      } @else if (step() === 2) {
        <!-- Step 2: Plans -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-slate-900">Your Personalized Plans</h2>
          <button (click)="step.set(1)" class="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            <mat-icon class="text-[18px]">arrow_back</mat-icon> Edit Profile
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          @for (plan of personalizedPlans(); track plan.id) {
            <div class="bg-white rounded-3xl border shadow-sm overflow-hidden flex flex-col transition-colors cursor-pointer relative" 
                 tabindex="0"
                 (keyup.enter)="selectPlan(plan.id)"
                 [class.border-emerald-300]="plan.id === 'safe'" [class.hover:border-emerald-400]="plan.id === 'safe'"
                 [class.border-indigo-300]="plan.id === 'balanced'" [class.hover:border-indigo-400]="plan.id === 'balanced'"
                 [class.border-pink-300]="plan.id === 'aggressive'" [class.hover:border-pink-400]="plan.id === 'aggressive'"
                 (click)="selectPlan(plan.id)">
              
              @if (plan.isRecommended) {
                <div class="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-bl-xl">Recommended</div>
              }
              
              <div class="p-6 border-b border-slate-100"
                   [class.bg-emerald-50]="plan.id === 'safe'"
                   [class.bg-indigo-50]="plan.id === 'balanced'"
                   [class.bg-pink-50]="plan.id === 'aggressive'">
                <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                     [class.bg-emerald-100]="plan.id === 'safe'" [class.text-emerald-600]="plan.id === 'safe'"
                     [class.bg-indigo-100]="plan.id === 'balanced'" [class.text-indigo-600]="plan.id === 'balanced'"
                     [class.bg-pink-100]="plan.id === 'aggressive'" [class.text-pink-600]="plan.id === 'aggressive'">
                  <mat-icon>{{ plan.id === 'safe' ? 'shield' : (plan.id === 'balanced' ? 'balance' : 'trending_up') }}</mat-icon>
                </div>
                <h3 class="text-xl font-bold text-slate-900">{{ plan.name }}</h3>
                <p class="text-sm font-medium"
                   [class.text-emerald-700]="plan.id === 'safe'"
                   [class.text-indigo-700]="plan.id === 'balanced'"
                   [class.text-pink-700]="plan.id === 'aggressive'">{{ plan.description }}</p>
              </div>
              
              <div class="p-6 space-y-4 flex-1">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-slate-500">Success Rate</span>
                  <span class="text-sm font-bold text-slate-900">{{ plan.successProb | number:'1.0-1' }}%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-slate-500">Potential Return</span>
                  <span class="text-sm font-bold"
                        [class.text-emerald-600]="plan.id === 'safe'"
                        [class.text-indigo-600]="plan.id === 'balanced'"
                        [class.text-pink-600]="plan.id === 'aggressive'">Up to {{ (plan.returnMax - 1) * 100 | number:'1.0-1' }}%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-slate-500">Duration</span>
                  <span class="text-sm font-bold text-slate-900">{{ plan.id === 'safe' ? 'Short' : (plan.id === 'balanced' ? 'Medium' : 'Long') }}</span>
                </div>
              </div>
              
              <div class="p-6 pt-0">
                <button class="w-full py-3 text-white rounded-xl font-bold text-sm transition-colors"
                        [class.bg-slate-900]="plan.id === 'safe'" [class.hover:bg-slate-800]="plan.id === 'safe'"
                        [class.bg-indigo-600]="plan.id === 'balanced'" [class.hover:bg-indigo-700]="plan.id === 'balanced'"
                        [class.bg-pink-600]="plan.id === 'aggressive'" [class.hover:bg-pink-700]="plan.id === 'aggressive'">
                  Choose {{ plan.name.split(' ')[0] }}
                </button>
              </div>
            </div>
          }
        </div>
      } @else if (step() === 3 && result()) {
        <!-- Step 3: Result -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 max-w-lg mx-auto text-center">
          @if (result()!.outcome === 'success') {
            <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <mat-icon class="scale-[2]">emoji_events</mat-icon>
            </div>
            <h2 class="text-2xl font-bold text-slate-900 mb-2">Investment Successful!</h2>
            <p class="text-slate-500 mb-6">Your {{ result()!.plan }} plan generated a solid profit.</p>
          } @else if (result()!.outcome === 'partial') {
            <div class="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <mat-icon class="scale-[2]">check_circle</mat-icon>
            </div>
            <h2 class="text-2xl font-bold text-slate-900 mb-2">Partial Success</h2>
            <p class="text-slate-500 mb-6">Your {{ result()!.plan }} plan generated a small return.</p>
          } @else {
            <div class="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <mat-icon class="scale-[2]">trending_down</mat-icon>
            </div>
            <h2 class="text-2xl font-bold text-slate-900 mb-2">Investment Loss</h2>
            <p class="text-slate-500 mb-6">The market didn't favor your {{ result()!.plan }} plan this time.</p>
          }

          <div class="bg-slate-50 rounded-2xl p-6 mb-6 text-left space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-500">Original Amount</span>
              <span class="text-sm font-bold text-slate-900">{{ result()!.originalAmount | currency:mockData.currentUser().currency:'symbol-narrow':'1.2-2' }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-sm text-slate-500">Final Amount</span>
              <span class="text-lg font-bold" [class.text-emerald-600]="result()!.profit > 0" [class.text-red-600]="result()!.profit < 0">
                {{ result()!.finalAmount | currency:mockData.currentUser().currency:'symbol-narrow':'1.2-2' }}
              </span>
            </div>
            <div class="flex justify-between items-center pt-4 border-t border-slate-200">
              <span class="text-sm text-slate-500">Net Profit/Loss</span>
              <span class="text-sm font-bold" [class.text-emerald-600]="result()!.profit > 0" [class.text-red-600]="result()!.profit < 0">
                {{ result()!.profit > 0 ? '+' : '' }}{{ result()!.profit | currency:mockData.currentUser().currency:'symbol-narrow':'1.2-2' }}
              </span>
            </div>
          </div>

          <!-- Rewards Section -->
          @if (result()!.rewards.firstTimeBonus || result()!.rewards.cashback || result()!.rewards.streakBonus || result()!.rewards.xpEarned) {
            <div class="bg-indigo-50 rounded-2xl p-6 mb-6 text-left border border-indigo-100">
              <h4 class="text-sm font-bold text-indigo-900 mb-3 flex items-center gap-2">
                <mat-icon class="text-[18px]">redeem</mat-icon> Rewards & XP
              </h4>
              <div class="space-y-2">
                @if (result()!.rewards.xpEarned) {
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-indigo-700">XP Earned</span>
                    <span class="text-sm font-bold text-indigo-900">+{{ result()!.rewards.xpEarned }} XP</span>
                  </div>
                }
                @if (result()!.rewards.firstTimeBonus) {
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-indigo-700">First-Time Bonus</span>
                    <span class="text-sm font-bold text-indigo-900">+{{ result()!.rewards.firstTimeBonus | currency:mockData.currentUser().currency:'symbol-narrow':'1.2-2' }}</span>
                  </div>
                }
                @if (result()!.rewards.cashback) {
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-indigo-700">Loss Cashback</span>
                    <span class="text-sm font-bold text-indigo-900">+{{ result()!.rewards.cashback | currency:mockData.currentUser().currency:'symbol-narrow':'1.2-2' }}</span>
                  </div>
                }
                @if (result()!.rewards.streakBonus) {
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-indigo-700">Streak Bonus</span>
                    <span class="text-sm font-bold text-indigo-900">+{{ result()!.rewards.streakBonus | currency:mockData.currentUser().currency:'symbol-narrow':'1.2-2' }}</span>
                  </div>
                }
              </div>
            </div>
          }

          <button (click)="reset()" class="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-colors">
            Start New Investment
          </button>
        </div>
      }
    </div>
  `
})
export class UserFlipComponent {
  mockData = inject(MockDataService);

  step = signal<1 | 2 | 3>(1);
  purpose = signal('Emergency');
  urgency = signal('Medium');
  amount = signal(100);
  result = signal<InvestmentResult | null>(null);
  personalizedPlans = signal<InvestmentPlanDetails[]>([]);

  // Analytics Computed
  totalFlips = computed(() => {
    const user = this.mockData.currentUser();
    return (user.flipWins || 0) + (user.flipLosses || 0) + (user.flipPartials || 0);
  });

  winRate = computed(() => {
    const total = this.totalFlips();
    if (total === 0) return 0;
    return (this.mockData.currentUser().flipWins || 0) / total;
  });

  lossRate = computed(() => {
    const total = this.totalFlips();
    if (total === 0) return 0;
    return (this.mockData.currentUser().flipLosses || 0) / total;
  });

  xpProgress = computed(() => {
    const xp = this.mockData.currentUser().xp || 0;
    const level = this.mockData.currentUser().level || 'Beginner';
    
    let currentLevelXp = 0;
    let nextLevelXp = 100;
    
    if (level === 'Elite') {
      return 100;
    } else if (level === 'Gold') {
      currentLevelXp = 2000;
      nextLevelXp = 5000;
    } else if (level === 'Silver') {
      currentLevelXp = 500;
      nextLevelXp = 2000;
    } else if (level === 'Bronze') {
      currentLevelXp = 100;
      nextLevelXp = 500;
    }
    
    const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
    return Math.min(100, Math.max(0, progress));
  });

  isValidAmount(): boolean {
    const amt = this.amount();
    const settings = this.mockData.systemSettings();
    const user = this.mockData.currentUser();
    return amt >= settings.investMinAmount && 
           amt <= settings.investMaxAmount && 
           amt <= (user.balances[user.currency] || 0);
  }

  generatePlans() {
    if (this.isValidAmount()) {
      const plans = this.mockData.getPersonalizedPlans(this.amount(), this.urgency());
      this.personalizedPlans.set(plans);
      this.step.set(2);
    }
  }

  selectPlan(plan: 'safe' | 'balanced' | 'aggressive') {
    const res = this.mockData.executeSmartInvestment(this.amount(), this.urgency(), plan);
    this.result.set(res);
    this.step.set(3);
  }

  reset() {
    this.step.set(1);
    this.result.set(null);
    this.amount.set(100);
  }
}
