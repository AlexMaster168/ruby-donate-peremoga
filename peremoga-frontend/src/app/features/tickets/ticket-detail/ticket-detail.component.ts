import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../../core/api/api.service';
import { AuthService } from '../../../core/auth/auth.service';
import { WebsocketService } from '../../../core/websocket/websocket.service';
import { Ticket, Comment } from '../../../types';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslatePipe, DatePipe],
  template: `
    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      @if (loading()) {
        <div class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      } @else if (ticket()) {
        <div class="mb-6">
          <a routerLink="/tickets" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
            {{ 'COMMON.BACK' | translate }}
          </a>
        </div>

        <div class="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div class="flex items-center justify-between mb-4">
            <span [class]="ticket().ticket_type === 'offer' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'"
                  class="px-4 py-1 rounded-full text-sm font-medium">
              {{ ticket().ticket_type === 'offer' ? ('TICKETS.OFFER' | translate) : ('TICKETS.REQUEST' | translate) }}
            </span>
            <span class="text-sm text-gray-500">{{ ticket().created_at | date:'medium' }}</span>
          </div>

          <h1 class="text-2xl font-bold mb-4">{{ ticket().title }}</h1>

          @if (ticket().image_url) {
            <img [src]="ticket().image_url" alt="{{ ticket().title }}" class="w-full max-h-96 object-cover rounded-lg mb-6">
          }

          <div class="flex items-center text-sm text-gray-600 mb-6 space-x-4">
            <span>{{ ticket().location }}</span>
            <span>{{ ticket().category?.title }}</span>
            <span>{{ ticket().author?.first_name }} {{ ticket().author?.last_name }}</span>
          </div>

          <p class="text-gray-700 leading-relaxed">{{ ticket().description }}</p>

          @if (canEdit()) {
            <div class="mt-6 flex space-x-4">
              <a [routerLink]="['/tickets', ticket().id, 'edit']"
                 class="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
                {{ 'COMMON.EDIT' | translate }}
              </a>
              <button (click)="deleteTicket()"
                      class="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition">
                {{ 'COMMON.DELETE' | translate }}
              </button>
            </div>
          }
        </div>

        <div class="bg-white rounded-xl shadow-sm p-8">
          <h2 class="text-xl font-bold mb-6">{{ 'TICKETS.COMMENTS' | translate }} ({{ comments().length }})</h2>

          @if (auth.isAuthenticated()) {
            <form (ngSubmit)="addComment()" class="mb-8">
              <textarea [(ngModel)]="newComment" name="comment" rows="3"
                        [placeholder]="'TICKETS.ADD_COMMENT' | translate"
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition mb-3"></textarea>
              <button type="submit" [disabled]="!newComment.trim() || sendingComment()"
                      class="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition">
                {{ 'TICKETS.POST_COMMENT' | translate }}
              </button>
            </form>
          }

          <div class="space-y-6">
            @for (comment of comments(); track comment.id) {
              <div class="border-b border-gray-100 pb-6 last:border-0">
                <div class="flex items-center justify-between mb-2">
                  <div class="flex items-center space-x-2">
                    <span class="font-medium text-gray-900">{{ comment.user?.email }}</span>
                    <span class="text-sm text-gray-500">{{ comment.created_at | date:'short' }}</span>
                  </div>
                </div>
                <p class="text-gray-700">{{ comment.body }}</p>
              </div>
            }
            @if (comments().length === 0) {
              <p class="text-gray-500 text-center py-4">No comments yet</p>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class TicketDetailComponent implements OnInit, OnDestroy {
  ticket = signal<Ticket | null>(null);
  comments = signal<Comment[]>([]);
  loading = signal(true);
  newComment = '';
  sendingComment = signal(false);

  private ticketId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    public auth: AuthService,
    private ws: WebsocketService
  ) {}

  ngOnInit() {
    this.ticketId = this.route.snapshot.paramMap.get('id') || '';
    this.loadTicket();
    this.loadComments();
    this.subscribeToComments();
  }

  ngOnDestroy() {
    this.ws.unsubscribeFromTicket(this.ticketId);
  }

  loadTicket() {
    this.api.getTicket(this.ticketId).subscribe({
      next: (res) => {
        this.ticket.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.router.navigate(['/tickets']);
      }
    });
  }

  loadComments() {
    this.api.getComments(this.ticketId).subscribe({
      next: (res) => {
        this.comments.set(res.data);
      }
    });
  }

  subscribeToComments() {
    this.ws.subscribeToTicket(this.ticketId, (message) => {
      if (message.type === 'new_comment') {
        this.comments.update(comments => [...comments, message.data]);
      }
    });
  }

  addComment() {
    if (!this.newComment.trim()) return;

    this.sendingComment.set(true);
    this.api.createComment(this.ticketId, { body: this.newComment }).subscribe({
      next: (res) => {
        this.comments.update(comments => [...comments, res.data]);
        this.newComment = '';
        this.sendingComment.set(false);
      },
      error: () => {
        this.sendingComment.set(false);
      }
    });
  }

  canEdit() {
    const user = this.auth.user();
    const t = this.ticket();
    if (!user || !t) return false;
    return user.id === t.author_id || user.role === 'admin' || user.role === 'moderator';
  }

  deleteTicket() {
    if (!confirm('Are you sure?')) return;
    this.api.deleteTicket(this.ticketId).subscribe({
      next: () => this.router.navigate(['/tickets'])
    });
  }
}
