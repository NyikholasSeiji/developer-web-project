import { Component, signal } from '@angular/core';
import { timer } from 'rxjs';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';
import { ServiceUnavailableComponent } from '../../../shared/components/service-unavailable/service-unavailable';

type CategoryListState = 'loading' | 'unavailable';

/**
 * Página de listagem de categorias.
 *
 * Assim como em `/produtos`, ainda não há uma fonte de dados real aqui.
 * A página está estruturalmente pronta para receber, por categoria: nome,
 * imagem, quantidade de produtos e link para os produtos daquela categoria
 * (ver `ProductCategory` em core/domain e `ListCategoriesUseCase` em
 * core/application, já usados pela Home). Por ora, ela simula o carregamento
 * e cai em um estado de indisponibilidade (503).
 *
 * Quando a listagem completa de categorias estiver pronta para esta página,
 * troque `simulateFetch()` pela chamada real:
 *   private readonly listCategories = inject(ListCategoriesUseCase);
 *   this.listCategories.execute().subscribe({
 *     next: (categories) => { ... },
 *     error: () => this.state.set('unavailable'),
 *   });
 */
@Component({
  selector: 'app-category-list-page',
  imports: [LoadingStateComponent, ServiceUnavailableComponent],
  templateUrl: './category-list-page.html',
})
export class CategoryListPage {
  readonly state = signal<CategoryListState>('loading');

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
