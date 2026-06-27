import { Component, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../../core/api/api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { Ticket } from '../../../types';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [RouterLink, FormsModule, TranslatePipe],
  template: `
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 class="text-2xl font-bold">{{ 'TICKETS.TITLE' | translate }}</h1>
        @if (auth.isAuthenticated()) {
          <a routerLink="/tickets/new"
             class="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            {{ 'TICKETS.CREATE' | translate }}
          </a>
        }
      </div>

      <div class="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div class="flex flex-col md:flex-row gap-4">
          <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onSearch()"
                 [placeholder]="'TICKETS.SEARCHPlaceholder' | translate"
                 class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">

          <select [(ngModel)]="filterType" (ngModelChange)="loadTickets()"
                  class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
            <option value="">{{ 'TICKETS.ALL' | translate }}</option>
            <option value="offer">{{ 'TICKETS.OFFER' | translate }}</option>
            <option value="request">{{ 'TICKETS.REQUEST' | translate }}</option>
          </select>
        </div>
      </div>

      @if (loading()) {
        <div class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">{{ 'COMMON.LOADING' | translate }}</p>
        </div>
      } @else if (tickets().length === 0) {
        <div class="text-center py-12 bg-white rounded-xl shadow-sm">
          <p class="text-gray-500 text-lg">{{ 'TICKETS.NO_TICKETS' | translate }}</p>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (ticket of tickets(); track ticket.id) {
            <a [routerLink]="['/tickets', ticket.id]"
               class="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6">
              @if (ticket.image_url) {
                <img [src]="ticket.image_url" alt="" class="w-full h-40 object-cover rounded-lg mb-3">
              }
              <div class="flex items-center justify-between mb-3">
                <span [class]="ticket.ticket_type === 'offer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'"
                      class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ ticket.ticket_type === 'offer' ? ('TICKETS.OFFER' | translate) : ('TICKETS.REQUEST' | translate) }}
                </span>
                <span class="text-sm text-gray-500">{{ ticket.category?.title }}</span>
              </div>
              <h3 class="text-lg font-semibold mb-2 line-clamp-2">{{ ticket.title }}</h3>
              <p class="text-gray-600 text-sm mb-4 line-clamp-3">{{ ticket.description }}</p>
              <div class="flex items-center text-sm text-gray-500">
                <span>{{ ticket.location }}</span>
              </div>
            </a>
          }
        </div>

        @if (totalPages() > 1) {
          <div class="flex justify-center mt-8 space-x-2">
            @for (page of pages(); track page) {
              <button (click)="goToPage(page)"
                      [class]="page === currentPage() ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'"
                      class="px-4 py-2 rounded-lg border border-gray-300 font-medium">
                {{ page }}
              </button>
            }
          </div>
        }
      }
    </div>
  `
})
export class TicketListComponent implements OnInit {
  tickets = signal<Ticket[]>([]);
  loading = signal(false);
  searchQuery = '';
  filterType = '';
  currentPage = signal(1);
  totalPages = signal(1);

  pages = signal<number[]>([]);

  constructor(
    private api: ApiService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.loading.set(true);
    const params: Record<string, string> = {
      page: this.currentPage().toString()
    };
    if (this.filterType) params['ticket_type'] = this.filterType;
    if (this.searchQuery) params['q'] = this.searchQuery;

    this.api.getTickets(params).subscribe({
      next: (res) => {
        this.tickets.set(res.data);
        this.totalPages.set(res.meta.total_pages);
        this.pages.set(Array.from({ length: res.meta.total_pages }, (_, i) => i + 1));
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onSearch() {
    this.currentPage.set(1);
    this.loadTickets();
  }

  goToPage(page: number) {
    this.currentPage.set(page);
    this.loadTickets();
  }
}
