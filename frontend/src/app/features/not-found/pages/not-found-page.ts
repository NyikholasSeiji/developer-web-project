import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button';

/**
 * Página de fallback para qualquer rota que não bata com nenhuma outra
 * (link quebrado, URL digitada errada etc.) — registrada como wildcard
 * (`path: '**'`) no fim de app.routes.ts.
 */
@Component({
  selector: 'app-not-found-page',
  imports: [ButtonComponent],
  templateUrl: './not-found-page.html',
})
export class NotFoundPage {}
