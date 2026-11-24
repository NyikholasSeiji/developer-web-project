import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductRepository } from '../domain/repositories/product-repository';
import { Product } from '../domain/models/product.model';

@Injectable({ providedIn: 'root' })
export class GetProductByIdUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(id: string): Observable<Product | undefined> {
    return this.productRepository.findById(id);
  }
}
