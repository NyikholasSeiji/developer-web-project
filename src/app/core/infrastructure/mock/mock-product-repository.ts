import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ProductRepository } from '../../domain/repositories/product-repository';
import { Product } from '../../domain/models/product.model';
import { ProductCategory } from '../../domain/models/product-category.model';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from './mock-products.data';

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
}
