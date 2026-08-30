import { Component, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/domain/models/product.model';
import { AddToCartUseCase } from '../../../core/application/add-to-cart.usecase';
import { formatCurrency } from '../../utils/format-currency.util';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
})
export class ProductCardComponent {
  private readonly addToCartUseCase = inject(AddToCartUseCase);

  product = input.required<Product>();

  /** Feedback breve no botão "Comprar" ao adicionar direto da grade. */
  readonly justAdded = signal(false);

  formattedPrice(): string {
    return formatCurrency(this.product().price);
  }

  formattedPreviousPrice(): string | null {
    const prev = this.product().previousPrice;
    return prev != null ? formatCurrency(prev) : null;
  }

  catalogLabel(): string {
    return `Nº ${String(this.product().catalogNumber).padStart(2, '0')}`;
  }

  onAddToCart(): void {
    this.addToCartUseCase.execute(this.product());
    this.justAdded.set(true);
    setTimeout(() => this.justAdded.set(false), 1200);
  }
}
