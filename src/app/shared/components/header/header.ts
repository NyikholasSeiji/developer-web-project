import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

import { NavbarComponent } from '../navbar/navbar';
import { AuthSessionStore } from '../../../core/application/auth-session.store';
import { LogoutUseCase } from '../../../core/application/logout.usecase';
import { CartStore } from '../../../core/application/cart.store';
import { ListProductsUseCase } from '../../../core/application/list-products.usecase';

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
  private readonly listProducts = inject(ListProductsUseCase);

  readonly currentUser = this.session.user;
  readonly isAuthenticated = this.session.isAuthenticated;
  readonly cartQuantity = this.cart.totalQuantity;

  readonly isSearchOpen = signal(false);
  readonly isMobileMenuOpen = signal(false);

  // Produtos usados pelo autocomplete
  private readonly products = toSignal(
    this.listProducts.execute(),
    {
      initialValue: [],
    }
  );

  readonly searchSuggestions = signal<string[]>([]);

  onLogout(): void {
    this.logoutUseCase.execute();
  }

  onMobileLogout(): void {
    this.onLogout();
    this.closeMobileMenu();
  }

  onSearchChange(term: string): void {
    const normalizedTerm = term.trim().toLowerCase();

    if (!normalizedTerm) {
      this.searchSuggestions.set([]);
      return;
    }

    const products = this.products();

    const suggestions = products
      .map((product) => product.name)
      .filter((name) =>
        name.toLowerCase().includes(normalizedTerm)
      )
      .slice(0, 6);

    this.searchSuggestions.set(suggestions);
  }

  onSearchSubmit(term: string): void {
    const trimmed = term.trim();

    if (!trimmed) {
      return;
    }

    this.searchSuggestions.set([]);

    this.router.navigate(['/busca'], {
      queryParams: {
        q: trimmed,
      },
    });

    this.isSearchOpen.set(false);
  }

  selectSearchSuggestion(item: string): void {
    this.searchSuggestions.set([]);

    this.router.navigate(['/busca'], {
      queryParams: {
        q: item,
      },
    });

    this.isSearchOpen.set(false);
  }

  toggleSearch(): void {
    this.isSearchOpen.update((v) => !v);

    if (!this.isSearchOpen()) {
      this.searchSuggestions.set([]);
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}