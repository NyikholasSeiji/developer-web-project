import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCategory } from '../../../../core/domain/models/product-category.model';

@Component({
  selector: 'app-categories-section',
  imports: [RouterLink],
  templateUrl: './categories-section.html',
})
export class CategoriesSectionComponent {
  categories = input.required<ProductCategory[]>();
}
