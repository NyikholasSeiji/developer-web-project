import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { AuthSessionStore } from '../../../core/application/auth-session.store';
import { LogoutUseCase } from '../../../core/application/logout.usecase';

@Component({
  selector: 'app-header',
  imports: [RouterLink, NavbarComponent],
  templateUrl: './header.html',
})
export class HeaderComponent {
  private readonly session = inject(AuthSessionStore);
  private readonly logoutUseCase = inject(LogoutUseCase);

  readonly currentUser = this.session.user;
  readonly isAuthenticated = this.session.isAuthenticated;

  readonly isSearchOpen = signal(false);
  readonly isMobileMenuOpen = signal(false);

  onLogout(): void {
    this.logoutUseCase.execute();
  }

  toggleSearch(): void {
    this.isSearchOpen.update((v) => !v);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
