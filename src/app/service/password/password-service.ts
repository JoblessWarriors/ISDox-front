import { Injectable } from '@angular/core';
import { PasswordValidation } from './password-validation.model';

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  validatePassword(password: string, confirmPassword: string): PasswordValidation {
    const errors: string[] = [];

    // 1. Check if passwords match
    if (password !== confirmPassword) {
      errors.push('passwords-dont-match');
    }

    // 2. Length check (at least 8 characters)
    if (password.length < 8) {
      errors.push('too-short');
    }

    // 3. Uppercase character check
    if (!/[A-Z]/.test(password)) {
      errors.push('no-uppercase');
    }

    // 4. Lowercase character check
    if (!/[a-z]/.test(password)) {
      errors.push('no-lowercase');
    }

    // 5. Number check
    if (!/[0-9]/.test(password)) {
      errors.push('no-number');
    }

    // 6. Special character check
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('no-special');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    } as PasswordValidation;
  }
}
