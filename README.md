# 🛍️ FORME — Loja Virtual

Frontend de um e-commerce construído em **Angular 19** (Standalone Components),
seguindo uma arquitetura inspirada em **Clean Architecture** adaptada para o
contexto de uma aplicação frontend: separação entre domínio, casos de uso,
infraestrutura e apresentação, com Dependency Inversion via DI do Angular.

Este README é atualizado conforme o projeto evolui.

## 🚀 Tecnologias

* Angular 19 (Standalone Components, novo sistema de Control Flow `@if`/`@for`)
* TypeScript
* Tailwind CSS v4
* RxJS
* Signals (`signal`, `computed`, `toSignal`)

## ▶️ Executando o projeto

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm start
```

Acesse:

```
http://localhost:4200
```

## 🏗️ Arquitetura

```text
src/app/
├── core/
│   ├── domain/           → entidades e contratos (Product, ProductRepository...), sem Angular
│   ├── application/      → casos de uso (ex: ListProductsUseCase), orquestram o domain
│   ├── infrastructure/   → implementações concretas dos contratos (hoje: mock)
│   └── config/           → wiring de DI: liga interface (domain) → implementação (infrastructure)
│
├── features/             → uma pasta por fatia de negócio, carregada via lazy loading
│   └── home/              (implementada)
│       ├── pages/          → componente de rota (HomePage)
│       ├── components/     → seções específicas da Home (hero, categorias, produtos, CTA)
│       └── home.routes.ts
│
├── shared/                → UI e utils reutilizáveis, sem regra de negócio
│   ├── components/         → header, footer, navbar, button, product-card, product-grid, filter
│   └── utils/               → filterProducts, formatCurrency
│
├── app.ts / app.html      → shell da aplicação (Header + router-outlet + Footer)
├── app.config.ts          → providers globais (router, repositórios)
└── app.routes.ts          → registro das rotas de cada feature (lazy loaded)
```

Cada camada tem um `README.md` próprio (`core/domain`, `core/application`,
`core/infrastructure`, `core/config`, `features`, `shared`) explicando sua
responsabilidade e como estender.

### Fluxo de dados (exemplo: produtos)

```
ProductSectionComponent
  → injeta ListProductsUseCase (application)
    → injeta ProductRepository (interface, domain)
      → resolvido em runtime para MockProductRepository (infrastructure)
        → hoje: retorna dados mockados
        → futuro: troca por HttpProductRepository, sem mudar mais nada
```

## ✅ Implementado até agora

* Estrutura arquitetural completa (`core`, `features`, `shared`)
* **Home / Landing Page**:
  * Header sticky com busca, favoritos, carrinho e menu mobile
  * Hero section
  * Seção de categorias (4 categorias mockadas)
  * Seção de produtos com filtros (categoria, preço, ordenação) — 8 produtos mockados
  * CTA de newsletter
  * Footer com colunas de links
* Identidade visual: paleta neutra (preto/branco/cinza), tipografia
  Fraunces + Inter, numeração de catálogo nos cards de produto
* Totalmente responsivo (desktop, tablet, mobile)
* Dados mockados isolados da apresentação (`core/infrastructure/mock`),
  prontos para serem trocados por uma API real

## 🚧 Ainda não implementado

* Páginas de Produtos, Categorias, Carrinho, Checkout, Login/Cadastro,
  Perfil e Favoritos (rotas já referenciadas na navegação, aguardando
  implementação)
* Integração com backend/API
* Autenticação e pagamento

## 🧩 Como adicionar uma nova feature

Veja o guia detalhado em [`src/app/features/README.md`](src/app/features/README.md).
Resumo:

1. Modelo/contrato novo? Cria em `core/domain`.
2. Implementação (mock ou HTTP)? Cria em `core/infrastructure`.
3. Liga interface → implementação em `core/config`.
4. Caso de uso em `core/application`.
5. Tela em `features/<nome>/pages`, componentes locais em `features/<nome>/components`,
   UI reaproveitável em `shared/components`.
6. Rota lazy-loaded registrada em `features/<nome>/<nome>.routes.ts` e
   referenciada em `app.routes.ts`.