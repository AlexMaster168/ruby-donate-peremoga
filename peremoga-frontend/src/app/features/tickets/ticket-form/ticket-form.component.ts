import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../../core/api/api.service';
import { Category } from '../../../types';

interface TicketForm {
  title: string;
  description: string;
  ticket_type: 'offer' | 'request';
  category_id: string;
  location: string;
}

@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslatePipe],
  template: `
    <div class="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="mb-6">
        <a routerLink="/tickets" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
          {{ 'COMMON.BACK' | translate }}
        </a>
      </div>

      <div class="bg-white rounded-xl shadow-sm p-8">
        <h1 class="text-2xl font-bold mb-6">
          {{ isEdit() ? ('COMMON.EDIT' | translate) : ('TICKETS.CREATE' | translate) }}
        </h1>

        @if (error()) {
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 whitespace-pre-line">{{ error() }}</div>
        }

        <form (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input type="text" [(ngModel)]="form.title" name="title" required
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea [(ngModel)]="form.description" name="description" rows="4" required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"></textarea>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'TICKETS.TYPE' | translate }}</label>
              <select [(ngModel)]="form.ticket_type" name="ticket_type"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                <option value="offer">{{ 'TICKETS.OFFER' | translate }}</option>
                <option value="request">{{ 'TICKETS.REQUEST' | translate }}</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'TICKETS.CATEGORY' | translate }}</label>
              <select [(ngModel)]="form.category_id" name="category_id"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                @for (cat of categories(); track cat.id) {
                  <option [value]="cat.id">{{ cat.title }}</option>
                }
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'TICKETS.LOCATION' | translate }}</label>
            <input type="text" [(ngModel)]="form.location" name="location" required
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ 'COMMON.IMAGE' | translate }}</label>
            <input type="file" accept="image/*" (change)="onFileSelected($event)"
                   class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
          </div>

          <div class="flex space-x-4">
            <button type="submit" [disabled]="loading()"
                    class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition">
              {{ loading() ? ('COMMON.LOADING' | translate) : ('COMMON.SAVE' | translate) }}
            </button>
            <a routerLink="/tickets"
               class="flex-1 text-center bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition">
              {{ 'COMMON.CANCEL' | translate }}
            </a>
          </div>
        </form>
      </div>
    </div>
  `
})
export class TicketFormComponent implements OnInit {
  form: TicketForm = {
    title: '',
    description: '',
    ticket_type: 'offer',
    category_id: '',
    location: ''
  };

  selectedFile: File | null = null;
  categories = signal<Category[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  isEdit = signal(false);

  private ticketId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.ticketId = this.route.snapshot.paramMap.get('id');
    this.isEdit.set(!!this.ticketId);

    this.loadCategories();

    if (this.ticketId) {
      this.loadTicket();
    }
  }

  loadCategories() {
    this.api.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res.data);
      }
    });
  }

  loadTicket() {
    if (!this.ticketId) return;
    this.api.getTicket(this.ticketId).subscribe({
      next: (res) => {
        const ticket = res.data;
        this.form = {
          title: ticket.title,
          description: ticket.description,
          ticket_type: ticket.ticket_type,
          category_id: ticket.category?.id || '',
          location: ticket.location
        };
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    this.loading.set(true);
    this.error.set(null);

    if (!this.form.title.trim()) {
      this.loading.set(false);
      this.error.set('Title is required');
      return;
    }
    if (!this.form.description.trim()) {
      this.loading.set(false);
      this.error.set('Description is required');
      return;
    }
    if (!this.form.location.trim()) {
      this.loading.set(false);
      this.error.set('Location is required');
      return;
    }
    if (!this.form.category_id) {
      this.loading.set(false);
      this.error.set('Please select a category');
      return;
    }

    let request;
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('ticket[title]', this.form.title);
      formData.append('ticket[description]', this.form.description);
      formData.append('ticket[ticket_type]', this.form.ticket_type);
      formData.append('ticket[category_id]', this.form.category_id);
      formData.append('ticket[location]', this.form.location);
      formData.append('ticket[image_file]', this.selectedFile);

      request = this.isEdit()
        ? this.api.updateTicketWithImage(this.ticketId!, formData)
        : this.api.createTicketWithImage(formData);
    } else {
      request = this.isEdit()
        ? this.api.updateTicket(this.ticketId!, this.form)
        : this.api.createTicket(this.form);
    }

    request.subscribe({
      next: (res) => {
        this.router.navigate(['/tickets', res.data.id]);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.message || 'Failed to save ticket');
      }
    });
  }
}
