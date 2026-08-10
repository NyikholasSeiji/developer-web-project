import { Component } from '@angular/core';

interface Value {
  number: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-about-values',
  templateUrl: './about-values.html',
})
export class AboutValuesComponent {
  readonly values: Value[] = [
    {
      number: '01',
      title: 'Materiais selecionados',
      description: 'Priorizamos fibras naturais e couros de curtume certificado, escolhidos peça a peça.',
    },
    {
      number: '02',
      title: 'Produção enxuta',
      description: 'Lotes pequenos, sem estoque excedente. Menos desperdício, mais atenção a cada detalhe.',
    },
    {
      number: '03',
      title: 'Feito para durar',
      description: 'Reparo e troca facilitados. Preferimos consertar uma peça a substituí-la.',
    },
  ];
}
