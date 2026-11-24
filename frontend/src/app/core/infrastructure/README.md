# infrastructure

Implementações concretas dos contratos definidos em `domain/repositories`. É a única
camada que sabe *como* os dados chegam (HTTP, cache, localStorage, SDKs externos).

## Regras

- Depende de Angular (`HttpClient`) e de bibliotecas externas — é o ponto esperado
  para esse tipo de acoplamento.
- Implementa as interfaces do `domain`, nunca o contrário. O domain não importa nada
  daqui.
- Erros de rede/parsing são tratados aqui ou em interceptors, não vazam como
  detalhes de implementação para `application`.

## Estrutura

- `http/` — implementações de repositórios que usam `HttpClient`
  (ex: `http-product-repository.ts implements ProductRepository`).
- `interceptors/` — interceptors HTTP globais (autenticação, tratamento de erro,
  loading state), registrados em `app.config.ts`.

## Exemplo de uso futuro

```ts
// core/infrastructure/http/http-product-repository.ts
@Injectable()
export class HttpProductRepository implements ProductRepository {
  constructor(private readonly http: HttpClient) {}

  findAll(): Observable<Product[]> {
    return this.http.get<Product[]>('/api/products');
  }
}
```

Nenhuma implementação foi criada ainda — será adicionada junto com a primeira
feature que precisar consumir dados reais.
