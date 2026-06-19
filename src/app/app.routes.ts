import { Routes } from '@angular/router'
import { WelcomePage } from './pages/welcome/welcome'
import { authGuard } from './core/guards/auth.guard'
import { guestGuard } from './core/guards/guest.guard'

export const routes: Routes = [
  {
    path: '',
    component: WelcomePage,
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login').then((m) => m.LoginPage),
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register').then((m) => m.RegisterPage),
    canActivate: [guestGuard],
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./pages/auth/forgot-password/forgot-password').then((m) => m.ForgotPasswordPage),
    canActivate: [guestGuard],
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/auth/reset-password/reset-password').then((m) => m.ResetPasswordPage),
  },
  {
    path: 'verify-email',
    loadComponent: () => import('./pages/auth/verify-email/verify-email').then((m) => m.VerifyEmailPage),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard').then((m) => m.DashboardPage),
    canActivate: [authGuard],
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users-page/users-page').then((m) => m.UsersPage),
    canActivate: [authGuard],
  },
  {
    path: 'roles',
    loadComponent: () => import('./pages/roles/roles-page/roles-page').then((m) => m.RolesPage),
    canActivate: [authGuard],
  },
  {
    path: 'permissions',
    loadComponent: () => import('./pages/permissions/permissions-page/permissions-page').then((m) => m.PermissionsPage),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile-page/profile-page').then((m) => m.ProfilePage),
    canActivate: [authGuard],
  },
  {
    path: 'profile/password',
    loadComponent: () => import('./pages/profile/change-password/change-password').then((m) => m.ChangePasswordPage),
    canActivate: [authGuard],
  },
  {
    path: '403',
    loadComponent: () => import('./pages/errors/forbidden/forbidden').then((m) => m.ForbiddenPage),
  },
  {
    path: '500',
    loadComponent: () => import('./pages/errors/server-error/server-error').then((m) => m.ServerErrorPage),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/errors/not-found/not-found').then((m) => m.NotFoundPage),
  },
]
