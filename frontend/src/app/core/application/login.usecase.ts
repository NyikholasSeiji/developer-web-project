import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthRepository } from '../domain/repositories/auth-repository';
import { LoginCredentials } from '../domain/models/login-credentials.model';
import { User } from '../domain/models/user.model';
import { AuthSessionStore } from './auth-session.store';

@Injectable({ providedIn: 'root' })
export class LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly session: AuthSessionStore,
  ) {}

  execute(credentials: LoginCredentials): Observable<User> {
    return this.authRepository.login(credentials).pipe(tap((user) => this.session.setUser(user)));
  }
}
