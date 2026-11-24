import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { OrderRepository } from '../../domain/repositories/order-repository';
import { NewOrder, Order } from '../../domain/models/order.model';
import { API_BASE_URL } from './api.config';
import { extractCodeFromMessage, toFriendlyError, toIsoDate, todayIsoDate } from './api-response.util';

/** Formato da entidade `com.ads.lojinha.Pedido`. */
interface PedidoDto {
  codigoPedido: number;
  valorTotal: number;
  entrega: string | null;
  obs: string | null;
  dataPedido: string | number | null;
  codigoCliente: number;
}

const BASE = `${API_BASE_URL}/api/pedido`;

/** OrderRepository sobre a API Spring Boot (PedidoController). */
@Injectable()
export class HttpOrderRepository implements OrderRepository {
  constructor(private readonly http: HttpClient) {}

  create(order: NewOrder): Observable<Order> {
    const body: Omit<PedidoDto, 'codigoPedido'> = {
      valorTotal: order.total,
      entrega: order.delivery,
      obs: order.notes,
      dataPedido: todayIsoDate(),
      codigoCliente: Number(order.customerId),
    };

    // A API responde "Cliente gravado com sucesso! N" (sic) — o N é o código do pedido.
    return this.http.post(BASE, body, { responseType: 'text' }).pipe(
      map((message) => {
        const codigo = extractCodeFromMessage(message);
        if (!codigo) throw new Error('Não foi possível registrar o pedido.');
        return this.toOrder({ ...body, codigoPedido: codigo });
      }),
      catchError((error) => throwError(() => toFriendlyError(error, 'Não foi possível registrar o pedido.'))),
    );
  }

  findById(id: string): Observable<Order | undefined> {
    return this.http
      .get<PedidoDto>(`${BASE}/${id}`)
      .pipe(map((pedido) => (pedido?.codigoPedido ? this.toOrder(pedido) : undefined)));
  }

  update(order: Order): Observable<Order> {
    const body: PedidoDto = {
      codigoPedido: Number(order.id),
      valorTotal: order.total,
      entrega: order.delivery,
      obs: order.notes,
      dataPedido: order.date,
      codigoCliente: Number(order.customerId),
    };

    return this.http.put(BASE, body, { responseType: 'text' }).pipe(
      map((message) => {
        if (message.includes('não encontrado')) throw new Error('Pedido não encontrado.');
        return this.toOrder(body);
      }),
      catchError((error) => throwError(() => toFriendlyError(error, 'Não foi possível alterar o pedido.'))),
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete(`${BASE}/${id}`, { responseType: 'text' }).pipe(
      map(() => undefined),
      catchError((error) => throwError(() => toFriendlyError(error, 'Não foi possível cancelar o pedido.'))),
    );
  }

  private toOrder(pedido: PedidoDto): Order {
    return {
      id: String(pedido.codigoPedido),
      customerId: String(pedido.codigoCliente),
      total: pedido.valorTotal,
      delivery: pedido.entrega ?? '',
      notes: pedido.obs ?? '',
      date: toIsoDate(pedido.dataPedido),
    };
  }
}
