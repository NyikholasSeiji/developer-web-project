import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RequestPasswordResetUseCase } from '../../../core/application/request-password-reset.usecase';
import { FormFieldComponent } from '../../../shared/components/form-field/form-field';
import { ButtonComponent } from '../../../shared/components/button/button';

type ForgotPasswordState = 'form' | 'sent';

@Component({
  selector: 'app-forgot-password-page',
  imports: [ReactiveFormsModule, RouterLink, FormFieldComponent, ButtonComponent],
  templateUrl: './forgot-password-page.html',
})
export class ForgotPasswordPage {
  private readonly fb = inject(FormBuilder);
  private readonly requestPasswordReset = inject(RequestPasswordResetUseCase);

  readonly loading = signal(false);
  readonly state = signal<ForgotPasswordState>('form');
  readonly submittedEmail = signal('');

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const email = this.form.getRawValue().email;

    this.requestPasswordReset.execute(email).subscribe(() => {
      this.loading.set(false);
      this.submittedEmail.set(email);
      this.state.set('sent');
    });
  }
}
