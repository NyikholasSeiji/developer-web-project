/**
 * Helpers finos sobre localStorage, usados pelos stores de application
 * (AuthSessionStore, CartStore) para persistir estado entre reloads.
 *
 * Ficam em shared/utils (não em infrastructure) porque não envolvem nenhuma
 * regra de negócio nem contrato de domínio — é só serialização de estado de
 * UI. `try/catch` cobre localStorage indisponível (modo privado, SSR, cota
 * excedida etc.): nesses casos, a persistência falha silenciosamente e a
 * aplicação segue funcionando só em memória, como já era antes.
 */
export function readFromLocalStorage<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function writeToLocalStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silencioso de propósito — persistência é um "nice to have", nunca
    // deve quebrar a aplicação.
  }
}

export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // idem
  }
}
