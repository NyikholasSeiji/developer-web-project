import { Injectable, signal } from '@angular/core';
import { readFromLocalStorage, writeToLocalStorage } from '../../shared/utils/local-storage.util';

const STORAGE_KEY = 'fnshop:orders';

/** Mapa id do cliente → ids dos pedidos feitos neste navegador. */
type OrderIndex = Record<string, string[]>;

/**
 * A API de pedidos não tem listagem nem filtro por cliente — só busca por
 * código. Por isso guardamos aqui os códigos dos pedidos que o cliente fez,
 * para conseguir montar "Meus pedidos" consultando cada um na API.
 */
@Injectable({ providedIn: 'root' })
export class OrderHistoryStore {
  private readonly index = signal<OrderIndex>(readFromLocalStorage<OrderIndex>(STORAGE_KEY) ?? {});

  idsFor(customerId: string): string[] {
    return this.index()[customerId] ?? [];
  }

  add(customerId: string, orderId: string): void {
    this.write({ ...this.index(), [customerId]: [orderId, ...this.idsFor(customerId)] });
  }

  remove(customerId: string, orderId: string): void {
    this.write({ ...this.index(), [customerId]: this.idsFor(customerId).filter((id) => id !== orderId) });
  }

  clearFor(customerId: string): void {
    const { [customerId]: _removed, ...rest } = this.index();
    this.write(rest);
  }

  private write(next: OrderIndex): void {
    this.index.set(next);
    writeToLocalStorage(STORAGE_KEY, next);
  }
}
