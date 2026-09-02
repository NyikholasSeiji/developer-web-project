import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    title: 'Produtos — FNShop',
    loadComponent: () => import('./pages/product-list-page').then((m) => m.ProductListPage),
  },
  {
    path: ':id',
    title: 'Produto — FNShop',
    loadComponent: () => import('./pages/product-detail-page').then((m) => m.ProductDetailPage),
  },
];
