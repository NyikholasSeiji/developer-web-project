import { Injectable } from '@angular/core';
import { Observable, catchError, forkJoin, map, of } from 'rxjs';
import { OrderRepository } from '../domain/repositories/order-repository';
import { Order } from '../domain/models/order.model';
import { AuthSessionStore } from './auth-session.store';
import { OrderHistoryStore } from './order-history.store';

@Injectable({ providedIn: 'root' })
export class ListMyOrdersUseCase {
  constructor(
    private readonly orders: OrderRepository,
    private readonly session: AuthSessionStore,
    private readonly history: OrderHistoryStore,
  ) {}

  execute(): Observable<Order[]> {
    const user = this.session.user();
    if (!user) return of([]);

    const ids = this.history.idsFor(user.id);
    if (ids.length === 0) return of([]);

    return forkJoin(
      ids.map((id) =>
        this.orders.findById(id).pipe(
          map((order) => {
            // Pedido apagado no backend: limpa do histórico local.
            if (!order) this.history.remove(user.id, id);
            return order;
          }),
          catchError(() => of(undefined)),
        ),
      ),
    ).pipe(map((orders) => orders.filter((order): order is Order => order !== undefined)));
  }
}
