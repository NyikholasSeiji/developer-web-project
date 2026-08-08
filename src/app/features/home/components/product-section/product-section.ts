import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ListProductsUseCase } from '../../../../core/application/list-products.usecase';
import { ListCategoriesUseCase } from '../../../../core/application/list-categories.usecase';
import { DEFAULT_PRODUCT_FILTER, ProductFilter } from '../../../../core/domain/models/product-filter.model';
import { filterProducts } from '../../../../shared/utils/filter-products.util';
import { FilterComponent } from '../../../../shared/components/filter/filter';
import { ProductGridComponent } from '../../../../shared/components/product-grid/product-grid';

@Component({
  selector: 'app-product-section',
  imports: [FilterComponent, ProductGridComponent],
  templateUrl: './product-section.html',
})
export class ProductSectionComponent {
  private readonly listProducts = inject(ListProductsUseCase);
  private readonly listCategories = inject(ListCategoriesUseCase);

  private readonly products = toSignal(this.listProducts.execute(), { initialValue: [] });
  readonly categories = toSignal(this.listCategories.execute(), { initialValue: [] });

  readonly filter = signal<ProductFilter>(DEFAULT_PRODUCT_FILTER);

  readonly filteredProducts = computed(() => filterProducts(this.products(), this.filter()));

  onFilterChange(next: ProductFilter): void {
    this.filter.set(next);
  }

  onClearFilter(): void {
    this.filter.set(DEFAULT_PRODUCT_FILTER);
  }
}
