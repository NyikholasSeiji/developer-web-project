# config

Wiring da Dependency Inversion: liga cada interface (port) de `domain/repositories`
à sua implementação concreta em `infrastructure`, usando os providers do Angular.

Esse é o único lugar que "conhece" as duas pontas (domain e infrastructure) — é
proposital, para manter o resto do app dependendo só das interfaces.

## Exemplo de uso futuro

```ts
// core/config/repository.providers.ts
import { Provider } from '@angular/core';
import { ProductRepository } from '../domain/repositories/product-repository';
import { HttpProductRepository } from '../infrastructure/http/http-product-repository';

export const REPOSITORY_PROVIDERS: Provider[] = [
  { provide: ProductRepository, useClass: HttpProductRepository },
];
```

E registrado uma vez em `app.config.ts`:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    ...REPOSITORY_PROVIDERS,
  ],
};
```

Assim, um serviço de `application` pode injetar `ProductRepository` (a interface) sem
nunca saber que por trás existe um `HttpProductRepository`.

Nenhum provider foi criado ainda — será adicionado junto com a primeira interface real.
