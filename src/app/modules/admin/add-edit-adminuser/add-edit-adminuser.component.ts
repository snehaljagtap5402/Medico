import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/shared/services/modules/admin.service';

@Component({
  selector: 'app-add-edit-adminuser',
  templateUrl: './add-edit-adminuser.component.html',
  styleUrls: ['./add-edit-adminuser.component.scss']
})
export class AddEditAdminuserComponent {
  public userForm!: FormGroup;
  public editMode: boolean = false;
  public userId: any;
  public userData: any;

  constructor(private adminService: AdminService,
    private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute,
    private toastrService: ToastrService,
    private router: Router) { }

  public ngOnInit(): void {
    this.formValidation();
    this.checkEditMode();
    this.getUserDetails();
  }

  private checkEditMode(): void {
    this.activateRoute.params.subscribe((param: any) => {
      if (param.id) {
        this.userId = param.id;
        this.editMode = true;
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('confirmPassword')?.clearValidators();
      }
    });
  }

  public saveUserDetails(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
    } else {
      const userData = {
        userId: this.userId ? Number(this.userId) : 0,
        email: this.userData?.email || this.userForm.get('email')?.value,
        firstName: this.userForm.get('firstName')?.value || '',
        lastName: this.userForm.get('lastName')?.value || '',
        phoneNumber: this.userForm.get('phoneNumber')?.value || '',
        password: this.userData?.password || this.userForm.get('password')?.value || 'Aress123$',
        isSuperAdmin: this.userForm.get('isSuperAdmin')?.value || false
      };

      if (this.editMode && this.userId) {
        this.adminService.updateAdminUser(this.userId, userData).subscribe(
          (response: any) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.toastrService.success('User updated successfully!', 'Success');
            this.router.navigate(['/admin/users']);
          },
          (error) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.toastrService.error(error.error, 'Error');
          }
        );
      } else {
        this.adminService.addAdminUser(userData).subscribe(
          (response: any) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.toastrService.success('User added successfully!', 'Success');
            this.router.navigate(['/admin/users']);
          },
          (error) => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.toastrService.error(error.error, 'Error');
          }
        );
      }
    }
  }

  public getUserDetails(): void {
    if (this.editMode) {
      this.adminService.getAdminUserById(this.userId).subscribe((res) => {
        this.userData = res[0];
        this.userForm.patchValue(this.userData);
      }, (error) => {
        this.toastrService.error('Something went wrong while patching data!', 'Error');
      });
    }
  }

  public isInvalid(controlName: string, validation: string) {
    return (
      this.userForm.get(controlName)?.hasError(validation) &&
      this.userForm.get(controlName)?.touched
    );
  }

  public formValidation(): void {
    this.userForm = this.formBuilder.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
          Validators.pattern(/^[^\s].*$/),
          Validators.pattern(/^[a-zA-Z\s,\/]+$/),
          Validators.pattern(/^[^\/,\s].*$/),
          this.noNumbersValidator,
          this.noSpecialCharactersValidator,
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
          Validators.pattern(/^[^\s].*$/),
          Validators.pattern(/^[a-zA-Z\s,\/]+$/),
          Validators.pattern(/^[^\/,\s].*$/),
          this.noNumbersValidator,
          this.noSpecialCharactersValidator,
        ],
      ],
      email: [
        { value: '', disabled: this.editMode },
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
        ],
      ],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10,}$/)]],
      password: ['', this.editMode ? [] : [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/)
      ]],
      confirmPassword: ['', this.editMode ? [] : [Validators.required]],
      isSuperAdmin: [false]
    }, {
      validators: this.editMode ? null : this.passwordsMatchValidator
    });
  }

  private passwordsMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password && confirmPassword && password !== confirmPassword ? { passwordsMismatch: true } : null;
  }

  public noNumbersValidator: ValidatorFn = (control: AbstractControl) => {
    const value = control.value;
    const hasNumbers = /\d/.test(value);
    return hasNumbers ? { noNumbers: true } : null;
  };

  public noSpecialCharactersValidator: ValidatorFn = (control: AbstractControl) => {
    const value = control.value;
    const hasSpecialCharacters = /[^\w\s,\/]/.test(value);
    return hasSpecialCharacters ? { noSpecialCharacters: true } : null;
  };
}
