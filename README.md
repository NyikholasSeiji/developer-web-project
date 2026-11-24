# 🛍️ FNShop — Loja Virtual

E-commerce completo com **frontend em Angular 19** e **backend em Spring Boot**
(API REST + SQLite), no mesmo repositório.

```text
.
├── frontend/   → Angular 19 (Standalone Components, Tailwind, Signals)
└── backend/    → Spring Boot 4 + Spring Data JPA + SQLite (API REST na porta 8081)
```

Este README é atualizado conforme o projeto evolui.

## 🚀 Tecnologias

**Frontend**

* Angular 19 (Standalone Components, Control Flow `@if`/`@for`)
* TypeScript, RxJS, Signals (`signal`, `computed`, `effect`, `toSignal`)
* Reactive Forms (`FormGroup`, `Validators`)
* Tailwind CSS v4

**Backend**

* Java 21+ e Spring Boot 4 (Web MVC + Data JPA)
* Hibernate 7 com dialeto SQLite (`hibernate-community-dialects`)
* SQLite (arquivo `lojinha.db`, criado automaticamente)
* Maven Wrapper (`mvnw`) — não precisa instalar Maven

## ▶️ Executando o projeto

São dois processos: **subir a API primeiro**, depois o frontend.

### 1. Backend (porta 8081)

Precisa de um **JDK 21 ou superior** (`JAVA_HOME` apontando para ele).

```powershell
cd backend
.\mvnw spring-boot:run "-Dmaven.compiler.proc=none"
```

No Linux/macOS: `./mvnw spring-boot:run -Dmaven.compiler.proc=none`.

> **Por que `-Dmaven.compiler.proc=none`?** O `pom.xml` declara o Lombok, que
> não é compatível com o compilador de JDKs muito novos (ex.: JDK 27). O código
> não usa Lombok, então desligar o processamento de anotações resolve. Com
> JDK 21/25 o comando sem a flag também funciona.

Pronto quando aparecer `Tomcat started on port 8081`. O banco `lojinha.db` é
criado dentro de `backend/` na primeira execução (as tabelas são geradas pelo
Hibernate com `ddl-auto=update`). O arquivo **não é versionado**: cada pessoa
tem o seu.

### 2. Frontend (porta 4200)

```bash
cd frontend
npm install
npm start
```

Acesse `http://localhost:4200`.

A URL da API fica em
[`frontend/src/app/core/infrastructure/http/api.config.ts`](frontend/src/app/core/infrastructure/http/api.config.ts)
(`http://localhost:8081`).

### 3. Primeiro uso

* **Produtos:** o banco começa vazio. Cadastre produtos via
  `POST /api/produto` (ex.: Postman, Insomnia ou `Invoke-RestMethod`):

  ```json
  { "nome": "Jaqueta Utilitária", "descritivo": "Corte reto em sarja pesada...",
    "valor": 689, "valorPromo": 0, "quantidade": 10, "destaque": 1 }
  ```

  `destaque > 0` coloca o produto na vitrine da Home (ordenado pelo número);
  `valorPromo` menor que `valor` exibe o produto em promoção.
* **Conta:** crie uma em `/cadastro` — login, checkout e perfil usam a API.

> Se a API estiver fora do ar, **o catálogo** cai automaticamente para dados
> locais (mock), para a vitrine nunca ficar vazia. Login, cadastro e pedidos
> **não** têm fallback: mostram a mensagem de erro de conexão.

## 🔌 API (backend)

Todos os controllers liberam CORS para qualquer origem (`@CrossOrigin("*")`).

### Cliente — `/api/cliente`

| Método | Endpoint | Uso no frontend |
|---|---|---|
| GET | `/api/cliente/{codigo}` | Perfil (dados atualizados) |
| POST | `/api/cliente` | Cadastro |
| PUT | `/api/cliente` | Editar perfil (nome, telefone) |
| DELETE | `/api/cliente/{codigo}` | Excluir conta |
| POST | `/api/cliente/login` | Login |
| PATCH | `/api/cliente/resetarSenha` | "Esqueci minha senha" |
| PATCH | `/api/cliente/alterarSenha` | Definir nova senha (e-mail + CPF) |

