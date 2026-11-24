import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { LoginCredentials } from '../models/login-credentials.model';
import { RegisterData } from '../models/register-data.model';
import { ChangePasswordData } from '../models/change-password.model';
import { ProfileUpdate } from '../models/profile-update.model';

/**
 * Contrato (port) para autenticação e conta do cliente. A implementação
 * ativa é escolhida em core/config, sem tocar em application ou features.
 */
export abstract class AuthRepository {
  abstract login(credentials: LoginCredentials): Observable<User>;
  abstract register(data: RegisterData): Observable<User>;
  /**
   * Solicita a redefinição de senha. Por design, sempre resolve com sucesso
   * (mesmo se o e-mail não existir) — não é papel do cliente revelar quais
   * e-mails estão cadastrados.
   */
  abstract requestPasswordReset(email: string): Observable<void>;
  /**
   * Define uma nova senha a partir de e-mail + CPF. Resolve com o usuário
   * já autenticado com a nova senha; falha se e-mail/CPF não conferirem.
   */
  abstract changePassword(data: ChangePasswordData): Observable<User>;
  /** Dados atuais do cliente; `undefined` quando a conta não existe mais. */
  abstract findById(id: string): Observable<User | undefined>;
  abstract updateProfile(id: string, changes: ProfileUpdate): Observable<User>;
  abstract deleteAccount(id: string): Observable<void>;
}
