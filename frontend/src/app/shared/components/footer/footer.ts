import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FooterLink {
  label: string;
  /** Rota interna (routerLink). Omitido para links que ainda não têm página. */
  path?: string;
  queryParams?: Record<string, string>;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  label: string;
  url: string;
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
        { label: 'Carrinho', path: '/carrinho' },
        { label: 'Minha conta', path: '/perfil' },
        { label: 'Edição Limitada', path: '/produtos', queryParams: { categoria: 'Edição Limitada' } },
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

  readonly social: SocialLink[] = [
    { label: 'Instagram', url: 'https://www.instagram.com/seiji_nick/' },
    { label: 'Pinterest', url: 'https://br.pinterest.com/pin/1133359062490708345/' },
  ];
}
