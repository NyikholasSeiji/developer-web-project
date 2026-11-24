import { Injectable } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { ProductRepository } from '../domain/repositories/product-repository';
import { Product } from '../domain/models/product.model';

/**
 * Produtos da vitrine (destaques). Enquanto nenhum produto estiver marcado
 * como destaque no banco, mostra o catálogo inteiro para a home não ficar vazia.
 */
@Injectable({ providedIn: 'root' })
export class ListShowcaseUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(): Observable<Product[]> {
    return this.productRepository
      .findShowcase()
      .pipe(switchMap((products) => (products.length > 0 ? of(products) : this.productRepository.findAll())));
  }
}
