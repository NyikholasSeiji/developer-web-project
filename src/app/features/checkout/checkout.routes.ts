import { Routes } from '@angular/router';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    title: 'Finalizar compra — FNShop',
    loadComponent: () => import('./pages/checkout-page').then((m) => m.CheckoutPage),
  },
];
