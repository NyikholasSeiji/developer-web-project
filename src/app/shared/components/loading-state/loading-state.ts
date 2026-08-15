import { Component, input } from '@angular/core';

/**
 * Estado de carregamento reutilizável para telas que buscam dados
 * assíncronos (produtos, categorias, pedidos, etc.).
 * Puramente visual — não sabe de onde vêm os dados nem quanto tempo leva.
 */
@Component({
  selector: 'app-loading-state',
  templateUrl: './loading-state.html',
})
export class LoadingStateComponent {
  /** Texto exibido acima do indicador, ex: "Carregando produtos". */
  label = input<string>('Carregando');
}
