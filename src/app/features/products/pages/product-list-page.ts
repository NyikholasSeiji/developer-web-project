import { Component, signal } from '@angular/core';
import { timer } from 'rxjs';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';
import { ServiceUnavailableComponent } from '../../../shared/components/service-unavailable/service-unavailable';

type ProductListState = 'loading' | 'unavailable';

/**
 * Página de listagem de produtos.
 *
 * Ainda não existe uma fonte de dados real para o catálogo — em vez de
 * exibir produtos mockados (o que passaria a falsa impressão de um catálogo
 * pronto), a página simula o ciclo de carregamento e cai em um estado de
 * indisponibilidade (503), já com a estrutura pronta para receber dados de
 * verdade depois.
 *
 * Quando o catálogo estiver disponível, troque `simulateFetch()` pela
 * chamada real, por exemplo:
 *   private readonly listProducts = inject(ListProductsUseCase);
 *   this.listProducts.execute().subscribe({
 *     next: (products) => { ... },
 *     error: () => this.state.set('unavailable'),
 *   });
 */
@Component({
  selector: 'app-product-list-page',
  imports: [LoadingStateComponent, ServiceUnavailableComponent],
  templateUrl: './product-list-page.html',
})
export class ProductListPage {
  readonly state = signal<ProductListState>('loading');

  constructor() {
    this.simulateFetch();
  }

  retry(): void {
    this.simulateFetch();
  }

  private simulateFetch(): void {
    this.state.set('loading');
    timer(1200).subscribe(() => this.state.set('unavailable'));
  }
}
