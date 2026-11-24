import { Routes } from '@angular/router';

export const CART_ROUTES: Routes = [
  {
    path: '',
    title: 'Cesta — FNShop',
    loadComponent: () => import('./pages/cart-page').then((m) => m.CartPage),
  },
];
