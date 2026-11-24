import { Injectable } from '@angular/core';
import { Observable, tap, throwError } from 'rxjs';
import { OrderRepository } from '../domain/repositories/order-repository';
import { Order } from '../domain/models/order.model';
import { AuthSessionStore } from './auth-session.store';
import { CartStore } from './cart.store';
import { OrderHistoryStore } from './order-history.store';

export interface PlaceOrderInput {
  delivery: string;
  paymentMethod: string;
}

/**
 * Grava o pedido da sacola atual na API, registra no histórico do cliente
 * e esvazia a sacola. A API ainda não guarda itens, então o resumo deles
 * vai no campo de observação.
 */
@Injectable({ providedIn: 'root' })
export class PlaceOrderUseCase {
  constructor(
    private readonly orders: OrderRepository,
    private readonly session: AuthSessionStore,
    private readonly cart: CartStore,
    private readonly history: OrderHistoryStore,
  ) {}

  execute(input: PlaceOrderInput): Observable<Order> {
    const user = this.session.user();
    if (!user) return throwError(() => new Error('Você precisa estar logado para finalizar a compra.'));

    const items = this.cart.items();
    if (items.length === 0) return throwError(() => new Error('Sua sacola está vazia.'));

    const itemsSummary = items.map((item) => `${item.quantity}x ${item.product.name}`).join('; ');

    return this.orders
      .create({
        customerId: user.id,
        total: this.cart.totalPrice(),
        delivery: input.delivery,
        notes: `Pagamento: ${input.paymentMethod} | Itens: ${itemsSummary}`,
      })
      .pipe(
        tap((order) => {
          this.history.add(user.id, order.id);
          this.cart.clear();
        }),
      );
  }
}
