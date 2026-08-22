import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuthRepository } from '../../domain/repositories/auth-repository';
import { User } from '../../domain/models/user.model';
import { LoginCredentials } from '../../domain/models/login-credentials.model';
import { RegisterData } from '../../domain/models/register-data.model';
import { MOCK_USERS } from './mock-users.data';

const NETWORK_DELAY_MS = 600;

@Injectable()
export class MockAuthRepository implements AuthRepository {
  login(credentials: LoginCredentials): Observable<User> {
    const record = MOCK_USERS.find(
      (u) => u.email === credentials.email && u.password === credentials.password,
    );

    if (!record) {
      return throwError(() => new Error('E-mail ou senha inválidos.')).pipe(delay(NETWORK_DELAY_MS));
    }

    const { password, ...user } = record;
    return of(user).pipe(delay(NETWORK_DELAY_MS));
  }

  register(data: RegisterData): Observable<User> {
    const alreadyExists = MOCK_USERS.some((u) => u.email === data.email);

    if (alreadyExists) {
      return throwError(() => new Error('Já existe uma conta com este e-mail.')).pipe(delay(NETWORK_DELAY_MS));
    }

    const record = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
      cpf: data.cpf,
      phone: data.phone,
    };
    MOCK_USERS.push(record);

    const { password, ...user } = record;
    return of(user).pipe(delay(NETWORK_DELAY_MS));
  }

  requestPasswordReset(email: string): Observable<void> {
    // Não revela se o e-mail existe ou não — sempre resolve com sucesso.
    // Em uma API real, o envio do e-mail (se aplicável) acontece no backend.
    return of(undefined).pipe(delay(NETWORK_DELAY_MS));
  }
}
