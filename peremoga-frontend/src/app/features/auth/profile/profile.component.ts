import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  template: `
    <div class="max-w-2xl mx-auto py-8 px-4">
      <h1 class="text-2xl font-bold mb-6">{{ 'NAV.PROFILE' | translate }}</h1>

      @if (success()) {
        <div class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {{ 'COMMON.SUCCESS' | translate }}
        </div>
      }

      @if (error()) {
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 whitespace-pre-line">{{ error() }}</div>
      }

      <div class="bg-white rounded-xl shadow-lg p-6">
        <form (ngSubmit)="onSubmit()" class="space-y-4">
          @if (auth.user()?.role === 'individual') {
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'AUTH.FIRST_NAME' | translate }}</label>
                <input type="text" [(ngModel)]="form.first_name" name="first_name"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'AUTH.LAST_NAME' | translate }}</label>
                <input type="text" [(ngModel)]="form.last_name" name="last_name"
                       class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
              </div>
            </div>
          }

          @if (auth.user()?.role === 'organization') {
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'AUTH.ORG_NAME' | translate }}</label>
              <input type="text" [(ngModel)]="form.organization_name" name="organization_name"
                     class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            </div>
          }

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'AUTH.EMAIL' | translate }}</label>
            <input type="email" [value]="auth.user()?.email" disabled
                   class="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea [(ngModel)]="form.biography" name="biography" rows="3"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'TICKETS.LOCATION' | translate }}</label>
            <input type="text" [(ngModel)]="form.location" name="location"
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
          </div>

          <button type="submit" [disabled]="loading()"
                  class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
            {{ loading() ? ('COMMON.LOADING' | translate) : ('COMMON.SAVE' | translate) }}
          </button>
        </form>
      </div>
    </div>
  `
})
export class ProfileComponent {
  form = {
    first_name: '',
    last_name: '',
    organization_name: '',
    biography: '',
    location: ''
  };

  loading = signal(false);
  error = signal<string | null>(null);
  success = signal(false);

  constructor(public auth: AuthService) {
    const user = auth.user();
    if (user) {
      this.form = {
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        organization_name: user.organization_name ?? '',
        biography: user.biography ?? '',
        location: user.location ?? ''
      };
    }
  }

  onSubmit() {
    this.loading.set(true);
    this.error.set(null);
    this.success.set(false);

    this.auth.updateProfile(this.form)!.subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Update failed');
      }
    });
  }
}
