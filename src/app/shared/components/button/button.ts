import { Component, input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'inverted';

@Component({
  selector: 'app-button',
  imports: [RouterLink, NgTemplateOutlet],
  template: `
    <ng-template #content><ng-content /></ng-template>

    @if (link()) {
      <a [routerLink]="link()" [class]="classes()">
        <ng-container *ngTemplateOutlet="content" />
      </a>
    } @else {
      <button [type]="type()" [disabled]="disabled()" [class]="classes()">
        <ng-container *ngTemplateOutlet="content" />
      </button>
    }
  `,
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  type = input<'button' | 'submit'>('button');
  disabled = input<boolean>(false);
  /** Quando informado, o botão renderiza como <a routerLink> em vez de <button>. */
  link = input<string | undefined>(undefined);

  private readonly base =
    'inline-flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

  private readonly variants: Record<ButtonVariant, string> = {
    primary: 'px-7 py-3 text-xs font-medium uppercase tracking-[0.14em] bg-ink text-bg hover:bg-ink/85',
    secondary: 'px-7 py-3 text-xs font-medium uppercase tracking-[0.14em] border border-ink text-ink hover:bg-ink hover:text-bg',
    ghost: 'text-sm font-normal text-ink hover:text-ink-soft',
    inverted: 'px-7 py-3 text-xs font-medium uppercase tracking-[0.14em] bg-bg text-ink hover:bg-on-dark-soft/30',
  };

  classes(): string {
    return `${this.base} ${this.variants[this.variant()]}`;
  }
}
