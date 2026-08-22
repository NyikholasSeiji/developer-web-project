import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  imports: [ReactiveFormsModule],
  templateUrl: './form-field.html',
})
export class FormFieldComponent {
  label = input.required<string>();
  fieldId = input.required<string>();
  control = input.required<FormControl>();
  type = input<'text' | 'email' | 'password'>('text');
  autocomplete = input<string>('off');

  errorMessage(): string | null {
    const errors = this.control().errors;
    if (!errors || !this.control().touched) return null;

    if (errors['required']) return 'Campo obrigatório.';
    if (errors['email']) return 'E-mail inválido.';
    if (errors['minlength']) return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;
    if (errors['mismatch']) return 'As senhas não coincidem.';
    if (errors['cpf']) return 'CPF inválido.';
    if (errors['phone']) return 'Telefone inválido.';
    return 'Campo inválido.';
  }
}
