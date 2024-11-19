import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function decimalNumberValidator(): ValidatorFn {
    return (c: AbstractControl): ValidationErrors | { [key: string]: boolean } => {
        const decimalNumberFormat = /^[0-9]+(\.[0-9]{0,2})?$/.test(c.value);

        if (c.dirty && c.value && !decimalNumberFormat) {
            return { format: true };
        }
        return {format: null};
    };
}
