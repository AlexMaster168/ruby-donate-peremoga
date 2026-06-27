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

export interface Category {
  id: string;
  title: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  location: string;
  image?: string;
  image_url?: string;
  ticket_type: 'offer' | 'request';
  category?: Category;
  author?: User;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface Fundraiser {
  id: string;
  title: string;
  description?: string;
  image?: string;
  image_url?: string;
  currency: 'UAH' | 'USD';
  raised: number;
  total: number;
  progress_percent: number;
  author?: User;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  image?: string;
  image_url?: string;
  kind: 'news' | 'event';
  author?: User;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  body: string;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    total_pages: number;
    total_count: number;
    per_page: number;
  };
}

export interface ApiResponse<T> {
  data: T;
}

export interface StatsOverview {
  users: {
    total: number;
    individuals: number;
    organizations: number;
    moderators: number;
    admins: number;
  };
  tickets: {
    total: number;
    offers: number;
    requests: number;
    by_category: Record<string, number>;
  };
  fundraisers: {
    total: number;
    total_raised_uah: number;
    total_goal_uah: number;
    total_raised_usd: number;
    total_goal_usd: number;
  };
  news: {
    total: number;
    news: number;
    events: number;
  };
  comments: {
    total: number;
  };
}

export interface LoginResponse {
  data: User;
  token: string;
}

export interface SearchResults {
  tickets?: PaginatedResponse<Ticket>;
  news_items?: PaginatedResponse<NewsItem>;
  fundraisers?: PaginatedResponse<Fundraiser>;
}
