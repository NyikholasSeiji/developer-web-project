import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const CART_ROUTES: Routes = [
  {
    path: '',
    title: 'Cesta — FNShop',
    // A sacola é exclusiva de contas cadastradas.
    canActivate: [authGuard],
    loadComponent: () => import('./pages/cart-page').then((m) => m.CartPage),
  },
];
