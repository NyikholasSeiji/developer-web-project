import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginUseCase } from '../../../core/application/login.usecase';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field';
import { ButtonComponent } from '../../../shared/components/button/button';

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

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  /**
   * Rota para onde voltar depois do login (ex.: /checkout quando o guard
   * bloqueou a finalização). Só aceita caminhos internos.
   */
  private redirectTarget(): string {
    const redirect = this.route.snapshot.queryParamMap.get('redirect');
    return redirect && redirect.startsWith('/') ? redirect : '/';
  }

  /** Mantém o destino do checkout ao trocar para a tela de cadastro. */
  redirectQueryParams(): Record<string, string> {
    const redirect = this.route.snapshot.queryParamMap.get('redirect');
    return redirect ? { redirect } : {};
  }

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
        this.router.navigateByUrl(this.redirectTarget());
      },
      error: (err: Error) => {
        this.loading.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }
}
