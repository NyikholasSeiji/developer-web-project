import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductRepository } from '../domain/repositories/product-repository';
import { Product } from '../domain/models/product.model';

@Injectable({ providedIn: 'root' })
export class ListProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(): Observable<Product[]> {
    return this.productRepository.findAll();
  }
}
