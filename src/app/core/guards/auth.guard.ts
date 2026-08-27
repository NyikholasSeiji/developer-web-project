import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionStore } from '../application/auth-session.store';

/**
 * Bloqueia o acesso a rotas que exigem login. Redireciona para /login
 * quando não há sessão ativa; deixa passar quando há.
 *
 * Não fica em core/config (que é só sobre wiring de repositórios) nem em
 * core/application (que é sobre casos de uso/estado) — é uma peça de
 * roteamento do Angular, então tem seu próprio lugar em core/guards.
 *
 * Uso: `{ path: 'perfil', canActivate: [authGuard], ... }`
 */
export const authGuard: CanActivateFn = () => {
  const session = inject(AuthSessionStore);
  const router = inject(Router);

  return session.isAuthenticated() || router.parseUrl('/login');
};
