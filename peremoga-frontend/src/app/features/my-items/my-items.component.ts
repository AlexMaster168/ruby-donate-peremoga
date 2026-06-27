import { Component, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DecimalPipe } from '@angular/common';
import { ApiService } from '../../core/api/api.service';
import { AuthService } from '../../core/auth/auth.service';
import { Ticket, Fundraiser, NewsItem } from '../../types';

@Component({
  selector: 'app-my-items',
  standalone: true,
  imports: [RouterLink, TranslatePipe, DecimalPipe],
  template: `
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-bold mb-8">{{ 'NAV.MY_ITEMS' | translate }}</h1>

      <!-- My Tickets -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold">{{ 'TICKETS.TITLE' | translate }} ({{ myTickets().length }})</h2>
          <a routerLink="/tickets/new" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
            {{ 'TICKETS.CREATE' | translate }}
          </a>
        </div>
        @if (myTickets().length === 0) {
          <p class="text-gray-500 bg-white rounded-xl p-6 text-center">{{ 'MY_ITEMS.NO_TICKETS' | translate }}</p>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            @for (ticket of myTickets(); track ticket.id) {
              <div class="bg-white rounded-xl shadow-sm p-4">
                <div class="flex items-center justify-between mb-2">
                  <span [class]="ticket.ticket_type === 'offer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'"
                        class="px-2 py-1 rounded-full text-xs font-medium">{{ ticket.ticket_type }}</span>
                  <span class="text-xs text-gray-500">{{ ticket.category?.title }}</span>
                </div>
                <a [routerLink]="['/tickets', ticket.id]" class="font-medium text-gray-900 hover:text-blue-600">{{ ticket.title }}</a>
                <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ ticket.description }}</p>
                <div class="flex gap-2 mt-3">
                  <a [routerLink]="['/tickets', ticket.id, 'edit']" class="text-xs text-blue-600 hover:underline">Edit</a>
                  <button (click)="deleteTicket(ticket.id)" class="text-xs text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- My Fundraisers (organizations only) -->
      @if (auth.isOrganization() || auth.isAdmin()) {
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">{{ 'FUNDRAISERS.TITLE' | translate }} ({{ myFundraisers().length }})</h2>
            <a routerLink="/fundraisers/new" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              {{ 'FUNDRAISERS.CREATE' | translate }}
            </a>
          </div>
          @if (myFundraisers().length === 0) {
            <p class="text-gray-500 bg-white rounded-xl p-6 text-center">{{ 'MY_ITEMS.NO_FUNDRAISERS' | translate }}</p>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (fund of myFundraisers(); track fund.id) {
                <div class="bg-white rounded-xl shadow-sm p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">{{ fund.currency }}</span>
                    <span class="text-xs text-gray-500">{{ fund.raised | number:'1.0-0' }} / {{ fund.total | number:'1.0-0' }}</span>
                  </div>
                  <a [routerLink]="['/fundraisers', fund.id]" class="font-medium text-gray-900 hover:text-blue-600">{{ fund.title }}</a>
                  <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div class="bg-blue-600 h-1.5 rounded-full" [style.width.%]="getPercentage(fund)"></div>
                  </div>
                  <div class="flex gap-2 mt-3">
                    <a [routerLink]="['/fundraisers', fund.id, 'edit']" class="text-xs text-blue-600 hover:underline">Edit</a>
                    <button (click)="deleteFundraiser(fund.id)" class="text-xs text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- My News (organizations only) -->
      @if (auth.isOrganization() || auth.isAdmin()) {
        <div class="mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold">{{ 'NEWS.TITLE' | translate }} ({{ myNews().length }})</h2>
            <a routerLink="/news/new" class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
              {{ 'NEWS.CREATE' | translate }}
            </a>
          </div>
          @if (myNews().length === 0) {
            <p class="text-gray-500 bg-white rounded-xl p-6 text-center">{{ 'MY_ITEMS.NO_NEWS' | translate }}</p>
          } @else {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (item of myNews(); track item.id) {
                <div class="bg-white rounded-xl shadow-sm p-4">
                  <span [class]="item.kind === 'news' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'"
                        class="px-2 py-1 rounded-full text-xs font-medium">{{ item.kind }}</span>
                  <a [routerLink]="['/news', item.id]" class="block font-medium text-gray-900 hover:text-blue-600 mt-2">{{ item.title }}</a>
                  <p class="text-sm text-gray-500 mt-1 line-clamp-2">{{ item.description }}</p>
                  <div class="flex gap-2 mt-3">
                    <a [routerLink]="['/news', item.id, 'edit']" class="text-xs text-blue-600 hover:underline">Edit</a>
                    <button (click)="deleteNews(item.id)" class="text-xs text-red-600 hover:underline">Delete</button>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `
})
export class MyItemsComponent implements OnInit {
  myTickets = signal<Ticket[]>([]);
  myFundraisers = signal<Fundraiser[]>([]);
  myNews = signal<NewsItem[]>([]);

  constructor(private api: ApiService, public auth: AuthService) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.api.getTickets().subscribe({
      next: (res) => {
        const userId = this.auth.user()?.id;
        this.myTickets.set(res.data.filter(t => t.author_id === userId));
      }
    });
    this.api.getFundraisers().subscribe({
      next: (res) => {
        const userId = this.auth.user()?.id;
        this.myFundraisers.set(res.data.filter(f => f.author_id === userId));
      }
    });
    this.api.getNews().subscribe({
      next: (res) => {
        const userId = this.auth.user()?.id;
        this.myNews.set(res.data.filter(n => n.author_id === userId));
      }
    });
  }

  getPercentage(fund: Fundraiser): number {
    if (!fund.total || fund.total === 0) return 0;
    return Math.min(100, (fund.raised / fund.total) * 100);
  }

  deleteTicket(id: string) {
    if (!confirm('Delete this ticket?')) return;
    this.api.deleteTicket(id).subscribe({ next: () => this.loadAll() });
  }

  deleteFundraiser(id: string) {
    if (!confirm('Delete this fundraiser?')) return;
    this.api.deleteFundraiser(id).subscribe({ next: () => this.loadAll() });
  }

  deleteNews(id: string) {
    if (!confirm('Delete this news item?')) return;
    this.api.deleteNews(id).subscribe({ next: () => this.loadAll() });
  }
}
