import { Component, inject, signal } from '@angular/core';
import { MockDataService } from '../../core/mock-data.service';
import { MatIconModule } from '@angular/material/icon';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-wallet',
  standalone: true,
  imports: [MatIconModule, CurrencyPipe, FormsModule],
  template: `
    <div class="space-y-8 pb-20 md:pb-0 max-w-5xl mx-auto">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">My Wallets</h1>
        <p class="text-base text-slate-500 mt-2">Manage your multi-currency balances.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (currency of currencies; track currency) {
          <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-colors">
            <div class="absolute -right-4 -top-4 w-24 h-24 bg-slate-50 rounded-full group-hover:bg-indigo-50 transition-colors z-0"></div>
            <div class="relative z-10">
              <div class="flex items-center justify-between mb-4">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                     [class.bg-indigo-100]="currency === 'USD'" [class.text-indigo-700]="currency === 'USD'"
                     [class.bg-emerald-100]="currency === 'NGN'" [class.text-emerald-700]="currency === 'NGN'"
                     [class.bg-blue-100]="currency === 'EUR'" [class.text-blue-700]="currency === 'EUR'"
                     [class.bg-purple-100]="currency === 'GBP'" [class.text-purple-700]="currency === 'GBP'">
                  {{ currency }}
                </div>
                <button class="text-slate-400 hover:text-indigo-600 transition-colors">
                  <mat-icon>more_vert</mat-icon>
                </button>
              </div>
              <p class="text-sm font-medium text-slate-500 mb-1">{{ currency }} Balance</p>
              <h2 class="text-2xl font-bold text-slate-900">
                {{ (mockData.currentUser().balances[currency] || 0) | currency:currency:'symbol-narrow':'1.2-2' }}
              </h2>
            </div>
          </div>
        }
      </div>

      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden mt-8">
        <div class="px-6 py-5 border-b border-slate-100">
          <h3 class="text-lg font-semibold text-slate-900">Quick Actions</h3>
        </div>
        <div class="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button (click)="openDepositModal()" class="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 transition-colors border border-transparent hover:border-indigo-100">
            <div class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-current">
              <mat-icon>add</mat-icon>
            </div>
            <span class="text-sm font-medium">Deposit</span>
          </button>
          <button (click)="openWithdrawModal()" class="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 transition-colors border border-transparent hover:border-indigo-100">
            <div class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-current">
              <mat-icon>arrow_upward</mat-icon>
            </div>
            <span class="text-sm font-medium">Withdraw</span>
          </button>
          <button (click)="openTransferModal()" class="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 transition-colors border border-transparent hover:border-indigo-100">
            <div class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-current">
              <mat-icon>swap_horiz</mat-icon>
            </div>
            <span class="text-sm font-medium">Transfer</span>
          </button>
          <button class="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 transition-colors border border-transparent hover:border-indigo-100">
            <div class="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-current">
              <mat-icon>receipt</mat-icon>
            </div>
            <span class="text-sm font-medium">Statement</span>
          </button>
        </div>
      </div>

      <!-- Deposit Modal -->
      @if (showDepositModal()) {
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 class="text-lg font-bold text-slate-900">Card Deposit</h3>
              <button (click)="closeDepositModal()" class="text-slate-400 hover:text-slate-600 transition-colors">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            
            @if (depositSuccess()) {
              <div class="p-8 text-center">
                <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <mat-icon class="text-[32px]">check_circle</mat-icon>
                </div>
                <h4 class="text-xl font-bold text-slate-900 mb-2">Deposit Requested</h4>
                <p class="text-sm text-slate-500 mb-6">Your deposit request has been submitted and is pending admin approval.</p>
                <button (click)="closeDepositModal()" class="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                  Close
                </button>
              </div>
            } @else {
              <div class="px-6 pt-4">
                <div class="flex p-1 bg-slate-100 rounded-xl">
                  <button (click)="depositMethod.set('card')" [class.bg-white]="depositMethod() === 'card'" [class.shadow-sm]="depositMethod() === 'card'" [class.text-slate-900]="depositMethod() === 'card'" [class.text-slate-500]="depositMethod() !== 'card'" class="flex-1 py-2 text-sm font-medium rounded-lg transition-all">Card</button>
                  <button (click)="depositMethod.set('bank')" [class.bg-white]="depositMethod() === 'bank'" [class.shadow-sm]="depositMethod() === 'bank'" [class.text-slate-900]="depositMethod() === 'bank'" [class.text-slate-500]="depositMethod() !== 'bank'" class="flex-1 py-2 text-sm font-medium rounded-lg transition-all">Bank</button>
                  <button (click)="depositMethod.set('crypto')" [class.bg-white]="depositMethod() === 'crypto'" [class.shadow-sm]="depositMethod() === 'crypto'" [class.text-slate-900]="depositMethod() === 'crypto'" [class.text-slate-500]="depositMethod() !== 'crypto'" class="flex-1 py-2 text-sm font-medium rounded-lg transition-all">Crypto</button>
                </div>
              </div>

              <div class="p-6 space-y-5">
                <div>
                  <label for="deposit-currency" class="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                  <select id="deposit-currency" [(ngModel)]="depositCurrency" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                    <option value="USD">USD - US Dollar</option>
                    <option value="NGN">NGN - Nigerian Naira</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
                
                <div>
                  <label for="deposit-amount" class="block text-sm font-medium text-slate-700 mb-2">Amount</label>
                  <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <span class="text-slate-500 font-medium">{{ depositCurrency() }}</span>
                    </div>
                    <input id="deposit-amount" type="number" [(ngModel)]="depositAmount" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-16 pr-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" placeholder="0.00">
                  </div>
                </div>

                @if (depositMethod() === 'card') {
                  <div class="pt-4 border-t border-slate-100">
                    <h4 class="text-sm font-semibold text-slate-900 mb-4">Card Details</h4>
                    
                    <div class="space-y-4">
                      <div>
                        <label for="card-number" class="block text-xs font-medium text-slate-500 mb-1">Card Number</label>
                        <input id="card-number" type="text" [(ngModel)]="cardNumber" placeholder="0000 0000 0000 0000" maxlength="19" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm">
                      </div>
                      
                      <div class="grid grid-cols-2 gap-4">
                        <div>
                          <label for="card-expiry" class="block text-xs font-medium text-slate-500 mb-1">Expiry Date</label>
                          <input id="card-expiry" type="text" [(ngModel)]="cardExpiry" placeholder="MM/YY" maxlength="5" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm">
                        </div>
                        <div>
                          <label for="card-cvv" class="block text-xs font-medium text-slate-500 mb-1">CVV</label>
                          <input id="card-cvv" type="text" [(ngModel)]="cardCvv" placeholder="123" maxlength="4" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm">
                        </div>
                      </div>
                    </div>
                  </div>
                }

                @if (depositMethod() === 'bank') {
                  <div class="pt-4 border-t border-slate-100">
                    <h4 class="text-sm font-semibold text-slate-900 mb-4">Bank Transfer Details</h4>
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 mb-4">
                      <div class="flex justify-between text-sm">
                        <span class="text-slate-500">Bank Name</span>
                        <span class="font-medium text-slate-900">{{ mockData.systemSettings().bankDepositDetails.bankName }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-slate-500">Account Name</span>
                        <span class="font-medium text-slate-900">{{ mockData.systemSettings().bankDepositDetails.accountName }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-slate-500">Account Number</span>
                        <span class="font-medium text-slate-900 font-mono">{{ mockData.systemSettings().bankDepositDetails.accountNumber }}</span>
                      </div>
                    </div>
                    <div>
                      <label for="bank-proof" class="block text-xs font-medium text-slate-500 mb-1">Payment Proof (URL or Reference)</label>
                      <input id="bank-proof" type="text" [(ngModel)]="depositProof" placeholder="Enter reference number or receipt URL" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm">
                    </div>
                  </div>
                }

                @if (depositMethod() === 'crypto') {
                  <div class="pt-4 border-t border-slate-100">
                    <h4 class="text-sm font-semibold text-slate-900 mb-4">Crypto Deposit Details</h4>
                    <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 mb-4">
                      <div>
                        <span class="text-xs text-slate-500 block mb-1">BTC Address</span>
                        <span class="text-sm font-medium text-slate-900 font-mono break-all">{{ mockData.systemSettings().cryptoDepositDetails.btcAddress }}</span>
                      </div>
                      <div class="border-t border-slate-200 pt-3">
                        <span class="text-xs text-slate-500 block mb-1">USDT (ERC20) Address</span>
                        <span class="text-sm font-medium text-slate-900 font-mono break-all">{{ mockData.systemSettings().cryptoDepositDetails.usdtAddress }}</span>
                      </div>
                    </div>
                    <div>
                      <label for="crypto-hash" class="block text-xs font-medium text-slate-500 mb-1">Transaction Hash</label>
                      <input id="crypto-hash" type="text" [(ngModel)]="depositTxHash" placeholder="Enter transaction hash" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono text-sm">
                    </div>
                  </div>
                }

                <div class="p-4 bg-indigo-50 rounded-xl text-indigo-900 mt-4 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium">Deposit Fee</span>
                    <span class="text-sm font-bold">{{ mockData.systemSettings().depositFeePercent }}%</span>
                  </div>
                  <div class="flex items-center justify-between pt-2 border-t border-indigo-100">
                    <span class="text-sm font-medium">You will receive</span>
                    <span class="text-sm font-bold">{{ ((depositAmount() || 0) * (1 - mockData.systemSettings().depositFeePercent / 100)) | currency:depositCurrency():'symbol-narrow':'1.2-2' }}</span>
                  </div>
                </div>

                <button 
                  (click)="submitDeposit()" 
                  [disabled]="!isValidDeposit() || isSubmittingDeposit()"
                  class="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  @if (isSubmittingDeposit()) {
                    <mat-icon class="animate-spin text-[20px] w-5 h-5">refresh</mat-icon>
                    Processing...
                  } @else {
                    Submit Deposit Request
                  }
                </button>
              </div>
            }
          </div>
        </div>
      }
      <!-- Withdraw Modal -->
      @if (showWithdrawModal()) {
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 class="text-lg font-bold text-slate-900">Withdraw Funds</h3>
              <button (click)="closeWithdrawModal()" class="text-slate-400 hover:text-slate-600 transition-colors">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            
            @if (withdrawSuccess()) {
              <div class="p-8 text-center">
                <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <mat-icon class="text-[32px]">check_circle</mat-icon>
                </div>
                <h4 class="text-xl font-bold text-slate-900 mb-2">Withdrawal Requested</h4>
                <p class="text-sm text-slate-500 mb-6">Your withdrawal request has been submitted and is pending admin approval.</p>
                <button (click)="closeWithdrawModal()" class="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                  Close
                </button>
              </div>
            } @else {
              <div class="p-6 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="withdraw-currency" class="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                    <div class="relative">
                      <select id="withdraw-currency" [(ngModel)]="withdrawCurrency" class="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none transition-colors">
                        @for (cur of currencies; track cur) {
                          <option [value]="cur">{{ cur }}</option>
                        }
                      </select>
                      <mat-icon class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</mat-icon>
                    </div>
                  </div>
                  <div>
                    <label for="withdraw-amount" class="block text-sm font-medium text-slate-700 mb-2">Amount</label>
                    <input id="withdraw-amount" type="number" [(ngModel)]="withdrawAmount" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" placeholder="0.00">
                  </div>
                </div>

                <div>
                  <label for="bank-name" class="block text-sm font-medium text-slate-700 mb-2">Bank Name</label>
                  <input id="bank-name" type="text" [(ngModel)]="bankName" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" placeholder="e.g. Chase Bank">
                </div>
                
                <div>
                  <label for="account-number" class="block text-sm font-medium text-slate-700 mb-2">Account Number</label>
                  <input id="account-number" type="text" [(ngModel)]="accountNumber" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" placeholder="Account Number">
                </div>

                <div class="p-4 bg-indigo-50 rounded-xl text-indigo-900 mt-4 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium">Withdrawal Fee</span>
                    <span class="text-sm font-bold">{{ mockData.systemSettings().withdrawalFeeFixed | currency:'USD' }}</span>
                  </div>
                  <div class="flex items-center justify-between pt-2 border-t border-indigo-100">
                    <span class="text-sm font-medium">You will receive</span>
                    <span class="text-sm font-bold">{{ ((withdrawAmount() || 0) - mockData.systemSettings().withdrawalFeeFixed) | currency:withdrawCurrency():'symbol-narrow':'1.2-2' }}</span>
                  </div>
                </div>

                <button 
                  (click)="submitWithdrawal()"
                  [disabled]="!isValidWithdrawal() || isSubmittingWithdraw()"
                  class="w-full py-4 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 mt-6"
                  [class.bg-indigo-600]="isValidWithdrawal()"
                  [class.text-white]="isValidWithdrawal()"
                  [class.hover:bg-indigo-700]="isValidWithdrawal()"
                  [class.bg-slate-100]="!isValidWithdrawal()"
                  [class.text-slate-400]="!isValidWithdrawal()">
                  @if (isSubmittingWithdraw()) {
                    <mat-icon class="animate-spin text-[20px] w-5 h-5">refresh</mat-icon>
                    Processing...
                  } @else if (withdrawAmount() && withdrawAmount()! > (mockData.currentUser().balances[withdrawCurrency()] || 0)) {
                    Insufficient Balance
                  } @else {
                    Confirm Withdrawal
                  }
                </button>
              </div>
            }
          </div>
        </div>
      }

      <!-- Transfer Modal -->
      @if (showTransferModal()) {
        <div class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div class="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 class="text-lg font-bold text-slate-900">Transfer Funds</h3>
              <button (click)="closeTransferModal()" class="text-slate-400 hover:text-slate-600 transition-colors">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            
            @if (transferSuccess()) {
              <div class="p-8 text-center">
                <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <mat-icon class="text-[32px]">check_circle</mat-icon>
                </div>
                <h4 class="text-xl font-bold text-slate-900 mb-2">Transfer Successful</h4>
                <p class="text-sm text-slate-500 mb-6">Your funds have been transferred successfully.</p>
                <button (click)="closeTransferModal()" class="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                  Close
                </button>
              </div>
            } @else {
              <div class="p-6 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="transfer-currency" class="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                    <div class="relative">
                      <select id="transfer-currency" [(ngModel)]="transferCurrency" class="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none transition-colors">
                        @for (cur of currencies; track cur) {
                          <option [value]="cur">{{ cur }}</option>
                        }
                      </select>
                      <mat-icon class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</mat-icon>
                    </div>
                  </div>
                  <div>
                    <label for="transfer-amount" class="block text-sm font-medium text-slate-700 mb-2">Amount</label>
                    <input id="transfer-amount" type="number" [(ngModel)]="transferAmount" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" placeholder="0.00">
                  </div>
                </div>

                <div>
                  <label for="recipient-id" class="block text-sm font-medium text-slate-700 mb-2">Recipient User ID</label>
                  <input id="recipient-id" type="text" [(ngModel)]="recipientId" class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors" placeholder="e.g. user-2">
                </div>

                <div class="p-4 bg-indigo-50 rounded-xl text-indigo-900 mt-4 space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="text-sm font-medium">Transfer Fee</span>
                    <span class="text-sm font-bold">{{ mockData.systemSettings().transferFeePercent }}%</span>
                  </div>
                  <div class="flex items-center justify-between pt-2 border-t border-indigo-100">
                    <span class="text-sm font-medium">Recipient will receive</span>
                    <span class="text-sm font-bold">{{ ((transferAmount() || 0) * (1 - mockData.systemSettings().transferFeePercent / 100)) | currency:transferCurrency():'symbol-narrow':'1.2-2' }}</span>
                  </div>
                </div>

                <button 
                  (click)="submitTransfer()"
                  [disabled]="!isValidTransfer() || isSubmittingTransfer()"
                  class="w-full py-4 rounded-xl font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 mt-6"
                  [class.bg-indigo-600]="isValidTransfer()"
                  [class.text-white]="isValidTransfer()"
                  [class.hover:bg-indigo-700]="isValidTransfer()"
                  [class.bg-slate-100]="!isValidTransfer()"
                  [class.text-slate-400]="!isValidTransfer()">
                  @if (isSubmittingTransfer()) {
                    <mat-icon class="animate-spin text-[20px] w-5 h-5">refresh</mat-icon>
                    Processing...
                  } @else if (transferAmount() && transferAmount()! > (mockData.currentUser().balances[transferCurrency()] || 0)) {
                    Insufficient Balance
                  } @else {
                    Confirm Transfer
                  }
                </button>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class UserWalletComponent {
  mockData = inject(MockDataService);
  currencies = ['USD', 'NGN', 'EUR', 'GBP'];

  showDepositModal = signal(false);
  depositSuccess = signal(false);
  isSubmittingDeposit = signal(false);
  depositMethod = signal<'card' | 'bank' | 'crypto'>('card');
  
  depositCurrency = signal('USD');
  depositAmount = signal<number | null>(null);
  cardNumber = signal('');
  cardExpiry = signal('');
  cardCvv = signal('');
  depositProof = signal('');
  depositTxHash = signal('');

  showWithdrawModal = signal(false);
  withdrawSuccess = signal(false);
  isSubmittingWithdraw = signal(false);
  withdrawCurrency = signal('USD');
  withdrawAmount = signal<number | null>(null);
  bankName = signal('');
  accountNumber = signal('');

  showTransferModal = signal(false);
  transferSuccess = signal(false);
  isSubmittingTransfer = signal(false);
  transferCurrency = signal('USD');
  transferAmount = signal<number | null>(null);
  recipientId = signal('');

  openDepositModal() {
    this.showDepositModal.set(true);
    this.depositSuccess.set(false);
    this.resetForm();
  }

  closeDepositModal() {
    this.showDepositModal.set(false);
  }

  openWithdrawModal() {
    this.showWithdrawModal.set(true);
    this.withdrawSuccess.set(false);
    this.resetWithdrawForm();
  }

  closeWithdrawModal() {
    this.showWithdrawModal.set(false);
  }

  openTransferModal() {
    this.showTransferModal.set(true);
    this.transferSuccess.set(false);
    this.resetTransferForm();
  }

  closeTransferModal() {
    this.showTransferModal.set(false);
  }

  resetForm() {
    this.depositAmount.set(null);
    this.cardNumber.set('');
    this.cardExpiry.set('');
    this.cardCvv.set('');
    this.depositProof.set('');
    this.depositTxHash.set('');
  }

  resetWithdrawForm() {
    this.withdrawAmount.set(null);
    this.bankName.set('');
    this.accountNumber.set('');
  }

  resetTransferForm() {
    this.transferAmount.set(null);
    this.recipientId.set('');
  }

  isValidDeposit(): boolean {
    const amount = this.depositAmount();
    if (!amount || amount <= 0) return false;

    if (this.depositMethod() === 'card') {
      const card = this.cardNumber().replace(/\s/g, '');
      const expiry = this.cardExpiry();
      const cvv = this.cardCvv();
      
      return card.length >= 15 && card.length <= 19 &&
             expiry.length === 5 && expiry.includes('/') &&
             cvv.length >= 3 && cvv.length <= 4;
    } else if (this.depositMethod() === 'bank') {
      return this.depositProof().length > 0;
    } else if (this.depositMethod() === 'crypto') {
      return this.depositTxHash().length > 0;
    }
    return false;
  }

  submitDeposit() {
    if (this.isValidDeposit()) {
      this.isSubmittingDeposit.set(true);
      setTimeout(() => {
        const amount = this.depositAmount()!;
        const currency = this.depositCurrency();
        const method = this.depositMethod();
        
        let details: { cardNumber?: string; proof?: string; txHash?: string } = {};
        if (method === 'card') {
          details = { cardNumber: this.cardNumber() };
        } else if (method === 'bank') {
          details = { proof: this.depositProof() };
        } else if (method === 'crypto') {
          details = { txHash: this.depositTxHash() };
        }
        
        this.mockData.requestDeposit(amount, currency, method, details);
        this.depositSuccess.set(true);
        this.isSubmittingDeposit.set(false);
      }, 1500);
    }
  }

  isValidWithdrawal(): boolean {
    const amount = this.withdrawAmount();
    const cur = this.withdrawCurrency();
    return !!amount && amount > 0 && 
           amount <= (this.mockData.currentUser().balances[cur] || 0) &&
           this.bankName().length > 0 &&
           this.accountNumber().length > 0;
  }

  isValidTransfer(): boolean {
    const amount = this.transferAmount();
    const cur = this.transferCurrency();
    return !!amount && amount > 0 && 
           amount <= (this.mockData.currentUser().balances[cur] || 0) &&
           this.recipientId().length > 0;
  }

  submitWithdrawal() {
    if (this.isValidWithdrawal()) {
      this.isSubmittingWithdraw.set(true);
      setTimeout(() => {
        this.mockData.requestWithdrawal(this.withdrawAmount()!, this.withdrawCurrency(), {
          bankName: this.bankName(),
          accountNumber: this.accountNumber()
        });
        this.withdrawSuccess.set(true);
        this.isSubmittingWithdraw.set(false);
      }, 1500);
    }
  }

  submitTransfer() {
    if (this.isValidTransfer()) {
      this.isSubmittingTransfer.set(true);
      setTimeout(() => {
        this.mockData.transferFunds(this.recipientId(), this.transferAmount()!, this.transferCurrency());
        this.transferSuccess.set(true);
        this.isSubmittingTransfer.set(false);
      }, 1500);
    }
  }
}
