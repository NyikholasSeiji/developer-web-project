/**
 * URL base da API do backend (Spring Boot "lojinha").
 *
 * O backend roda separado, por padrão na porta 8081. Em desenvolvimento o
 * Angular (4200) consome direto via CORS; em produção, basta trocar esta
 * constante pela URL pública da API.
 *
 * O front NÃO depende exclusivamente desta API: os repositórios HTTP
 * (core/infrastructure/http) caem para o catálogo/mock local quando ela
 * está indisponível. Veja o README da infraestrutura.
 */
export const API_BASE_URL = 'http://localhost:8081/api';
