# domain

Camada mais interna. Representa as regras de negócio e os conceitos centrais da loja
(ex: Product, Cart, Order, User).

## Regras

- **Zero dependência de Angular.** Nada de `@Injectable`, `HttpClient`, RxJS específico
  de framework, etc. São classes/interfaces TypeScript puras.
- **Zero dependência de infrastructure.** O domain nunca sabe como os dados são
  buscados (HTTP, localStorage, etc). Ele só define *o que* existe e *o que* é
  necessário para operar sobre isso.

## Estrutura

- `models/` — entidades e value objects (ex: `product.model.ts`, `cart-item.model.ts`).
- `repositories/` — interfaces (ports) que descrevem operações de persistência/leitura,
  sem dizer como são implementadas (ex: `product-repository.ts` com um método
  `findAll(): Observable<Product[]>`). A implementação real fica em
  `core/infrastructure`.

## Exemplo de uso futuro

```ts
// core/domain/models/product.model.ts
export interface Product {
  id: string;
  name: string;
  price: number;
}

// core/domain/repositories/product-repository.ts
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

export abstract class ProductRepository {
  abstract findAll(): Observable<Product[]>;
  abstract findById(id: string): Observable<Product>;
}
```

Nenhum arquivo de negócio foi criado ainda — isso é responsabilidade de cada feature,
quando for implementada.
