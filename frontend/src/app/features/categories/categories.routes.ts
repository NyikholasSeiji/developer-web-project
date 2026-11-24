import { Routes } from '@angular/router';

export const CATEGORIES_ROUTES: Routes = [
  {
    path: '',
    title: 'Categorias — FNShop',
    loadComponent: () => import('./pages/category-list-page').then((m) => m.CategoryListPage),
  },
];
