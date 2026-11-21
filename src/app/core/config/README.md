# config

Wiring da Dependency Inversion: liga cada interface (port) de `domain/repositories`
à sua implementação concreta em `infrastructure`, usando os providers do Angular.

Esse é o único lugar que "conhece" as duas pontas (domain e infrastructure) — é
proposital, para manter o resto do app dependendo só das interfaces.

## O que tem aqui

```ts
// core/config/repository.providers.ts
export const REPOSITORY_PROVIDERS: Provider[] = [
  MockProductRepository,
  MockAuthRepository,
  { provide: ProductRepository, useClass: HttpProductRepository },
  { provide: AuthRepository, useClass: HttpAuthRepository },
];
```

Os mocks são registrados para poderem ser injetados pelos repositórios HTTP como
fallback. Quem consome (application/features) continua injetando apenas
`ProductRepository`/`AuthRepository`.

`api.config.ts` guarda a URL base da API (`http://localhost:8081/api`).

E registrado uma vez em `app.config.ts`:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    ...REPOSITORY_PROVIDERS,
  ],
};
```

Assim, um serviço de `application` pode injetar `ProductRepository` (a interface) sem
nunca saber que por trás existe um `HttpProductRepository`.
