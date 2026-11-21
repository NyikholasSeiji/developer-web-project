import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginUseCase } from '../../../core/application/login.usecase';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field';
import { ButtonComponent } from '../../../shared/components/button/button';
import { resolveReturnUrl } from '../../../shared/utils/return-url.util';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, RouterLink, FormFieldComponent, ButtonComponent],
  templateUrl: './login-page.html',
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  /** Para onde voltar depois do login (ex: /carrinho), vindo do authGuard. */
  readonly returnUrl = resolveReturnUrl(this.route.snapshot.queryParamMap.get('returnUrl'));

  get isCartFlow(): boolean {
    return this.returnUrl === '/carrinho' || this.returnUrl === '/checkout';
  }

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.loginUseCase.execute(this.form.getRawValue()).subscribe({
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
