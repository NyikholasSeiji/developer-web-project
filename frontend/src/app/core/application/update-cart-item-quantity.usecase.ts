import { Injectable } from '@angular/core';
import { CartStore } from './cart.store';

@Injectable({ providedIn: 'root' })
export class UpdateCartItemQuantityUseCase {
  constructor(private readonly cart: CartStore) {}

  execute(productId: string, quantity: number): void {
    this.cart.updateQuantity(productId, quantity);
  }
}
