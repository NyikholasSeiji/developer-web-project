import { Injectable, computed, effect, signal } from '@angular/core';
import { User } from '../domain/models/user.model';
import { readFromLocalStorage, removeFromLocalStorage, writeToLocalStorage } from '../../shared/utils/local-storage.util';

const STORAGE_KEY = 'fnshop:session';

/**
 * Estado de sessão do usuário logado, em signal, persistido em
 * localStorage. Não é um caso de uso (não representa uma ação) — é o
 * estado que as ações de login/register/logout atualizam, e que a UI
 * (ex: Header) lê.
 *
 * A persistência é só uma cópia de conveniência para sobreviver a reloads:
 * a fonte da verdade continua sendo o backend (hoje, o mock) em cada login.
 */
@Injectable({ providedIn: 'root' })
export class AuthSessionStore {
  private readonly _user = signal<User | null>(readFromLocalStorage<User>(STORAGE_KEY));

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  constructor() {
    effect(() => {
      const user = this._user();
      if (user) {
        writeToLocalStorage(STORAGE_KEY, user);
      } else {
        removeFromLocalStorage(STORAGE_KEY);
      }
    });
  }

  setUser(user: User): void {
    this._user.set(user);
  }

  clear(): void {
    this._user.set(null);
  }
}
