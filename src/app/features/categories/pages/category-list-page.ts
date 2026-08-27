import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ListCategoriesUseCase } from '../../../core/application/list-categories.usecase';
import { ListProductsUseCase } from '../../../core/application/list-products.usecase';
import { ProductCategory } from '../../../core/domain/models/product-category.model';
import { Product } from '../../../core/domain/models/product.model';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';
import { ServiceUnavailableComponent } from '../../../shared/components/service-unavailable/service-unavailable';

interface CategoryWithCount extends ProductCategory {
  productCount: number;
}

/**
 * Página de listagem de categorias (`/categorias`), com catálogo real.
 * Cada categoria mostra nome, imagem, quantidade de produtos (calculada a
 * partir do catálogo) e leva para `/produtos?categoria=<id>` já filtrado.
 */
@Component({
  selector: 'app-category-list-page',
  imports: [RouterLink, LoadingStateComponent, ServiceUnavailableComponent],
  templateUrl: './category-list-page.html',
})
export class CategoryListPage {
  private readonly listCategories = inject(ListCategoriesUseCase);
  private readonly listProducts = inject(ListProductsUseCase);

  private readonly categories = signal<ProductCategory[] | null>(null);
  private readonly products = signal<Product[] | null>(null);
  readonly hasError = signal(false);

  readonly isLoading = computed(
    () => (this.categories() === null || this.products() === null) && !this.hasError(),
  );

  readonly categoriesWithCount = computed<CategoryWithCount[]>(() => {
    const categories = this.categories();
    const products = this.products();
    if (!categories || !products) return [];

    return categories.map((category) => ({
      ...category,
      productCount: products.filter((product) => product.category === category.id).length,
    }));
  });

  constructor() {
    this.load();
  }

  retry(): void {
    this.load();
  }

  private load(): void {
    this.hasError.set(false);
    this.categories.set(null);
    this.products.set(null);

    forkJoin({
      categories: this.listCategories.execute(),
      products: this.listProducts.execute(),
    }).subscribe({
      next: ({ categories, products }) => {
        this.categories.set(categories);
        this.products.set(products);
      },
      error: () => this.hasError.set(true),
    });
  }
}
