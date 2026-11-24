import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Valida CPF: formato (11 dígitos, ignora pontuação), rejeita sequências
 * repetidas (111.111.111-11 etc.) e confere os dois dígitos verificadores.
 * Campo vazio não é erro daqui — isso é responsabilidade do `required`.
 */
export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const digits = (control.value ?? '').toString().replace(/\D/g, '');
    if (!digits) return null;

    if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) {
      return { cpf: true };
    }

    const checkDigit = (length: number): number => {
      let sum = 0;
      for (let i = 0; i < length; i++) {
        sum += Number(digits[i]) * (length + 1 - i);
      }
      const remainder = (sum * 10) % 11;
      return remainder === 10 ? 0 : remainder;
    };

    const isValid = checkDigit(9) === Number(digits[9]) && checkDigit(10) === Number(digits[10]);
    return isValid ? null : { cpf: true };
  };
}

/**
 * Valida telefone brasileiro: 10 dígitos (fixo, com DDD) ou 11 (celular,
 * com DDD), ignorando pontuação/máscara.
 */
export function phoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const digits = (control.value ?? '').toString().replace(/\D/g, '');
    if (!digits) return null;

    return digits.length === 10 || digits.length === 11 ? null : { phone: true };
  };
}

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
