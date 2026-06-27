import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../../core/api/api.service';

interface FundraiserForm {
  title: string;
  description: string;
  currency: 'UAH' | 'USD';
  total: number;
}

@Component({
  selector: 'app-fundraiser-form',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslatePipe],
  template: `
    <div class="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <a routerLink="/fundraisers" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
          {{ 'COMMON.BACK' | translate }}
        </a>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-8">
        <h1 class="text-2xl font-bold mb-6">
          {{ isEdit() ? ('COMMON.EDIT' | translate) : ('FUNDRAISERS.CREATE' | translate) }}
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
            <textarea [(ngModel)]="form.description" name="description" rows="4" required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select [(ngModel)]="form.currency" name="currency"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                <option value="UAH">UAH</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'FUNDRAISERS.GOAL' | translate }}</label>
              <input type="number" [(ngModel)]="form.total" name="total" required min="1"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            </div>
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
            <a routerLink="/fundraisers"
               class="flex-1 text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition">
              {{ 'COMMON.CANCEL' | translate }}
            </a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class FundraiserFormComponent implements OnInit {
  form: FundraiserForm = {
    title: '',
    description: '',
    currency: 'UAH',
    total: 0
  };

  selectedFile: File | null = null;
  loading = signal(false);
  error = signal<string | null>(null);
  isEdit = signal(false);

  private fundraiserId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.fundraiserId = this.route.snapshot.paramMap.get('id');
    this.isEdit.set(!!this.fundraiserId);

    if (this.fundraiserId) {
      this.loadFundraiser();
    }
  }

  loadFundraiser() {
    if (!this.fundraiserId) return;
    this.api.getFundraiser(this.fundraiserId).subscribe({
      next: (res) => {
        const fund = res.data;
        this.form = {
          title: fund.title,
          description: fund.description ?? '',
          currency: fund.currency,
          total: fund.total
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
    if (!this.form.total || this.form.total <= 0) {
      this.loading.set(false);
      this.error.set('Goal must be greater than 0');
      return;
    }

    let request;
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('fundraiser[title]', this.form.title);
      formData.append('fundraiser[description]', this.form.description);
      formData.append('fundraiser[currency]', this.form.currency);
      formData.append('fundraiser[total]', this.form.total.toString());
      formData.append('fundraiser[image_file]', this.selectedFile);

      request = this.isEdit()
        ? this.api.updateFundraiserWithImage(this.fundraiserId!, formData)
        : this.api.createFundraiserWithImage(formData);
    } else {
      request = this.isEdit()
        ? this.api.updateFundraiser(this.fundraiserId!, this.form)
        : this.api.createFundraiser(this.form);
    }

    request.subscribe({
      next: (res) => {
        this.router.navigate(['/fundraisers', res.data.id]);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Failed to save fundraiser');
      }
    });
  }
}
