import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService, IndividualConfig } from 'ngx-toastr';
import { UserAuthService } from 'src/app/shared/services/modules/user-auth.service';
import { EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/shared/services/modules/auth.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    passwordHash: new FormControl('', [Validators.required]),
  });
  public passwordHash: any;
  public userId: any;
  public showErrorMessages = false;
  loginSuccess: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit() {
    localStorage.removeItem('username');
  }

  constructor(
    private userService: UserAuthService,
    private dialogRef: MatDialogRef<LoginComponent>,
    private toastrService: ToastrService,
    private _authService: AuthService,
  ) {}

  logindata() {
    if (this.loginForm.valid) {
      const user = {
        username: this.loginForm.get('username')?.value,
        passwordHash: this.loginForm.get('passwordHash')?.value,
      };

      this.userService.login(user).subscribe(
        (users: any) => {
          let userName: any = this.loginForm.get('User')?.value;
          localStorage.setItem('username', users.username);
          localStorage.setItem('id', users.userId);
          this.userService.setAuthenticated(true);
          //this.router.navigate(['/']);

          if (user) {
            const toastrConfig = {
              timeOut: 2000,
              progressBar: true,
              positionClass: 'toast-top-center',
              closeButton: true,
              enableHtml: true,
              tapToDismiss: true,
              newestOnTop: true,
              extendedTimeOut: 0,
              progressAnimation: 'decreasing',
              easeTime: 500,
              animate: 'zoomOutUp',
            } as Partial<IndividualConfig<any>>;

            // @ts-ignore
            toastrConfig.enableDuplicates = false;
            this.toastrService.success(
              'You are successfully logged in',
              'Success',
              toastrConfig
            );

            setTimeout(() => {
              window.location.reload();
            }, 1000);
          } else {
            this.toastrService.error('User Not Found', 'Error');
          }
        },

        (error: any) => {
          this.toastrService.error('Incorrect Username or pasword', 'Error');
          console.error(error);
        }
      );
      // this.loginSuccess.emit();
    } else {
      // Check if any field is touched before marking all as touched
      this.showErrorMessages = true;
      this.loginForm.markAllAsTouched();
    }
  }

  isInvalid(controlName: string, validation: string) {
    return (
      this.loginForm.get(controlName)?.hasError(validation) &&
      this.loginForm.get(controlName)?.touched &&
      this.showErrorMessages // Only show error messages if the flag is true
    );
  }

  closePopup() {
    this.dialogRef.close();
  }


  login() {
    // Add your login logic here
    this._authService.login();
  }

  register() {
    window.open(`${environment.stsAuthority}Account/Register/`, '_blank');
  }
}
