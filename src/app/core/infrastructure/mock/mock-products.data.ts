import { Product } from '../../domain/models/product.model';
import { ProductCategory } from '../../domain/models/product-category.model';

// id === name de propósito: evita uma tabela de lookup só para casar
// Product.category (string) com a categoria selecionada no filtro.
export const MOCK_CATEGORIES: ProductCategory[] = [
  { id: 'Essenciais', name: 'Essenciais', imageUrl: 'https://picsum.photos/seed/forme-essenciais/600/750' },
  { id: 'Novidades', name: 'Novidades', imageUrl: 'https://picsum.photos/seed/forme-novidades/600/750' },
  { id: 'Acessórios', name: 'Acessórios', imageUrl: 'https://picsum.photos/seed/forme-acessorios/600/750' },
  { id: 'Edição Limitada', name: 'Edição Limitada', imageUrl: 'https://picsum.photos/seed/forme-edicao/600/750' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p01', catalogNumber: 1, name: 'Jaqueta Utilitária', category: 'Essenciais', price: 689, imageUrl: 'https://picsum.photos/seed/forme-p1/700/875' },
  { id: 'p02', catalogNumber: 2, name: 'Tênis Slip-On', category: 'Novidades', price: 429, previousPrice: 549, isOnSale: true, imageUrl: 'https://picsum.photos/seed/forme-p2/700/875' },
  { id: 'p03', catalogNumber: 3, name: 'Bolsa Tote Estruturada', category: 'Acessórios', price: 759, imageUrl: 'https://picsum.photos/seed/forme-p3/700/875' },
  { id: 'p04', catalogNumber: 4, name: 'Óculos de Sol Redondo', category: 'Acessórios', price: 349, imageUrl: 'https://picsum.photos/seed/forme-p4/700/875' },
  { id: 'p05', catalogNumber: 5, name: 'Relógio Minimalista', category: 'Edição Limitada', price: 1290, imageUrl: 'https://picsum.photos/seed/forme-p5/700/875' },
  { id: 'p06', catalogNumber: 6, name: 'Cinto de Couro', category: 'Essenciais', price: 219, previousPrice: 289, isOnSale: true, imageUrl: 'https://picsum.photos/seed/forme-p6/700/875' },
  { id: 'p07', catalogNumber: 7, name: 'Boné Six-Panel', category: 'Novidades', price: 189, imageUrl: 'https://picsum.photos/seed/forme-p7/700/875' },
  { id: 'p08', catalogNumber: 8, name: 'Mochila Compacta', category: 'Essenciais', price: 599, imageUrl: 'https://picsum.photos/seed/forme-p8/700/875' },
];
