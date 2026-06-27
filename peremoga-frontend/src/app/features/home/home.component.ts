import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    <div class="bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <div class="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">{{ 'APP.NAME' | translate }}</h1>
        <p class="text-xl md:text-2xl mb-8 text-blue-100">{{ 'APP.TAGLINE' | translate }}</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/tickets"
             class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition">
            {{ 'NAV.TICKETS' | translate }}
          </a>
          <a routerLink="/fundraisers"
             class="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition">
            {{ 'NAV.FUNDRAISERS' | translate }}
          </a>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="text-center p-6">
          <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">&#x1F91D;</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">Volunteer</h3>
          <p class="text-gray-600">Offer your skills and time to help those in need</p>
        </div>
        <div class="text-center p-6">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">&#x1F4B0;</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">Donate</h3>
          <p class="text-gray-600">Support fundraising campaigns for important causes</p>
        </div>
        <div class="text-center p-6">
          <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">&#x1F4E2;</span>
          </div>
          <h3 class="text-xl font-semibold mb-2">Spread the Word</h3>
          <p class="text-gray-600">Share news and events with the community</p>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {}
