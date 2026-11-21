import { Provider } from '@angular/core';
import { ProductRepository } from '../domain/repositories/product-repository';
import { AuthRepository } from '../domain/repositories/auth-repository';
import { MockProductRepository } from '../infrastructure/mock/mock-product-repository';
import { MockAuthRepository } from '../infrastructure/mock/mock-auth-repository';
import { HttpProductRepository } from '../infrastructure/http/http-product-repository';
import { HttpAuthRepository } from '../infrastructure/http/http-auth-repository';

/**
 * Amarra cada interface de repositório à sua implementação atual.
 *
 * Os repositórios HTTP falam com o backend real (API_BASE_URL em
 * core/config/api.config.ts) e recebem os mocks como fallback: se a API
 * estiver fora do ar, o app continua funcionando com o catálogo/usuários
 * locais. O resto do app nunca conhece essas implementações — depende só
 * das interfaces de domain.
 */
export const REPOSITORY_PROVIDERS: Provider[] = [
  MockProductRepository,
  MockAuthRepository,
  { provide: ProductRepository, useClass: HttpProductRepository },
  { provide: AuthRepository, useClass: HttpAuthRepository },
];
