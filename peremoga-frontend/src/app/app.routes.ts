import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout.component';
import { AuthLayoutComponent } from './layout/auth-layout.component';
import { authGuard, guestGuard, roleGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'tickets',
        loadComponent: () => import('./features/tickets/ticket-list/ticket-list.component').then(m => m.TicketListComponent)
      },
      {
        path: 'tickets/new',
        loadComponent: () => import('./features/tickets/ticket-form/ticket-form.component').then(m => m.TicketFormComponent),
        canActivate: [authGuard]
      },
      {
        path: 'tickets/:id/edit',
        loadComponent: () => import('./features/tickets/ticket-form/ticket-form.component').then(m => m.TicketFormComponent),
        canActivate: [authGuard]
      },
      {
        path: 'tickets/:id',
        loadComponent: () => import('./features/tickets/ticket-detail/ticket-detail.component').then(m => m.TicketDetailComponent)
      },
      {
        path: 'fundraisers',
        loadComponent: () => import('./features/fundraisers/fundraiser-list/fundraiser-list.component').then(m => m.FundraiserListComponent)
      },
      {
        path: 'fundraisers/new',
        loadComponent: () => import('./features/fundraisers/fundraiser-form/fundraiser-form.component').then(m => m.FundraiserFormComponent),
        canActivate: [authGuard]
      },
      {
        path: 'fundraisers/:id/edit',
        loadComponent: () => import('./features/fundraisers/fundraiser-form/fundraiser-form.component').then(m => m.FundraiserFormComponent),
        canActivate: [authGuard]
      },
      {
        path: 'fundraisers/:id',
        loadComponent: () => import('./features/fundraisers/fundraiser-detail/fundraiser-detail.component').then(m => m.FundraiserDetailComponent)
      },
      {
        path: 'news',
        loadComponent: () => import('./features/news/news-list/news-list.component').then(m => m.NewsListComponent)
      },
      {
        path: 'news/new',
        loadComponent: () => import('./features/news/news-form/news-form.component').then(m => m.NewsFormComponent),
        canActivate: [authGuard]
      },
      {
        path: 'news/:id/edit',
        loadComponent: () => import('./features/news/news-form/news-form.component').then(m => m.NewsFormComponent),
        canActivate: [authGuard]
      },
      {
        path: 'news/:id',
        loadComponent: () => import('./features/news/news-detail/news-detail.component').then(m => m.NewsDetailComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['admin', 'moderator'] }
      },
      {
        path: 'dashboard/users',
        loadComponent: () => import('./features/admin/admin-users/admin-users.component').then(m => m.AdminUsersComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: 'dashboard/content',
        loadComponent: () => import('./features/admin/admin-items/admin-items.component').then(m => m.AdminItemsComponent),
        canActivate: [authGuard, roleGuard],
        data: { roles: ['admin', 'moderator'] }
      },
      {
        path: 'my-items',
        loadComponent: () => import('./features/my-items/my-items.component').then(m => m.MyItemsComponent),
        canActivate: [authGuard]
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/auth/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
      }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
        canActivate: [guestGuard]
      },
      {
        path: 'register',
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
        canActivate: [guestGuard]
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
