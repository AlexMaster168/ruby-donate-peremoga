import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  template: `
    <nav class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center space-x-2">
              <span class="text-2xl font-bold text-blue-600">{{ 'APP.NAME' | translate }}</span>
            </a>

            <div class="hidden md:flex md:ml-10 md:space-x-8">
              <a routerLink="/tickets" routerLinkActive="border-blue-500 text-gray-900"
                 class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                {{ 'NAV.TICKETS' | translate }}
              </a>
              <a routerLink="/fundraisers" routerLinkActive="border-blue-500 text-gray-900"
                 class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                {{ 'NAV.FUNDRAISERS' | translate }}
              </a>
              <a routerLink="/news" routerLinkActive="border-blue-500 text-gray-900"
                 class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                {{ 'NAV.NEWS' | translate }}
              </a>
              @if (auth.isAdmin() || auth.isModerator()) {
                <a routerLink="/dashboard" routerLinkActive="border-blue-500 text-gray-900"
                   class="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                  {{ 'NAV.DASHBOARD' | translate }}
                </a>
              }
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <button (click)="toggleLang()" class="text-sm text-gray-500 hover:text-gray-700 px-2 py-1 rounded border border-gray-200">
              {{ currentLang() === 'uk' ? 'EN' : 'UA' }}
            </button>

            @if (auth.isAuthenticated()) {
              <a routerLink="/my-items" class="text-sm text-gray-700 hover:text-gray-900">
                {{ 'NAV.MY_ITEMS' | translate }}
              </a>
              <a routerLink="/profile" class="text-sm text-gray-700 hover:text-gray-900">
                {{ auth.user()?.email }}
              </a>
              <button (click)="logout()"
                      class="text-sm text-red-600 hover:text-red-800">
                {{ 'NAV.LOGOUT' | translate }}
              </button>
            } @else {
              <a routerLink="/login" class="text-sm text-blue-600 hover:text-blue-800">
                {{ 'NAV.LOGIN' | translate }}
              </a>
              <a routerLink="/register"
                 class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                {{ 'NAV.REGISTER' | translate }}
              </a>
            }

            <button (click)="mobileMenuOpen.set(!mobileMenuOpen())" class="md:hidden text-gray-500">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      @if (mobileMenuOpen()) {
        <div class="md:hidden border-t border-gray-200">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <a routerLink="/tickets" class="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">
              {{ 'NAV.TICKETS' | translate }}
            </a>
            <a routerLink="/fundraisers" class="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">
              {{ 'NAV.FUNDRAISERS' | translate }}
            </a>
            <a routerLink="/news" class="block px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">
              {{ 'NAV.NEWS' | translate }}
            </a>
          </div>
        </div>
      }
    </nav>
  `
})
export class NavbarComponent {
  mobileMenuOpen = signal(false);
  currentLang = signal('uk');

  constructor(public auth: AuthService, private translate: TranslateService) {
    this.currentLang.set(this.translate.currentLang() || 'uk');
  }

  toggleLang() {
    const newLang = this.currentLang() === 'uk' ? 'en' : 'uk';
    this.currentLang.set(newLang);
    this.translate.use(newLang);
    localStorage.setItem('lang', newLang);
  }

  logout() {
    this.auth.logout().subscribe();
  }
}
