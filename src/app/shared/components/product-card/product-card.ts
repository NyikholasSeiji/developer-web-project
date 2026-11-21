import { Component, inject, input, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Product } from '../../../core/domain/models/product.model';
import { AddToCartUseCase } from '../../../core/application/add-to-cart.usecase';
import { AuthSessionStore } from '../../../core/application/auth-session.store';
import { formatCurrency } from '../../utils/format-currency.util';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
})
export class ProductCardComponent {
  private readonly addToCartUseCase = inject(AddToCartUseCase);
  private readonly session = inject(AuthSessionStore);
  private readonly router = inject(Router);

  product = input.required<Product>();

  readonly isAuthenticated = this.session.isAuthenticated;

  /** Feedback breve no botão "Comprar" ao adicionar direto da grade. */
  readonly justAdded = signal(false);

  formattedPrice(): string {
    return formatCurrency(this.product().price);
  }

  formattedPreviousPrice(): string | null {
    const prev = this.product().previousPrice;
    return prev != null ? formatCurrency(prev) : null;
  }

  catalogLabel(): string {
    return `Nº ${String(this.product().catalogNumber).padStart(2, '0')}`;
  }

  onAddToCart(): void {
    // A sacola só existe para contas cadastradas: visitante vai para o
    // login e volta para a página onde estava depois de entrar/cadastrar.
    if (!this.isAuthenticated()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }

    this.addToCartUseCase.execute(this.product());
    this.justAdded.set(true);
    setTimeout(() => this.justAdded.set(false), 1200);
  }

  buttonLabel(): string {
    if (this.justAdded()) {
      return 'Adicionado ✓';
    }

    return this.isAuthenticated() ? 'Comprar' : 'Entrar para comprar';
  }
}
