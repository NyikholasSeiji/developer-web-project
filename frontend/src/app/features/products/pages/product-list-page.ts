import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { ListProductsUseCase } from '../../../core/application/list-products.usecase';
import { ListCategoriesUseCase } from '../../../core/application/list-categories.usecase';
import { Product } from '../../../core/domain/models/product.model';
import { ProductCategory } from '../../../core/domain/models/product-category.model';
import { DEFAULT_PRODUCT_FILTER, ProductFilter } from '../../../core/domain/models/product-filter.model';
import { filterProducts } from '../../../shared/utils/filter-products.util';
import { FilterComponent } from '../../../shared/components/filter/filter';
import { ProductGridComponent } from '../../../shared/components/product-grid/product-grid';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';
import { ServiceUnavailableComponent } from '../../../shared/components/service-unavailable/service-unavailable';

/**
 * Página de listagem de produtos (`/produtos`), com catálogo real —
 * mesma fonte de dados usada na Home (ListProductsUseCase +
 * ListCategoriesUseCase + filterProducts).
 *
 * `categoria` chega automaticamente do query param (?categoria=X) via
 * withComponentInputBinding — é assim que o card de categoria da Home
 * (e a futura página de Categorias) leva direto pra cá já filtrado.
 */
@Component({
  selector: 'app-product-list-page',
  imports: [FilterComponent, ProductGridComponent, LoadingStateComponent, ServiceUnavailableComponent],
  templateUrl: './product-list-page.html',
})
export class ProductListPage {
  private readonly listProducts = inject(ListProductsUseCase);
  private readonly listCategories = inject(ListCategoriesUseCase);

  categoria = input<string>();

  private readonly products = signal<Product[] | null>(null);
  readonly categories = signal<ProductCategory[]>([]);
  readonly hasError = signal(false);

  readonly filter = signal<ProductFilter>(DEFAULT_PRODUCT_FILTER);

  readonly isLoading = computed(() => this.products() === null && !this.hasError());

  readonly filteredProducts = computed(() => {
    const products = this.products();
    return products ? filterProducts(products, this.filter()) : [];
  });

  constructor() {
    this.load();

    // Sincroniza o filtro de categoria sempre que o query param mudar
    // (ex: clicar em outra categoria enquanto já está em /produtos).
    effect(() => {
      const categoryId = this.categoria() ?? null;
      this.filter.update((current) => ({ ...current, categoryId }));
    });
  }

  onFilterChange(next: ProductFilter): void {
    this.filter.set(next);
  }

  onClearFilter(): void {
    this.filter.set(DEFAULT_PRODUCT_FILTER);
  }

  retry(): void {
    this.load();
  }

  private load(): void {
    this.hasError.set(false);
    this.products.set(null);

    this.listCategories.execute().subscribe({
      next: (categories) => this.categories.set(categories),
    });

    this.listProducts.execute().subscribe({
      next: (products) => this.products.set(products),
      error: () => this.hasError.set(true),
    });
  }
}
