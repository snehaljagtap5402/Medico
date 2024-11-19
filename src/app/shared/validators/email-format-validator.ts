import { ValidatorFn, ValidationErrors, AbstractControl } from "@angular/forms";

export function passwordFormatValidator(): ValidatorFn {
  return (c: AbstractControl): ValidationErrors | { [key: string]: boolean } => {
      const hasPostcodeFormat = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/.test(c.value);
      if (c.dirty && c.value && !hasPostcodeFormat) {
        return { 'format': true }
    } else {
        return { 'format': null };
    }
  }
}