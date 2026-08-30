import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button';

/**
 * Stub honesto para /favoritos: a feature ainda não foi implementada
 * (diferente de um 404 — é uma página real, planejada, só não pronta).
 * Deixa de ser um link morto no Header sem inventar dados de favoritos.
 */
@Component({
  selector: 'app-favorites-page',
  imports: [ButtonComponent],
  templateUrl: './favorites-page.html',
})
export class FavoritesPage {}
