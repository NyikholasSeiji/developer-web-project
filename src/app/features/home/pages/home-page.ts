import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { HeroSectionComponent } from '../components/hero-section/hero-section';
import { CategoriesSectionComponent } from '../components/categories-section/categories-section';
import { ProductSectionComponent } from '../components/product-section/product-section';
import { CtaSectionComponent } from '../../../shared/components/cta-section/cta-section';
import { ListCategoriesUseCase } from '../../../core/application/list-categories.usecase';

@Component({
  selector: 'app-home-page',
  imports: [HeroSectionComponent, CategoriesSectionComponent, ProductSectionComponent, CtaSectionComponent],
  templateUrl: './home-page.html',
})
export class HomePage {
  private readonly listCategories = inject(ListCategoriesUseCase);
  readonly categories = toSignal(this.listCategories.execute(), { initialValue: [] });
}
