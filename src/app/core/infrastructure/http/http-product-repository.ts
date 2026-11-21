import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../../domain/models/product.model';
import { ProductCategory } from '../../domain/models/product-category.model';
import { ProductRepository } from '../../domain/repositories/product-repository';
import { API_BASE_URL } from './api.config';

/**
 * Formato devolvido pela API Spring Boot (`com.ads.lojinha.Produto`).
 * O domínio do frontend não conhece esses nomes: a tradução acontece aqui.
 */
interface ProdutoDto {
  codigo: number;
  nome: string;
  descritivo: string;
  valor: number;
  valorPromo: number;
  quantidade: number;
  destaque: number;
}

/** Categoria usada enquanto a API não possui um campo de categoria. */
const FALLBACK_CATEGORY = 'Geral';

/** Imagem usada enquanto a API não possui um campo de imagem. */
const FALLBACK_CATEGORY_IMAGE = 'assets/images/1_home_category.jpg';

const PRODUCT_IMAGES = [
  'assets/images/1_product.png',
  'assets/images/2_product.png',
  'assets/images/3_product.png',
  'assets/images/4_product.png',
  'assets/images/5_product.png',
  'assets/images/6_product.png',
  'assets/images/7_product.png',
  'assets/images/8_product.png',
];

/**
 * Implementação de ProductRepository que consome a API real.
 * Substitui a MockProductRepository via binding em core/config.
 */
@Injectable()
export class HttpProductRepository implements ProductRepository {
  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Product[]> {
    return this.http
      .get<ProdutoDto[]>(`${API_BASE_URL}/api/produtos`)
      .pipe(map((produtos) => produtos.map((produto) => this.toProduct(produto))));
  }

  findById(id: string): Observable<Product | undefined> {
    return this.http
      .get<ProdutoDto>(`${API_BASE_URL}/api/produto/${id}`)
      .pipe(map((produto) => (produto.codigo === 0 ? undefined : this.toProduct(produto))));
  }

  /**
   * A API ainda não expõe categorias. Derivamos a lista a partir dos produtos
   * retornados; quando o backend ganhar esse campo, basta trocar esta chamada.
   */
  findCategories(): Observable<ProductCategory[]> {
    return this.findAll().pipe(
      map((products) => {
        const names = [...new Set(products.map((product) => product.category))];
        return names.map((name) => ({
          id: name,
          name,
          imageUrl: FALLBACK_CATEGORY_IMAGE,
        }));
      }),
    );
  }

  private toProduct(produto: ProdutoDto): Product {
    const hasPromo = produto.valorPromo > 0 && produto.valorPromo < produto.valor;

    return {
      id: String(produto.codigo),
      catalogNumber: produto.codigo,
      name: produto.nome,
      category: FALLBACK_CATEGORY,
      price: hasPromo ? produto.valorPromo : produto.valor,
      previousPrice: hasPromo ? produto.valor : undefined,
      isOnSale: hasPromo,
      imageUrl: this.imageFor(produto.codigo),
      description: produto.descritivo,
    };
  }

  /** A API não guarda imagem: usa uma das imagens do catálogo como placeholder. */
  private imageFor(codigo: number): string {
    const index = ((codigo - 1) % PRODUCT_IMAGES.length + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length;
    return PRODUCT_IMAGES[index];
  }
}
