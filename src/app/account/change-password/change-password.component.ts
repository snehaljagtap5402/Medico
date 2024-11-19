import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/shared/services/modules/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  public changePasswordForm = new FormGroup({
    email: new FormControl({ value: '', disabled: true }, [
      Validators.required,
      Validators.email,
    ]),
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [Validators.required]),
    confirmNewPassword: new FormControl('', [Validators.required]),
  });
  public showErrorMessages = false;

  ngOnInit() {
    // Retrieve logged-in user's email and patch it into the form
    const loggedInUserEmail = this._authService.getUser?.profile?.email;
    if (loggedInUserEmail) {
      this.changePasswordForm.patchValue({
        email: loggedInUserEmail,
      });
    }
  }

  constructor(
    private toastrService: ToastrService,
    private _authService: AuthService,
    private router: Router // Inject Router
  ) {}

  // Function to change password
  changePassword() {
    if (this.changePasswordForm.valid) {
      const formData = {
        ...this.changePasswordForm.value,
        email: this._authService.getUser?.profile?.email,
      };
      if (formData.newPassword !== formData.confirmNewPassword) {
        this.toastrService.error(
          'New Password and Confirm Password must match',
          'Error'
        );
        return;
      }
      // this._authService.changePassword(formData).subscribe(
      //   (response: any) => {
      //     // Handle success
      //     if (response instanceof HttpResponse) {
      //       this.toastrService.success(response.body, 'Success');
      //     } else {
      //       this.toastrService.success(
      //         'Password changed successfully',
      //         'Success'
      //       );
      //     }
      //     // Wait 10 seconds before logging out
      //     setTimeout(() => {
      //       this._authService.logout();
      //     //  this.toastrService.success('Logout successful', 'Success');
      //       // Redirect to login page after logout
      //       this.router.navigate(['/login']);
      //       // Reset form
      //       this.changePasswordForm.reset();
      //     }, 5000);
      //   },
      //   (error: any) => {
      //     // Handle error
      //     this.toastrService.error('Failed to change password', 'Error');
      //     console.error(error);
      //   }
      // );
    } else {
      // Mark all fields as touched to display validation errors
      this.changePasswordForm.markAllAsTouched();
    }
  }

  isInvalid(controlName: string, validation: string) {
    const control = this.changePasswordForm.get(controlName);
    return control && control.hasError(validation) && control.touched;
  }
}
