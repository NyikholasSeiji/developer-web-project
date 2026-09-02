import { Routes } from '@angular/router';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    title: 'FNShop — Peças essenciais, feitas para durar',
    loadComponent: () => import('./pages/home-page').then((m) => m.HomePage),
  },
];
