# shared

UI e utilidades genéricas, reutilizadas por múltiplas features. **Sem regra de
negócio** — se algo aqui depende de conceitos como "produto" ou "pedido", ele
provavelmente pertence a uma feature específica, não a `shared`.

## Estrutura

- `components/` — componentes de UI puros (botão, input, modal, card genérico),
  standalone, recebendo dados via `@Input`/`@Output`.
- `directives/` — diretivas reutilizáveis (ex: `ClickOutsideDirective`).
- `pipes/` — pipes reutilizáveis (ex: formatação de moeda, se não coberta pelos
  pipes nativos do Angular).
- `utils/` — funções puras auxiliares (formatação, validação simples), sem estado
  e sem Angular.

Nada foi criado ainda — os primeiros componentes reais devem surgir junto com a
primeira feature que precisar de um elemento de UI repetido em mais de um lugar.
