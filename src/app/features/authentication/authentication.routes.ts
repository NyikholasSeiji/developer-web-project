import { Routes } from '@angular/router';

export const AUTHENTICATION_ROUTES: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'cadastro',
    loadComponent: () => import('./pages/register-page').then((m) => m.RegisterPage),
  },
  {
    path: 'esqueci-senha',
    loadComponent: () => import('./pages/forgot-password-page').then((m) => m.ForgotPasswordPage),
  },
];
