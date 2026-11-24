import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { AuthRepository } from '../domain/repositories/auth-repository';
import { ProfileUpdate } from '../domain/models/profile-update.model';
import { User } from '../domain/models/user.model';
import { AuthSessionStore } from './auth-session.store';

@Injectable({ providedIn: 'root' })
export class UpdateProfileUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly session: AuthSessionStore,
  ) {}

  execute(changes: ProfileUpdate): Observable<User> {
    const current = this.session.user();
    if (!current) return throwError(() => new Error('Você precisa estar logado.'));

    return this.authRepository.updateProfile(current.id, changes).pipe(tap((user) => this.session.setUser(user)));
  }
}
