# Peremoga (Перемога)

Donation and aid-coordination platform for Ukraine.

## Stack

**Backend:** Ruby 3.4 / Rails 8.1 API-only / PostgreSQL 17 / JWT auth / ActionCable  
**Frontend:** Angular 22 / Tailwind CSS 3 / ngx-translate (UA/EN) / Signals

## Quick Start

```bash
# Setup
setup.bat

# Run
start.bat
```

**Backend:** http://localhost:3000  
**Frontend:** http://localhost:4200  
**ActiveAdmin:** http://localhost:3000/admin  
**Swagger UI:** http://localhost:3000/api-docs  
**Swagger YAML:** http://localhost:3000/api-docs/v1/swagger.yaml

## Screenshots

### Public Pages

| Page | Screenshot |
|------|------------|
| Home | ![Home](docs/screenshots/home/01.png) |
| Login | ![Login](docs/screenshots/login/01.png) |
| Register | ![Register](docs/screenshots/register/01.png) |
| Tickets | ![Tickets](docs/screenshots/tickets/01.png) |
| Fundraisers | ![Fundraisers](docs/screenshots/fundraisers/01.png) |
| News | ![News](docs/screenshots/news/01.png) |
| Ticket Detail | ![Ticket Detail](docs/screenshots/details/01-ticket-detail.png) |
| Fundraiser Detail | ![Fundraiser Detail](docs/screenshots/details/02-fundraiser-detail.png) |
| News Detail | ![News Detail](docs/screenshots/details/03-news-detail.png) |

### Admin Role

| Page | Screenshot |
|------|------------|
| Dashboard | ![Dashboard](docs/screenshots/admin/08-dashboard.png) |
| Manage Users | ![Admin Users](docs/screenshots/admin/09-admin-users.png) |
| Manage Content | ![Admin Content](docs/screenshots/admin/10-admin-content.png) |
| My Items | ![My Items](docs/screenshots/admin/06-my-items.png) |
| Profile | ![Profile](docs/screenshots/admin/05-profile.png) |

### Organization Role

| Page | Screenshot |
|------|------------|
| Home (Auth) | ![Home](docs/screenshots/organization/01-home.png) |
| Create Fundraiser | ![Create Fundraiser](docs/screenshots/organization/08-create-fundraiser.png) |
| Create News | ![Create News](docs/screenshots/organization/09-create-news.png) |
| My Items | ![My Items](docs/screenshots/organization/06-my-items.png) |

### Individual Role

| Page | Screenshot |
|------|------------|
| Home (Auth) | ![Home](docs/screenshots/individual/01-home.png) |
| Create Ticket | ![Create Ticket](docs/screenshots/individual/07-create-ticket.png) |
| My Items | ![My Items](docs/screenshots/individual/06-my-items.png) |

## API Documentation

Interactive Swagger UI available at **http://localhost:3000/api-docs** when the server is running.

### Regenerating Swagger spec

```bash
# Run request specs and regenerate swagger.yaml
bundle exec rake rswag:specs:swaggerize
```

The spec lives at `swagger/v1/swagger.yaml` and is auto-generated from the request specs in `spec/requests/`.

### Adding new endpoints

1. Write a request spec in `spec/requests/api/v1/<resource>_spec.rb`
2. Run `bundle exec rake rswag:specs:swaggerize`
3. The YAML is updated automatically

## Features

- **4 Roles:** individual, organization, moderator, admin — each with distinct permissions
- **Tickets:** offer/request with categories, location, image upload, real-time comments
- **Fundraisers:** UAH/USD with progress tracking, image upload
- **News:** news items and events with image upload
- **Real-time:** ActionCable WebSocket for live comments on tickets
- **i18n:** Full Ukrainian and English UI with language toggle
- **Search:** Full-text search across all entities
- **Dashboard:** Admin statistics panel with user/ticket/fundraiser/news counts
- **Admin Panel:** User role management, content moderation
- **File uploads:** ActiveStorage for images on tickets, fundraisers, and news
- **JWT Auth:** Secure token-based authentication with refresh

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/v1/login | No | Sign in (returns JWT) |
| DELETE | /api/v1/logout | Yes | Sign out (revokes token) |
| POST | /api/v1/users | No | Register new account |
| GET | /api/v1/users | Admin | List all users |
| PATCH | /api/v1/users/:id/update_role | Admin | Change user role |
| GET | /api/v1/tickets | No | List tickets (paginated) |
| POST | /api/v1/tickets | Yes | Create ticket |
| PATCH | /api/v1/tickets/:id | Owner/Admin | Update ticket |
| DELETE | /api/v1/tickets/:id | Owner/Admin | Delete ticket |
| GET | /api/v1/tickets/:id/comments | No | List comments |
| POST | /api/v1/tickets/:id/comments | Yes | Add comment |
| GET | /api/v1/fundraisers | No | List fundraisers |
| POST | /api/v1/fundraisers | Org/Admin | Create fundraiser |
| GET | /api/v1/news | No | List news |
| POST | /api/v1/news | Org/Admin | Create news |
| GET | /api/v1/categories | No | List categories |
| GET | /api/v1/search?q= | No | Search across entities |
| GET | /api/v1/stats/overview | Admin | Dashboard statistics |

## Roles & Permissions

| Role | Tickets | Fundraisers | News | Comments | Admin |
|------|---------|-------------|------|----------|-------|
| Individual | Create, Edit own | View only | View only | Create | No |
| Organization | Create, Edit own | Create, Edit own | Create, Edit own | Create | No |
| Moderator | Full CRUD | Full CRUD | Full CRUD | Full CRUD | View only |
| Admin | Full CRUD | Full CRUD | Full CRUD | Full CRUD | Full access |

## Database

PostgreSQL with UUID primary keys, enum types, check constraints.

```bash
rails db:create
rails db:migrate
rails db:seed  # Populates with test data
```

### Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@peremoga.ua | admin123 |
| Organization | charity@help.ua | org123456 |
| Individual | ivan@example.com | user123456 |

## ER Diagram

![ER Diagram](docs/er-diagram.png)

> Откройте `docs/er-diagram.excalidraw` в [Excalidraw](https://excalidraw.com) для интерактивного просмотра.

### Tables

- **users** — All platform users (individuals, organizations, moderators, admins)
- **categories** — Ticket categories (Medical, Food, Shelter, etc.)
- **tickets** — Help offers and requests, linked to author and category
- **fundraisers** — Fundraising campaigns with currency and progress
- **news_items** — News articles and events
- **comments** — Comments on tickets (real-time via ActionCable)
- **jwt_denylists** — Revoked JWT tokens for logout
- **admin_users** — ActiveAdmin administrator accounts

## Project Structure

```
ruby-donate/
├── app/
│   ├── controllers/api/v1/   # REST API controllers
│   ├── models/               # ActiveRecord models
│   ├── serializers/          # Blueprinter JSON serializers
│   ├── policies/             # Pundit authorization policies
│   ├── channels/             # ActionCable WebSocket channels
│   └── services/             # Business logic (SearchService)
├── peremoga-frontend/
│   └── src/app/
│       ├── core/             # Auth, API, WebSocket services
│       ├── features/         # Page components (tickets, news, etc.)
│       ├── layout/           # Navbar, footer, layouts
│       └── types/            # TypeScript interfaces
├── db/
│   ├── migrate/              # Database migrations
│   ├── seeds.rb              # Test data seeder
│   └── schema.rb             # Current schema
└── docs/
    ├── screenshots/          # App screenshots by role
    └── er-diagram.excalidraw # Database ER diagram
```
