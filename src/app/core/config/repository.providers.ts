import { Provider } from '@angular/core';
import { ProductRepository } from '../domain/repositories/product-repository';
import { HttpProductRepository } from '../infrastructure/http/http-product-repository';
import { MockProductRepository } from '../infrastructure/mock/mock-product-repository';
import { FallbackProductRepository } from '../infrastructure/fallback-product-repository';
import { AuthRepository } from '../domain/repositories/auth-repository';
import { MockAuthRepository } from '../infrastructure/mock/mock-auth-repository';

/**
 * Amarra cada interface de repositório à sua implementação atual.
 * Produtos vêm da API Spring Boot, com fallback automático para o mock
 * caso a API não responda; autenticação continua no mock até o fluxo de
 * login ser integrado.
 */
export const REPOSITORY_PROVIDERS: Provider[] = [
  HttpProductRepository,
  MockProductRepository,
  { provide: ProductRepository, useClass: FallbackProductRepository },
  { provide: AuthRepository, useClass: MockAuthRepository },
];
