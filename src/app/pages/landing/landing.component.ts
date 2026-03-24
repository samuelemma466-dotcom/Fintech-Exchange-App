import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  template: `
    <div class="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <!-- Header -->
      <header class="flex items-center justify-between px-8 py-6 bg-white shadow-sm">
        <div class="flex items-center gap-2">
          <mat-icon class="text-indigo-600">account_balance_wallet</mat-icon>
          <span class="text-xl font-bold tracking-tight">FinExchange</span>
        </div>
        <nav class="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          <a href="#services" class="hover:text-indigo-600 transition-colors">Services</a>
          <a href="#rates" class="hover:text-indigo-600 transition-colors">Live Rates</a>
          <a href="#about" class="hover:text-indigo-600 transition-colors">About</a>
        </nav>
        <div class="flex items-center gap-4">
          <a routerLink="/login" class="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">Log in</a>
          <a routerLink="/login" class="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm">Get Started</a>
        </div>
      </header>

      <!-- Hero Section -->
      <main>
        <section class="px-8 py-24 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div class="space-y-8">
            <h1 class="text-5xl md:text-6xl font-bold tracking-tight leading-tight text-slate-900">
              The smartest way to <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">exchange assets</span>
            </h1>
            <p class="text-lg text-slate-600 max-w-lg leading-relaxed">
              Trade fiat, cryptocurrencies, and gift cards instantly with the best rates in the market. Secure, fast, and reliable.
            </p>
            <div class="flex gap-4">
              <a routerLink="/login" class="bg-indigo-600 text-white px-8 py-4 rounded-xl text-base font-medium hover:bg-indigo-700 transition-colors shadow-md flex items-center gap-2">
                Start Trading <mat-icon>arrow_forward</mat-icon>
              </a>
              <a href="#rates" class="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl text-base font-medium hover:bg-slate-50 transition-colors">
                View Rates
              </a>
            </div>
          </div>
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-violet-100 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
            <img src="https://picsum.photos/seed/fintech/800/600" alt="Dashboard Preview" class="rounded-3xl shadow-2xl border border-white/20" referrerpolicy="no-referrer" />
          </div>
        </section>

        <!-- Services -->
        <section id="services" class="bg-white py-24">
          <div class="max-w-7xl mx-auto px-8">
            <div class="text-center max-w-2xl mx-auto mb-16">
              <h2 class="text-3xl font-bold tracking-tight mb-4">Everything you need in one place</h2>
              <p class="text-slate-600">We provide a comprehensive suite of financial services to help you manage your assets seamlessly.</p>
            </div>
            <div class="grid md:grid-cols-3 gap-8">
              <!-- Service 1 -->
              <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                <div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <mat-icon>currency_exchange</mat-icon>
                </div>
                <h3 class="text-xl font-semibold mb-3">Fiat Exchange</h3>
                <p class="text-slate-600 text-sm leading-relaxed">Exchange USD, EUR, GBP to NGN instantly at the best market rates with zero hidden fees.</p>
              </div>
              <!-- Service 2 -->
              <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                <div class="w-12 h-12 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center mb-6">
                  <mat-icon>currency_bitcoin</mat-icon>
                </div>
                <h3 class="text-xl font-semibold mb-3">Crypto Trading</h3>
                <p class="text-slate-600 text-sm leading-relaxed">Buy and sell BTC, ETH, USDT securely. Your funds are protected by industry-leading security.</p>
              </div>
              <!-- Service 3 -->
              <div class="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                <div class="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                  <mat-icon>card_giftcard</mat-icon>
                </div>
                <h3 class="text-xl font-semibold mb-3">Gift Cards</h3>
                <p class="text-slate-600 text-sm leading-relaxed">Trade Amazon, iTunes, Steam, and other popular gift cards for instant cash in your wallet.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  `
})
export class LandingComponent {}
