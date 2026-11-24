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
  {
    path: 'produtos',
    loadChildren: () =>
      import('./features/products/products.routes').then((m) => m.PRODUCTS_ROUTES),
  },
  {
    path: 'categorias',
    loadChildren: () =>
      import('./features/categories/categories.routes').then((m) => m.CATEGORIES_ROUTES),
  },
  {
    path: 'busca',
    loadChildren: () =>
      import('./features/search/search.routes').then((m) => m.SEARCH_ROUTES),
  },
  {
    path: 'carrinho',
    loadChildren: () =>
      import('./features/cart/cart.routes').then((m) => m.CART_ROUTES),
  },
  {
    path: 'checkout',
    loadChildren: () =>
      import('./features/checkout/checkout.routes').then((m) => m.CHECKOUT_ROUTES),
  },
  {
    path: 'perfil',
    loadChildren: () =>
      import('./features/profile/profile.routes').then((m) => m.PROFILE_ROUTES),
  },
  {
    path: 'favoritos',
    title: 'Favoritos — FNShop',
    loadComponent: () =>
      import('./features/favorites/pages/favorites-page').then((m) => m.FavoritesPage),
  },

  // Próximas features registram suas rotas do mesmo jeito.

  // Wildcard: sempre por último — qualquer rota que não bateu com nenhuma
  // acima cai aqui, em vez de deixar o router-outlet em branco.
  {
    path: '**',
    title: 'Página não encontrada — FNShop',
    loadComponent: () =>
      import('./features/not-found/pages/not-found-page').then((m) => m.NotFoundPage),
  },
];
