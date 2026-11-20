import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    title: 'Finalizar compra — FNShop',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/checkout-page').then((m) => m.CheckoutPage),
  },
];
