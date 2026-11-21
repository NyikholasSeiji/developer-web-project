/**
 * Formato cru devolvido pelo backend Spring Boot em
 * `POST /api/cliente/login` e `GET /api/cliente/{codigo}`.
 *
 * O backend devolve um `Cliente` vazio (campos nulos, `codigo` 0) quando o
 * login falha; `HttpAuthRepository` traduz isso para um erro de negócio.
 */
export interface BackendCliente {
  codigo: number;
  nome: string;
  telefone?: string;
  documento?: string;
  senha?: string;
  logradouro?: string;
  email: string;
  ativo?: number;
}
