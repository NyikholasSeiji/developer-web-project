import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { AuthRepository } from '../domain/repositories/auth-repository';
import { AuthSessionStore } from './auth-session.store';
import { OrderHistoryStore } from './order-history.store';

@Injectable({ providedIn: 'root' })
export class DeleteAccountUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly session: AuthSessionStore,
    private readonly orderHistory: OrderHistoryStore,
  ) {}

  execute(): Observable<void> {
    const current = this.session.user();
    if (!current) return of(undefined);

    return this.authRepository.deleteAccount(current.id).pipe(
      tap(() => {
        this.orderHistory.clearFor(current.id);
        this.session.clear();
      }),
    );
  }
}
