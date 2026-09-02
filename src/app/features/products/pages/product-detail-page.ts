import { Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { GetProductByIdUseCase } from '../../../core/application/get-product-by-id.usecase';
import { AddToCartUseCase } from '../../../core/application/add-to-cart.usecase';
import { Product } from '../../../core/domain/models/product.model';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';
import { ButtonComponent } from '../../../shared/components/button/button';
import { formatCurrency } from '../../../shared/utils/format-currency.util';

type DetailState = 'loading' | 'found' | 'not-found';

/**
 * Página de detalhe de um produto (`/produtos/:id`).
 *
 * O `id` chega via `input()` ligado ao parâmetro de rota (habilitado em
 * app.config.ts com `withComponentInputBinding()`). Busca o produto através
 * de `GetProductByIdUseCase`, que hoje resolve para o mock, mas trocará de
 * fonte de dados sem exigir mudanças aqui quando a API real existir.
 */
@Component({
  selector: 'app-product-detail-page',
  imports: [LoadingStateComponent, ButtonComponent],
  templateUrl: './product-detail-page.html',
})
export class ProductDetailPage {
  private readonly getProductById = inject(GetProductByIdUseCase);
  private readonly addToCartUseCase = inject(AddToCartUseCase);
  private readonly router = inject(Router);
  private readonly titleService = inject(Title);

  id = input.required<string>();

  readonly state = signal<DetailState>('loading');
  readonly product = signal<Product | null>(null);

  constructor() {
    // `id` é um input required ligado por withComponentInputBinding — o
    // Angular só garante um valor DEPOIS do construtor rodar, então ler
    // this.id() aqui direto lança NG0950. effect() roda depois, e também
    // reage se o :id mudar (ex: navegar de um produto pra outro sem sair
    // da rota).
    effect(() => {
      this.load(this.id());
    });
  }

  addToCart(): void {
    const product = this.product();
    if (!product) return;

    this.addToCartUseCase.execute(product);
    this.router.navigate(['/carrinho']);
  }

  private load(id: string): void {
    this.state.set('loading');
    this.product.set(null);

    this.getProductById.execute(id).subscribe((product) => {
      if (product) {
        this.product.set(product);
        this.state.set('found');
        this.titleService.setTitle(`${product.name} — FNShop`);
      } else {
        this.state.set('not-found');
        this.titleService.setTitle('Produto não encontrado — FNShop');
      }
    });
  }

  formattedPrice(): string {
    const product = this.product();
    return product ? formatCurrency(product.price) : '';
  }

  formattedPreviousPrice(): string | null {
    const previous = this.product()?.previousPrice;
    return previous != null ? formatCurrency(previous) : null;
  }

  catalogLabel(): string {
    const product = this.product();
    return product ? `Nº ${String(product.catalogNumber).padStart(2, '0')}` : '';
  }
}
