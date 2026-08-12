import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then((m) => m.HOME_ROUTES),
  },
  {
    path: 'sobre',
    loadChildren: () => import('./features/about/about.routes').then((m) => m.ABOUT_ROUTES),
  },
  {
    path: '',
    loadChildren: () =>
      import('./features/authentication/authentication.routes').then((m) => m.AUTHENTICATION_ROUTES),
  },

  // Próximas features registram suas rotas do mesmo jeito, por exemplo:
  // {
  //   path: 'produtos',
  //   loadChildren: () =>
  //     import('./features/products/products.routes').then((m) => m.PRODUCTS_ROUTES),
  // },
];
