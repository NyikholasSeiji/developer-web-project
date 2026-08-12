import { Injectable, computed, signal } from '@angular/core';
import { User } from '../domain/models/user.model';

/**
 * Estado de sessão do usuário logado, em memória (signal). Não é um
 * caso de uso (não representa uma ação) — é o estado que as ações de
 * login/register/logout atualizam, e que a UI (ex: Header) lê.
 */
@Injectable({ providedIn: 'root' })
export class AuthSessionStore {
  private readonly _user = signal<User | null>(null);

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  setUser(user: User): void {
    this._user.set(user);
  }

  clear(): void {
    this._user.set(null);
  }
}
