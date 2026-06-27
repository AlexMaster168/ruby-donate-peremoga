import { Component, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../../core/api/api.service';
import { Ticket, Fundraiser, NewsItem } from '../../../types';

@Component({
  selector: 'app-admin-items',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">{{ 'ADMIN.MANAGE_CONTENT' | translate }}</h1>
        <a routerLink="/dashboard" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
          {{ 'COMMON.BACK' | translate }}
        </a>
      </div>

      <div class="space-y-8">
        <!-- Tickets -->
        <div>
          <h2 class="text-lg font-semibold mb-4">{{ 'TICKETS.TITLE' | translate }} ({{ tickets().length }})</h2>
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                @for (t of tickets(); track t.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm">
                      <a [routerLink]="['/tickets', t.id]" class="text-blue-600 hover:underline">{{ t.title }}</a>
                    </td>
                    <td class="px-4 py-3">
                      <span [class]="t.ticket_type === 'offer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'"
                            class="px-2 py-1 rounded-full text-xs font-medium">{{ t.ticket_type }}</span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-600">{{ t.author?.email }}</td>
                    <td class="px-4 py-3">
                      <button (click)="deleteTicket(t.id)" class="text-red-600 hover:text-red-800 text-xs">Delete</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Fundraisers -->
        <div>
          <h2 class="text-lg font-semibold mb-4">{{ 'FUNDRAISERS.TITLE' | translate }} ({{ fundraisers().length }})</h2>
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Goal</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                @for (f of fundraisers(); track f.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm">
                      <a [routerLink]="['/fundraisers', f.id]" class="text-blue-600 hover:underline">{{ f.title }}</a>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-600">{{ f.total }} {{ f.currency }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600">{{ f.author?.email }}</td>
                    <td class="px-4 py-3">
                      <button (click)="deleteFundraiser(f.id)" class="text-red-600 hover:text-red-800 text-xs">Delete</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- News -->
        <div>
          <h2 class="text-lg font-semibold mb-4">{{ 'NEWS.TITLE' | translate }} ({{ news().length }})</h2>
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kind</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                @for (n of news(); track n.id) {
                  <tr class="hover:bg-gray-50">
                    <td class="px-4 py-3 text-sm">
                      <a [routerLink]="['/news', n.id]" class="text-blue-600 hover:underline">{{ n.title }}</a>
                    </td>
                    <td class="px-4 py-3">
                      <span [class]="n.kind === 'news' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'"
                            class="px-2 py-1 rounded-full text-xs font-medium">{{ n.kind }}</span>
                    </td>
                    <td class="px-4 py-3 text-sm text-gray-600">{{ n.author?.email }}</td>
                    <td class="px-4 py-3">
                      <button (click)="deleteNews(n.id)" class="text-red-600 hover:text-red-800 text-xs">Delete</button>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminItemsComponent implements OnInit {
  tickets = signal<Ticket[]>([]);
  fundraisers = signal<Fundraiser[]>([]);
  news = signal<NewsItem[]>([]);

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getTickets().subscribe({ next: (res) => this.tickets.set(res.data) });
    this.api.getFundraisers().subscribe({ next: (res) => this.fundraisers.set(res.data) });
    this.api.getNews().subscribe({ next: (res) => this.news.set(res.data) });
  }

  deleteTicket(id: string) {
    if (!confirm('Delete this ticket?')) return;
    this.api.deleteTicket(id).subscribe({ next: () => this.tickets.update(t => t.filter(x => x.id !== id)) });
  }

  deleteFundraiser(id: string) {
    if (!confirm('Delete this fundraiser?')) return;
    this.api.deleteFundraiser(id).subscribe({ next: () => this.fundraisers.update(f => f.filter(x => x.id !== id)) });
  }

  deleteNews(id: string) {
    if (!confirm('Delete this news item?')) return;
    this.api.deleteNews(id).subscribe({ next: () => this.news.update(n => n.filter(x => x.id !== id)) });
  }
}
