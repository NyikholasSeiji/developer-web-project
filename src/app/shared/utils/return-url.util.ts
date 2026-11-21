/**
 * Normaliza o `returnUrl` recebido por query string (usado pelo authGuard).
 *
 * Só aceita caminhos internos que começam com uma única barra: evita tanto
 * URLs absolutas (http://...) quanto "//outro-site.com", que o navegador
 * trataria como outro domínio.
 */
export function resolveReturnUrl(value: string | null | undefined, fallback = '/'): string {
  if (!value || !value.startsWith('/') || value.startsWith('//')) {
    return fallback;
  }

  return value;
}
