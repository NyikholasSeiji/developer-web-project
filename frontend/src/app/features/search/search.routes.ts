import { Routes } from '@angular/router';

export const SEARCH_ROUTES: Routes = [
  {
    path: '',
    title: 'Busca — FNShop',
    loadComponent: () => import('./pages/search-page').then((m) => m.SearchPage),
  },
];
