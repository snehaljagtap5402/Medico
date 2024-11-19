import { ValidatorFn, ValidationErrors, AbstractControl } from "@angular/forms";

export function emailDomainExtensionValidator(): ValidatorFn {
    return (c: AbstractControl): null | ValidationErrors => {
        const hasDomainExt = /.+@.+\..+/.test(c.value);
        if (c.dirty && c.value && !hasDomainExt) {
            return { 'email': true }
        }
        return null;
    }
}
