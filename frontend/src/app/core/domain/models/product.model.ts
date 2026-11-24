export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  previousPrice?: number;
  imageUrl: string;
  isOnSale?: boolean;
  catalogNumber: number;
  /** Texto curto exibido na página de detalhe do produto. */
  description?: string;
}
