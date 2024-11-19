import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/shared/services/modules/admin.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
  public loginForm!: FormGroup;
  public errorMessage: string | null = null;
  public showPassword: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  public ngOnInit(): void {
    this.checkFormValid();
  }

  public checkFormValid(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  public isInvalid(controlName: string, validation: string) {
    return (
      this.loginForm.get(controlName)?.hasError(validation) &&
      this.loginForm.get(controlName)?.touched
    );
  }

  // Method to handle form submission
  public login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.adminService.adminLogin(this.loginForm.value).subscribe(
      (response) => {
        localStorage.setItem('adminUserId', response.userId);

        if (response.lastLoginDate == null) {
          localStorage.setItem('lastLoginDate', '');
          localStorage.setItem('passwordChanged', 'false');
          this.router.navigate(['/admin/change-password']);
        } else {
          localStorage.setItem('lastLoginDate', response.lastLoginDate);
          //localStorage.setItem('passwordChanged', 'true');
          this.router.navigate(['/admin/dashboard']);
        }
        this.toastrService.success('Login successfully!', 'Success');
        this.adminService.updateLastLoginDate(response.userId, new Date()).subscribe(() => { });
      },
      (error) => {
        this.toastrService.error(error.error, 'Error');
      }
    );
  }
}
