import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador de grupo: confere se dois campos (ex: senha e confirmação)
 * têm o mesmo valor. Marca o erro no próprio campo de confirmação,
 * pra aparecer embaixo dele (não só no grupo).
 */
export function passwordsMatchValidator(passwordKey: string, confirmKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey)?.value;
    const confirm = group.get(confirmKey)?.value;

    if (password && confirm && password !== confirm) {
      group.get(confirmKey)?.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    return null;
  };
}
