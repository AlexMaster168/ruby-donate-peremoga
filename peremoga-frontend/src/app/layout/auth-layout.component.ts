import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, TranslatePipe],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-blue-600">{{ 'APP.NAME' | translate }}</h1>
          <p class="mt-2 text-sm text-gray-600">{{ 'APP.TAGLINE' | translate }}</p>
        </div>
        <router-outlet />
      </div>
    </div>
  `
})
export class AuthLayoutComponent {}
