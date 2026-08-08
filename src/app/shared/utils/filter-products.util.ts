import { Product } from '../../core/domain/models/product.model';
import { ProductFilter } from '../../core/domain/models/product-filter.model';

/**
 * Filtragem 100% client-side, aplicada sobre a lista já carregada.
 * Fica em shared/utils (e não em application) porque hoje não envolve
 * nenhuma fonte de dados nem regra de negócio — é só transformação de lista
 * para a UI. Se um dia isso migrar para a API (ex: paginação server-side),
 * o lugar certo passa a ser um caso de uso em core/application.
 */
export function filterProducts(products: Product[], filter: ProductFilter): Product[] {
  let result = products;

  if (filter.categoryId) {
    result = result.filter((p) => p.category === filter.categoryId);
  }

  if (filter.maxPrice != null) {
    result = result.filter((p) => p.price <= filter.maxPrice!);
  }

  switch (filter.sort) {
    case 'price-asc':
      result = [...result].sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result = [...result].sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  return result;
}
