# features

Cada subpasta é uma fatia vertical de negócio (`home`, `products`, `cart`,
`checkout`, `authentication`, `profile`, ...). É aqui que vive a **presentation
layer**: componentes standalone responsáveis por UI e interação do usuário.

## Regras

- Componentes não contêm regra de negócio. Eles chamam um caso de uso de
  `core/application` (via DI) e apenas exibem o resultado / capturam eventos do
  usuário.
- Cada feature é carregada via **lazy loading** nas rotas (`loadComponent` /
  `loadChildren`), para manter o bundle inicial pequeno.
- Nem toda feature precisa da estrutura completa abaixo — crie só o que fizer
  sentido. `home`, por exemplo, pode ser só `pages/home-page.ts`.

## Estrutura recomendada dentro de cada feature

```text
features/products/
├── pages/          → componentes de rota (ex: product-list-page.ts)
├── components/     → UI reutilizável só dentro dessa feature
├── data/           → modelos/serviços específicos da feature, quando não fizer
│                      sentido promovê-los para core/domain (ex: um filtro de UI
│                      que não é regra de negócio global)
└── products.routes.ts
```

## Como adicionar uma nova feature (exemplo: products)

1. Se a feature precisar de uma entidade de negócio nova e compartilhável
   (ex: `Product`), crie o modelo em `core/domain/models/product.model.ts` e o
   contrato em `core/domain/repositories/product-repository.ts`.
2. Implemente o contrato em
   `core/infrastructure/http/http-product-repository.ts`.
3. Registre o provider em `core/config` (interface → implementação).
4. Crie o(s) caso(s) de uso em `core/application`
   (ex: `list-products.usecase.ts`).
5. Em `features/products/pages/product-list-page.ts`, injete o caso de uso e
   monte a tela. Componentes de UI puramente visuais (ex: um card de produto
   reutilizável entre `products` e `cart`) vão para `shared/components`; UI
   específica de `products` fica em `features/products/components`.
6. Registre a rota com lazy loading em `features/products/products.routes.ts` e
   referencie-a em `app.routes.ts` via `loadChildren`.

Nenhuma feature foi implementada ainda — as pastas existem apenas para reservar o
lugar de cada uma na arquitetura.
