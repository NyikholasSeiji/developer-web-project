import { Component, inject } from '@angular/core';
import { CartStore } from '../../../core/application/cart.store';
import { UpdateCartItemQuantityUseCase } from '../../../core/application/update-cart-item-quantity.usecase';
import { RemoveFromCartUseCase } from '../../../core/application/remove-from-cart.usecase';
import { ClearCartUseCase } from '../../../core/application/clear-cart.usecase';
import { ButtonComponent } from '../../../shared/components/button/button';
import { formatCurrency } from '../../../shared/utils/format-currency.util';

@Component({
  selector: 'app-cart-page',
  imports: [ButtonComponent],
  templateUrl: './cart-page.html',
})
export class CartPage {
  private readonly cart = inject(CartStore);
  private readonly updateQuantityUseCase = inject(UpdateCartItemQuantityUseCase);
  private readonly removeFromCartUseCase = inject(RemoveFromCartUseCase);
  private readonly clearCartUseCase = inject(ClearCartUseCase);

  readonly items = this.cart.items;
  readonly totalPrice = this.cart.totalPrice;

  formattedUnitPrice(price: number): string {
    return formatCurrency(price);
  }

  formattedSubtotal(price: number, quantity: number): string {
    return formatCurrency(price * quantity);
  }

  formattedTotal(): string {
    return formatCurrency(this.totalPrice());
  }

  increase(productId: string, currentQuantity: number): void {
    this.updateQuantityUseCase.execute(productId, currentQuantity + 1);
  }

  decrease(productId: string, currentQuantity: number): void {
    this.updateQuantityUseCase.execute(productId, currentQuantity - 1);
  }

  remove(productId: string): void {
    this.removeFromCartUseCase.execute(productId);
  }

  clear(): void {
    this.clearCartUseCase.execute();
  }
}
