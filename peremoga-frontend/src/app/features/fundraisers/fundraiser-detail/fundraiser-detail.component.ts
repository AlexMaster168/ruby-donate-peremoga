import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { ApiService } from '../../../core/api/api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Fundraiser } from '../../../types';

@Component({
  selector: 'app-fundraiser-detail',
  standalone: true,
  imports: [RouterLink, TranslatePipe, DecimalPipe, DatePipe],
  template: `
    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      @if (loading()) {
        <div class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      } @else if (fundraiser()) {
        <div class="mb-6">
          <a routerLink="/fundraisers" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
            {{ 'COMMON.BACK' | translate }}
          </a>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-8">
          <div class="flex items-center justify-between mb-4">
            <span class="px-4 py-1 rounded-full text-sm font-medium"
                  [class]="fundraiser().currency === 'UAH' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'">
              {{ fundraiser().currency }}
            </span>
            <span class="text-sm text-gray-500">{{ fundraiser().created_at | date:'medium' }}</span>
          </div>

          <h1 class="text-3xl font-bold mb-4">{{ fundraiser().title }}</h1>

          @if (fundraiser().image_url) {
            <img [src]="fundraiser().image_url" alt="{{ fundraiser().title }}" class="w-full max-h-96 object-cover rounded-lg mb-6">
          }

          <p class="text-gray-600 mb-6">{{ fundraiser().author?.organization_name || fundraiser().author?.email }}</p>

          <div class="mb-8">
            <div class="flex justify-between text-lg mb-2">
              <span class="font-semibold text-green-600">{{ fundraiser().raised | number:'1.0-0' }} {{ fundraiser().currency }}</span>
              <span class="text-gray-500">{{ 'FUNDRAISERS.GOAL' | translate }}: {{ fundraiser().total | number:'1.0-0' }} {{ fundraiser().currency }}</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-4">
              <div class="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                   [style.width.%]="getPercentage()"></div>
            </div>
            <p class="text-center mt-2 text-gray-600">{{ getPercentage() | number:'1.0-0' }}% {{ 'FUNDRAISERS.PROGRESS' | translate }}</p>
          </div>

          <p class="text-gray-700 leading-relaxed mb-8">{{ fundraiser().description }}</p>

          @if (canEdit()) {
            <div class="flex space-x-4">
              <a [routerLink]="['/fundraisers', fundraiser().id, 'edit']"
                 class="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition">
                {{ 'COMMON.EDIT' | translate }}
              </a>
              <button (click)="deleteFundraiser()"
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
export class FundraiserDetailComponent implements OnInit {
  fundraiser = signal<Fundraiser | null>(null);
  loading = signal(true);

  private fundraiserId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.fundraiserId = this.route.snapshot.paramMap.get('id') || '';
    this.loadFundraiser();
  }

  loadFundraiser() {
    this.api.getFundraiser(this.fundraiserId).subscribe({
      next: (res) => {
        this.fundraiser.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/fundraisers']);
      }
    });
  }

  getPercentage(): number {
    const f = this.fundraiser();
    if (!f || !f.total || f.total === 0) return 0;
    return Math.min(100, (f.raised / f.total) * 100);
  }

  canEdit() {
    const user = this.auth.user();
    const f = this.fundraiser();
    if (!user || !f) return false;
    return user.id === f.author_id || user.role === 'admin' || user.role === 'moderator';
  }

  deleteFundraiser() {
    if (!confirm('Are you sure?')) return;
    this.api.deleteFundraiser(this.fundraiserId).subscribe({
      next: () => this.router.navigate(['/fundraisers'])
    });
  }
}
