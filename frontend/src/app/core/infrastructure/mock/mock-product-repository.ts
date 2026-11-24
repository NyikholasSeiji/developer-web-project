import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ProductRepository } from '../../domain/repositories/product-repository';
import { Product } from '../../domain/models/product.model';
import { ProductCategory } from '../../domain/models/product-category.model';
import { DEFAULT_PRODUCT_FILTER } from '../../domain/models/product-filter.model';
import { filterProducts } from '../../../shared/utils/filter-products.util';
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
    return of(MOCK_PRODUCTS).pipe(delay(NETWORK_DELAY_MS));
  }

  findCategories(): Observable<ProductCategory[]> {
    return of(MOCK_CATEGORIES).pipe(delay(NETWORK_DELAY_MS));
  }

  findById(id: string): Observable<Product | undefined> {
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    return of(product).pipe(delay(NETWORK_DELAY_MS));
  }

  /** Sem campo de destaque no mock: a vitrine é o catálogo inteiro. */
  findShowcase(): Observable<Product[]> {
    return this.findAll();
  }

  search(term: string): Observable<Product[]> {
    const results = filterProducts(MOCK_PRODUCTS, { ...DEFAULT_PRODUCT_FILTER, query: term });
    return of(results).pipe(delay(NETWORK_DELAY_MS));
  }
}
