import { Component, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { ApiService } from '../../../core/api/api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Fundraiser } from '../../../types';

@Component({
  selector: 'app-fundraiser-list',
  standalone: true,
  imports: [RouterLink, FormsModule, TranslatePipe, DecimalPipe, DatePipe],
  template: `
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 class="text-2xl font-bold">{{ 'FUNDRAISERS.TITLE' | translate }}</h1>
        @if (auth.isOrganization() || auth.isAdmin()) {
          <a routerLink="/fundraisers/new"
             class="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            {{ 'FUNDRAISERS.CREATE' | translate }}
          </a>
        }
      </div>

      <div class="flex gap-4 mb-6">
        <button (click)="filterCurrency = ''; loadFundraisers()"
                [class]="filterCurrency === '' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'"
                class="px-4 py-2 rounded-lg border border-gray-300 font-medium">
          {{ 'TICKETS.ALL' | translate }}
        </button>
        <button (click)="filterCurrency = 'UAH'; loadFundraisers()"
                [class]="filterCurrency === 'UAH' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'"
                class="px-4 py-2 rounded-lg border border-gray-300 font-medium">
          UAH
        </button>
        <button (click)="filterCurrency = 'USD'; loadFundraisers()"
                [class]="filterCurrency === 'USD' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'"
                class="px-4 py-2 rounded-lg border border-gray-300 font-medium">
          USD
        </button>
      </div>

      @if (loading()) {
        <div class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      } @else if (fundraisers().length === 0) {
        <div class="text-center py-12 bg-white rounded-xl shadow-sm">
          <p class="text-gray-500 text-lg">{{ 'FUNDRAISERS.NO_FUNDRAISERS' | translate }}</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (fund of fundraisers(); track fund.id) {
            <a [routerLink]="['/fundraisers', fund.id]"
               class="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6">
              @if (fund.image_url) {
                <img [src]="fund.image_url" alt="" class="w-full h-40 object-cover rounded-lg mb-3">
              }
              <div class="flex items-center justify-between mb-3">
                <span class="px-3 py-1 rounded-full text-sm font-medium"
                      [class]="fund.currency === 'UAH' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'">
                  {{ fund.currency }}
                </span>
                <span class="text-sm text-gray-500">{{ fund.created_at | date:'shortDate' }}</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">{{ fund.title }}</h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ fund.description }}</p>

              <div class="mb-2">
                <div class="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{{ 'FUNDRAISERS.RAISED' | translate }}: {{ fund.raised | number:'1.0-0' }}</span>
                  <span>{{ 'FUNDRAISERS.GOAL' | translate }}: {{ fund.total | number:'1.0-0' }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div class="bg-blue-600 h-2 rounded-full transition-all"
                       [style.width.%]="getPercentage(fund)"></div>
                </div>
              </div>
              <p class="text-sm text-gray-500">{{ getPercentage(fund) | number:'1.0-0' }}%</p>
            </a>
          }
        </div>
      }
    </div>
  `
})
export class FundraiserListComponent implements OnInit {
  fundraisers = signal<Fundraiser[]>([]);
  loading = signal(false);
  filterCurrency = '';

  constructor(
    private api: ApiService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loadFundraisers();
  }

  loadFundraisers() {
    this.loading.set(true);
    const params: Record<string, string> = {};
    if (this.filterCurrency) params['currency'] = this.filterCurrency;

    this.api.getFundraisers(params).subscribe({
      next: (res) => {
        this.fundraisers.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getPercentage(fund: Fundraiser): number {
    if (!fund.total || fund.total === 0) return 0;
    return Math.min(100, (fund.raised / fund.total) * 100);
  }
}
