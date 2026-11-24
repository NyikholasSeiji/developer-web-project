import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, concat, map, of, switchMap } from 'rxjs';

import { ListProductsUseCase } from '../../../core/application/list-products.usecase';
import { SearchProductsUseCase } from '../../../core/application/search-products.usecase';
import { Product } from '../../../core/domain/models/product.model';

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
  private readonly searchProducts = inject(SearchProductsUseCase);
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
  // PRODUTOS (usados só no autocomplete)
  // =========================

  private readonly products = toSignal(
    this.listProducts.execute(),
    {
      initialValue: null,
    }
  );

  // =========================
  // RESULTADOS DA BUSCA (GET /api/produto/busca/{termo})
  // =========================

  /** `null` enquanto a busca do termo atual está em andamento. */
  private readonly searchResults = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => params.get('q') ?? ''),
      switchMap((term) =>
        concat(
          of(null),
          this.searchProducts.execute(term).pipe(catchError(() => of([] as Product[]))),
        ),
      ),
    ),
    { initialValue: null },
  );

  readonly isLoading = computed(() => {
    return this.searchResults() === null;
  });

  readonly results = computed(() => this.searchResults() ?? []);

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