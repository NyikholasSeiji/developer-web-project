import { Injectable } from '@angular/core';
import { Product } from '../domain/models/product.model';
import { CartStore } from './cart.store';

@Injectable({ providedIn: 'root' })
export class AddToCartUseCase {
  constructor(private readonly cart: CartStore) {}

  execute(product: Product, quantity = 1): void {
    this.cart.addItem(product, quantity);
  }
}
