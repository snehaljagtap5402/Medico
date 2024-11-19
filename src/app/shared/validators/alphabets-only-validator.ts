import { AbstractControl, ValidatorFn } from "@angular/forms";

export function AlphabetsOnlyValidator(): ValidatorFn {
    
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (!control.value)
            return null;
        let alphanumericPostcodeRegex = new RegExp('^[a-zA-Z ]*$');
        return !alphanumericPostcodeRegex.test(control.value.toString().trim()) ? { 'alphabetsOnly': true } : null;
    }
}
