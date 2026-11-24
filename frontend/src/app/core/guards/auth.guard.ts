import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthSessionStore } from '../application/auth-session.store';

/**
 * Bloqueia o acesso a rotas que exigem login. Redireciona para /login
 * quando não há sessão ativa; deixa passar quando há. A rota de destino
 * vai no query param `redirect`, para o usuário voltar a ela após entrar.
 *
 * Não fica em core/config (que é só sobre wiring de repositórios) nem em
 * core/application (que é sobre casos de uso/estado) — é uma peça de
 * roteamento do Angular, então tem seu próprio lugar em core/guards.
 *
 * Uso: `{ path: 'perfil', canActivate: [authGuard], ... }`
 */
export const authGuard: CanActivateFn = (_route, state) => {
  const session = inject(AuthSessionStore);
  const router = inject(Router);

  if (session.isAuthenticated()) {
    return true;
  }

  return router.parseUrl(`/login?redirect=${encodeURIComponent(state.url)}`);
};
