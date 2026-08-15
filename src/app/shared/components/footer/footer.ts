import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FooterLink {
  label: string;
  path?: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
})
export class FooterComponent {
  readonly year = new Date().getFullYear();

  readonly columns: FooterColumn[] = [
    {
      title: 'Loja',
      links: [
        { label: 'Produtos', path: '/produtos' },
        { label: 'Categorias', path: '/categorias' },
        { label: 'Edição Limitada' },
      ],
    },
    {
      title: 'Atendimento',
      links: [{ label: 'Trocas e devoluções' }, { label: 'Envio' }, { label: 'Contato' }],
    },
    {
      title: 'Sobre',
      links: [{ label: 'Nossa história', path: '/sobre' }, { label: 'Sustentabilidade' }],
    },
  ];

  readonly social = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/seiji_nick/',
    },
    {
      name: 'Pinterest',
      url: 'https://br.pinterest.com/pin/1133359062490708345/',
    },
  ];
}