import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

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
        this.router.navigateByUrl('/');
      },
      error: (err: Error) => {
        this.loading.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }
}
