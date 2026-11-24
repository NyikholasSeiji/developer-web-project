import { Provider } from '@angular/core';
import { ProductRepository } from '../domain/repositories/product-repository';
import { HttpProductRepository } from '../infrastructure/http/http-product-repository';
import { MockProductRepository } from '../infrastructure/mock/mock-product-repository';
import { FallbackProductRepository } from '../infrastructure/fallback-product-repository';
import { AuthRepository } from '../domain/repositories/auth-repository';
import { HttpAuthRepository } from '../infrastructure/http/http-auth-repository';
import { OrderRepository } from '../domain/repositories/order-repository';
import { HttpOrderRepository } from '../infrastructure/http/http-order-repository';

/**
 * Amarra cada interface de repositório à sua implementação atual.
 * Produtos vêm da API Spring Boot, com fallback automático para o mock
 * caso a API não responda. Clientes e pedidos falam só com a API: não faz
 * sentido "logar" ou "comprar" em dados locais — se ela estiver fora,
 * a tela mostra o erro.
 */
export const REPOSITORY_PROVIDERS: Provider[] = [
  HttpProductRepository,
  MockProductRepository,
  { provide: ProductRepository, useClass: FallbackProductRepository },
  { provide: AuthRepository, useClass: HttpAuthRepository },
  { provide: OrderRepository, useClass: HttpOrderRepository },
];
