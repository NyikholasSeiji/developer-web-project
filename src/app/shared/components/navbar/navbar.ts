import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  readonly links: NavLink[] = [
    { label: 'Home', path: '/' },
    { label: 'Produtos', path: '/produtos' },
    { label: 'Categorias', path: '/categorias' },
    { label: 'Sobre', path: '/sobre' },
  ];
}
