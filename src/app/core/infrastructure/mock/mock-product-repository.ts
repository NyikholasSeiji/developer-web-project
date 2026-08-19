import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProductRepository } from '../../domain/repositories/product-repository';
import { Product } from '../../domain/models/product.model';
import { ProductCategory } from '../../domain/models/product-category.model';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from './mock-products.data';

const NETWORK_DELAY_MS = 500;

/**
 * Implementação temporária de ProductRepository usando dados mockados.
 * Quando a API existir, basta criar HttpProductRepository e trocar o
 * binding em core/config — nada em application ou features muda.
 */
@Injectable()
export class MockProductRepository implements ProductRepository {
  findAll(): Observable<Product[]> {
    return of(MOCK_PRODUCTS);
  }

  findCategories(): Observable<ProductCategory[]> {
    return of(MOCK_CATEGORIES);
  }

  findById(id: string): Observable<Product | undefined> {
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    return of(product).pipe(delay(NETWORK_DELAY_MS));
  }
}
