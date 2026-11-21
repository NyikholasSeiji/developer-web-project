import { HttpErrorResponse } from '@angular/common/http';

/**
 * Diz se o erro significa "a API não está disponível" (rede, servidor fora
 * do ar, endpoint ausente) em vez de um erro de negócio (400, 401, 409...).
 *
 * Só nesses casos os repositórios HTTP usam o fallback local: uma senha
 * inválida, por exemplo, continua sendo um erro de verdade e não deve ser
 * mascarada por um login mockado.
 */
export function isApiUnavailable(error: unknown): boolean {
  if (!(error instanceof HttpErrorResponse)) {
    return false;
  }

  return error.status === 0 || error.status === 404 || error.status >= 500;
}
