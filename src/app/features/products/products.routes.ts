import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/product-list-page').then((m) => m.ProductListPage),
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/product-detail-page').then((m) => m.ProductDetailPage),
  },
];
