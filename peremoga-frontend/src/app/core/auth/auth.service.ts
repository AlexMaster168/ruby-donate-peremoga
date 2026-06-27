import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { WebsocketService } from '../websocket/websocket.service';

export interface User {
  id: string;
  email: string;
  role: 'individual' | 'organization' | 'moderator' | 'admin';
  first_name?: string;
  last_name?: string;
  organization_name?: string;
  biography?: string;
  location?: string;
  avatar_url?: string;
  created_at: string;
}

export interface LoginResponse {
  data: User;
  token: string;
}

export interface RegisterRequest {
  user: {
    email: string;
    password: string;
    password_confirmation: string;
    first_name?: string;
    last_name?: string;
    organization_name?: string;
    role: 'individual' | 'organization';
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUser = signal<User | null>(null);
  private jwtToken = signal<string | null>(null);

  user = this.currentUser.asReadonly();
  token = this.jwtToken.asReadonly();
  isAuthenticated = computed(() => !!this.currentUser());
  isAdmin = computed(() => this.currentUser()?.role === 'admin');
  isModerator = computed(() => this.currentUser()?.role === 'moderator');
  isOrganization = computed(() => this.currentUser()?.role === 'organization');
  isIndividual = computed(() => this.currentUser()?.role === 'individual');

  private ws = inject(WebsocketService);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadFromStorage();
    if (this.jwtToken()) {
      this.ws.connect(this.jwtToken()!);
    }
  }

  login(email: string, password: string) {
    return this.http.post<LoginResponse>('/api/v1/login', {
      user: { email, password }
    }).pipe(
      tap(response => {
        this.currentUser.set(response.data);
        this.jwtToken.set(response.token);
        this.saveToStorage();
        this.ws.connect(response.token);
      })
    );
  }

  register(data: RegisterRequest['user']) {
    return this.http.post<LoginResponse>('/api/v1/users', { user: data }).pipe(
      tap(response => {
        this.currentUser.set(response.data);
        if (response.token) {
          this.jwtToken.set(response.token);
        }
        this.saveToStorage();
      })
    );
  }

  logout() {
    return this.http.delete('/api/v1/logout').pipe(
      tap(() => {
        this.ws.disconnect();
        this.clearSession();
        this.router.navigate(['/login']);
      })
    );
  }

  updateProfile(data: Partial<User>) {
    const user = this.currentUser();
    if (!user) return;

    return this.http.patch<{ data: User }>(`/api/v1/users/${user.id}`, { user: data }).pipe(
      tap(response => {
        this.currentUser.set(response.data);
        this.saveToStorage();
      })
    );
  }

  clearSession() {
    this.currentUser.set(null);
    this.jwtToken.set(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  private loadFromStorage() {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser) {
      try {
        this.currentUser.set(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    if (storedToken) {
      this.jwtToken.set(storedToken);
    }
  }

  private saveToStorage() {
    const user = this.currentUser();
    const token = this.jwtToken();
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    if (token) {
      localStorage.setItem('token', token);
    }
  }
}
