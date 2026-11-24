import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap, throwError } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth-repository';
import { User } from '../../domain/models/user.model';
import { LoginCredentials } from '../../domain/models/login-credentials.model';
import { RegisterData } from '../../domain/models/register-data.model';
import { ChangePasswordData } from '../../domain/models/change-password.model';
import { ProfileUpdate } from '../../domain/models/profile-update.model';
import { API_BASE_URL } from './api.config';
import { extractCodeFromMessage, onlyDigits, toFriendlyError } from './api-response.util';

/** Formato da entidade `com.ads.lojinha.Cliente`. */
interface ClienteDto {
  codigo: number;
  nome: string | null;
  email: string | null;
  senha: string | null;
  documento: string | null;
  telefone: string | null;
  logradouro: string | null;
  ativo: number;
}

const BASE = `${API_BASE_URL}/api/cliente`;

/**
 * AuthRepository sobre a API Spring Boot (ClienteController).
 *
 * Particularidades da API tratadas aqui, para não vazarem para o resto do app:
 * - "não encontrado" e "login inválido" chegam como `{}` (codigo 0), não 404;
 * - gravações respondem texto puro ("Cliente gravado com sucesso! 12");
 * - o login só aceita contas com `ativo = 1`, então o cadastro já envia ativo;
 * - PUT substitui a entidade inteira, então o perfil é mesclado com o atual.
 */
@Injectable()
export class HttpAuthRepository implements AuthRepository {
  constructor(private readonly http: HttpClient) {}

  login(credentials: LoginCredentials): Observable<User> {
    return this.http
      .post<ClienteDto>(`${BASE}/login`, { email: credentials.email, senha: credentials.password })
      .pipe(
        catchError((error) => throwError(() => toFriendlyError(error, 'Não foi possível entrar.'))),
        map((cliente) => {
          if (!cliente?.codigo) {
            throw new Error('E-mail ou senha inválidos.');
          }
          return this.toUser(cliente);
        }),
      );
  }

  register(data: RegisterData): Observable<User> {
    const body: Omit<ClienteDto, 'codigo' | 'logradouro'> = {
      nome: data.name,
      email: data.email,
      senha: data.password,
      documento: onlyDigits(data.cpf),
      telefone: onlyDigits(data.phone),
      ativo: 1,
    };

    return this.http.post(BASE, body, { responseType: 'text' }).pipe(
      catchError((error) => throwError(() => toFriendlyError(error, 'Não foi possível criar a conta.'))),
      map((message) => {
        const codigo = extractCodeFromMessage(message);
        if (!codigo) {
          throw new Error('Não foi possível criar a conta.');
        }
        return { id: String(codigo), name: body.nome!, email: body.email!, cpf: body.documento!, phone: body.telefone! };
      }),
    );
  }

  requestPasswordReset(email: string): Observable<void> {
    return this.http.patch(`${BASE}/resetarSenha`, { email }, { responseType: 'text' }).pipe(
      catchError((error) => throwError(() => toFriendlyError(error, 'Não foi possível redefinir a senha.'))),
      map(() => undefined),
    );
  }

  /**
   * A API sempre responde "senha alterada", mesmo quando e-mail/CPF não
   * batem. Para dar um retorno honesto, confirmamos fazendo login com a
   * nova senha logo em seguida.
   */
  changePassword(data: ChangePasswordData): Observable<User> {
    const body = { email: data.email, documento: onlyDigits(data.cpf), senha: data.newPassword };

    return this.http.patch(`${BASE}/alterarSenha`, body, { responseType: 'text' }).pipe(
      catchError((error) => throwError(() => toFriendlyError(error, 'Não foi possível alterar a senha.'))),
      switchMap(() => this.login({ email: data.email, password: data.newPassword })),
      catchError((error: Error) =>
        throwError(() =>
          error.message === 'E-mail ou senha inválidos.' ? new Error('E-mail e CPF não conferem com nenhuma conta.') : error,
        ),
      ),
    );
  }

  findById(id: string): Observable<User | undefined> {
    return this.fetchCliente(id).pipe(map((cliente) => (cliente ? this.toUser(cliente) : undefined)));
  }

  updateProfile(id: string, changes: ProfileUpdate): Observable<User> {
    return this.fetchCliente(id).pipe(
      switchMap((current) => {
        if (!current) {
          return throwError(() => new Error('Conta não encontrada.'));
        }
        const updated: ClienteDto = { ...current, nome: changes.name, telefone: onlyDigits(changes.phone) };
        return this.http.put(BASE, updated, { responseType: 'text' }).pipe(
          map((message) => {
            if (message.includes('não encontrado')) {
              throw new Error('Conta não encontrada.');
            }
            return this.toUser(updated);
          }),
        );
      }),
      catchError((error) => throwError(() => toFriendlyError(error, 'Não foi possível salvar o perfil.'))),
    );
  }

  deleteAccount(id: string): Observable<void> {
    return this.http.delete(`${BASE}/${id}`, { responseType: 'text' }).pipe(
      catchError((error) => throwError(() => toFriendlyError(error, 'Não foi possível excluir a conta.'))),
      map(() => undefined),
    );
  }

  /** GET /api/cliente/{codigo}; `null` quando não existe (a API devolve `{}`). */
  private fetchCliente(id: string): Observable<ClienteDto | null> {
    // Sessões antigas do mock têm ids como "u01", que a API não entende.
    if (!/^\d+$/.test(id)) {
      return of(null);
    }
    return this.http.get<ClienteDto>(`${BASE}/${id}`).pipe(map((cliente) => (cliente?.codigo ? cliente : null)));
  }

  private toUser(cliente: ClienteDto): User {
    return {
      id: String(cliente.codigo),
      name: cliente.nome ?? '',
      email: cliente.email ?? '',
      cpf: cliente.documento ?? undefined,
      phone: cliente.telefone ?? undefined,
    };
  }
}
