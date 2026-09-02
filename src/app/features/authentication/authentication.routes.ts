import { Routes } from '@angular/router';

export const AUTHENTICATION_ROUTES: Routes = [
  {
    path: 'login',
    title: 'Entrar — FNShop',
    loadComponent: () => import('./pages/login-page').then((m) => m.LoginPage),
  },
  {
    path: 'cadastro',
    title: 'Criar conta — FNShop',
    loadComponent: () => import('./pages/register-page').then((m) => m.RegisterPage),
  },
  {
    path: 'esqueci-senha',
    title: 'Recuperar senha — FNShop',
    loadComponent: () => import('./pages/forgot-password-page').then((m) => m.ForgotPasswordPage),
  },
];
