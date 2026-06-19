# Starter Frontend — Angular

Admin panel frontend built with Angular 21, TypeScript, and Tailwind CSS. Connects to any of the available backend APIs (Golang, Node.js, Java, .NET, Python, Rust).

## Tech Stack

| Package | Version | Purpose |
|---|---|---|
| Angular | 21 | UI framework |
| TypeScript | 5.9 | Type safety |
| Tailwind CSS | 3 | Styling |
| Angular Router | — | Client-side routing (lazy-loaded) |
| Angular Reactive Forms | — | Form handling |
| HttpClient | — | HTTP client with functional interceptors |
| Axios | 1 | HTTP client (supplemental) |
| lucide-angular | — | Icons |
| ngx-toastr | 20 | Toast notifications |

## Prerequisites

- Node.js 18+
- npm
- Angular CLI (`npm install -g @angular/cli`)
- A running backend API (default expects `http://localhost:8080`)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:4200)
npm start

# Build for production
npm run build
```

## Configuration

Set the API base URL in `src/app/core/services/api.service.ts` or via environment files:

```
src/environments/environment.ts       → development
src/environments/environment.prod.ts  → production
```

Default points to `http://localhost:8080/api/v1`.

## Project Structure

```
src/app/
├── core/
│   ├── guards/             # auth.guard.ts, guest.guard.ts
│   ├── interceptors/       # auth.interceptor.ts (token + 401 refresh)
│   ├── models/             # Shared TypeScript interfaces
│   └── services/           # AuthService, UserService, RoleService, PermissionService, AuthApiService
├── pages/
│   ├── auth/               # Login, ForgotPassword, ResetPassword
│   ├── dashboard/          # DashboardPage
│   ├── users/              # UsersPage, UserFormModal, PhotoModal
│   ├── roles/              # RolesPage, RoleFormModal
│   ├── permissions/        # PermissionsPage (tree view)
│   └── profile/            # ProfilePage
└── shared/
    └── components/
        ├── layout/          # MainLayout, Sidebar, Header
        └── ui/              # AppBtn, AppInput, AppModal, AppBadge, AppSpinner
```

## Features

- **Authentication** — Login, forgot password, reset password via email link
- **Dashboard** — Summary stats
- **Users** — CRUD with avatar upload; edit/delete hidden for root user
- **Roles** — CRUD with permission assignment tree (category → menu → action)
- **Permissions** — Read-only tree view of all permissions
- **Profile** — Update own name, email, password, avatar
- **Responsive** — Mobile sidebar drawer with hamburger toggle
- **Permission guard** — `AuthService.can('permission:name')` signal-based helper; root user bypasses all checks
- **Token refresh** — Functional HTTP interceptor handles 401 with silent refresh
- **Standalone components** — No NgModules; all components are `standalone: true`
- **Angular Signals** — Reactive state using `signal()` and `computed()`

## Angular Signals Pattern

```ts
// AuthService uses signals for reactive state
readonly user = signal<User | null>(null)
readonly isAuthenticated = computed(() => this.user() !== null)

// Usage in a component
private auth = inject(AuthService)
get isLoggedIn() { return this.auth.isAuthenticated() }
```

## Lazy Loading

All page routes are lazy-loaded via `loadComponent()`:

```ts
{ path: 'users', loadComponent: () => import('./pages/users/...').then(m => m.UsersPage) }
```

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start dev server on port 4200 |
| `npm run build` | Production build to `dist/` |
| `npm run watch` | Build in watch mode (development) |
| `npm test` | Run unit tests |
