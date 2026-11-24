import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError, timeout } from 'rxjs';
import { Product } from '../domain/models/product.model';
import { ProductCategory } from '../domain/models/product-category.model';
import { ProductRepository } from '../domain/repositories/product-repository';
import { HttpProductRepository } from './http/http-product-repository';
import { MockProductRepository } from './mock/mock-product-repository';

/** Tempo máximo esperando a API antes de cair para os dados locais. */
const API_TIMEOUT_MS = 3000;

/**
 * Tenta a API Spring Boot e, se ela estiver fora do ar, lenta ou com erro,
 * responde com os dados mockados — a tela nunca fica vazia.
 *
 * Depois da primeira falha, a sessão inteira passa a usar o mock
 * (modo offline "grudento"): evita esperar o timeout a cada tela e
 * mantém os ids consistentes entre listagem e detalhe.
 */
@Injectable()
export class FallbackProductRepository implements ProductRepository {
  private readonly api = inject(HttpProductRepository);
  private readonly mock = inject(MockProductRepository);
  private offline = false;

  findAll(): Observable<Product[]> {
    return this.withFallback(
      () => this.api.findAll(),
      () => this.mock.findAll(),
    );
  }

  findCategories(): Observable<ProductCategory[]> {
    return this.withFallback(
      () => this.api.findCategories(),
      () => this.mock.findCategories(),
    );
  }

  findById(id: string): Observable<Product | undefined> {
    return this.withFallback(
      () => this.api.findById(id),
      // Ids da API são numéricos ("1"); os do mock são "p01". Aceita os dois.
      () =>
        this.mock
          .findAll()
          .pipe(map((products) => products.find((p) => p.id === id || String(p.catalogNumber) === id))),
    );
  }

  findShowcase(): Observable<Product[]> {
    return this.withFallback(
      () => this.api.findShowcase(),
      () => this.mock.findShowcase(),
    );
  }

  search(term: string): Observable<Product[]> {
    return this.withFallback(
      () => this.api.search(term),
      () => this.mock.search(term),
    );
  }

  private withFallback<T>(fromApi: () => Observable<T>, fromMock: () => Observable<T>): Observable<T> {
    if (this.offline) {
      return fromMock();
    }

    return fromApi().pipe(
      timeout(API_TIMEOUT_MS),
      catchError((error: unknown) => {
        // 404 é resposta válida da API ("não existe"), não queda do backend.
        if (error instanceof HttpErrorResponse && error.status === 404) {
          return throwError(() => error);
        }
        this.goOffline(error);
        return fromMock();
      }),
    );
  }

  private goOffline(error: unknown): void {
    if (this.offline) return;
    this.offline = true;
    console.warn('[FNShop] API indisponível — usando dados locais.', error);
  }
}
