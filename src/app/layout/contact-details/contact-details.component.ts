import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserDashboardService } from 'src/app/shared/services/modules/user-dashboard.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss'],
})
export class ContactDetailsComponent {
  form: FormGroup;
  toasterMessage: string = '';
  recaptchaResolved: boolean = false;

  noNumbersValidator: ValidatorFn = (control: AbstractControl) => {
    const value = control.value;
    const hasNumbers = /\d/.test(value);
    return hasNumbers ? { noNumbers: true } : null;
  };

  noSpecialCharactersValidator: ValidatorFn = (control: AbstractControl) => {
    const value = control.value;
    const hasSpecialCharacters = /[^\w\s,\/]/.test(value);
    return hasSpecialCharacters ? { noSpecialCharacters: true } : null;
  };

  constructor(
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private router: Router,
    private userDashboardService: UserDashboardService
  ) {
    this.form = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
          Validators.pattern(/^[^\s].*$/), // No blank spaces at the beginning
          Validators.pattern(/^[a-zA-Z\s,\/]+$/), // Alphabets, spaces, commas, and slashes allowed
          Validators.pattern(/^[^\/,\s].*$/),
          this.noNumbersValidator,
          this.noSpecialCharactersValidator, // No blank spaces, commas, or slashes at the beginning
        ],
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
      phone: [''],
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(500),
          Validators.pattern(/^[^\s].*$/),
        ],
      ],
      recaptcha: [null, Validators.required],
    });
  }

  isInvalid(controlName: string, validation: string) {
    return (
      this.form.get(controlName)?.hasError(validation) &&
      this.form.get(controlName)?.touched
    );
  }

  resolved(captchaResponse: string): void {
    this.recaptchaResolved = true;
    this.form.patchValue({ recaptcha: captchaResponse }); // Set reCAPTCHA value in the form control
  }

  submitForm() {
    if (this.form.valid) {
      const contact = {
        emailSubject: '',
        emailToName: this.form.get('name')?.value || '',
        emailToId: this.form.get('email')?.value || '',
        emailBody: this.form.value.message || '\n\n' + this.form.value.phone,
      };
      // this.userDashboardService.sendContactData(contact).subscribe(
        
      // );

      // this.router.navigateByUrl('/');
      // window.scrollTo({ top: 0, behavior: 'smooth' });
      // this.toastrService.success(
      //   'Form submitted successfully! Admin will contact you',
      //   'Success'
      // );
      // this.form.reset();
    } else {
      this.form.markAllAsTouched();
      this.toastrService.error('Please fill the form', 'Error');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  
  register() {
     window.open(`${environment.stsAuthority}Account/Register/`, '_blank');
   }
}
