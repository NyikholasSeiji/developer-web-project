import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartStore } from '../../../core/application/cart.store';
import { PlaceOrderUseCase } from '../../../core/application/place-order.usecase';
import { ButtonComponent } from '../../../shared/components/button/button';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field';
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
 * Checkout (`/checkout`): o pagamento é simulado, mas o pedido é gravado
 * de verdade na API (POST /api/pedido) e aparece em "Meus pedidos".
 */
@Component({
  selector: 'app-checkout-page',
  imports: [ButtonComponent, FormFieldComponent, LoadingStateComponent, ReactiveFormsModule],
  templateUrl: './checkout-page.html',
})
export class CheckoutPage {
  private readonly cart = inject(CartStore);
  private readonly placeOrder = inject(PlaceOrderUseCase);
  private readonly fb = inject(FormBuilder);

  readonly items = this.cart.items;
  readonly totalPrice = this.cart.totalPrice;

  readonly methods = PAYMENT_METHODS;
  readonly selectedMethodId = signal(PAYMENT_METHODS[0].id);
  readonly state = signal<CheckoutState>('payment');
  readonly errorMessage = signal<string | null>(null);

  readonly orderNumber = signal('');
  private readonly paidTotal = signal(0);

  readonly form = this.fb.nonNullable.group({
    delivery: ['', [Validators.required, Validators.minLength(5)]],
  });

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
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const method = PAYMENT_METHODS.find((m) => m.id === this.selectedMethodId()) ?? PAYMENT_METHODS[0];
    const totalSnapshot = this.totalPrice();

    this.errorMessage.set(null);
    this.state.set('processing');

    this.placeOrder.execute({ delivery: this.form.getRawValue().delivery, paymentMethod: method.label }).subscribe({
      next: (order) => {
        this.paidTotal.set(totalSnapshot);
        this.orderNumber.set(order.id);
        this.state.set('confirmed');
      },
      error: (err: Error) => {
        this.errorMessage.set(err.message);
        this.state.set('payment');
      },
    });
  }
}
