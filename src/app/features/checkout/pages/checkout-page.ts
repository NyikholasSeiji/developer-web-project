import { Component, inject, signal } from '@angular/core';
import { CartStore } from '../../../core/application/cart.store';
import { ClearCartUseCase } from '../../../core/application/clear-cart.usecase';
import { ButtonComponent } from '../../../shared/components/button/button';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';
import { formatCurrency } from '../../../shared/utils/format-currency.util';

type CheckoutState = 'payment' | 'processing' | 'confirmed';

interface PaymentMethod {
  id: string;
  label: string;
  description: string;
}

/** Métodos fictícios — nenhuma integração real de pagamento existe aqui. */
const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'credit-card', label: 'Cartão de crédito', description: 'Visa, Mastercard ou Elo — em até 3x sem juros' },
  { id: 'pix', label: 'Pix', description: 'Aprovação imediata' },
  { id: 'boleto', label: 'Boleto', description: 'Vencimento em 3 dias úteis' },
];

/**
 * Checkout "de mentirinha" (`/checkout`): não existe gateway de pagamento
 * real, nem pedido persistido em lugar nenhum — é só a simulação completa
 * do fluxo (escolher forma de pagamento → "processar" → confirmação),
 * finalizando com ClearCartUseCase.
 */
@Component({
  selector: 'app-checkout-page',
  imports: [ButtonComponent, LoadingStateComponent],
  templateUrl: './checkout-page.html',
})
export class CheckoutPage {
  private readonly cart = inject(CartStore);
  private readonly clearCartUseCase = inject(ClearCartUseCase);

  readonly items = this.cart.items;
  readonly totalPrice = this.cart.totalPrice;

  readonly methods = PAYMENT_METHODS;
  readonly selectedMethodId = signal(PAYMENT_METHODS[0].id);
  readonly state = signal<CheckoutState>('payment');

  readonly orderNumber = signal('');
  private readonly paidTotal = signal(0);

  formattedTotal(): string {
    return formatCurrency(this.totalPrice());
  }

  formattedPaidTotal(): string {
    return formatCurrency(this.paidTotal());
  }

  selectMethod(id: string): void {
    this.selectedMethodId.set(id);
  }

  pay(): void {
    this.state.set('processing');
    const totalSnapshot = this.totalPrice();

    // Simula a latência de um processamento real de pagamento.
    setTimeout(() => {
      this.paidTotal.set(totalSnapshot);
      this.orderNumber.set(this.generateOrderNumber());
      this.clearCartUseCase.execute();
      this.state.set('confirmed');
    }, 1500);
  }

  private generateOrderNumber(): string {
    const random = Math.floor(100000 + Math.random() * 900000);
    return `FN-${random}`;
  }
}
