import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators,} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { CountryService, GetCountriesResult,} from 'src/app/shared/services/country.service';
import { UserDashboardService } from 'src/app/shared/services/modules/user-dashboard.service';

@Component({
  selector: 'app-update-address',
  templateUrl: './update-address.component.html',
  styleUrls: ['./update-address.component.scss'],
})
export class UpdateAddressComponent {
  public userAddressForm: FormGroup | any;
  public userDashboard: any = { userDashboard: [{ addressBook: [] }] };
  public userId: number | any;
  public userData: any;
  public addressBookData: any = [];
  public selected = '1';
  public addressToShow: any;
  public users: any[] = [];
  public idAccount: any;
  public addresses: any[] = [];
  public selectedAddress: any | undefined;
  public idAddress: number | undefined;
  //selectedCountry: number | undefined;
  public countries: GetCountriesResult[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private _route: Router,
    private userDashboardService: UserDashboardService,
    private route: ActivatedRoute,
    private toasterService: ToastrService,
    private countryService: CountryService
  ) {
    this.userAddressForm = this.formBuilder.group({
      alias: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z ]+$'),
        ],
      ],
      // firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]+$')]],
      // lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50), Validators.pattern('^[a-zA-Z ]+$')]],
      firstName: [
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
      lastName: [
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
      company: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\S(.*\S)?$/), // No blank spaces at the beginning
        ],
      ],
      // country: ['', [Validators.required,
      //   Validators.pattern(/^\S(.*\S)?$/),  // No blank spaces at the beginning
      // ]],
      country: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)],
      ],
      address: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\S(.*\S)?$/), // No blank spaces at the beginning
        ],
      ],
      postCode: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(/^\S(.*\S)?$/), // No blank spaces at the beginning
        ],
      ],
      //postCode: ['', Validators.required, Validators.maxLength(10)],
      city: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\S(.*\S)?$/), // No blank spaces at the beginning
        ],
      ],
      county: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\S(.*\S)?$/), // No blank spaces at the beginning
        ],
      ],
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
    //this.userId = +this.route.snapshot.paramMap.get('id')!;
    const idAccountStr = localStorage.getItem('idAccount');
     if (idAccountStr) {
       this.idAccount = parseInt(idAccountStr);
     }
     if (this.idAccount) {
      this.getUserByIdAccount(this.idAccount);
    } else {
      this.toasterService.error('idAccount not found in local storage', 'Error');
    }
    
    this.addressToShow = this.route.snapshot.paramMap.get('addressId');
    this.getCountries();

    // if (this.userId) {
    //   this.getUserById(this.userId);
    // } else {
    //   this.toasterService.error('userId not found in local storage', 'Error');
    // }
    // this.userId = +this.route.snapshot.paramMap.get('id')!;
    //  this.addressToShow = this.route.snapshot.paramMap.get('addressId')
    // this.userDashboardService.getAddressDetailsByIdAccount(this.userId).subscribe((data: any) => {
    //   this.userData = data;
    //   this.addressBookData = data.addressBook;
    //   if(this.addressToShow)
    //   this.userAddressForm.patchValue(this.addressBookData[parseInt(this.addressToShow)])
    // })
  }

  getUserByIdAccount(idAccount: any): void {
    this.userDashboardService.getUserByIdAccount(idAccount).subscribe(
      (response: any) => {
        this.users = Array.isArray(response) ? response : [response];
        this.idAccount = this.users[0].idAccount;
        this.getAddressDetails(this.idAccount);
      },
      (error: any) => {
        this.toasterService.error('Error fetching user by idAccount', error);
      }
    );
  }

  // getUserById(userId: any): void {
  //   this.userDashboardService.getUserById(userId).subscribe(
  //     (response: any) => {
  //       this.users = Array.isArray(response) ? response : [response];
  //       const accountDetails = response?.accountDetails;
  //       if (accountDetails && response?.accountDetails.idAccount) {
  //         const idAccount = response?.accountDetails.idAccount;
  //         this.getAddressDetails(idAccount);
  //         this.idAccount = idAccount;
  //       } else {
  //       }
  //     },
  //     (error: any) => {
  //       console.error('Error fetching user by userId:', error);
  //       this.toasterService.error('Error fetching user by userId', error);
  //     },
  //     () => {
  //     }
  //   );
  // }

  //Function to load address by idAccount
  getAddressDetails(idAccount: any): void {
    this.userDashboardService.getAddressDetailsByIdAccount(idAccount).subscribe(
      (addresses: any[]) => {
        this.addresses = Array.isArray(addresses) ? addresses : [addresses];
        this.selectedAddress = this.addresses.find(
          (address) => address.idAddress === parseInt(this.addressToShow)
        );
        if (this.selectedAddress) {
          this.idAddress = this.selectedAddress.idAddress;
          this.patchFormWithAddress(this.selectedAddress);
        }
      },
      (error: any) => {
        console.error('Error fetching addresses:', error);
      }
    );
  }

  patchFormWithAddress(address: any) {
    const isMainAddress = address.isMainAddress;
    const aliasValue = isMainAddress ? 'default' : 'primary';
    this.userAddressForm.patchValue({
      alias: aliasValue,
      firstName: address.forename,
      lastName: address.surname,
      company: address.custName,
      country: address.country,
      address: address.addressLine1,
      postCode: address.postcode,
      city: address.town,
      county: address.county,
    });

    // Disable the alias field if it's already set
    if (aliasValue === 'default' || aliasValue === 'primary') {
      this.userAddressForm.get('alias').disable();
    }
  }

  isInvalid(controlName: string, validation: string) {
    return (
      this.userAddressForm.get(controlName)?.hasError(validation) &&
      this.userAddressForm.get(controlName)?.touched
    );
  }

  onSubmit() {
    if (this.userAddressForm.valid) {
      const newAddress = {
        forenames: this.userAddressForm.get('firstName').value,
        surname: this.userAddressForm.get('lastName').value,
        custName: this.userAddressForm.get('company').value,
        country: this.selectedAddress?.country,
        idcountry: this.selectedAddress?.country.value,
        //country: this.userAddressForm.get('country').value,
        address: this.userAddressForm.get('address').value,
        //address: this.selectedAddress?.addressLine1 ,
        postcode: this.userAddressForm.get('postCode').value,
        town: this.userAddressForm.get('city').value,
        county: this.userAddressForm.get('county').value,
        addressLine1: this.selectedAddress?.addressLine2,
        addressLine2: this.selectedAddress?.addressLine3,
        mobile: '',
        telno: this.selectedAddress?.telno,
        email: this.selectedAddress?.email,
        lprimary: this.selectedAddress?.isMainAddress,
        notes: '',
        greeting: '',
        job: '',
        suffix: '',
        title: '',
        note: '',
        type: 0,
      };

      if (this.idAddress !== undefined) {
        this.userDashboardService
          .updateAddressDetails(this.idAddress, newAddress)
          .subscribe((data) => {
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
            this.toasterService.success(
              'Updated data Succesfully',
              'Updated',
              toastrConfig
            );
            this._route.navigate(['/user/dashboard']);
          });
      } else {
        console.error('Error: idAddress is undefined.');
      }
    } else {
      this.userAddressForm.markAllAsTouched();
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
