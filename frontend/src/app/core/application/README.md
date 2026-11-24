# application

Camada de casos de uso. Orquestra o `domain` para responder a uma intenção do usuário
(ex: "listar produtos", "adicionar item ao carrinho", "efetuar login").

## Regras

- Pode usar Angular (`@Injectable({ providedIn: 'root' })`), pois os serviços daqui
  são injetados nos componentes de `features/`.
- Depende apenas de **interfaces** do `domain` (ex: `ProductRepository`), nunca de uma
  implementação concreta de `infrastructure`. A ligação interface → implementação é
  feita em `core/config`, via Dependency Injection do Angular.
- Não deve conter lógica de UI (nada de manipular DOM, formatar texto para exibição,
  etc). Isso é responsabilidade da `presentation` (dentro de `features/`).
- Um serviço de application deve ter uma responsabilidade única — evite "classes
  Deus" que fazem tudo relacionado a uma feature inteira.

## Exemplo de uso futuro

```ts
// core/application/list-products.usecase.ts
@Injectable({ providedIn: 'root' })
export class ListProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  execute(): Observable<Product[]> {
    return this.productRepository.findAll();
  }
}
```

Nenhum caso de uso foi criado ainda — será adicionado conforme cada feature for
implementada.
