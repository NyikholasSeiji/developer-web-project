import { Component, computed, inject, signal } from '@angular/core';
import { HeroSectionComponent } from '../components/hero-section/hero-section';
import { CategoriesSectionComponent } from '../components/categories-section/categories-section';
import { ProductSectionComponent } from '../components/product-section/product-section';
import { CtaSectionComponent } from '../../../shared/components/cta-section/cta-section';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';
import { ListCategoriesUseCase } from '../../../core/application/list-categories.usecase';
import { ProductCategory } from '../../../core/domain/models/product-category.model';

@Component({
  selector: 'app-home-page',
  imports: [
    HeroSectionComponent,
    CategoriesSectionComponent,
    ProductSectionComponent,
    CtaSectionComponent,
    LoadingStateComponent,
  ],
  templateUrl: './home-page.html',
})
export class HomePage {
  private readonly listCategories = inject(ListCategoriesUseCase);

  private readonly categories = signal<ProductCategory[] | null>(null);
  readonly categoriesLoading = computed(() => this.categories() === null);

  constructor() {
    this.listCategories.execute().subscribe((categories) => this.categories.set(categories));
  }

  readonly categoriesValue = computed(() => this.categories() ?? []);
}
