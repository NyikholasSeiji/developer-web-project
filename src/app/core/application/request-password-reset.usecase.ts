import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRepository } from '../domain/repositories/auth-repository';

@Injectable({ providedIn: 'root' })
export class RequestPasswordResetUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(email: string): Observable<void> {
    return this.authRepository.requestPasswordReset(email);
  }
}
