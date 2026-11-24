import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductRepository } from '../domain/repositories/product-repository';
import { Product } from '../domain/models/product.model';

@Injectable({ providedIn: 'root' })
export class SearchProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(term: string): Observable<Product[]> {
    const trimmed = term.trim();
    return trimmed ? this.productRepository.search(trimmed) : of([]);
  }
}
