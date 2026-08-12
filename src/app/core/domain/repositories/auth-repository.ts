import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { LoginCredentials } from '../models/login-credentials.model';
import { RegisterData } from '../models/register-data.model';

/**
 * Contrato (port) para autenticação. Hoje resolvido por MockAuthRepository;
 * quando a API existir, troca-se o binding em core/config sem tocar em
 * application ou features.
 */
export abstract class AuthRepository {
  abstract login(credentials: LoginCredentials): Observable<User>;
  abstract register(data: RegisterData): Observable<User>;
}
