import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { OrderRepository } from '../domain/repositories/order-repository';
import { AuthSessionStore } from './auth-session.store';
import { OrderHistoryStore } from './order-history.store';

@Injectable({ providedIn: 'root' })
export class CancelOrderUseCase {
  constructor(
    private readonly orders: OrderRepository,
    private readonly session: AuthSessionStore,
    private readonly history: OrderHistoryStore,
  ) {}

  execute(orderId: string): Observable<void> {
    const user = this.session.user();
    if (!user) return of(undefined);

    return this.orders.delete(orderId).pipe(tap(() => this.history.remove(user.id, orderId)));
  }
}
