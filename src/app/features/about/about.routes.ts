import { Routes } from '@angular/router';

export const ABOUT_ROUTES: Routes = [
  {
    path: '',
    title: 'Sobre — FNShop',
    loadComponent: () => import('./pages/about-page').then((m) => m.AboutPage),
  },
];
