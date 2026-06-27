import { Component, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../core/api/api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { NewsItem } from '../../../types';

@Component({
  selector: 'app-news-list',
  standalone: true,
  imports: [RouterLink, TranslatePipe, DatePipe],
  template: `
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 class="text-2xl font-bold">{{ 'NEWS.TITLE' | translate }}</h1>
        @if (auth.isOrganization() || auth.isAdmin()) {
          <a routerLink="/news/new"
             class="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            {{ 'NEWS.CREATE' | translate }}
          </a>
        }
      </div>

      <div class="flex gap-4 mb-6">
        <button (click)="filterKind = ''; loadNews()"
                [class]="filterKind === '' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'"
                class="px-4 py-2 rounded-lg border border-gray-300 font-medium">
          {{ 'NEWS.ALL' | translate }}
        </button>
        <button (click)="filterKind = 'news'; loadNews()"
                [class]="filterKind === 'news' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'"
                class="px-4 py-2 rounded-lg border border-gray-300 font-medium">
          {{ 'NEWS.NEWS' | translate }}
        </button>
        <button (click)="filterKind = 'event'; loadNews()"
                [class]="filterKind === 'event' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'"
                class="px-4 py-2 rounded-lg border border-gray-300 font-medium">
          {{ 'NEWS.EVENT' | translate }}
        </button>
      </div>

      @if (loading()) {
        <div class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      } @else if (news().length === 0) {
        <div class="text-center py-12 bg-white rounded-xl shadow-sm">
          <p class="text-gray-500 text-lg">{{ 'NEWS.NO_NEWS' | translate }}</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (item of news(); track item.id) {
            <a [routerLink]="['/news', item.id]"
               class="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6">
              @if (item.image_url) {
                <img [src]="item.image_url" alt="" class="w-full h-40 object-cover rounded-lg mb-3">
              }
              <div class="flex items-center justify-between mb-3">
                <span [class]="item.kind === 'news' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'"
                      class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ item.kind === 'news' ? ('NEWS.NEWS' | translate) : ('NEWS.EVENT' | translate) }}
                </span>
                <span class="text-sm text-gray-500">{{ item.created_at | date:'shortDate' }}</span>
              </div>
              <h3 class="text-lg font-semibold mb-2 line-clamp-2">{{ item.title }}</h3>
              <p class="text-gray-600 text-sm line-clamp-3">{{ item.description }}</p>
            </a>
          }
        </div>
      }
    </div>
  `
})
export class NewsListComponent implements OnInit {
  news = signal<NewsItem[]>([]);
  loading = signal(false);
  filterKind = '';

  constructor(
    private api: ApiService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loadNews();
  }

  loadNews() {
    this.loading.set(true);
    const params: Record<string, string> = {};
    if (this.filterKind) params['kind'] = this.filterKind;

    this.api.getNews(params).subscribe({
      next: (res) => {
        this.news.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }
}
