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
* `HttpClient` (integração com a API + fallback local)

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

Usuário de teste do modo offline (API desligada): `demo@forme.com` / `123456`

### Backend (API)

O front consome a API do backend Spring Boot (`lojinha`), que roda separado na
porta **8081**. Suba o backend antes do front para usar os dados reais:

```bash
# na pasta do backend
./mvnw spring-boot:run
```

A URL base fica em [`src/app/core/config/api.config.ts`](src/app/core/config/api.config.ts)
(`http://localhost:8081/api` por padrão).

Se a API estiver desligada, vazia ou retornar erro de servidor, o front **não
quebra**: os repositórios HTTP caem automaticamente para o catálogo/usuários
mockados em `core/infrastructure/mock`. É o modo de desenvolvimento offline.

## 🏗️ Arquitetura

```text
src/app/
├── core/
│   ├── domain/           → entidades e contratos (Product, User, CartItem, AuthRepository...), sem Angular
│   ├── application/      → casos de uso (ex: ListProductsUseCase, LoginUseCase, AddToCartUseCase)
│   │                        e stores de estado (AuthSessionStore, CartStore)
│   ├── infrastructure/   → implementações concretas: HTTP (API real) + mocks de fallback
│   ├── config/           → wiring de DI e URL base da API (api.config.ts)
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
│   └── checkout/          (implementada) → CheckoutPage (`/checkout`, pagamento fake, rota protegida)
│
├── shared/                 → UI e utils reutilizáveis, sem regra de negócio
│   ├── components/           → header, footer, navbar, button, form-field, product-card,
│   │                            product-grid, filter, cta-section, loading-state,
│   │                            service-unavailable
│   └── utils/                 → filterProducts (com busca por nome), formatCurrency,
│                                 passwordsMatchValidator, cpfValidator, phoneValidator,
│                                 local-storage.util (persistência de sessão/carrinho),
│                                 return-url.util (returnUrl seguro pós-login)
│
├── app.ts / app.html       → shell da aplicação (Header + router-outlet + Footer)
├── app.config.ts           → providers globais (router com withComponentInputBinding,
│                              provideHttpClient, repositórios)
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
      → resolvido em runtime para HttpProductRepository (infrastructure)
        → consome a API real (GET /api/produtos)
        → se a API estiver indisponível/vazia, cai para MockProductRepository
          → a UI recebe o mesmo Product, sem saber a origem
```

### Fluxo de autenticação (exemplo: login)

```
LoginPage
  → injeta LoginUseCase (application)
    → injeta AuthRepository (interface, domain)
      → resolvido em runtime para HttpAuthRepository (infrastructure)
        → POST /api/cliente/login no backend
        → API indisponível? cai para MockAuthRepository
    → em caso de sucesso, atualiza AuthSessionStore (signal, persistido em localStorage)
      → Header reage automaticamente ao novo estado (mostra nome + "Sair")
      → redireciona para `returnUrl` (ex: /carrinho), quando veio de uma rota protegida
```

### Fluxo de recuperação de senha

```
ForgotPasswordPage
  → injeta RequestPasswordResetUseCase (application)
    → injeta AuthRepository (interface, domain)
      → resolvido em runtime para HttpAuthRepository (infrastructure)
        → PATCH /api/cliente/resetarSenha no backend
        → API indisponível? cai para MockAuthRepository
        → sempre resolve com sucesso, por design: o cliente nunca revela
          se um e-mail está ou não cadastrado
```

### Fluxo de carrinho (exclusivo para contas cadastradas)

```
ProductDetailPage / ProductCard ("Comprar")
  → não autenticado? redireciona para /login?returnUrl=<página atual>
  → autenticado:
    → injeta AddToCartUseCase (application)
      → atualiza CartStore (signal, persistido em localStorage)
        → Header (badge) e CartPage reagem automaticamente ao novo estado
    → navega para /carrinho
```

A sacola só é carregada/persistida quando existe sessão ativa e é esvaziada no
logout, para nunca vazar itens entre contas no mesmo navegador.

### Rota protegida (exemplo: perfil)

```
/perfil
  → authGuard (core/guards) verifica AuthSessionStore.isAuthenticated()
    → autenticado: libera a rota
    → não autenticado: redireciona para /login?returnUrl=/perfil
```

O mesmo guard protege `/carrinho` e `/checkout`: a sacola e a finalização de
compra só existem para quem tem conta.

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
  carregamento e "não encontrado" (404), botão "Comprar" que exige login,
  adiciona ao carrinho e navega para a Cesta
* **Busca (`/busca?q=`)**: campo de busca no Header totalmente funcional,
  navega para a página de resultados; busca por nome, ignorando
  maiúsculas/acentos
* **Carrinho (`/carrinho`)**: **exclusivo para contas cadastradas**
  (`authGuard` + redirecionamento para o login com `returnUrl`); adicionar,
  alterar quantidade, remover e limpar itens; total calculado
  automaticamente; badge no Header reflete a quantidade real; **persistido em
  localStorage apenas enquanto há sessão ativa** e limpo no logout
* **Integração com backend**: repositórios HTTP (`HttpProductRepository`,
  `HttpAuthRepository`) consumindo a API Spring Boot; fallback automático para
  os mocks locais quando a API está fora do ar/vazia, então o front **não
  depende exclusivamente da API** para funcionar
* **Perfil (`/perfil`)**: rota protegida (`authGuard`, redireciona para
  `/login` se não autenticado); mostra nome, e-mail, CPF e telefone do
  usuário logado
* **Footer**: Loja (Produtos, Categorias, Carrinho, Minha conta, Edição
  Limitada — já filtrando por categoria), Sobre, redes sociais (Instagram e
  Pinterest) funcionando, abrindo em nova aba
* Identidade visual: paleta neutra (preto/branco/cinza), tipografia
  Fraunces + Inter, numeração de catálogo nos cards de produto
* Totalmente responsivo (desktop, tablet, mobile)
* Dados mockados isolados da apresentação (`core/infrastructure/mock`), usados
  como fallback do backend e para complementar campos de vitrine

## 🚧 Ainda não implementado

* Favoritos (página ainda é um stub em `/favoritos`)
* Redefinição de senha em si (a página `/esqueci-senha` só solicita o envio
  do link; a tela de "criar nova senha" ainda não existe)
* Pagamento real (o checkout atual é uma simulação)

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