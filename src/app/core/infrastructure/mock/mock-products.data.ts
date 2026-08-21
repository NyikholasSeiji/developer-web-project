import { Product } from '../../domain/models/product.model';
import { ProductCategory } from '../../domain/models/product-category.model';

// id === name de propósito: evita uma tabela de lookup só para casar
// Product.category (string) com a categoria selecionada no filtro.
export const MOCK_CATEGORIES: ProductCategory[] = [
  { id: 'Essenciais', name: 'Essenciais', imageUrl: 'assets/images/1_home_category.jpg' },
  { id: 'Novidades', name: 'Novidades', imageUrl: 'assets/images/2_home_category.jpg' },
  { id: 'Acessórios', name: 'Acessórios', imageUrl: 'assets/images/3_home_category.jpg' },
  { id: 'Edição Limitada', name: 'Edição Limitada', imageUrl: 'assets/images/4_home_category.jpg' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'p01', catalogNumber: 1, name: 'Jaqueta Utilitária', category: 'Essenciais', price: 689, imageUrl: 'assets/images/1_product.png', description: 'Corte reto em sarja pesada, com bolsos utilitários e caimento que funciona em qualquer estação. Uma peça-base para construir looks em camadas.' },
  { id: 'p02', catalogNumber: 2, name: 'Tênis Slip-On', category: 'Novidades', price: 429, previousPrice: 549, isOnSale: true, imageUrl: 'assets/images/2_product.png', description: 'Cabedal em couro escovado sem cadarços, solado em borracha vulcanizada. Feito para o dia a dia, sem abrir mão do acabamento.' },
  { id: 'p03', catalogNumber: 3, name: 'Bolsa Tote Estruturada', category: 'Acessórios', price: 759, imageUrl: 'assets/images/3_product.png', description: 'Estrutura firme em couro legítimo, compartimento interno amplo e alças reforçadas costuradas à mão.' },
  { id: 'p04', catalogNumber: 4, name: 'Óculos de Sol Redondo', category: 'Acessórios', price: 349, imageUrl: 'assets/images/4_product.png', description: 'Armação acetato com lentes polarizadas e proteção UV400. Um clássico atemporal, discreto em qualquer produção.' },
  { id: 'p05', catalogNumber: 5, name: 'Relógio Minimalista', category: 'Edição Limitada', price: 1290, imageUrl: 'assets/images/5_product.png', description: 'Caixa em aço escovado, mostrador limpo e pulseira em couro italiano. Peça numerada, produção limitada.' },
  { id: 'p06', catalogNumber: 6, name: 'Cinto de Couro', category: 'Essenciais', price: 219, previousPrice: 289, isOnSale: true, imageUrl: 'assets/images/6_product.png', description: 'Couro curtido naturalmente, fivela em metal escovado. Envelhece bem e ganha caráter com o uso.' },
  { id: 'p07', catalogNumber: 7, name: 'Boné Six-Panel', category: 'Novidades', price: 189, imageUrl: 'assets/images/7_product.png', description: 'Estrutura six-panel em algodão encorpado, fecho ajustável em metal e bordado discreto na frente.' },
  { id: 'p08', catalogNumber: 8, name: 'Mochila Compacta', category: 'Essenciais', price: 599, imageUrl: 'assets/images/8_product.png', description: 'Compartimento acolchoado para notebook, tecido resistente à água e ferragens em metal escovado.' },
];
