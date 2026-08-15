import { Component, input, output } from '@angular/core';
import { ButtonComponent } from '../button/button';

/**
 * Estado de erro reutilizável no estilo "503 — Serviço indisponível",
 * usado por telas que dependem de uma fonte de dados que ainda não existe
 * ou está fora do ar. Segue a mesma identidade visual do estado vazio do
 * ProductGrid (borda fina, tipografia serifada em itálico).
 */
@Component({
  selector: 'app-service-unavailable',
  imports: [ButtonComponent],
  templateUrl: './service-unavailable.html',
})
export class ServiceUnavailableComponent {
  title = input<string>('Catálogo temporariamente indisponível');
  message = input<string>(
    'Não conseguimos carregar essas informações agora. Já estamos de olho nisso — tente novamente em instantes.',
  );
  showRetry = input<boolean>(true);

  retry = output<void>();
}