### Produto — `/api/produto`

| Método | Endpoint | Uso no frontend |
|---|---|---|
| GET | `/api/produtos` | Catálogo, categorias |
| GET | `/api/produto/{codigo}` | Detalhe do produto |
| GET | `/api/produto/vitrine` | Destaques da Home |
| GET | `/api/produto/busca/{termo}` | Página de busca |
| POST / PUT / DELETE | `/api/produto` | — (administração, sem tela ainda) |

### Pedido — `/api/pedido`

| Método | Endpoint | Uso no frontend |
|---|---|---|
| POST | `/api/pedido` | Finalizar compra (checkout) |
| GET | `/api/pedido/{codigo}` | "Meus pedidos" no perfil |
| DELETE | `/api/pedido/{codigo}` | Cancelar pedido |
| PUT | `/api/pedido` | — (disponível em `OrderRepository`, sem tela) |

### Regras e particularidades da API

* "Não encontrado" e "login inválido" voltam como **objeto vazio** (`codigo: 0`),
  não como 404.
* Gravações respondem **texto puro** com o código no fim
  (`"Cliente gravado com sucesso! 12"`); o frontend extrai esse número.
* O login só aceita clientes com `ativo = 1` — o cadastro já envia `ativo: 1`.
* **Resetar senha** define a senha `Senha1234` e **desativa** a conta
  (`ativo = 0`). Para voltar a entrar, o cliente define uma nova senha em
  `/redefinir-senha` (e-mail + CPF), o que reativa a conta. O envio de e-mail
  ainda não existe no backend.
* `alterarSenha` sempre responde sucesso; o frontend confirma fazendo login
  com a nova senha e só então avisa se e-mail/CPF não conferem.
* Pedidos ainda **não guardam itens** (`ItemPedido` está desligado no
  backend): o resumo dos itens e a forma de pagamento vão no campo `obs`.
* Não existe listagem de pedidos por cliente: o frontend guarda os códigos dos
  pedidos feitos no navegador (`OrderHistoryStore`) e consulta cada um.
* A tabela de produtos não tem categoria nem imagem: produtos vindos da API
  aparecem na categoria "Geral" e com imagens do catálogo como placeholder.

## 🏗️ Arquitetura do frontend

```text
frontend/src/app/
├── core/
│   ├── domain/           → entidades e contratos (Product, User, Order, AuthRepository,
│   │                        ProductRepository, OrderRepository), sem Angular
│   ├── application/      → casos de uso (LoginUseCase, PlaceOrderUseCase, SearchProductsUseCase...)
│   │                        e stores de estado (AuthSessionStore, CartStore, OrderHistoryStore)
│   ├── infrastructure/   → implementações dos contratos
│   │   ├── http/          → HttpProductRepository, HttpAuthRepository, HttpOrderRepository
│   │   ├── mock/          → MockProductRepository (fallback do catálogo)
│   │   └── fallback-product-repository.ts → tenta a API e cai para o mock
│   ├── config/           → wiring de DI: liga interface (domain) → implementação (infrastructure)
│   └── guards/           → guards de rota (authGuard)
│
├── features/              → uma pasta por fatia de negócio, carregada via lazy loading
│   ├── home/               → hero, categorias, vitrine com filtros, CTA
│   ├── about/              → página "Sobre"
│   ├── authentication/    → Login, Cadastro, Esqueci a senha, Definir nova senha
│   ├── products/          → catálogo com filtros e detalhe do produto
│   ├── categories/        → lista de categorias com contagem
│   ├── search/             → busca (`/busca?q=`)
│   ├── cart/               → carrinho (`/carrinho`)
│   ├── checkout/          → finalizar compra (`/checkout`, rota protegida)
│   ├── profile/            → perfil e "Meus pedidos" (`/perfil`, rota protegida)
│   └── favorites/          → página placeholder (ainda não implementada)
│
├── shared/                 → UI e utils reutilizáveis, sem regra de negócio
└── app.config.ts / app.routes.ts
```

