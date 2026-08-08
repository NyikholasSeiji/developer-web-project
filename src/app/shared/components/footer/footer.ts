import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FooterColumn {
  title: string;
  links: string[];
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
})
export class FooterComponent {
  readonly year = new Date().getFullYear();

  readonly columns: FooterColumn[] = [
    { title: 'Loja', links: ['Produtos', 'Categorias', 'Edição Limitada'] },
    { title: 'Atendimento', links: ['Trocas e devoluções', 'Envio', 'Contato'] },
    { title: 'Sobre', links: ['Nossa história', 'Sustentabilidade'] },
  ];

  readonly social = ['Instagram', 'Pinterest'];
}
