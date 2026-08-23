import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ListProductsUseCase } from '../../../core/application/list-products.usecase';
import { DEFAULT_PRODUCT_FILTER } from '../../../core/domain/models/product-filter.model';
import { filterProducts } from '../../../shared/utils/filter-products.util';
import { ProductGridComponent } from '../../../shared/components/product-grid/product-grid';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';

/**
 * Página de resultados de busca (`/busca?q=termo`).
 *
 * `q` chega automaticamente do query param via `withComponentInputBinding()`
 * (configurado em app.config.ts). A filtragem em si reaproveita
 * `filterProducts`, o mesmo utilitário usado pelos filtros da Home.
 */
@Component({
  selector: 'app-search-page',
  imports: [ProductGridComponent, LoadingStateComponent],
  templateUrl: './search-page.html',
})
export class SearchPage {
  private readonly listProducts = inject(ListProductsUseCase);

  q = input<string>('');

  private readonly products = toSignal(this.listProducts.execute(), { initialValue: null });

  readonly isLoading = computed(() => this.products() === null);

  readonly results = computed(() => {
    const products = this.products();
    if (!products) return [];
    return filterProducts(products, { ...DEFAULT_PRODUCT_FILTER, query: this.q() });
  });
}
