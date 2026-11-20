import { Provider } from '@angular/core';
import { ProductRepository } from '../domain/repositories/product-repository';
import { HttpProductRepository } from '../infrastructure/http/http-product-repository';
import { AuthRepository } from '../domain/repositories/auth-repository';
import { MockAuthRepository } from '../infrastructure/mock/mock-auth-repository';

/**
 * Amarra cada interface de repositório à sua implementação atual.
 * Produtos já vêm da API Spring Boot; autenticação continua no mock até
 * o fluxo de login ser integrado.
 */
export const REPOSITORY_PROVIDERS: Provider[] = [
  { provide: ProductRepository, useClass: HttpProductRepository },
  { provide: AuthRepository, useClass: MockAuthRepository },
];
