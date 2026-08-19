import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductCategory } from '../models/product-category.model';

/**
 * Contrato (port) para acesso a produtos e categorias.
 * O domain não sabe se, por trás, isso vem de mock, HTTP ou outra fonte —
 * essa decisão é de core/infrastructure, ligada via core/config.
 */
export abstract class ProductRepository {
  abstract findAll(): Observable<Product[]>;
  abstract findCategories(): Observable<ProductCategory[]>;
  /** Retorna `undefined` quando nenhum produto corresponde ao id informado. */
  abstract findById(id: string): Observable<Product | undefined>;
}
