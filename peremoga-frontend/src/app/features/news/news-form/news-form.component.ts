import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../../core/api/api.service';

interface NewsForm {
  title: string;
  description: string;
  kind: 'news' | 'event';
}

@Component({
  selector: 'app-news-form',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslatePipe],
  template: `
    <div class="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <a routerLink="/news" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
          {{ 'COMMON.BACK' | translate }}
        </a>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-8">
        <h1 class="text-2xl font-bold mb-6">
          {{ isEdit() ? ('COMMON.EDIT' | translate) : ('NEWS.CREATE' | translate) }}
        </h1>

        @if (error()) {
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 whitespace-pre-line">{{ error() }}</div>
        }

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" [(ngModel)]="form.title" name="title" required
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea [(ngModel)]="form.description" name="description" rows="6" required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select [(ngModel)]="form.kind" name="kind"
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
              <option value="news">{{ 'NEWS.NEWS' | translate }}</option>
              <option value="event">{{ 'NEWS.EVENT' | translate }}</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'COMMON.IMAGE' | translate }}</label>
            <input type="file" accept="image/*" (change)="onFileSelected($event)"
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
          </div>

          <div class="flex space-x-4">
            <button type="submit" [disabled]="loading()"
                    class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition">
              {{ loading() ? ('COMMON.LOADING' | translate) : ('COMMON.SAVE' | translate) }}
            </button>
            <a routerLink="/news"
               class="flex-1 text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition">
              {{ 'COMMON.CANCEL' | translate }}
            </a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class NewsFormComponent implements OnInit {
  form: NewsForm = {
    title: '',
    description: '',
    kind: 'news'
  };

  selectedFile: File | null = null;
  loading = signal(false);
  error = signal<string | null>(null);
  isEdit = signal(false);

  private newsId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.newsId = this.route.snapshot.paramMap.get('id');
    this.isEdit.set(!!this.newsId);

    if (this.newsId) {
      this.loadNews();
    }
  }

  loadNews() {
    if (!this.newsId) return;
    this.api.getNewsItem(this.newsId).subscribe({
      next: (res) => {
        const item = res.data;
        this.form = {
          title: item.title,
          description: item.description,
          kind: item.kind
        };
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    this.loading.set(true);
    this.error.set(null);

    if (!this.form.title.trim()) {
      this.loading.set(false);
      this.error.set('Title is required');
      return;
    }
    if (!this.form.description.trim()) {
      this.loading.set(false);
      this.error.set('Description is required');
      return;
    }

    let request;
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('news_item[title]', this.form.title);
      formData.append('news_item[description]', this.form.description);
      formData.append('news_item[kind]', this.form.kind);
      formData.append('news_item[image_file]', this.selectedFile);

      request = this.isEdit()
        ? this.api.updateNewsWithImage(this.newsId!, formData)
        : this.api.createNewsWithImage(formData);
    } else {
      request = this.isEdit()
        ? this.api.updateNews(this.newsId!, this.form)
        : this.api.createNews(this.form);
    }

    request.subscribe({
      next: (res) => {
        this.router.navigate(['/news', res.data.id]);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Failed to save news');
      }
    });
  }
}
