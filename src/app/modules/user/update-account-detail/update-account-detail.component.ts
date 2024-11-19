import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { Observable, catchError } from 'rxjs';
import { AuthService } from 'src/app/shared/services/modules/auth.service';
import { UserDashboardService } from 'src/app/shared/services/modules/user-dashboard.service';
//import { ChangePasswordRequest } from '../../product/models/change-password-request';

@Component({
  selector: 'app-update-account-detail',
  templateUrl: './update-account-detail.component.html',
  styleUrls: ['./update-account-detail.component.scss'],
})
export class UpdateAccountDetailComponent {
  public userId: any = localStorage.getItem('id');
  public userForm: FormGroup | any;
  public user: any[] = [];
  public accountDetails: any = [];
  public updatedDetails: any = [];
  public userData: any;
  public id: any = localStorage.getItem('id');
  public email: any = localStorage.getItem('email');
  public idAccount: any;
  public userProfile: any;
  public addresses: any[] = [];

  constructor(
    private toastrService: ToastrService,
    private userDashboardService: UserDashboardService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _authService: AuthService,
    private toasterService: ToastrService,
  ) {
   // this.userProfile = this._authService.getUser?.profile;

    this.userForm = this.fb.group({
      forenames: [
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
      surname: [
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
      addressLine1: [''],
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
      telno: ['', [Validators.required, Validators.pattern(/^\d{10,}$/)]],
      custName: [''],
      postcode: [''],
      newsLetter: [''],
    });
  }

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

  ngOnInit() {
    // Retrieve idAccount from localStorage
    const idAccountStr = localStorage.getItem('idAccount');
    if (idAccountStr) {
      this.idAccount = parseInt(idAccountStr);
    }
    this.getUserByIdAccount(this.idAccount);
  }

  getUserByIdAccount(idAccount: any): void {
    this.userDashboardService.getUserByIdAccount(idAccount).subscribe(
      (response: any) => {
        this.user = Array.isArray(response) ? response : [response];
        this.userForm.patchValue({
          forenames: this.user[0].forenames,
          custName: this.user[0].custName,
          surname: this.user[0].surname,
          addressLine1: this.user[0].addressLine1,
          email: this.user[0].email,
          postcode: this.user[0].postcode,
          telno: this.user[0].mobile,
        });
        this.getAddressDetails(this.idAccount);
      },
      (error: any) => {
        this.toastrService.error('Error fetching user by userId', error);
      }
    );
  }

    //Function to load address by idAccount
    getAddressDetails(idAccount: any): void {
      this.userDashboardService.getAddressDetailsByIdAccount(idAccount).subscribe(
        (addresses: any[]) => {
          this.addresses = Array.isArray(addresses) ? addresses : [addresses];
          this.addresses.forEach((address) => (address.isSelected = false));
        },
        (error: any) => {
          console.error('Error fetching addresses:', error);
        }
      );
    }

  isInvalid(controlName: string, validation: string) {
    return (
      this.userForm.get(controlName)?.hasError(validation) &&
      this.userForm.get(controlName)?.touched
    );
  }

  saveUserDetails() {
    if (this.userForm.valid) {
      const newAddress = {
        idAccount: this.idAccount,
        custIndex: this.user[0]?.custIndex,
        addressLine2: this.user[0]?.addressLine2,
        town: this.user[0]?.town,
        county: this.user[0]?.county,
        country: this.user[0]?.country,
        idAddress: this.user[0]?.idAddress,
        lprimary: this.addresses[0]?.isMainAddress,
        forenames: this.userForm.get('forenames').value,
        surname: this.userForm.get('surname').value,
        addressLine1: this.userForm.get('addressLine1').value,
        email: this.email,
        telno: this.userForm.get('telno').value,
        telephone: this.userForm.get('telno').value,
        custName: this.userForm.get('custName').value,
        postcode: this.userForm.get('postcode').value,
        newsLetter: this.userForm.get('newsLetter').value,
        upliftCharge: this.user[0].upliftCharge || 0
      };

      this.userDashboardService.updateAccountDetails(newAddress, this.idAccount).subscribe(() => {
          const toastrConfig = {
            timeOut: 3000,
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
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.toastrService.success(
            'Updated data Succesfully',
            'Updated',
            toastrConfig
          );
          this.router.navigate(['/user/dashboard']);
        });
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  public changePassword(): void {
    this.router.navigate(['/changepassword']);
  }
}
