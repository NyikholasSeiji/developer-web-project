import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../domain/models/cart-item.model';
import { Product } from '../domain/models/product.model';

/**
 * Estado da sacola de compras, em memória (signal). Como a AuthSessionStore,
 * não é um caso de uso — é o estado que os casos de uso de carrinho
 * atualizam, e que a UI (Header, CartPage) lê diretamente.
 */
@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();

  readonly totalQuantity = computed(() => this._items().reduce((sum, item) => sum + item.quantity, 0));

  readonly totalPrice = computed(() =>
    this._items().reduce((sum, item) => sum + item.product.price * item.quantity, 0),
  );

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
