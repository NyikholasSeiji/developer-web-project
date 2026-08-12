import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthRepository } from '../domain/repositories/auth-repository';
import { RegisterData } from '../domain/models/register-data.model';
import { User } from '../domain/models/user.model';
import { AuthSessionStore } from './auth-session.store';

@Injectable({ providedIn: 'root' })
export class RegisterUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly session: AuthSessionStore,
  ) {}

  execute(data: RegisterData): Observable<User> {
    return this.authRepository.register(data).pipe(tap((user) => this.session.setUser(user)));
  }
}
