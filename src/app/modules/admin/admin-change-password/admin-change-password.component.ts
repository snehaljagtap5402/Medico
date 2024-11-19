import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/shared/services/modules/admin.service';

@Component({
  selector: 'app-admin-change-password',
  templateUrl: './admin-change-password.component.html',
  styleUrls: ['./admin-change-password.component.scss']
})
export class AdminChangePasswordComponent {
  public changePasswordForm!: FormGroup;
  public adminUserId: any;

  constructor(private adminService: AdminService,
    private formBuilder: FormBuilder,
    private router: Router, private toastrService: ToastrService,) { }

  public ngOnInit(): void {
    this.adminUserId = localStorage.getItem('adminUserId');
    this.formValidation();
  }

  public isInvalid(controlName: string, validation: string) {
    return (
      this.changePasswordForm.get(controlName)?.hasError(validation) &&
      this.changePasswordForm.get(controlName)?.touched
    );
  }

  public formValidation(): void {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordsMatchValidator
    });
  }

  private passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return newPassword && confirmPassword && newPassword !== confirmPassword ? { passwordsMismatch: true } : null;
  }

  public onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      this.changePasswordForm.markAllAsTouched();
      return;
    }

    const passwordData = {
      oldPassword: this.changePasswordForm.value.oldPassword,
      newPassword: this.changePasswordForm.value.newPassword,
    };

    this.adminService.changePassword(this.adminUserId, passwordData).subscribe(
      (response: any) => {
        // Password changed successfully, update flag
        localStorage.setItem('passwordChanged', 'true');
        this.router.navigate(['/admin/dashboard']);
        this.toastrService.success('Password changed successfully!', 'Success');
      },
      (error) => {
        this.toastrService.error(error.error, 'Error');
      }
    );
  }
}
