import { Injectable } from '@angular/core';
import { CartStore } from './cart.store';

@Injectable({ providedIn: 'root' })
export class RemoveFromCartUseCase {
  constructor(private readonly cart: CartStore) {}

  execute(productId: string): void {
    this.cart.removeItem(productId);
  }
}
