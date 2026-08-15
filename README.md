# 🛍️ FNShop — Loja Virtual

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
* Reactive Forms (`FormGroup`, `Validators`)

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
│   ├── domain/           → entidades e contratos (Product, User, AuthRepository...), sem Angular
│   ├── application/      → casos de uso (ex: ListProductsUseCase, LoginUseCase) e stores de estado (AuthSessionStore)
│   ├── infrastructure/   → implementações concretas dos contratos (hoje: mock)
│   └── config/           → wiring de DI: liga interface (domain) → implementação (infrastructure)
│
├── features/              → uma pasta por fatia de negócio, carregada via lazy loading
│   ├── home/               (implementada)
│   │   ├── pages/            → componente de rota (HomePage)
│   │   ├── components/       → seções específicas da Home (hero, categorias, produtos, CTA)
│   │   └── home.routes.ts
│   ├── about/              (implementada)
│   │   ├── pages/            → componente de rota (AboutPage)
│   │   ├── components/       → seções específicas (hero, história, valores)
│   │   └── about.routes.ts
│   ├── authentication/    (implementada)
│   │   ├── pages/            → LoginPage, RegisterPage
│   │   └── authentication.routes.ts
│   ├── products/          (estrutura pronta — aguardando catálogo real)
│   │   ├── pages/            → ProductListPage (loading + estado 503)
│   │   └── products.routes.ts
│   └── categories/        (estrutura pronta — aguardando catálogo real)
│       ├── pages/            → CategoryListPage (loading + estado 503)
│       └── categories.routes.ts
│
├── shared/                 → UI e utils reutilizáveis, sem regra de negócio
│   ├── components/           → header, footer, navbar, button, form-field, product-card,
│   │                            product-grid, filter, cta-section, loading-state,
│   │                            service-unavailable
│   └── utils/                 → filterProducts, formatCurrency, passwordsMatchValidator
│
├── app.ts / app.html       → shell da aplicação (Header + router-outlet + Footer)
├── app.config.ts           → providers globais (router, repositórios)
└── app.routes.ts           → registro das rotas de cada feature (lazy loaded)
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

### Fluxo de autenticação (exemplo: login)

```
LoginPage
  → injeta LoginUseCase (application)
    → injeta AuthRepository (interface, domain)
      → resolvido em runtime para MockAuthRepository (infrastructure)
        → hoje: valida contra usuários mockados em memória
        → futuro: troca por HttpAuthRepository, sem mudar mais nada
    → em caso de sucesso, atualiza AuthSessionStore (signal global)
      → Header reage automaticamente ao novo estado (mostra nome + "Sair")
```

## ✅ Implementado até agora

* Estrutura arquitetural completa (`core`, `features`, `shared`)
* **Home / Landing Page**:
  * Header sticky com busca, favoritos, carrinho, conta e menu mobile
  * Hero section
  * Seção de categorias (4 categorias mockadas)
  * Seção de produtos com filtros (categoria, preço, ordenação) — 8 produtos mockados
  * CTA de newsletter
  * Footer com colunas de links
* **Sobre**: hero editorial, seção de história (texto + imagem) e valores/pilares
* **Login / Cadastro**:
  * Formulários com Reactive Forms e validação (obrigatório, e-mail, senha mínima,
    confirmação de senha)
  * `MockAuthRepository` simula latência de rede e valida credenciais
    (usuário de teste: `demo@forme.com` / `123456`)
  * Sessão do usuário em `AuthSessionStore` (signal), refletida em tempo real no Header
  * Cadastro loga automaticamente após sucesso
* **Produtos (`/produtos`) e Categorias (`/categorias`)**:
  * Estrutura de página pronta para receber o catálogo real futuramente
  * Sem produtos/categorias mockados nestas páginas — ainda não há fonte de dados
  * Estado de carregamento (`LoadingState`) com animação CSS minimalista
  * Estado de erro customizado (`ServiceUnavailable`, "503") consistente com a
    identidade visual da loja, com botão de tentar novamente
* **Footer**: links de "Loja" e "Sobre" conectados às rotas reais; Instagram e
  Pinterest funcionando, abrindo em nova aba
* Identidade visual: paleta neutra (preto/branco/cinza), tipografia
  Fraunces + Inter, numeração de catálogo nos cards de produto
* Totalmente responsivo (desktop, tablet, mobile)
* Dados mockados isolados da apresentação (`core/infrastructure/mock`),
  prontos para serem trocados por uma API real

## 🚧 Ainda não implementado

* Catálogo real de Produtos e Categorias (as páginas existem, mas ainda
  simulam indisponibilidade — aguardando fonte de dados)
* Páginas de Carrinho, Checkout, Perfil e Favoritos
  (rotas já referenciadas na navegação, aguardando implementação)
* Rotas protegidas (ex: exigir login para acessar `/perfil`)
* Persistência de sessão entre reloads (hoje é só em memória)
* Recuperação de senha
* Integração com backend/API
* Pagamento

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
