import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { ListProductsUseCase } from '../../../core/application/list-products.usecase';
import { DEFAULT_PRODUCT_FILTER } from '../../../core/domain/models/product-filter.model';
import { filterProducts } from '../../../shared/utils/filter-products.util';

import { ProductGridComponent } from '../../../shared/components/product-grid/product-grid';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';

@Component({
  selector: 'app-search-page',
  imports: [
    ProductGridComponent,
    LoadingStateComponent,
  ],
  templateUrl: './search-page.html',
})
export class SearchPage {

  // =========================
  // DEPENDÊNCIAS
  // =========================

  private readonly listProducts = inject(ListProductsUseCase);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // =========================
  // QUERY PARAMETER
  // =========================

  readonly q = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => params.get('q') ?? '')
    ),
    {
      initialValue: '',
    }
  );

  // =========================
  // PRODUTOS
  // =========================

  private readonly products = toSignal(
    this.listProducts.execute(),
    {
      initialValue: null,
    }
  );

  readonly isLoading = computed(() => {
    return this.products() === null;
  });

  // =========================
  // RESULTADOS DA BUSCA
  // =========================

  readonly results = computed(() => {
    const products = this.products();

    if (!products) {
      return [];
    }

    return filterProducts(products, {
      ...DEFAULT_PRODUCT_FILTER,
      query: this.q(),
    });
  });

  // =========================
  // AUTOCOMPLETE
  // =========================

  readonly searchTerm = signal('');

  readonly suggestions = signal<string[]>([]);

  onSearchChange(term: string): void {
    this.searchTerm.set(term);

    const products = this.products();

    if (!products || !term.trim()) {
      this.suggestions.set([]);
      return;
    }

    const normalizedTerm = term
      .toLowerCase()
      .trim();

    const suggestions = products
      .map((product) => product.name)
      .filter((name) =>
        name.toLowerCase().includes(normalizedTerm)
      );

    this.suggestions.set(suggestions);
  }

  // =========================
  // SELECIONAR SUGESTÃO
  // =========================

  selectItem(item: string): void {
    this.searchTerm.set(item);
    this.suggestions.set([]);

    this.router.navigate(['/busca'], {
      queryParams: {
        q: item,
      },
    });
  }

  // =========================
  // ENVIAR BUSCA
  // =========================

  submitSearch(): void {
    const term = this.searchTerm().trim();

    if (!term) {
      return;
    }

    this.suggestions.set([]);

    this.router.navigate(['/busca'], {
      queryParams: {
        q: term,
      },
    });
  }
}