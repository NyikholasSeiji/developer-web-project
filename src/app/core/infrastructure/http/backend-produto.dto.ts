/**
 * Formato cru devolvido pelo backend Spring Boot em
 * `GET /api/produtos`, `GET /api/produto/{codigo}` e `GET /api/produto/vitrine`.
 *
 * Não é um modelo de domínio: existe só na infraestrutura, para isolar o
 * front do formato da API. A tradução para `Product` acontece em
 * `HttpProductRepository`.
 */
export interface BackendProduto {
  codigo: number;
  nome: string;
  descritivo?: string;
  valor: number;
  valorPromo?: number;
  quantidade?: number;
  destaque?: number;
}
