export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'name-asc';

export interface ProductFilter {
  categoryId: string | null;
  maxPrice: number | null;
  sort: SortOption;
}

export const DEFAULT_PRODUCT_FILTER: ProductFilter = {
  categoryId: null,
  maxPrice: null,
  sort: 'relevance',
};
