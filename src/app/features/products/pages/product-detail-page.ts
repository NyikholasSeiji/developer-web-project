import { Component, inject, input, signal } from '@angular/core';
import { GetProductByIdUseCase } from '../../../core/application/get-product-by-id.usecase';
import { Product } from '../../../core/domain/models/product.model';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';
import { ButtonComponent } from '../../../shared/components/button/button';
import { formatCurrency } from '../../../shared/utils/format-currency.util';

type DetailState = 'loading' | 'found' | 'not-found';

/**
 * Página de detalhe de um produto (`/produtos/:id`).
 *
 * O `id` chega via `input()` ligado ao parâmetro de rota (habilitado em
 * app.config.ts com `withComponentInputBinding()`). Busca o produto através
 * de `GetProductByIdUseCase`, que hoje resolve para o mock, mas trocará de
 * fonte de dados sem exigir mudanças aqui quando a API real existir.
 */
@Component({
  selector: 'app-product-detail-page',
  imports: [LoadingStateComponent, ButtonComponent],
  templateUrl: './product-detail-page.html',
})
export class ProductDetailPage {
  private readonly getProductById = inject(GetProductByIdUseCase);

  id = input.required<string>();

  readonly state = signal<DetailState>('loading');
  readonly product = signal<Product | null>(null);

  constructor() {
    this.load();
  }

  private load(): void {
    this.state.set('loading');
    this.product.set(null);

    this.getProductById.execute(this.id()).subscribe((product) => {
      if (product) {
        this.product.set(product);
        this.state.set('found');
      } else {
        this.state.set('not-found');
      }
    });
  }

  formattedPrice(): string {
    const product = this.product();
    return product ? formatCurrency(product.price) : '';
  }

  formattedPreviousPrice(): string | null {
    const previous = this.product()?.previousPrice;
    return previous != null ? formatCurrency(previous) : null;
  }

  catalogLabel(): string {
    const product = this.product();
    return product ? `Nº ${String(product.catalogNumber).padStart(2, '0')}` : '';
  }
}
