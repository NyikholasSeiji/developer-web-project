import { Injectable } from '@angular/core';
import { Observable, map, of, tap } from 'rxjs';
import { AuthRepository } from '../domain/repositories/auth-repository';
import { User } from '../domain/models/user.model';
import { AuthSessionStore } from './auth-session.store';

/**
 * Recarrega os dados do cliente logado a partir da API. Se a conta não
 * existir mais, encerra a sessão local (resolve com `null`).
 */
@Injectable({ providedIn: 'root' })
export class RefreshProfileUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly session: AuthSessionStore,
  ) {}

  execute(): Observable<User | null> {
    const current = this.session.user();
    if (!current) return of(null);

    return this.authRepository.findById(current.id).pipe(
      tap((user) => (user ? this.session.setUser(user) : this.session.clear())),
      map((user) => user ?? null),
    );
  }
}
