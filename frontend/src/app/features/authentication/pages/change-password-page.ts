import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ChangePasswordUseCase } from '../../../core/application/change-password.usecase';
import { AuthSessionStore } from '../../../core/application/auth-session.store';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field';
import { ButtonComponent } from '../../../shared/components/button/button';
import { cpfValidator, passwordsMatchValidator } from '../../../shared/utils/validators.util';

/**
 * Definir nova senha (`/redefinir-senha`) — PATCH /api/cliente/alterarSenha.
 * Usado depois de "esqueci minha senha" (que desativa a conta) e também
 * pelo perfil, para trocar a senha. Confirma a identidade por e-mail + CPF.
 */
@Component({
  selector: 'app-change-password-page',
  imports: [ReactiveFormsModule, RouterLink, FormFieldComponent, ButtonComponent],
  templateUrl: './change-password-page.html',
})
export class ChangePasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly changePassword = inject(ChangePasswordUseCase);
  private readonly session = inject(AuthSessionStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group(
    {
      email: [
        this.route.snapshot.queryParamMap.get('email') ?? this.session.user()?.email ?? '',
        [Validators.required, Validators.email],
      ],
      cpf: ['', [Validators.required, cpfValidator()]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: passwordsMatchValidator('newPassword', 'confirmPassword') },
  );

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, cpf, newPassword } = this.form.getRawValue();

    this.changePassword.execute({ email, cpf, newPassword }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/perfil');
      },
      error: (err: Error) => {
        this.loading.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }
}
