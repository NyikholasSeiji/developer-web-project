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

- `http/` — implementações de repositórios que usam `HttpClient`:
  - `http-product-repository.ts` → `ProductRepository` (API + fallback local)
  - `http-auth-repository.ts` → `AuthRepository` (API + fallback local)
  - `backend-*.dto.ts` → formato cru devolvido pelo backend, isolado do domain
  - `api-error.util.ts` → distingue "API indisponível" de erro de negócio
- `interceptors/` — interceptors HTTP globais (autenticação, tratamento de erro,
  loading state), registrados em `app.config.ts`.

## API + fallback local

Os repositórios HTTP consomem a API Spring Boot (`API_BASE_URL` em
`core/config/api.config.ts`) e usam os mocks de `infrastructure/mock` como
**fallback**:

- API respondeu → usa os dados reais.
- API vazia, fora do ar ou com erro 5xx/404 → usa o catálogo/usuários locais.
- Erro de negócio (ex: senha inválida) **não** cai no fallback: continua sendo
  erro de verdade.

Assim o front funciona com ou sem backend, e a UI nunca precisa saber a origem
dos dados. Para trocar de fonte, basta ajustar o binding em `core/config`.
