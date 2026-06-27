import { Component, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../core/api/api.service';
import { AuthService } from '../../core/auth/auth.service';
import { StatsOverview } from '../../types';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, TranslatePipe, DecimalPipe],
  template: `
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">{{ 'DASHBOARD.TITLE' | translate }}</h1>
        <div class="flex gap-3">
          <a routerLink="/dashboard/content" class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
            {{ 'ADMIN.MANAGE_CONTENT' | translate }}
          </a>
          @if (auth.isAdmin()) {
            <a routerLink="/dashboard/users" class="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50">
              {{ 'ADMIN.MANAGE_USERS' | translate }}
            </a>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      } @else if (stats()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">{{ 'DASHBOARD.TOTAL_USERS' | translate }}</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats().users.total }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-2xl">&#x1F465;</span>
              </div>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
              <span>Individuals: {{ stats().users.individuals }}</span>
              <span>Organizations: {{ stats().users.organizations }}</span>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">{{ 'DASHBOARD.TOTAL_TICKETS' | translate }}</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats().tickets.total }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span class="text-2xl">&#x1F4CB;</span>
              </div>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
              <span>Offers: {{ stats().tickets.offers }}</span>
              <span>Requests: {{ stats().tickets.requests }}</span>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">{{ 'DASHBOARD.TOTAL_FUNDRAISERS' | translate }}</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats().fundraisers.total }}</p>
              </div>
              <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span class="text-2xl">&#x1F4B0;</span>
              </div>
            </div>
            <div class="mt-4 text-sm text-gray-600">
              <p>Raised UAH: {{ stats().fundraisers.total_raised_uah | number:'1.0-0' }}</p>
              <p>Raised USD: {{ stats().fundraisers.total_raised_usd | number:'1.0-0' }}</p>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">{{ 'DASHBOARD.TOTAL_NEWS' | translate }}</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats().news.total }}</p>
              </div>
              <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span class="text-2xl">&#x1F4F0;</span>
              </div>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
              <span>News: {{ stats().news.news }}</span>
              <span>Events: {{ stats().news.events }}</span>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">{{ 'DASHBOARD.TOTAL_COMMENTS' | translate }}</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats().comments.total }}</p>
              </div>
              <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <span class="text-2xl">&#x1F4AC;</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-sm p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-500">Moderators / Admins</p>
                <p class="text-3xl font-bold text-gray-900">{{ stats().users.moderators + stats().users.admins }}</p>
              </div>
              <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <span class="text-2xl">&#x1F6E1;&#xFE0F;</span>
              </div>
            </div>
            <div class="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
              <span>Moderators: {{ stats().users.moderators }}</span>
              <span>Admins: {{ stats().users.admins }}</span>
            </div>
          </div>
        </div>

        @if (stats().tickets.by_category) {
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold mb-4">Tickets by Category</h2>
            <div class="space-y-3">
              @for (entry of getCategoryEntries(); track entry[0]) {
                <div class="flex items-center">
                  <span class="w-32 text-sm text-gray-600">{{ entry[0] }}</span>
                  <div class="flex-1 mx-4">
                    <div class="w-full bg-gray-200 rounded-full h-4">
                      <div class="bg-blue-500 h-4 rounded-full"
                           [style.width.%]="getCategoryPercentage(entry[1])"></div>
                    </div>
                  </div>
                  <span class="text-sm font-medium text-gray-900 w-12 text-right">{{ entry[1] }}</span>
                </div>
              }
            </div>
          </div>
        }
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  stats = signal<StatsOverview | null>(null);
  loading = signal(true);

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.api.getStats().subscribe({
      next: (res) => {
        this.stats.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getCategoryEntries(): [string, number][] {
    const byCategory = this.stats()?.tickets?.by_category;
    if (!byCategory) return [];
    return Object.entries(byCategory) as [string, number][];
  }

  getCategoryPercentage(count: number): number {
    const total = this.stats()?.tickets?.total || 1;
    return (count / total) * 100;
  }
}
