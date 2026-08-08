import { Component, input } from '@angular/core';
import { Product } from '../../../core/domain/models/product.model';
import { formatCurrency } from '../../utils/format-currency.util';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.html',
})
export class ProductCardComponent {
  product = input.required<Product>();

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
}
