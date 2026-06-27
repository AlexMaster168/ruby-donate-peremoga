import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <footer class="bg-gray-800 text-white mt-auto">
      <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 class="text-lg font-semibold mb-4">{{ 'APP.NAME' | translate }}</h3>
            <p class="text-gray-400 text-sm">{{ 'APP.TAGLINE' | translate }}</p>
          </div>
          <div>
            <h4 class="text-sm font-semibold uppercase tracking-wider mb-4">{{ 'FOOTER.ABOUT' | translate }}</h4>
            <p class="text-gray-400 text-sm">{{ 'FOOTER.RIGHTS' | translate }} &copy; 2026</p>
          </div>
          <div>
            <h4 class="text-sm font-semibold uppercase tracking-wider mb-4">{{ 'FOOTER.CONTACT' | translate }}</h4>
            <p class="text-gray-400 text-sm">peremoga&#64;example.com</p>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
