import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../core/api/api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { NewsItem } from '../../../types';

@Component({
  selector: 'app-news-detail',
  standalone: true,
  imports: [RouterLink, TranslatePipe, DatePipe],
  template: `
    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      @if (loading()) {
        <div class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      } @else if (newsItem()) {
        <div class="mb-6">
          <a routerLink="/news" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
            {{ 'COMMON.BACK' | translate }}
          </a>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-8">
          <div class="flex items-center justify-between mb-4">
            <span [class]="newsItem().kind === 'news' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'"
                  class="px-4 py-1 rounded-full text-sm font-medium">
              {{ newsItem().kind === 'news' ? ('NEWS.NEWS' | translate) : ('NEWS.EVENT' | translate) }}
            </span>
            <span class="text-sm text-gray-500">{{ newsItem().created_at | date:'medium' }}</span>
          </div>

          <h1 class="text-3xl font-bold mb-4">{{ newsItem().title }}</h1>

          @if (newsItem().image_url) {
            <img [src]="newsItem().image_url" alt="{{ newsItem().title }}" class="w-full max-h-96 object-cover rounded-lg mb-6">
          }

          <p class="text-gray-600 mb-6">{{ newsItem().author?.organization_name || newsItem().author?.email }}</p>

          <p class="text-gray-700 leading-relaxed">{{ newsItem().description }}</p>

          @if (canEdit()) {
            <div class="mt-8 flex space-x-4">
              <a [routerLink]="['/news', newsItem().id, 'edit']"
                 class="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition">
                {{ 'COMMON.EDIT' | translate }}
              </a>
              <button (click)="deleteNews()"
                      class="bg-red-100 text-red-700 px-6 py-3 rounded-lg font-medium hover:bg-red-200 transition">
                {{ 'COMMON.DELETE' | translate }}
              </button>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class NewsDetailComponent implements OnInit {
  newsItem = signal<NewsItem | null>(null);
  loading = signal(true);

  private newsId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.newsId = this.route.snapshot.paramMap.get('id') || '';
    this.loadNews();
  }

  loadNews() {
    this.api.getNewsItem(this.newsId).subscribe({
      next: (res) => {
        this.newsItem.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/news']);
      }
    });
  }

  canEdit() {
    const user = this.auth.user();
    const item = this.newsItem();
    if (!user || !item) return false;
    return user.id === item.author_id || user.role === 'admin' || user.role === 'moderator';
  }

  deleteNews() {
    if (!confirm('Are you sure?')) return;
    this.api.deleteNews(this.newsId).subscribe({
      next: () => this.router.navigate(['/news'])
    });
  }
}
