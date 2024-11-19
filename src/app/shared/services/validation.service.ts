import { Inject, Injectable } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormArray, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private initalValues: { [key: string]: any } = {};
  public initalValuesChanged = false;
  private checkInitalValues = false;
  private arrayInputsInitialValue: { [key: string]: any } = {};
  public arrayInputInitalValuesChanged = false;

  constructor(
    @Inject('validationMessages') private validationMessages?: { [key: string]: { [key: string]: string } },
    private form?: FormGroup
  ) { }

  getValidationMessages(control: string): string[] {
    const messages: string[] = [];
    if (this.validationMessages && this.form) {
      const controlInstance = this.form.get(control);
      if (controlInstance && this.isFormTouched(controlInstance)) {
        const messagesForControl = this.validationMessages[control];
        if (messagesForControl) {
          Object.keys(messagesForControl).forEach((validator) => {
            const error = controlInstance.errors?.[validator];
            if (error) {
              const message = messagesForControl[validator];
              if (message) {
                messages.push(message);
              }
            }
          });
        }
      }
    }
    return messages;
  }
  

  private isFormTouched(control: AbstractControl): boolean {
    return (control.touched || control.dirty) && control.errors !== null;
  }
}