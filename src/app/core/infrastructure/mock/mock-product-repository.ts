import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProductRepository } from '../../domain/repositories/product-repository';
import { Product } from '../../domain/models/product.model';
import { ProductCategory } from '../../domain/models/product-category.model';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from './mock-products.data';

const NETWORK_DELAY_MS = 500;

/**
 * Catálogo local de fallback do ProductRepository.
 *
 * É usado pelo HttpProductRepository quando a API está fora do ar/vazia, e
 * também para complementar campos de vitrine (categoria, imagem) que o
 * backend não guarda. O binding principal fica em core/config.
 */
@Injectable()
export class MockProductRepository implements ProductRepository {
  findAll(): Observable<Product[]> {
    return of(MOCK_PRODUCTS).pipe(delay(NETWORK_DELAY_MS));
  }

  findCategories(): Observable<ProductCategory[]> {
    return of(MOCK_CATEGORIES).pipe(delay(NETWORK_DELAY_MS));
  }

  findById(id: string): Observable<Product | undefined> {
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    return of(product).pipe(delay(NETWORK_DELAY_MS));
  }
}
