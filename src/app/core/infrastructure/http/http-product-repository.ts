import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { API_BASE_URL } from '../../config/api.config';
import { ProductCategory } from '../../domain/models/product-category.model';
import { Product } from '../../domain/models/product.model';
import { ProductRepository } from '../../domain/repositories/product-repository';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../mock/mock-products.data';
import { MockProductRepository } from '../mock/mock-product-repository';
import { BackendProduto } from './backend-produto.dto';

const LOCAL_IMAGE_COUNT = 8;

/**
 * Implementação de ProductRepository que consome a API real (backend
 * Spring Boot) e usa o catálogo local como complemento/fallback.
 *
 * Estratégia:
 * - API respondeu com produtos → usa os dados da API.
 * - API vazia, fora do ar ou com erro → devolve o catálogo mock local.
 * - O backend não guarda campos de vitrine (categoria, imagem), então esses
 *   vêm do catálogo local quando o `codigo` coincide. Isso mantém a UI
 *   completa mesmo quando a API só fornece nome/preço/descrição.
 *
 * O restante do app continua dependendo só da interface ProductRepository;
 * trocar API por mock (ou vice-versa) não muda nada em application/features.
 */
@Injectable()
export class HttpProductRepository implements ProductRepository {
  constructor(
    private readonly http: HttpClient,
    private readonly fallback: MockProductRepository,
  ) {}

  findAll(): Observable<Product[]> {
    return this.http.get<BackendProduto[]>(`${API_BASE_URL}/produtos`).pipe(
      map((items) => (items ?? []).map((item) => this.toProduct(item))),
      catchError(() => this.fallback.findAll()),
      // Catálogo vazio na API também cai para o seed local: melhor mostrar a
      // vitrine de demonstração do que uma loja sem nenhum produto.
      switchMap((products) => (products.length > 0 ? of(products) : this.fallback.findAll())),
    );
  }

  findCategories(): Observable<ProductCategory[]> {
    return this.findAll().pipe(map((products) => this.toCategories(products)));
  }

  findById(id: string): Observable<Product | undefined> {
    // Ids do catálogo local (ex: "p01") não existem no backend.
    if (!/^\d+$/.test(id)) {
      return this.fallback.findById(id);
    }

    return this.http.get<BackendProduto>(`${API_BASE_URL}/produto/${id}`).pipe(
      // O backend devolve um Produto vazio (codigo 0) quando não encontra.
      map((item) => (item?.codigo ? this.toProduct(item) : undefined)),
      switchMap((product) => (product ? of(product) : this.localById(id))),
      catchError(() => this.localById(id)),
    );
  }

  /** Busca no catálogo local por id ou número de catálogo (id numérico da API). */
  private localById(id: string): Observable<Product | undefined> {
    return this.fallback.findAll().pipe(
      map((products) =>
        products.find((product) => product.id === id || String(product.catalogNumber) === id),
      ),
    );
  }

  private toProduct(item: BackendProduto): Product {
    const local = MOCK_PRODUCTS.find((product) => product.catalogNumber === item.codigo);
    const promoPrice =
      item.valorPromo && item.valorPromo > 0 && item.valorPromo < item.valor ? item.valorPromo : null;

    return {
      id: String(item.codigo),
      catalogNumber: item.codigo,
      name: item.nome,
      category: local?.category ?? (item.destaque ? 'Novidades' : 'Essenciais'),
      price: promoPrice ?? item.valor,
      previousPrice: promoPrice ? item.valor : undefined,
      isOnSale: promoPrice !== null,
      imageUrl:
        local?.imageUrl ?? `assets/images/${((item.codigo - 1) % LOCAL_IMAGE_COUNT) + 1}_product.png`,
      description: item.descritivo || local?.description,
    };
  }

  private toCategories(products: Product[]): ProductCategory[] {
    const names = Array.from(new Set(products.map((product) => product.category)));

    return names.map((name) => {
      const local = MOCK_CATEGORIES.find((category) => category.name === name);
      return (
        local ?? {
          id: name,
          name,
          imageUrl: 'assets/images/1_home_category.jpg',
        }
      );
    });
  }
}
