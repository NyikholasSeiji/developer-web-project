import { Provider } from '@angular/core';
import { ProductRepository } from '../domain/repositories/product-repository';
import { MockProductRepository } from '../infrastructure/mock/mock-product-repository';

/**
 * Amarra cada interface de repositório à sua implementação atual.
 * Hoje aponta para o mock; no futuro, troca-se apenas aqui por um
 * HttpProductRepository, sem tocar em application ou features.
 */
export const REPOSITORY_PROVIDERS: Provider[] = [
  { provide: ProductRepository, useClass: MockProductRepository },
];
