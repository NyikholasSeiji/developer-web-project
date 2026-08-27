import { Component, inject } from '@angular/core';
import { AuthSessionStore } from '../../../core/application/auth-session.store';
import { LogoutUseCase } from '../../../core/application/logout.usecase';
import { ButtonComponent } from '../../../shared/components/button/button';

/**
 * Página de perfil (`/perfil`), protegida por authGuard — só acessível com
 * sessão ativa. Exibe os dados coletados no cadastro (nome, e-mail, CPF,
 * telefone), lidos diretamente de AuthSessionStore.
 */
@Component({
  selector: 'app-profile-page',
  imports: [ButtonComponent],
  templateUrl: './profile-page.html',
})
export class ProfilePage {
  private readonly session = inject(AuthSessionStore);
  private readonly logoutUseCase = inject(LogoutUseCase);

  readonly user = this.session.user;

  onLogout(): void {
    this.logoutUseCase.execute();
  }
}
