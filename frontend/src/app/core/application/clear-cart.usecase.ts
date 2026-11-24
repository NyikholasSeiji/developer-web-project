import { Injectable } from '@angular/core';
import { CartStore } from './cart.store';

@Injectable({ providedIn: 'root' })
export class ClearCartUseCase {
  constructor(private readonly cart: CartStore) {}

  execute(): void {
    this.cart.clear();
  }
}
