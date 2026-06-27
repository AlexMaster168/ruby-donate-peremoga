import { Component, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '../../../core/api/api.service';
import { User } from '../../../types';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  template: `
    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">{{ 'ADMIN.MANAGE_USERS' | translate }}</h1>
        <a routerLink="/dashboard" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
          {{ 'COMMON.BACK' | translate }}
        </a>
      </div>

      @if (loading()) {
        <div class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      } @else {
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              @for (user of users(); track user.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 text-sm text-gray-900">{{ user.email }}</td>
                  <td class="px-6 py-4 text-sm text-gray-600">
                    {{ user.first_name }} {{ user.last_name }} {{ user.organization_name }}
                  </td>
                  <td class="px-6 py-4">
                    <span [class]="getRoleClass(user.role)"
                          class="px-2 py-1 rounded-full text-xs font-medium">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600">{{ user.location }}</td>
                  <td class="px-6 py-4 text-sm space-x-2">
                    <select (change)="changeRole(user.id, $event)"
                            class="text-xs border border-gray-300 rounded px-2 py-1">
                      <option value="individual" [selected]="user.role === 'individual'">Individual</option>
                      <option value="organization" [selected]="user.role === 'organization'">Organization</option>
                      <option value="moderator" [selected]="user.role === 'moderator'">Moderator</option>
                      <option value="admin" [selected]="user.role === 'admin'">Admin</option>
                    </select>
                    <button (click)="deleteUser(user.id)"
                            class="text-red-600 hover:text-red-800 text-xs font-medium">
                      {{ 'COMMON.DELETE' | translate }}
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class AdminUsersComponent implements OnInit {
  users = signal<User[]>([]);
  loading = signal(true);

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.api.getUsers().subscribe({
      next: (res) => {
        this.users.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'moderator': return 'bg-yellow-100 text-yellow-800';
      case 'organization': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  }

  changeRole(userId: string, event: Event) {
    const role = (event.target as HTMLSelectElement).value;
    this.api.updateUserRole(userId, role).subscribe({
      next: () => this.loadUsers()
    });
  }

  deleteUser(userId: string) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    this.api.deleteUser(userId).subscribe({
      next: () => this.loadUsers()
    });
  }
}