Cada camada tem um `README.md` próprio (`core/domain`, `core/application`,
`core/infrastructure`, `core/config`, `features`, `shared`) explicando sua
responsabilidade e como estender.

### Fluxo de dados (exemplo: login)

```
LoginPage
  → LoginUseCase (application)
    → AuthRepository (interface, domain)
      → HttpAuthRepository (infrastructure) → POST /api/cliente/login
    → sucesso: atualiza AuthSessionStore (signal, persistido em localStorage)
      → Header reage automaticamente (mostra nome + "Sair")
```

### Fluxo de compra

```
CartPage → "Finalizar compra" → /checkout (authGuard exige login)
  → PlaceOrderUseCase
    → OrderRepository → HttpOrderRepository → POST /api/pedido
    → registra o código em OrderHistoryStore e esvazia o CartStore
  → Perfil → "Meus pedidos" → GET /api/pedido/{codigo} para cada pedido
```

## 🏗️ Estrutura do backend

```text
backend/src/main/java/com/ads/lojinha/
├── LojinhaApplication.java          → ponto de entrada Spring Boot
├── Cliente / Produto / Pedido / ItemPedido.java   → entidades JPA
├── *Repository.java                 → Spring Data JPA (+ queries nativas: login,
│                                       resetar/alterar senha, vitrine, busca)
└── *Controller.java                 → endpoints REST
backend/src/main/resources/application.properties → porta 8081 e conexão SQLite
```

## ✅ Implementado até agora

* Frontend e backend integrados no mesmo repositório
* **Home**: vitrine de destaques vinda da API, com filtros (categoria, preço,
  ordenação, busca por nome)
* **Login / Cadastro** na API, com validação completa (CPF com dígito
  verificador, telefone com DDD, confirmação de senha)
* **Esqueci minha senha + Definir nova senha** (e-mail + CPF), reativando a conta
* **Produtos, Categorias e Detalhe** com dados da API e fallback para mock
* **Busca** pela API (`/api/produto/busca/{termo}`), com autocomplete
* **Carrinho** persistido em localStorage
* **Checkout**: pagamento simulado, pedido gravado de verdade na API
* **Perfil**: dados da API, edição de nome/telefone, troca de senha,
  exclusão de conta, "Meus pedidos" com cancelamento
* Totalmente responsivo; identidade visual neutra (Fraunces + Inter)

## 🚧 Ainda não implementado

* Favoritos
* Área administrativa de produtos (a API já tem POST/PUT/DELETE)
* Itens do pedido no backend (`ItemPedido`) e listagem de pedidos por cliente
* Categoria e imagem no cadastro de produto
* Envio de e-mail na redefinição/alteração de senha
* Pagamento real
* Segurança: a API devolve a senha do cliente no login/consulta e guarda a
  senha em texto puro — precisa de hash e de um DTO de resposta sem senha

## 🧩 Como adicionar uma nova feature (frontend)

Veja o guia detalhado em [`frontend/src/app/features/README.md`](frontend/src/app/features/README.md).
Resumo:

1. Modelo/contrato novo? Cria em `core/domain`.
2. Implementação (HTTP ou mock)? Cria em `core/infrastructure`.
3. Liga interface → implementação em `core/config`.
4. Caso de uso em `core/application`.
5. Tela em `features/<nome>/pages`, componentes locais em `features/<nome>/components`,
   UI reaproveitável em `shared/components`.
6. Rota lazy-loaded registrada em `features/<nome>/<nome>.routes.ts` e
   referenciada em `app.routes.ts`. Rota exige login? Adiciona
   `canActivate: [authGuard]`.
