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
* Signals (`signal`, `computed`, `effect`, `toSignal`)
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

Usuário de teste (login): `demo@forme.com` / `123456`

## 🏗️ Arquitetura

```text
src/app/
├── core/
│   ├── domain/           → entidades e contratos (Product, User, CartItem, AuthRepository...), sem Angular
│   ├── application/      → casos de uso (ex: ListProductsUseCase, LoginUseCase, AddToCartUseCase)
│   │                        e stores de estado (AuthSessionStore, CartStore)
│   ├── infrastructure/   → implementações concretas dos contratos (hoje: mock)
│   ├── config/           → wiring de DI: liga interface (domain) → implementação (infrastructure)
│   └── guards/           → guards de rota (authGuard), separados de config (DI) e application (casos de uso)
│
├── features/              → uma pasta por fatia de negócio, carregada via lazy loading
│   ├── home/               (implementada)
│   ├── about/              (implementada)
│   ├── authentication/    (implementada) → LoginPage, RegisterPage, ForgotPasswordPage
│   ├── products/          (implementada) → ProductListPage (catálogo real + filtros), ProductDetailPage
│   ├── categories/        (implementada) → CategoryListPage (catálogo real, com contagem de produtos)
│   ├── search/             (implementada) → SearchPage (`/busca?q=`)
│   ├── cart/               (implementada) → CartPage (`/carrinho`)
│   ├── profile/            (implementada) → ProfilePage (`/perfil`, rota protegida)
│   └── checkout/          (vazia — próxima a implementar)
│
├── shared/                 → UI e utils reutilizáveis, sem regra de negócio
│   ├── components/           → header, footer, navbar, button, form-field, product-card,
│   │                            product-grid, filter, cta-section, loading-state,
│   │                            service-unavailable
│   └── utils/                 → filterProducts (com busca por nome), formatCurrency,
│                                 passwordsMatchValidator, cpfValidator, phoneValidator,
│                                 local-storage.util (persistência de sessão/carrinho)
│
├── app.ts / app.html       → shell da aplicação (Header + router-outlet + Footer)
├── app.config.ts           → providers globais (router com withComponentInputBinding, repositórios)
└── app.routes.ts           → registro das rotas de cada feature (lazy loaded)
```

Cada camada tem um `README.md` próprio (`core/domain`, `core/application`,
`core/infrastructure`, `core/config`, `features`, `shared`) explicando sua
responsabilidade e como estender.

### Fluxo de dados (exemplo: produtos)

```
ProductListPage / ProductSectionComponent (Home)
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
    → em caso de sucesso, atualiza AuthSessionStore (signal, persistido em localStorage)
      → Header reage automaticamente ao novo estado (mostra nome + "Sair")
```

### Fluxo de recuperação de senha

```
ForgotPasswordPage
  → injeta RequestPasswordResetUseCase (application)
    → injeta AuthRepository (interface, domain)
      → resolvido em runtime para MockAuthRepository (infrastructure)
        → sempre resolve com sucesso, por design: o cliente nunca revela
          se um e-mail está ou não cadastrado
```

### Fluxo de carrinho

```
ProductDetailPage ("Comprar")
  → injeta AddToCartUseCase (application)
    → atualiza CartStore (signal, persistido em localStorage)
      → Header (badge) e CartPage reagem automaticamente ao novo estado
  → navega para /carrinho
```

### Rota protegida (exemplo: perfil)

```
/perfil
  → authGuard (core/guards) verifica AuthSessionStore.isAuthenticated()
    → autenticado: libera a rota
    → não autenticado: redireciona para /login
```

## ✅ Implementado até agora

* Estrutura arquitetural completa (`core`, `features`, `shared`)
* **Home / Landing Page**: header sticky, hero, categorias, produtos com filtros
  (categoria, preço, ordenação, busca por nome), CTA de newsletter, footer
* **Sobre**: hero editorial, história e valores/pilares
* **Login / Cadastro / Recuperação de senha**:
  * Login e cadastro com Reactive Forms e validação completa (obrigatório,
    e-mail, senha mínima, confirmação de senha, **CPF** com dígito
    verificador, **telefone** com DDD)
  * **"Esqueci minha senha"** (`/esqueci-senha`): sempre confirma o envio,
    sem revelar se o e-mail existe (boa prática de segurança)
  * Sessão do usuário em `AuthSessionStore`, **persistida em localStorage**
    (sobrevive a reload)
* **Produtos (`/produtos`) e Categorias (`/categorias`)**: catálogo real
  (mesma fonte de dados da Home), com filtros, contagem de produtos por
  categoria, e estados de loading/erro (503) reais — não mais simulados
* **Produto — Detalhe (`/produtos/:id`)**: busca por id, estados de
  carregamento e "não encontrado" (404), botão "Comprar" que adiciona ao
  carrinho e navega para a Cesta
* **Busca (`/busca?q=`)**: campo de busca no Header totalmente funcional,
  navega para a página de resultados; busca por nome, ignorando
  maiúsculas/acentos
* **Carrinho (`/carrinho`)**: adicionar, alterar quantidade, remover e
  limpar itens; total calculado automaticamente; badge no Header reflete a
  quantidade real; **persistido em localStorage**
* **Perfil (`/perfil`)**: primeira rota protegida do projeto (`authGuard`,
  redireciona para `/login` se não autenticado); mostra nome, e-mail, CPF e
  telefone do usuário logado
* **Footer**: Loja (Produtos, Categorias, Carrinho, Minha conta, Edição
  Limitada — já filtrando por categoria), Sobre, redes sociais (Instagram e
  Pinterest) funcionando, abrindo em nova aba
* Identidade visual: paleta neutra (preto/branco/cinza), tipografia
  Fraunces + Inter, numeração de catálogo nos cards de produto
* Totalmente responsivo (desktop, tablet, mobile)
* Dados mockados isolados da apresentação (`core/infrastructure/mock`),
  prontos para serem trocados por uma API real

## 🚧 Ainda não implementado

* Checkout e Favoritos (rotas já referenciadas na navegação)
* "Finalizar compra" no carrinho fica desabilitado até o Checkout existir
* Redefinição de senha em si (a página `/esqueci-senha` só solicita o envio
  do link; a tela de "criar nova senha" ainda não existe)
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
   referenciada em `app.routes.ts`. Rota exige login? Adiciona
   `canActivate: [authGuard]`.