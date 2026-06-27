import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslatePipe],
  template: `
    <div class="bg-white rounded-xl shadow-lg p-8">
      <h2 class="text-2xl font-bold text-center mb-6">{{ 'AUTH.LOGIN_TITLE' | translate }}</h2>

      @if (error()) {
        <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 whitespace-pre-line">{{ error() }}</div>
      }

      <form (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'AUTH.EMAIL' | translate }}</label>
          <input type="email" [(ngModel)]="email" name="email" required
                 class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'AUTH.PASSWORD' | translate }}</label>
          <input type="password" [(ngModel)]="password" name="password" required
                 class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
        </div>

        <button type="submit" [disabled]="loading()"
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
          {{ loading() ? ('COMMON.LOADING' | translate) : ('AUTH.LOGIN_BUTTON' | translate) }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-gray-600">
        {{ 'AUTH.NO_ACCOUNT' | translate }}
        <a routerLink="/register" class="text-blue-600 hover:text-blue-800 font-medium">
          {{ 'NAV.REGISTER' | translate }}
        </a>
      </p>
    </div>
  `
})
export class LoginComponent {
  email = '';
  password = '';
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading.set(true);
    this.error.set(null);

    this.auth.login(this.email, this.password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Login failed');
      }
    });
  }
}
