import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    title: 'Meu perfil — FNShop',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile-page').then((m) => m.ProfilePage),
  },
];
