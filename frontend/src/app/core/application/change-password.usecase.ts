import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthRepository } from '../domain/repositories/auth-repository';
import { ChangePasswordData } from '../domain/models/change-password.model';
import { User } from '../domain/models/user.model';
import { AuthSessionStore } from './auth-session.store';

/** Define a nova senha e já deixa o cliente logado com ela. */
@Injectable({ providedIn: 'root' })
export class ChangePasswordUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly session: AuthSessionStore,
  ) {}

  execute(data: ChangePasswordData): Observable<User> {
    return this.authRepository.changePassword(data).pipe(tap((user) => this.session.setUser(user)));
  }
}
