import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-header',
  imports: [RouterLink, NavbarComponent],
  templateUrl: './header.html',
})
export class HeaderComponent {
  readonly isSearchOpen = signal(false);
  readonly isMobileMenuOpen = signal(false);

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
