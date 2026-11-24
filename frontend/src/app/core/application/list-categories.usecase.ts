import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductRepository } from '../domain/repositories/product-repository';
import { ProductCategory } from '../domain/models/product-category.model';

@Injectable({ providedIn: 'root' })
export class ListCategoriesUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(): Observable<ProductCategory[]> {
    return this.productRepository.findCategories();
  }
}
