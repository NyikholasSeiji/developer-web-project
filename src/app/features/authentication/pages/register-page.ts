import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RegisterUseCase } from '../../../core/application/register.usecase';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field';
import { ButtonComponent } from '../../../shared/components/button/button';
import { passwordsMatchValidator, cpfValidator, phoneValidator } from '../../../shared/utils/validators.util';
import { resolveReturnUrl } from '../../../shared/utils/return-url.util';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, RouterLink, FormFieldComponent, ButtonComponent],
  templateUrl: './register-page.html',
})
export class RegisterPage {
  private readonly fb = inject(FormBuilder);
  private readonly registerUseCase = inject(RegisterUseCase);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  /** Para onde voltar depois de criar a conta (ex: /carrinho), vindo do authGuard. */
  readonly returnUrl = resolveReturnUrl(this.route.snapshot.queryParamMap.get('returnUrl'));

  readonly form = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      cpf: ['', [Validators.required, cpfValidator()]],
      phone: ['', [Validators.required, phoneValidator()]],
    },
    { validators: passwordsMatchValidator('password', 'confirmPassword') },
  );

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { confirmPassword, ...data } = this.form.getRawValue();

    this.registerUseCase.execute(data).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err: Error) => {
        this.loading.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }
}
