import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';
import { AuthSessionStore } from '../../../core/application/auth-session.store';
import { LogoutUseCase } from '../../../core/application/logout.usecase';
import { CartStore } from '../../../core/application/cart.store';

@Component({
  selector: 'app-header',
  imports: [RouterLink, NavbarComponent],
  templateUrl: './header.html',
})
export class HeaderComponent {
  private readonly router = inject(Router);
  private readonly session = inject(AuthSessionStore);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly cart = inject(CartStore);

  readonly currentUser = this.session.user;
  readonly isAuthenticated = this.session.isAuthenticated;
  readonly cartQuantity = this.cart.totalQuantity;

  readonly isSearchOpen = signal(false);
  readonly isMobileMenuOpen = signal(false);

  onLogout(): void {
    this.logoutUseCase.execute();
  }

  onSearchSubmit(term: string): void {
    const trimmed = term.trim();
    if (!trimmed) return;

    this.router.navigate(['/busca'], { queryParams: { q: trimmed } });
    this.isSearchOpen.set(false);
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
