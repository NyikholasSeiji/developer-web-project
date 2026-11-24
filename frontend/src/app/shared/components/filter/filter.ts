import { Component, input, output } from '@angular/core';
import { ProductCategory } from '../../../core/domain/models/product-category.model';
import { ProductFilter, SortOption } from '../../../core/domain/models/product-filter.model';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.html',
})
export class FilterComponent {
  categories = input.required<ProductCategory[]>();
  filter = input.required<ProductFilter>();

  filterChange = output<ProductFilter>();
  clear = output<void>();

  readonly priceOptions = [
    { label: 'Até R$ 300', value: 300 },
    { label: 'Até R$ 600', value: 600 },
    { label: 'Até R$ 1.000', value: 1000 },
  ];

  readonly sortOptions: { label: string; value: SortOption }[] = [
    { label: 'Relevância', value: 'relevance' },
    { label: 'Menor preço', value: 'price-asc' },
    { label: 'Maior preço', value: 'price-desc' },
    { label: 'Nome (A–Z)', value: 'name-asc' },
  ];

  onCategoryChange(value: string): void {
    this.filterChange.emit({ ...this.filter(), categoryId: value || null });
  }

  onPriceChange(value: string): void {
    this.filterChange.emit({ ...this.filter(), maxPrice: value ? Number(value) : null });
  }

  onSortChange(value: string): void {
    this.filterChange.emit({ ...this.filter(), sort: value as SortOption });
  }
}
