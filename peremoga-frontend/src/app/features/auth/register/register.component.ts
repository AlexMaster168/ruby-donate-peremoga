import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslatePipe],
  template: `
    <div class="bg-white rounded-xl shadow-lg p-8">
      <h2 class="text-2xl font-bold text-center mb-6">{{ 'AUTH.REGISTER_TITLE' | translate }}</h2>

      @if (error()) {
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 whitespace-pre-line">{{ error() }}</div>
      }

      <form (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'AUTH.EMAIL' | translate }}</label>
          <input type="email" [(ngModel)]="form.email" name="email" required
                 class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'AUTH.PASSWORD' | translate }}</label>
          <input type="password" [(ngModel)]="form.password" name="password" required
                 class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'AUTH.PASSWORD_CONFIRM' | translate }}</label>
          <input type="password" [(ngModel)]="form.password_confirmation" name="password_confirmation" required
                 class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'AUTH.ROLE' | translate }}</label>
          <select [(ngModel)]="form.role" name="role"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
            <option value="individual">{{ 'AUTH.ROLE_INDIVIDUAL' | translate }}</option>
            <option value="organization">{{ 'AUTH.ROLE_ORGANIZATION' | translate }}</option>
          </select>
        </div>

        @if (form.role === 'individual') {
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

        @if (form.role === 'organization') {
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'AUTH.ORG_NAME' | translate }}</label>
            <input type="text" [(ngModel)]="form.organization_name" name="organization_name"
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
          </div>
        }

        <button type="submit" [disabled]="loading()"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
          {{ loading() ? ('COMMON.LOADING' | translate) : ('AUTH.REGISTER_BUTTON' | translate) }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600">
        {{ 'AUTH.HAS_ACCOUNT' | translate }}
        <a routerLink="/login" class="text-blue-600 hover:text-blue-800 font-medium">
          {{ 'NAV.LOGIN' | translate }}
        </a>
      </p>
    </div>
  `
})
export class RegisterComponent {
  form = {
    email: '',
    password: '',
    password_confirmation: '',
    role: 'individual' as 'individual' | 'organization',
    first_name: '',
    last_name: '',
    organization_name: ''
  };

  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading.set(true);
    this.error.set(null);

    if (!this.form.email.trim()) {
      this.loading.set(false);
      this.error.set('Email is required');
      return;
    }
    if (!this.form.password) {
      this.loading.set(false);
      this.error.set('Password is required');
      return;
    }
    if (this.form.password.length < 6) {
      this.loading.set(false);
      this.error.set('Password must be at least 6 characters');
      return;
    }
    if (this.form.password !== this.form.password_confirmation) {
      this.loading.set(false);
      this.error.set('Passwords do not match');
      return;
    }
    if (this.form.role === 'individual' && (!this.form.first_name?.trim() || !this.form.last_name?.trim())) {
      this.loading.set(false);
      this.error.set('First name and last name are required for individual accounts');
      return;
    }
    if (this.form.role === 'organization' && !this.form.organization_name?.trim()) {
      this.loading.set(false);
      this.error.set('Organization name is required');
      return;
    }

    this.auth.register(this.form).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Registration failed');
      }
    });
  }
}
