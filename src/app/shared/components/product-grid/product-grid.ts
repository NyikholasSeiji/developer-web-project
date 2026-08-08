import { Component, input } from '@angular/core';
import { Product } from '../../../core/domain/models/product.model';
import { ProductCardComponent } from '../product-card/product-card';

@Component({
  selector: 'app-product-grid',
  imports: [ProductCardComponent],
  templateUrl: './product-grid.html',
})
export class ProductGridComponent {
  products = input.required<Product[]>();
}
