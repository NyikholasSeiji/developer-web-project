import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthSessionStore } from '../../../core/application/auth-session.store';
import { LogoutUseCase } from '../../../core/application/logout.usecase';
import { RefreshProfileUseCase } from '../../../core/application/refresh-profile.usecase';
import { UpdateProfileUseCase } from '../../../core/application/update-profile.usecase';
import { DeleteAccountUseCase } from '../../../core/application/delete-account.usecase';
import { ListMyOrdersUseCase } from '../../../core/application/list-my-orders.usecase';
import { CancelOrderUseCase } from '../../../core/application/cancel-order.usecase';
import { Order } from '../../../core/domain/models/order.model';
import { ButtonComponent } from '../../../shared/components/button/button';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state';
import { phoneValidator } from '../../../shared/utils/validators.util';
import { formatCurrency } from '../../../shared/utils/format-currency.util';

/**
 * Página de perfil (`/perfil`), protegida por authGuard. Os dados vêm da
 * API (GET /api/cliente/{codigo}); permite editar nome/telefone (PUT),
 * excluir a conta (DELETE), trocar a senha e ver/cancelar pedidos.
 */
@Component({
  selector: 'app-profile-page',
  imports: [ButtonComponent, FormFieldComponent, LoadingStateComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './profile-page.html',
})
export class ProfilePage {
  private readonly session = inject(AuthSessionStore);
  private readonly logoutUseCase = inject(LogoutUseCase);
  private readonly refreshProfile = inject(RefreshProfileUseCase);
  private readonly updateProfile = inject(UpdateProfileUseCase);
  private readonly deleteAccount = inject(DeleteAccountUseCase);
  private readonly listMyOrders = inject(ListMyOrdersUseCase);
  private readonly cancelOrder = inject(CancelOrderUseCase);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  readonly user = this.session.user;

  readonly editing = signal(false);
  readonly saving = signal(false);
  readonly message = signal<string | null>(null);

  readonly orders = signal<Order[] | null>(null);
  readonly ordersError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, phoneValidator()]],
  });

  constructor() {
    this.refreshProfile.execute().subscribe({
      next: (user) => {
        if (!user) this.router.navigateByUrl('/login');
      },
      // API fora do ar: segue mostrando os dados da sessão local.
      error: () => this.message.set('Não foi possível atualizar seus dados agora.'),
    });
    this.loadOrders();
  }

  formatCurrency = formatCurrency;

  startEditing(): void {
    const user = this.user();
    if (!user) return;
    this.form.setValue({ name: user.name, phone: user.phone ?? '' });
    this.message.set(null);
    this.editing.set(true);
  }

  cancelEditing(): void {
    this.editing.set(false);
  }

  onSave(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.updateProfile.execute(this.form.getRawValue()).subscribe({
      next: () => {
        this.saving.set(false);
        this.editing.set(false);
        this.message.set('Perfil atualizado.');
      },
      error: (err: Error) => {
        this.saving.set(false);
        this.message.set(err.message);
      },
    });
  }

  onDeleteAccount(): void {
    if (!confirm('Excluir sua conta? Essa ação não pode ser desfeita.')) return;

    this.deleteAccount.execute().subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (err: Error) => this.message.set(err.message),
    });
  }

  onCancelOrder(order: Order): void {
    if (!confirm(`Cancelar o pedido nº ${order.id}?`)) return;

    this.cancelOrder.execute(order.id).subscribe({
      next: () => this.orders.set((this.orders() ?? []).filter((o) => o.id !== order.id)),
      error: (err: Error) => this.ordersError.set(err.message),
    });
  }

  onLogout(): void {
    this.logoutUseCase.execute();
    this.router.navigateByUrl('/');
  }

  private loadOrders(): void {
    this.listMyOrders.execute().subscribe({
      next: (orders) => this.orders.set(orders),
      error: () => {
        this.orders.set([]);
        this.ordersError.set('Não foi possível carregar seus pedidos.');
      },
    });
  }
}
