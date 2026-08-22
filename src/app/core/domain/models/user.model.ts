export interface User {
  id: string;
  name: string;
  email: string;
  /** Opcionais: nem todo fluxo de auth (ex: login) os retorna preenchidos. */
  cpf?: string;
  phone?: string;
}
