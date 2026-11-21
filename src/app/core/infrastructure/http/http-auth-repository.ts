import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap, throwError } from 'rxjs';
import { API_BASE_URL } from '../../config/api.config';
import { LoginCredentials } from '../../domain/models/login-credentials.model';
import { RegisterData } from '../../domain/models/register-data.model';
import { User } from '../../domain/models/user.model';
import { AuthRepository } from '../../domain/repositories/auth-repository';
import { MockAuthRepository } from '../mock/mock-auth-repository';
import { isApiUnavailable } from './api-error.util';
import { BackendCliente } from './backend-cliente.dto';

/**
 * Implementação de AuthRepository que consome a API real (backend Spring
 * Boot) e cai para o mock local somente quando a API está indisponível.
 *
 * Importante: erro de credenciais (API respondeu "cliente vazio") continua
 * sendo erro de verdade — não vira login mockado. O fallback existe para
 * permitir desenvolver/testar o front sem o backend rodando.
 */
@Injectable()
export class HttpAuthRepository implements AuthRepository {
  constructor(
    private readonly http: HttpClient,
    private readonly fallback: MockAuthRepository,
  ) {}

  login(credentials: LoginCredentials): Observable<User> {
    return this.http
      .post<BackendCliente>(`${API_BASE_URL}/cliente/login`, {
        email: credentials.email,
        senha: credentials.password,
      })
      .pipe(
        map((cliente) => {
          if (!cliente?.codigo) {
            throw new Error('E-mail ou senha inválidos.');
          }
          return this.toUser(cliente);
        }),
        catchError((error: unknown) =>
          isApiUnavailable(error) ? this.fallback.login(credentials) : throwError(() => error),
        ),
      );
  }

  register(data: RegisterData): Observable<User> {
    const body = {
      nome: data.name,
      email: data.email,
      senha: data.password,
      documento: data.cpf,
      telefone: data.phone,
      ativo: 1,
    };

    return this.http.post(`${API_BASE_URL}/cliente`, body, { responseType: 'text' }).pipe(
      // O endpoint de cadastro devolve só uma mensagem; buscamos o cliente
      // recém-criado no login para obter o código real.
      switchMap(() =>
        this.login({ email: data.email, password: data.password }).pipe(
          catchError(() => of(this.toUserFromRegister(data))),
        ),
      ),
      catchError((error: unknown) =>
        isApiUnavailable(error) ? this.fallback.register(data) : throwError(() => error),
      ),
    );
  }

  requestPasswordReset(email: string): Observable<void> {
    return this.http
      .patch(`${API_BASE_URL}/cliente/resetarSenha`, { email }, { responseType: 'text' })
      .pipe(
        map(() => undefined),
        catchError((error: unknown) =>
          isApiUnavailable(error)
            ? this.fallback.requestPasswordReset(email)
            : throwError(() => error),
        ),
      );
  }

  private toUser(cliente: BackendCliente): User {
    return {
      id: String(cliente.codigo),
      name: cliente.nome,
      email: cliente.email,
      cpf: cliente.documento,
      phone: cliente.telefone,
    };
  }

  private toUserFromRegister(data: RegisterData): User {
    return {
      id: `api-${data.email}`,
      name: data.name,
      email: data.email,
      cpf: data.cpf,
      phone: data.phone,
    };
  }
}
