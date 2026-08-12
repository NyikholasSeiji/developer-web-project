import { Injectable } from '@angular/core';
import { AuthSessionStore } from './auth-session.store';

@Injectable({ providedIn: 'root' })
export class LogoutUseCase {
  constructor(private readonly session: AuthSessionStore) {}

  execute(): void {
    this.session.clear();
  }
}
