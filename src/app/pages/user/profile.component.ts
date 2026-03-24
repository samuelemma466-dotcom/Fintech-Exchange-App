import { Component, inject } from '@angular/core';
import { MockDataService } from '../../core/mock-data.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatIconModule, FormsModule],
  template: `
    <div class="space-y-8 pb-20 md:pb-0 max-w-3xl mx-auto">
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">Profile & KYC</h1>
        <p class="text-base text-slate-500 mt-2">Complete your bank account registration to unlock all features.</p>
      </div>

      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div class="p-8">
          @if (mockData.currentUser().kycStatus === 'approved') {
            <div class="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex items-center gap-4 text-emerald-800">
              <mat-icon class="text-[32px] text-emerald-600">verified</mat-icon>
              <div>
                <h3 class="text-lg font-bold">KYC Approved</h3>
                <p class="text-sm mt-1">Your account is fully verified. You have access to all features.</p>
              </div>
            </div>
          } @else if (mockData.currentUser().kycStatus === 'pending') {
            <div class="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-center gap-4 text-amber-800">
              <mat-icon class="text-[32px] text-amber-600">pending_actions</mat-icon>
              <div>
                <h3 class="text-lg font-bold">KYC Pending</h3>
                <p class="text-sm mt-1">Your application is under review by our admin team.</p>
              </div>
            </div>
          } @else if (mockData.currentUser().kycStatus === 'rejected') {
            <div class="bg-red-50 border border-red-200 rounded-2xl p-6 flex items-center gap-4 text-red-800 mb-8">
              <mat-icon class="text-[32px] text-red-600">error</mat-icon>
              <div>
                <h3 class="text-lg font-bold">KYC Rejected</h3>
                <p class="text-sm mt-1">Please review your details and submit again.</p>
              </div>
            </div>
          }

          @if (mockData.currentUser().kycStatus === 'none' || mockData.currentUser().kycStatus === 'rejected') {
            <form (ngSubmit)="submitKyc()" class="space-y-8 mt-8">
              <!-- Personal Details -->
              <div>
                <h3 class="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Personal Details</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="fullName" class="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                    <input id="fullName" type="text" [(ngModel)]="kyc.fullName" name="fullName" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                  </div>
                  <div>
                    <label for="dob" class="block text-sm font-medium text-slate-700 mb-2">Date of Birth</label>
                    <input id="dob" type="date" [(ngModel)]="kyc.dob" name="dob" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                  </div>
                  <div>
                    <label for="phone" class="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                    <input id="phone" type="tel" [(ngModel)]="kyc.phone" name="phone" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                  </div>
                  <div>
                    <label for="email" class="block text-sm font-medium text-slate-700 mb-2">Email</label>
                    <input id="email" type="email" [(ngModel)]="kyc.email" name="email" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                  </div>
                  <div class="md:col-span-2">
                    <label for="address" class="block text-sm font-medium text-slate-700 mb-2">Address</label>
                    <input id="address" type="text" [(ngModel)]="kyc.address" name="address" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                  </div>
                  <div>
                    <label for="country" class="block text-sm font-medium text-slate-700 mb-2">Country</label>
                    <input id="country" type="text" [(ngModel)]="kyc.country" name="country" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                  </div>
                  <div>
                    <label for="idNumber" class="block text-sm font-medium text-slate-700 mb-2">Government ID Number</label>
                    <input id="idNumber" type="text" [(ngModel)]="kyc.idNumber" name="idNumber" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                  </div>
                </div>
              </div>

              <!-- Bank Details -->
              <div>
                <h3 class="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Bank Details</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label for="bankName" class="block text-sm font-medium text-slate-700 mb-2">Bank Name</label>
                    <input id="bankName" type="text" [(ngModel)]="kyc.bankName" name="bankName" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                  </div>
                  <div>
                    <label for="accountNumber" class="block text-sm font-medium text-slate-700 mb-2">Account Number</label>
                    <input id="accountNumber" type="text" [(ngModel)]="kyc.accountNumber" name="accountNumber" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                  </div>
                  <div class="md:col-span-2">
                    <label for="accountName" class="block text-sm font-medium text-slate-700 mb-2">Account Name</label>
                    <input id="accountName" type="text" [(ngModel)]="kyc.accountName" name="accountName" required class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all">
                  </div>
                </div>
              </div>

              <!-- Documents -->
              <div>
                <h3 class="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">Documents</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                    <mat-icon class="text-slate-400 text-[48px] mb-4">badge</mat-icon>
                    <p class="text-sm font-medium text-slate-900">Upload ID Document</p>
                    <p class="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                  <div class="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer">
                    <mat-icon class="text-slate-400 text-[48px] mb-4">face</mat-icon>
                    <p class="text-sm font-medium text-slate-900">Upload Selfie</p>
                    <p class="text-xs text-slate-500 mt-1">Clear photo of your face</p>
                  </div>
                </div>
              </div>

              <button type="submit" class="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm">
                Submit KYC Application
              </button>
            </form>
          }
        </div>
      </div>
    </div>
  `
})
export class UserProfileComponent {
  mockData = inject(MockDataService);

  kyc = {
    fullName: this.mockData.currentUser().name,
    dob: '',
    phone: '',
    email: this.mockData.currentUser().email,
    address: '',
    country: '',
    idNumber: '',
    bankName: '',
    accountNumber: '',
    accountName: ''
  };

  submitKyc() {
    this.mockData.submitKyc(this.kyc);
    alert('KYC Application Submitted Successfully!');
  }
}
