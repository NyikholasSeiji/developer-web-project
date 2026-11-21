import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { CartItem } from '../domain/models/cart-item.model';
import { Product } from '../domain/models/product.model';
import {
  readFromLocalStorage,
  removeFromLocalStorage,
  writeToLocalStorage,
} from '../../shared/utils/local-storage.util';
import { AuthSessionStore } from './auth-session.store';

const STORAGE_KEY = 'fnshop:cart';

/**
 * Estado da sacola de compras, em memória (signal) e persistido em
 * localStorage.
 *
 * A sacola é exclusiva de contas cadastradas: só carrega/persiste itens
 * quando há sessão ativa e é esvaziada ao sair. Assim, uma sacola antiga de
 * outra pessoa (ou de antes do login) nunca vaza para um visitante.
 */
@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly session = inject(AuthSessionStore);

  private readonly _items = signal<CartItem[]>(
    this.session.isAuthenticated() ? (readFromLocalStorage<CartItem[]>(STORAGE_KEY) ?? []) : [],
  );

  readonly items = this._items.asReadonly();

  readonly totalQuantity = computed(() => this._items().reduce((sum, item) => sum + item.quantity, 0));

  readonly totalPrice = computed(() =>
    this._items().reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );

  constructor() {
    effect(() => {
      if (!this.session.isAuthenticated()) {
        if (this._items().length > 0) {
          this._items.set([]);
        }
        removeFromLocalStorage(STORAGE_KEY);
        return;
      }

      writeToLocalStorage(STORAGE_KEY, this._items());
    });
  }

  addItem(product: Product, quantity = 1): void {
    const items = this._items();
    const existing = items.find((item) => item.product.id === product.id);

    if (existing) {
      this._items.set(
        items.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        ),
      );
      return;
    }

    this._items.set([...items, { product, quantity }]);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this._items.set(this._items().map((item) => (item.product.id === productId ? { ...item, quantity } : item)));
  }

  removeItem(productId: string): void {
    this._items.set(this._items().filter((item) => item.product.id !== productId));
  }

  clear(): void {
    this._items.set([]);
  }
}
