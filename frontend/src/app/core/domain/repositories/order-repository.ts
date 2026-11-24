import { Observable } from 'rxjs';
import { NewOrder, Order } from '../models/order.model';

/** Contrato (port) para pedidos. */
export abstract class OrderRepository {
  /** Grava o pedido e resolve com ele já com id e data. */
  abstract create(order: NewOrder): Observable<Order>;
  /** Retorna `undefined` quando o pedido não existe. */
  abstract findById(id: string): Observable<Order | undefined>;
  abstract update(order: Order): Observable<Order>;
  abstract delete(id: string): Observable<void>;
}
