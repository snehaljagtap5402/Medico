import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators, AbstractControl,} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserDashboardService } from 'src/app/shared/services/modules/user-dashboard.service';
import { OrderService } from 'src/app/shared/services/modules/order.service';
import { CountryService, GetCountriesResult} from 'src/app/shared/services/country.service';
import { AuthService } from 'src/app/shared/services/modules/auth.service';

function noWhitespaceValidator(control: AbstractControl): { [key: string]: any } | null {
  const isWhitespace = (control.value || '').trim().length === 0;
  return isWhitespace ? { noWhitespace: true } : null;
}
 
@Component({
  selector: 'app-insert-addresses',
  templateUrl: './insert-addresses.component.html',
  styleUrls: ['./insert-addresses.component.scss'],
})
export class InsertAddressesComponent implements OnInit {
  public userAddressForm: FormGroup | any;
  public userDashboard: any = { userDashboard: [{ addressBook: [] }] };
  public userId: any = localStorage.getItem('id');
  public userData: any;
  public addressBookData: any = [];
  public selected = '1';
  public idAccount: any;
  public selectedCountry: any;
  public countries: GetCountriesResult[] = [];
  public formSubmitted = false;
  public email: any = localStorage.getItem('email');
  

  constructor(
    private toastrService: ToastrService,
    private formBuilder: FormBuilder,
    private userDashboardService: UserDashboardService,
    private _route: Router,
    private route: ActivatedRoute,
    private orderService: OrderService,
    private countryService: CountryService,
    private toasterService: ToastrService,
    private _authService: AuthService
  ) {
    this.userAddressForm = this.formBuilder.group({
      // alias: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]+$')]],
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern('^[a-zA-Z ]+$'),
          noWhitespaceValidator,
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          Validators.pattern('^[a-zA-Z ]+$'),
          ,
          noWhitespaceValidator,
        ],
      ],
      company: ['', [Validators.required, Validators.pattern(/^\S(.*\S)?$/)]],
      country: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)],
      ],
      address: ['', [Validators.required, Validators.pattern(/^\S(.*\S)?$/)]],
      postcode: ['', [Validators.required, Validators.pattern(/^\S(.*\S)?$/)]],
      city: ['', [Validators.required, Validators.pattern(/^\S(.*\S)?$/)]],
      county: ['', [Validators.required, Validators.pattern(/^\S(.*\S)?$/)]],
    });
  }

  ngOnInit() {
    const idAccountStr = localStorage.getItem('idAccount');
     if (idAccountStr) {
       this.idAccount = parseInt(idAccountStr);
     }
     //this.selectedCountry = 'India';
    // this.userId = +this.route.snapshot.paramMap.get('id')!;
    // this.userDashboardService.getUserById(this.userId).subscribe((users: any[]) => {
    //     this.userData = Array.isArray(users) ? users : [users];
    //   });
    // this.getAccountId();
    this.getCountries();

    // this.email = localStorage.getItem('email');
    // this.GetCustomerByContactEmail(this.email);
  }

  // getAccountId() {
  //   this.orderService.getAccountId(this.userId).subscribe(
  //     (data: any) => {
  //       this.idAccount = data.idAccount;
  //     },
  //     (error: any) => {
  //       console.error('Error fetching idAccount:', error);
  //     }
  //   );
  // }

  isInvalid(controlName: string, validation: string) {
    const control = this.userAddressForm.get(controlName);
    if (validation === 'noWhitespace' && this.formSubmitted) {
      return false;
    }
    return (
      control?.hasError(validation) &&
      (control.dirty || control.touched || this.formSubmitted)
    );
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.userAddressForm.valid) {
      const newAddress = {
        idAccount: 0,
        addressLine1: '',
        addressLine2: '',
        county: this.userAddressForm.get('county')?.value || '',
        idAddress: 0,
        mobile: '',
        telno: '',
        email: '',
        lprimary: false,
        notes: '',
        greeting: '',
        job: '',
        suffix: '',
        title: '',
        note: '',
        type: 0,
        forenames: this.userAddressForm.get('firstName')?.value || '',
        surname: this.userAddressForm.get('lastName')?.value || '',
        custName: this.userAddressForm.get('company')?.value || '',
        country: this.selectedCountry || '',
        address: this.userAddressForm.get('address')?.value || '',
        postcode: this.userAddressForm.get('postcode')?.value || '',
        town: this.userAddressForm.get('city')?.value || '',
      };
      this.userDashboardService.insertAddress(this.idAccount, newAddress).subscribe(
        (response: any) => {
          this.toastrService.success(
            'Address inserted Successfully',
            'Success'
          );
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          this._route.navigate(['/user/dashboard']);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        (error: any) => {
          this.toastrService.error('Error adding address', 'Error');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      );
    } else {
      this.toastrService.error('Please fill the form', 'Error');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  getCountries() {
    this.countryService.getCountries().subscribe(
      (data: any[]) => {
        this.countries = data;
      },
      (error: any) => {
        console.error('Error fetching countries:', error);
      }
    );
  }
}
