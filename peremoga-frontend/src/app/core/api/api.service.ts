import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  User, Ticket, Fundraiser, NewsItem, Comment, Category,
  PaginatedResponse, ApiResponse, StatsOverview, SearchResults
} from '../../types';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  private buildParams(params?: Record<string, string>): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) httpParams = httpParams.set(key, value);
      });
    }
    return httpParams;
  }

  // Tickets
  getTickets(params?: Record<string, string>): Observable<PaginatedResponse<Ticket>> {
    return this.http.get<PaginatedResponse<Ticket>>(`${this.baseUrl}/tickets`, { params: this.buildParams(params) });
  }

  getTicket(id: string): Observable<ApiResponse<Ticket>> {
    return this.http.get<ApiResponse<Ticket>>(`${this.baseUrl}/tickets/${id}`);
  }

  createTicket(data: Partial<Ticket>): Observable<ApiResponse<Ticket>> {
    return this.http.post<ApiResponse<Ticket>>(`${this.baseUrl}/tickets`, { ticket: data });
  }

  createTicketWithImage(formData: FormData): Observable<ApiResponse<Ticket>> {
    return this.http.post<ApiResponse<Ticket>>(`${this.baseUrl}/tickets`, formData);
  }

  updateTicket(id: string, data: Partial<Ticket>): Observable<ApiResponse<Ticket>> {
    return this.http.patch<ApiResponse<Ticket>>(`${this.baseUrl}/tickets/${id}`, { ticket: data });
  }

  updateTicketWithImage(id: string, formData: FormData): Observable<ApiResponse<Ticket>> {
    return this.http.patch<ApiResponse<Ticket>>(`${this.baseUrl}/tickets/${id}`, formData);
  }

  deleteTicket(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tickets/${id}`);
  }

  // Comments
  getComments(ticketId: string, params?: Record<string, string>): Observable<PaginatedResponse<Comment>> {
    return this.http.get<PaginatedResponse<Comment>>(`${this.baseUrl}/tickets/${ticketId}/comments`, { params: this.buildParams(params) });
  }

  createComment(ticketId: string, data: { body: string }): Observable<ApiResponse<Comment>> {
    return this.http.post<ApiResponse<Comment>>(`${this.baseUrl}/tickets/${ticketId}/comments`, { comment: data });
  }

  // Fundraisers
  getFundraisers(params?: Record<string, string>): Observable<PaginatedResponse<Fundraiser>> {
    return this.http.get<PaginatedResponse<Fundraiser>>(`${this.baseUrl}/fundraisers`, { params: this.buildParams(params) });
  }

  getFundraiser(id: string): Observable<ApiResponse<Fundraiser>> {
    return this.http.get<ApiResponse<Fundraiser>>(`${this.baseUrl}/fundraisers/${id}`);
  }

  createFundraiser(data: Partial<Fundraiser>): Observable<ApiResponse<Fundraiser>> {
    return this.http.post<ApiResponse<Fundraiser>>(`${this.baseUrl}/fundraisers`, { fundraiser: data });
  }

  createFundraiserWithImage(formData: FormData): Observable<ApiResponse<Fundraiser>> {
    return this.http.post<ApiResponse<Fundraiser>>(`${this.baseUrl}/fundraisers`, formData);
  }

  updateFundraiser(id: string, data: Partial<Fundraiser>): Observable<ApiResponse<Fundraiser>> {
    return this.http.patch<ApiResponse<Fundraiser>>(`${this.baseUrl}/fundraisers/${id}`, { fundraiser: data });
  }

  updateFundraiserWithImage(id: string, formData: FormData): Observable<ApiResponse<Fundraiser>> {
    return this.http.patch<ApiResponse<Fundraiser>>(`${this.baseUrl}/fundraisers/${id}`, formData);
  }

  deleteFundraiser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/fundraisers/${id}`);
  }

  // News
  getNews(params?: Record<string, string>): Observable<PaginatedResponse<NewsItem>> {
    return this.http.get<PaginatedResponse<NewsItem>>(`${this.baseUrl}/news`, { params: this.buildParams(params) });
  }

  getNewsItem(id: string): Observable<ApiResponse<NewsItem>> {
    return this.http.get<ApiResponse<NewsItem>>(`${this.baseUrl}/news/${id}`);
  }

  createNews(data: Partial<NewsItem>): Observable<ApiResponse<NewsItem>> {
    return this.http.post<ApiResponse<NewsItem>>(`${this.baseUrl}/news`, { news_item: data });
  }

  createNewsWithImage(formData: FormData): Observable<ApiResponse<NewsItem>> {
    return this.http.post<ApiResponse<NewsItem>>(`${this.baseUrl}/news`, formData);
  }

  updateNews(id: string, data: Partial<NewsItem>): Observable<ApiResponse<NewsItem>> {
    return this.http.patch<ApiResponse<NewsItem>>(`${this.baseUrl}/news/${id}`, { news_item: data });
  }

  updateNewsWithImage(id: string, formData: FormData): Observable<ApiResponse<NewsItem>> {
    return this.http.patch<ApiResponse<NewsItem>>(`${this.baseUrl}/news/${id}`, formData);
  }

  deleteNews(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/news/${id}`);
  }

  // Search
  search(params: Record<string, string>): Observable<ApiResponse<SearchResults>> {
    return this.http.get<ApiResponse<SearchResults>>(`${this.baseUrl}/search`, { params: this.buildParams(params) });
  }

  // Stats (admin only)
  getStats(): Observable<ApiResponse<StatsOverview>> {
    return this.http.get<ApiResponse<StatsOverview>>(`${this.baseUrl}/stats/overview`);
  }

  getFundraiserStats(params?: Record<string, string>): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/stats/fundraisers`, { params: this.buildParams(params) });
  }

  getTicketStats(params?: Record<string, string>): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/stats/tickets`, { params: this.buildParams(params) });
  }

  // Categories
  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.baseUrl}/categories`);
  }

  // Users (admin)
  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(`${this.baseUrl}/users`);
  }

  getUser(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/users/${id}`);
  }

  updateUserRole(id: string, role: string): Observable<ApiResponse<User>> {
    return this.http.patch<ApiResponse<User>>(`${this.baseUrl}/users/${id}/update_role`, { user: { role } });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }
}
