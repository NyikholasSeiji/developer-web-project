import { Component, computed, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ListProductsUseCase } from '../../../../core/application/list-products.usecase';
import { ListCategoriesUseCase } from '../../../../core/application/list-categories.usecase';
import { DEFAULT_PRODUCT_FILTER, ProductFilter } from '../../../../core/domain/models/product-filter.model';
import { Product } from '../../../../core/domain/models/product.model';
import { ProductCategory } from '../../../../core/domain/models/product-category.model';
import { filterProducts } from '../../../../shared/utils/filter-products.util';
import { FilterComponent } from '../../../../shared/components/filter/filter';
import { ProductGridComponent } from '../../../../shared/components/product-grid/product-grid';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state';

@Component({
  selector: 'app-product-section',
  imports: [FilterComponent, ProductGridComponent, LoadingStateComponent],
  templateUrl: './product-section.html',
})
export class ProductSectionComponent {
  private readonly listProducts = inject(ListProductsUseCase);
  private readonly listCategories = inject(ListCategoriesUseCase);

  private readonly products = signal<Product[] | null>(null);
  readonly categories = signal<ProductCategory[]>([]);

  readonly isLoading = computed(() => this.products() === null);

  readonly filter = signal<ProductFilter>(DEFAULT_PRODUCT_FILTER);

  readonly filteredProducts = computed(() => {
    const products = this.products();
    return products ? filterProducts(products, this.filter()) : [];
  });

  constructor() {
    forkJoin({
      products: this.listProducts.execute(),
      categories: this.listCategories.execute(),
    }).subscribe(({ products, categories }) => {
      this.products.set(products);
      this.categories.set(categories);
    });
  }

  onFilterChange(next: ProductFilter): void {
    this.filter.set(next);
  }

  onClearFilter(): void {
    this.filter.set(DEFAULT_PRODUCT_FILTER);
  }
}
