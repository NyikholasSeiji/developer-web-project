import { HttpErrorResponse } from '@angular/common/http';
import { API_BASE_URL } from './api.config';

/**
 * Os endpoints de gravação da API respondem texto puro com o código no fim,
 * ex.: "Cliente gravado com sucesso! 12". Extrai esse número.
 */
export function extractCodeFromMessage(message: string): number | null {
  const match = message.trim().match(/(\d+)\s*$/);
  return match ? Number(match[1]) : null;
}

/** Converte falhas de rede/HTTP em uma mensagem legível para a UI. */
export function toFriendlyError(error: unknown, fallback = 'Algo deu errado. Tente novamente.'): Error {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      return new Error(`Não foi possível conectar ao servidor (${API_BASE_URL}). Verifique se a API está rodando.`);
    }
    return new Error(`${fallback} (erro ${error.status})`);
  }
  return error instanceof Error ? error : new Error(fallback);
}

/** Converte a data da API (string ISO ou epoch em ms) para `YYYY-MM-DD`. */
export function toIsoDate(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'number') return new Date(value).toISOString().slice(0, 10);
  return value.slice(0, 10);
}

export function todayIsoDate(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, '');
}
