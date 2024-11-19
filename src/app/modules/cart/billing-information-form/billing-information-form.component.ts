import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StepType } from '@progress/kendo-angular-layout';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CheckoutCompleteComponent } from '../checkout-complete/checkout-complete.component';
import { Product } from '../../product/models/product.model';
import { CurrencyService } from 'src/app/shared/services/currency.service';
import { AddToCartService } from 'src/app/shared/services/modules/add-to-cart.service';
import { CheckoutService } from 'src/app/shared/services/modules/checkout.service';
import { OrderService } from 'src/app/shared/services/modules/order.service';
import { Router } from '@angular/router';
import { DialogService } from 'src/app/shared/services/dialog.service';
import { UserDashboardService } from 'src/app/shared/services/modules/user-dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { MatSelectChange } from '@angular/material/select';
import { ILines, IOrder } from '../../product/models/order';
import { Location } from '@angular/common';

@Component({
  selector: 'app-billing-information-form',
  templateUrl: './billing-information-form.component.html',
  styleUrls: ['./billing-information-form.component.scss'],
})
export class BillingInformationFormComponent {
  @Input() products: Product = {} as Product;
  @Input() selectedCurrency: string = 'GBP';
  @Input() product: any;
  @Input() displayedColumns: string[] = ['id', 'totalprice', 'quantity', 'price', 'action',];
  @Input() cartDetails: any;
  @Input() totalPrice = 0.0;
  @Input() totalOfAllItems: number = 0;
  @Input() totalExcludingVAT: any = 0;
  @Input() vat: number = 0;
  @Output() showcheckoutFormEvent = new EventEmitter<any>();
  @Output() continueClicked: EventEmitter<any> = new EventEmitter<any>();
  @Output() billingFormValues: EventEmitter<any> = new EventEmitter();
  @Output() shippingFormValues: EventEmitter<any> = new EventEmitter();
  @Output() shippingMethodFormValues: EventEmitter<any> = new EventEmitter();
  @Output() selectedPaymentMethodChange = new EventEmitter<number>();
  @Output() selectedContact: EventEmitter<any> = new EventEmitter();
  private readonly storageKey = 'billingCurrentStep';
  public stepType: StepType = 'indicator';
  public stepTypes: Array<StepType> = ['indicator', 'label', 'full'];
  public current = 0;
  public selected = 'option2';
  public selectedPaymentMethod: any;
  public cartItems: any;
  public confirmOrder: any[] = [];
  public ShippingRate: number = 0;
  public cartProducts: any[] = [];
  public userId: any = localStorage.getItem('id');
  public billingDetails: any;
  public displayedBillingDetails: any;
  public users: any;
  public checkoutDetails: any = {};
  public hideButtons: boolean | undefined;
  public checkoutButtonClicked = false;
  public user: any;
  public selectedShippingTitle: string = '';
  public vatRate: any;
  public idAddress: any;
  public selectedAddress: string = 'copyFromAddressBook';
  public addresses: any[] = [];
  public idAccount: any;
  public shippingModes: any[] = [];
  public selectedLabel: string = '';
  public mainAddressArray: any[] = [];
  public showConfirmationMessage: boolean | any;
  public formSubmitted = false;
  public cartId: any;
  public sessionId: any;
  public newOrder: any;
  public newOrderNo: any;
  public upliftCharge: number = 0;
  public billingInformationForm!: FormGroup;
  public shippingInfoForm!: FormGroup;
  public shippingMethodForm!: FormGroup;
  public contactDetailsForm!: FormGroup;
  public paymentMethodForm!: FormGroup;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private dialogService: DialogService,
    private userDashboardService: UserDashboardService,
    private fb: FormBuilder,
    private checkoutService: CheckoutService,
    private orderService: OrderService,
    private addToCartService: AddToCartService,
    public currancyService: CurrencyService,
    private toasterService: ToastrService,
    private location: Location
  ) { this.checkValidForm(); }

  public ngOnInit(): void {
    // Retrieve idAccount from localStorage
    const idAccountStr = localStorage.getItem('idAccount');
    if (idAccountStr) {
      this.idAccount = parseInt(idAccountStr);
    }
    this.getUserByIdAccount(this.idAccount);
    const upliftChargeStr = localStorage.getItem('upliftCharge');
    this.upliftCharge = upliftChargeStr ? parseFloat(upliftChargeStr) : 0;
    this.currancyService.selectedCurrency$.subscribe((currency) => {
      this.selectedCurrency = currency;
    });

    this.getPriceInSelectedCurrency();
    this.userDashboardService
      .getUserByIdAccount(parseInt(this.idAccount))
      .subscribe((response: any) => {
        const checkoutDetails = response;
        this.billingDetails = Array.isArray(response) ? response : [response];
        if (this.billingDetails) {
          this.billingInformationForm.patchValue({
            firstName: this.billingDetails[0]?.forenames || '',
            lastName: this.billingDetails[0]?.surname || '',
            company: this.billingDetails[0]?.custName || '',
            country: this.billingDetails[0]?.county || '',
            address: this.billingDetails[0]?.addressLine1 || '',
            postCode: this.billingDetails[0]?.postcode || '',
            city: this.billingDetails[0]?.town || '',
            secondcountry: this.billingDetails[0]?.country || '',
            saveToAddressBook: this.billingDetails.billerCountry || '',
            aliasName: this.billingDetails.billerCountry || '',
          });
        }
        if (this.billingDetails) {
          this.shippingInfoForm.patchValue({
            firstName: this.billingDetails[0]?.forenames || '',
            lastName: this.billingDetails[0]?.surname || '',
            company: this.billingDetails[0]?.custName || '',
            country: this.billingDetails[0]?.county || '',
            address: this.billingDetails[0]?.addressLine1 || '',
            postCode: this.billingDetails[0]?.postcode || '',
            city: this.billingDetails[0]?.town || '',
            secondcountry: this.billingDetails[0]?.country || '',
          });
        }

        if (this.shippingModes && this.shippingModes.length > 0) {
          this.shippingMethodForm.patchValue({
            shippingMethod: this.shippingModes[0].name || '',
          });
        }

        if (checkoutDetails) {
          this.contactDetailsForm.patchValue({
            email: checkoutDetails.email || '',
            phone: checkoutDetails.telno || '',
            //note: checkoutDetails.cartNotes || '',
            note:
              (
                document.querySelector(
                  'textarea[name="note"]'
                ) as HTMLTextAreaElement
              )?.value || '',
          });
        }

        if (checkoutDetails) {
          this.paymentMethodForm.patchValue({
            paymentMethod: checkoutDetails.paymentMethod || '',
            accountNumber: checkoutDetails.AccoutNo || '',
          });
        }
      });
    this.getCart();
    this.displayBillingDetails();
    const lastSavedStep = this.getLastSavedStep();

    this.current = lastSavedStep !== null ? lastSavedStep : 0;
    this.fetchBillingDetails();
    this.getShippingOptions();

    const urlParams = new URLSearchParams(window.location.search);
    const successParam = urlParams.get('success');

    if (successParam === 'true') {
      // Call handleStripePaymentSuccess if the payment was successful
      this.handleStripePaymentSuccess();
    } else if (successParam === 'false') {
      // Display a message indicating that the transaction failed
      this.displayTransactionFailedMessage();
    }
  }

  public checkValidForm(): void {
    this.shippingInfoForm = this.fb.group({
      shippingMethod: [''],
    });
    this.billingInformationForm = this.fb.group({
      selectedAddress: ['copyFromAddressBook'],
      firstName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
          Validators.pattern('^[A-Za-z]+(?: [A-Za-z]+)*$'),
        ]),
        [],
      ],
      lastName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
          Validators.pattern('^[A-Za-z]+(?: [A-Za-z]+)*$'),
        ]),
        [],
      ],
      company: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
          Validators.pattern('^[A-Za-z]+(?: [A-Za-z]+)*$'),
        ]),
        [],
      ],
      country: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
          Validators.pattern('[A-Za-z ]+'),
        ]),
        [],
      ],
      address: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
          Validators.pattern('^[A-Za-z0-9.]+(?:[- ][A-Za-z0-9]+)*$'),
        ]),
        [],
      ],
      postCode: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z0-9\\s]{0,10}$'),
        ]),
        [],
      ],
      city: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
          Validators.pattern('[A-Za-z]+'),
        ]),
        [],
      ],
      secondcountry: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(50),
          Validators.pattern('^[A-Za-z]+(?: [A-Za-z]+)*$'),
        ]),
        [],
      ],
      saveToAddressBook: [''],
      aliasName: ['default'],
    });

    this.shippingInfoForm = this.fb.group({
      selectedAddress: ['copyFromAddressBook'],
      firstName: ['', [Validators.required, Validators.minLength(1)]],
      lastName: ['', Validators.required],
      company: ['', Validators.required],
      country: ['', Validators.required],
      address: ['', Validators.required],
      postCode: ['', Validators.required],
      city: ['', Validators.required],
      secondcountry: ['', Validators.required],
      saveToAddressBook: [''],
      aliasName: ['default'],
    });

    this.shippingMethodForm = this.fb.group({
      shippingMethod: ['', Validators.required],
    });

    this.contactDetailsForm = this.fb.group({
      email: [
        '',
        [
          Validators.compose([
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            ),
          ]),
        ],
      ],
      phone: [
        '',
        [
          Validators.compose([
            Validators.required,
            Validators.pattern(/^[0-9]{10}$/),
          ]),
        ],
      ],
      note: [],
    });

    this.paymentMethodForm = this.fb.group({
      paymentMethod: ['', Validators.required],
      accountNumber: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue],
    });
  }

  public resetPaymentMethod(): any {
    if (this.paymentMethodForm) {
      const paymentMethodControl = this.paymentMethodForm.get('paymentMethod');
      if (paymentMethodControl) {
        paymentMethodControl.reset();
      } else {
        console.error('paymentMethodControl is null or undefined');
      }
    } else {
      console.error('paymentMethodForm is null or undefined');
    }
  }

  // Method to be called when navigating to the payment method section
  public goToPaymentMethod(): void {
    // Reset the selected payment method
    this.resetPaymentMethod();
  }

  public getShippingOptions(): void {
    this.addToCartService.getAllDelModes().subscribe(
      (data) => {
        this.shippingModes = data;
        this.selectedLabel = this.shippingModes[0].name;
      },
      (error) => {
        console.error('Error fetching shipping options:', error);
      }
    );
  }

  public updatePriceBasedOnShipping(): void {
    if (this.cartDetails && this.selectedLabel) {
      this.cartDetails.forEach((item: any) => {
        const selectedShippingOption = this.shippingOptions.find(
          (option) => option.value === this.selectedLabel
        );
        if (selectedShippingOption) {
          item.price = selectedShippingOption.price;
        }
      });
    }
  }

  public getUserByIdAccount(idAccount: any): void {
    this.userDashboardService.getUserByIdAccount(idAccount).subscribe(
      (response: any) => {
        this.users = Array.isArray(response) ? response : [response];
        this.getAddressDetails(this.idAccount);
      },
      (error: any) => {
        this.toasterService.error('Error fetching user by userId', error);
      },
      () => { }
    );
  }

  public getAddressDetails(idAccount: any): void {
    this.userDashboardService.getAddressDetailsByIdAccount(idAccount).subscribe(
      (addresses: any[]) => {
        this.addresses = Array.isArray(addresses) ? addresses : [addresses];
        const mainAddress = this.addresses.find(
          (address) => address.isMainAddress === true
        );
        if (mainAddress) {
          this.mainAddressArray = [mainAddress];
        }
        this.addresses.forEach((address) => (address.isSelected = false));
      },
      (error: any) => {
        console.error('Error fetching addresses:', error);
      }
    );
  }

  //Function to be called when the "Continue" button is clicked
  public onContinueClicked(data: any): any {
    if (data == 'billingInfo') {
      if (this.billingInformationForm.invalid) {
        this.markFormControlsAsTouched(this.billingInformationForm);
        return;
      } else {
        this.continueClicked.emit(1);
        this.billingFormValues.emit(this.billingInformationForm.value);
        this.updateBillingInfo();
        this.goToStep(this.current + 1);
      }
    } else if (data == 'shippingInfo') {
      if (this.shippingInfoForm.invalid) {
        this.markFormControlsAsTouched(this.shippingInfoForm);
        return;
      } else {
        this.continueClicked.emit(2);
        this.shippingFormValues.emit(this.shippingInfoForm.value);
        this.updateShippingInfo();
        this.goToStep(this.current + 1);
      }
    } else if (data == 'shippingMethod') {
      this.continueClicked.emit(3);
      this.shippingMethodFormValues.emit(this.shippingMethodForm.value);
      this.goToStep(this.current + 1);
    } else if (data == 'contactInfo') {
      if (this.contactDetailsForm.valid) {
        this.continueClicked.emit(4);
        this.selectedContact.emit(this.contactDetailsForm.value);
        this.updateContactInfo();
        this.goToStep(this.current + 1);
      } else {
        this.contactDetailsForm.markAllAsTouched();
      }
    }
  }

  public markFormControlsAsTouched(formGroup: FormGroup): any {
    Object.keys(formGroup.controls).forEach((controlName) => {
      const control = formGroup.get(controlName);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormControlsAsTouched(control);
      }
    });
  }

  // Add this method to save the current step in local storage
  private saveCurrentStep(step: number) {
    localStorage.setItem(this.storageKey, step.toString());
  }

  // Add this method to get the last saved step from local storage
  private getLastSavedStep(): number | null {
    const storedStep = localStorage.getItem(this.storageKey);
    return storedStep ? parseInt(storedStep, 10) : null;
  }

  // Update the current step and save it to local storage
  public goToStep(stepIndex: number): void {
    this.current = stepIndex;
    this.saveCurrentStep(stepIndex);
  }

  public steps = [
    {
      label: '1. Billing Information',
      isValid: true,
      icon: 'steps-icon steps-icon1',
    },
    {
      label: '2. Shipping Information',
      isValid: false,
      icon: 'steps-icon steps-icon2',
      disabled: true,
    },
    {
      label: '3. Shipping Method',
      isValid: true,
      icon: 'steps-icon steps-icon3',
      disabled: true,
    },
    {
      label: '4. Review Cart and Contact Details',
      isValid: true,
      icon: 'steps-icon steps-icon4',
      disabled: true,
    },
    {
      label: '5. Payment Method',
      isValid: true,
      icon: 'steps-icon steps-icon5',
      disabled: true,
    },
  ];

  // Define your shipping options
  public shippingOptions: { value: string; label: string; price: number }[] = [
    { value: '1', label: 'Collect from London Branch @ ', price: 0.0 },
    { value: '2', label: 'Collect from Birmingham Branch @ ', price: 0.0 },
    { value: '3', label: 'Royal Mail Signed For 1st Class @ ', price: 6.0 },
    {
      value: '4',
      label: 'Royal Mail Special Delivery: Next Day Delivery @ ',
      price: 8.6,
    },
    { value: '5', label: 'TNT: Heavy Weight Delivery @ ', price: 20.0 },
  ];

  public onSelectionChange(event: MatSelectChange): void {
    const selectedAddress = event.value;
    if (selectedAddress && selectedAddress !== 'copyFromAddressBook') {
      const selectedAddressObj = this.addresses.find(
        (address) => address.idAddress === selectedAddress
      );

      if (selectedAddressObj) {
        this.billingInformationForm.patchValue({
          firstName: selectedAddressObj.forename || '',
          lastName: selectedAddressObj.surname || '',
          company: selectedAddressObj.custName || '',
          country: selectedAddressObj.country || '',
          address: selectedAddressObj.addressLine1 || '',
          postCode: selectedAddressObj.postcode || '',
          city: selectedAddressObj.town || '',
          secondcountry: selectedAddressObj.county || '',
        });
      }
      if (selectedAddressObj) {
        this.shippingInfoForm.patchValue({
          firstName: selectedAddressObj.forename || '',
          lastName: selectedAddressObj.surname || '',
          company: selectedAddressObj.custName || '',
          country: selectedAddressObj.country || '',
          address: selectedAddressObj.addressLine1 || '',
          postCode: selectedAddressObj.postcode || '',
          city: selectedAddressObj.town || '',
          secondcountry: selectedAddressObj.county || '',
        });
      }
      //this.updateBillingInfo();
      this.updateShippingInfo();
      this.updateContactInfo();
    }
  }

  // Method to handle selection change in the shipping form
  public onShippingSelectionChange(event: MatSelectChange): void {
    const selectedAddressId = event.value;
    if (selectedAddressId && selectedAddressId !== 'copyFromAddressBook') {
      const selectedAddress = this.addresses.find(
        (address) => address.idAddress === selectedAddressId
      );

      if (selectedAddress) {
        this.shippingInfoForm.patchValue({
          firstName: selectedAddress.forename || '',
          lastName: selectedAddress.surname || '',
          company: selectedAddress.custName || '',
          country: selectedAddress.country || '',
          address: selectedAddress.addressLine1 || '',
          postCode: selectedAddress.postcode || '',
          city: selectedAddress.town || '',
          secondcountry: selectedAddress.county || '',
        });
      }
      this.updateShippingInfo(); // Update the shipping information after patching values
    }
  }

  // Method to handle selection change in the billing form
  public onBillingSelectionChange(event: MatSelectChange): void {
    const selectedAddressId = event.value;
    if (selectedAddressId && selectedAddressId !== 'copyFromAddressBook') {
      const selectedAddress = this.addresses.find(
        (address) => address.idAddress === selectedAddressId
      );

      if (selectedAddress) {
        this.billingInformationForm.patchValue({
          firstName: selectedAddress.forename || '',
          lastName: selectedAddress.surname || '',
          company: selectedAddress.custName || '',
          country: selectedAddress.country || '',
          address: selectedAddress.addressLine1 || '',
          postCode: selectedAddress.postcode || '',
          city: selectedAddress.town || '',
          secondcountry: selectedAddress.county || '',
        });
      }
      this.updateBillingInfo(); // Update the billing information after patching values
    }
  }

  public fetchBillingDetails(): void {
    this.userDashboardService
      .getUserByIdAccount(parseInt(this.idAccount))
      .subscribe((response: any) => {
        //const checkoutDetails = response[0];
        this.billingDetails = Array.isArray(response) ? response : [response];
        this.idAddress = this.billingDetails[0]?.idAddress;
      });
  }

  public updateBillingInfo(): void {
    this.userDashboardService
      .getUserByIdAccount(parseInt(this.idAccount))
      .subscribe((response: any) => {
        const checkoutDetails = response[0];
        this.billingDetails = Array.isArray(response) ? response : [response];
        this.idAddress = this.billingDetails[0]?.idAddress;
        const updatedBillingInfo = {
          forenames: this.billingInformationForm.value.firstName,
          surname: this.billingInformationForm.value.lastName,
          custName: this.billingInformationForm.value.company,
          county: this.billingInformationForm.value.country,
          address: this.billingInformationForm.value.address,
          postcode: this.billingInformationForm.value.postCode,
          town: this.billingInformationForm.value.city,
          country: this.billingInformationForm.value.secondcountry,
          addressLine1: this.billingDetails[0]?.addressLine1,
          addressLine2: this.billingDetails[0]?.addressLine2,
          mobile: '',
          telno: this.billingDetails[0]?.telno,
          email: this.billingDetails[0]?.email,
          lprimary: true,
          notes: '',
          greeting: '',
          job: '',
          suffix: '',
          title: '',
          note: '',
          type: 0,
        };

        this.userDashboardService
          .updateAddressDetails(this.idAddress, updatedBillingInfo)
          .subscribe((response) => { });
      });
  }

  public updateShippingInfo(): void {
    this.userDashboardService
      .getUserByIdAccount(parseInt(this.idAccount))
      .subscribe((response: any) => {
        //const checkoutDetails = response[0];
        this.billingDetails = Array.isArray(response) ? response : [response];
        this.idAddress = this.billingDetails[0]?.idAddress;
        const updatedShippingInfo = {
          forenames: this.shippingInfoForm.value.firstName,
          surname: this.shippingInfoForm.value.lastName,
          custName: this.shippingInfoForm.value.company,
          county: this.shippingInfoForm.value.country,
          address: this.shippingInfoForm.value.address,
          postcode: this.shippingInfoForm.value.postCode,
          town: this.shippingInfoForm.value.city,
          country: this.shippingInfoForm.value.secondcountry,
          addressLine1: this.billingDetails[0]?.addressLine1,
          addressLine2: this.billingDetails[0]?.addressLine2,
          mobile: '',
          telno: '',
          email: this.billingDetails[0]?.email,
          lprimary: true,
          notes: '',
          greeting: '',
          job: '',
          suffix: '',
          title: '',
          note: '',
          type: 0,
        };

        // this.userDashboardService
        //   .updateAddressDetails(this.idAddress, updatedShippingInfo)
        //   .subscribe((response) => {});
      });
  }

  public updateContactInfo(): void {
    this.userDashboardService
      .getUserByIdAccount(parseInt(this.idAccount))
      .subscribe((response: any) => {
        // const checkoutDetails = response[0];
        this.billingDetails = Array.isArray(response) ? response : [response];
        this.idAddress = this.billingDetails[0]?.idAddress;
        const updateContactInfo = {
          forenames: this.billingInformationForm.value.firstName,
          surname: this.billingInformationForm.value.lastName,
          custName: this.billingInformationForm.value.company,
          county: this.billingInformationForm.value.country,
          address: this.billingInformationForm.value.address,
          postcode: this.billingInformationForm.value.postCode,
          town: this.billingInformationForm.value.city,
          country: this.billingInformationForm.value.secondcountry,
          addressLine1: this.billingDetails[0]?.addressLine1,
          addressLine2: this.billingDetails[0]?.addressLine2,
          mobile: '',
          telno: this.contactDetailsForm.value.phone,
          email: this.contactDetailsForm.value.email,
          lprimary: true,
          note: this.contactDetailsForm.value.note,
          greeting: '',
          job: '',
          suffix: '',
          title: '',
          //note: this.contactDetailsForm.value.note,
          notes: this.contactDetailsForm.value.note,
          type: 0,
        };
        this.userDashboardService
          .updateAddressDetails(this.idAddress, updateContactInfo)
          .subscribe((response) => { });
      });
  }

  public displayBillingDetails(): void {
    const billingFormValues = this.billingInformationForm.value;
    this.displayedBillingDetails = billingFormValues;
  }

  public copyBillingAddress(): void {
    this.shippingInfoForm.patchValue(this.billingInformationForm.value);
  }

  public copyBillingAddressToBillingForm(): void {
    this.billingInformationForm.patchValue({
      firstName: this.billingDetails[0]?.forenames || '',
      lastName: this.billingDetails[0]?.surname || '',
      company: this.billingDetails[0]?.custName || '',
      country: this.billingDetails[0]?.county || '',
      address: this.billingDetails[0]?.addressLine1 || '',
      postCode: this.billingDetails[0]?.postcode || '',
      city: this.billingDetails[0]?.town || '',
      secondcountry: this.billingDetails[0]?.country || '',
      saveToAddressBook: this.billingDetails.billerCountry || '',
      aliasName: this.billingDetails.billerCountry || '',
    });
  }

  public getPriceInSelectedCurrency(): string {
    if (this.products && this.products.refcodes) {
      const selectedPrice =
        this.products.refcodes[0].prices[this.selectedCurrency];
      if (selectedPrice !== undefined) {
        return selectedPrice.toFixed(2);
      }
    }
    return 'N/A';
  }

  // Function to update the selectedShippingTitle when a radio button is changed
  public updateSelectedTitle(): void {
    const selectedValue = this.shippingMethodForm.get('shippingMethod')?.value;
    this.selectedShippingTitle = this.getShippingTitle(selectedValue);
  }

  public getShippingTitle(value: string): string {
    // Implement logic to map values to titles
    switch (value) {
      case '1':
        return 'Collect from London Branch @ £0.00';
      case '2':
        return 'Collect from Birmingham Branch @ £0.00';
      case '3':
        return 'Royal Mail Signed For 1st Class @ £6.00';
      case '4':
        return 'Royal Mail Special Delivery: Next Day Delivery @ £8.60';
      case '5':
        return 'TNT: Heavy Weight Delivery @ £20.00';
      default:
        return '';
    }
  }

  public getCartItemsdetsilbyproduct(): void {
    this.totalPrice = 0.0;
    this.addToCartService.getProductFromCart().subscribe((data: any) => {
      this.currancyService.selectedCurrency$.subscribe((currency) => {
        this.selectedCurrency = currency;
      });
      if (data && this.product) {
        this.cartItems = [];
        this.cartDetails = [];
        data.forEach((cartDetail: any) => {
          if (!cartDetail.placeOrder) {
            this.totalPrice = parseFloat(
              (this.totalPrice + cartDetail.price).toFixed(2)
            );
            let product = this.product.filter(
              (x: { id: any }) => x.id == cartDetail.productId
            );
            cartDetail.imgUrl = product[0].imageUrl;
            cartDetail.description = product[0].description;
            cartDetail.description = product[0].description;
            cartDetail.refcodes = product[0].refcodes[0].refcode;
            if (
              product[0].refcodes[0].prices[this.selectedCurrency] !== undefined
            ) {
              cartDetail.pricePerProduct =
                product[0].refcodes[0].prices[this.selectedCurrency].toFixed(2);
            } else {
              cartDetail.pricePerProduct = 'N/A';
            }
            cartDetail.pricePerProduct = product[0].refcodes[0].prices;
            this.cartDetails.push(cartDetail);
          }
        });
      }
    });
  }

  public getItemTotal(product: any): number {
    let total = 0;
    for (const item of this.cartProducts) {
      total += parseFloat(item.total);
    }
    return total;
  }

  public getItem(product: any): number {
    const pricePerProduct = product.pricePerProduct[this.selectedCurrency];
    if (!isNaN(pricePerProduct)) {
      return pricePerProduct;
    } else {
      return 0;
    }
  }

  public getTotalOfAllItems(): number {
    let total = 0;
    for (const item of this.cartProducts) {
      total = item.lineItemCount;
    }
    return total;
  }

  public calculateSubTotal(): number {
    let subTotal = 0;
    if (this.cartProducts) {
      for (const product of this.cartProducts) {
        subTotal = this.getItemTotal(product);
      }
    }
    return subTotal;
  }

  public getTotalExcludingVAT(): number {
    let total = 0;
    // Iterate through each item in cartDetails and sum up the total
    for (const item of this.cartProducts) {
      total += Math.round(parseFloat(item.total) * 100);
    }
    return parseFloat((total / 100).toFixed(2));
  }

  public calculateSubTotalExcludingVAT(): string {
    // Calculate Sub Total (ex. VAT) by subtracting VAT from total excluding VAT
    const subTotalExcludingVAT = this.getTotalExcludingVAT() - this.vat;
    // Limit the number of digits after the decimal point to 2
    return subTotalExcludingVAT.toFixed(2);
  }

  public calculateGrandTotal(): number {
    const subTotal = this.calculateSubTotal();
    //onst vat = this.getVAT(subTotal);
    const totalExcludingVAT = this.getTotalExcludingVAT();
    const grandTotal = totalExcludingVAT + this.ShippingRate + this.vat;
    return isNaN(grandTotal) ? 0.0 : parseFloat(grandTotal.toFixed(2));
  }

  public isConfirmDisabled(): boolean {
    const totalProductPrice = this.calculateGrandTotal();
    return totalProductPrice === 0;
  }

  public getTotalQuantity(): number {
    let totalQuantity = 0;
    if (this.cartProducts) {
      for (const product of this.cartProducts) {
        totalQuantity += product.quantity;
      }
    }
    return totalQuantity;
  }

  public onBillingFormValues(value: any) {
    this.checkoutService.billingDetails = value;
    this.checkoutService.shippingDetails = value;
    this.checkoutService.shippingMethodDetails = value;
  }

  public isInvalid(controlName: string, validation: string) {
    return (
      this.contactDetailsForm.get(controlName)?.hasError(validation) &&
      this.contactDetailsForm.get(controlName)?.touched
    );
  }

  public prev(): void {
    if (this.current > 0) {
      this.current -= 1;
    }
  }

  public next(): void {
    if (this.current < this.steps.length - 1) {
      this.current += 1;
    }
  }

  get form() {
    return this.billingInformationForm.controls;
  }

  get shippingform(): any {
    return this.shippingInfoForm.controls;
  }

  public submit(formName: any): any {
    switch (formName) {
      case 'billingInfo': {
        this.addOrUpdateCheckoutForm(formName);
        break;
      }
      case 'shippingInfo': {
        this.addOrUpdateCheckoutForm(formName);
        break;
      }
      case 'contact': {
        this.addOrUpdateCheckoutForm(formName);
        break;
      }
      case 'paymentMethod': {
        this.addCheckoutForm(formName);
        this.addOrUpdateCheckoutForm(formName);
        break;
      }
    }
  }

  // public getAccountId(): any {
  //   this.orderService.getAccountId(this.userId).subscribe(
  //     (data: any) => {
  //       this.idAccount = data.idAccount;
  //     },
  //     (error: any) => {
  //       console.error('Error fetching idAccount:', error);
  //     }
  //   );
  // }

  public addOrUpdateCheckoutForm(formName: string) {
    const newAddress = {
      idAccount: this.idAccount,
      salesOrderId: 225865,
    };
    const formData = this.getFormData(formName);
    this.checkoutService
      .submitOrderForm(newAddress.idAccount, formData)
      .subscribe(
        (response) => {
          // Handle response
        },
        (error) => {
          // Handle error
        }
      );
  }

  private getFormData(formName: string): any {
    switch (formName) {
      case 'billingInfo':
        return {
          firstName: this.billingDetails?.forenames || '',
          lastName: this.billingDetails?.surname || '',
          company: this.billingDetails?.custName || '',
          country: this.billingDetails?.county || '',
          address: this.billingDetails?.addressLine1 || '',
          postCode: this.billingDetails?.postcode || '',
          city: this.billingDetails?.town || '',
          secondcountry: this.billingDetails?.country || '',
          saveToAddressBook: this.billingDetails?.billerCountry || '',
          aliasName: this.billingDetails?.billerCountry || '',
        };
      case 'shippingInfo':
        return {
          firstName: this.billingDetails?.forenames || '',
          lastName: this.billingDetails?.surname || '',
          company: this.billingDetails?.custName || '',
          country: this.billingDetails?.county || '',
          address: this.billingDetails?.addressLine1 || '',
          postCode: this.billingDetails?.postcode || '',
          city: this.billingDetails?.town || '',
          secondcountry: this.billingDetails?.country || '',
        };
      default:
        return {};
    }
  }

  public paymentMethod(value: any): any {
    this.selectedPaymentMethod = value;
    this.selectedPaymentMethodChange.emit(value);
    if (value != 1) {
      this.paymentMethodForm.get('accountNumber')?.setErrors(null);
    } else {
      this.paymentMethodForm
        .get('accountNumber')
        ?.setErrors(Validators.required);
    }
  }

  public async addCheckoutForm(formName: string): Promise<void> {
    const payload = this.orderPayload();
    const userId = localStorage.getItem('id');
    payload.userId = userId;
    const response = await this.orderService.addOrderDetails(payload);
    this.checkoutDetails = response;
  }

  private createOrderId(): any {
    const randomId = Math.floor(10000000 + Math.random() * 90000000)
      .toString()
      .substring(0, 8);
    return `EURO-${randomId}`;
  }

  private orderPayload(): any {
    const userId = localStorage.getItem('id');
    const orderId = this.createOrderId();

    const subtotal = this.calculateSubTotal();
    //const vat = this.getVAT(subtotal);
    const vat = this.vat;
    const totalQuantity = this.getTotalQuantity();
    const grandTotal = this.calculateGrandTotal();
    const price =
      this.product[0].refcodes[0].prices[this.selectedCurrency] !== undefined
        ? this.product[0].refcodes[0].prices[this.selectedCurrency].toFixed(2)
        : 'N/A';
    const selectedShippingMethod = this.shippingMethodForm.value.shippingMethod;
    const selectedOption = this.shippingOptions.find(
      (option) => option.label == selectedShippingMethod
    );
    const shippingPrice = selectedOption ? selectedOption.price : 0.0;

    const cartItems = this.cartDetails.map(
      (cartDetail: {
        productId: any;
        description: any;
        refcodes: any;
        pricePerProduct: number;
        quantity: number;
      }) => {
        return {
          productId: cartDetail.productId,
          description: cartDetail.description,
          refcodes: cartDetail.refcodes,
          quantity: cartDetail.quantity,
          pricePerProduct: price,
          totalPrice: (parseFloat(price) * cartDetail.quantity).toFixed(2),
          dateAdded: new Date(),
        };
      }
    );
    return {
      orderId: orderId,
      vatRate: 20,
      cartEmail: this.contactDetailsForm.value.email,
      cartPhone: this.contactDetailsForm.value.phone,
      cartNotes: this.contactDetailsForm.value.note,
      shipperMethod: this.shippingMethodForm.value.shippingMethod,
      shippingPrice: shippingPrice,
      paymentMethod: this.paymentMethodForm.value.paymentMethod,
      AccoutNo: this.paymentMethodForm.value.accountNumber,
      subtotal: subtotal,
      vat: vat,
      grandTotal: grandTotal,
      userId: userId,
      totalQuantity: totalQuantity,
      cartItems: cartItems,
    };
  }

  // private createPayload() {
  //   const userId = localStorage.getItem('id');
  //   const selectedShippingMethod = this.shippingMethodForm.value.shippingMethod;
  //   const selectedOption = this.shippingOptions.find(
  //     (option) => option.label == selectedShippingMethod
  //   );
  //   const shippingPrice = selectedOption ? selectedOption.price : 0.0;
  //   const subtotal = this.calculateSubTotal();
  //   const vat = this.getVAT(subtotal);
  //   const grandTotal = this.calculateGrandTotal();

  //   return {
  //     id: this.users[0]?.id ? this.users[0]?.id : null,
  //     billerFristName: this.billingInformationForm.value.firstName,
  //     billerLastName: this.billingInformationForm.value.lastName,
  //     billerCompany: this.billingInformationForm.value.company,
  //     billerCounty: this.billingInformationForm.value.country,
  //     billerAddress: this.billingInformationForm.value.address,
  //     billerPostCode: this.billingInformationForm.value.postCode,
  //     billerCity: this.billingInformationForm.value.city,
  //     billerCountry: this.billingInformationForm.value.secondcountry,
  //     billerAddresssaveToAddressBook:
  //       this.billingInformationForm.value.saveToAddressBook == ''
  //         ? true
  //         : false,
  //     billerAlias: this.billingInformationForm.value.aliasName,
  //     shipperFristName: this.shippingInfoForm.value.firstName,
  //     shipperLastName: this.shippingInfoForm.value.lastName,
  //     shipperCompany: this.shippingInfoForm.value.company,
  //     shipperCounty: this.shippingInfoForm.value.country,
  //     shipperAddress: this.shippingInfoForm.value.address,
  //     shipperPostCode: this.shippingInfoForm.value.postCode,
  //     shipperCity: this.shippingInfoForm.value.city,
  //     shipperCountry: this.shippingInfoForm.value.secondcountry,
  //     shipperAddresssaveToAddressBook:
  //       this.shippingInfoForm.value.shippingInfoForm == '' ? true : false,
  //     shipperAlias: this.shippingInfoForm.value.aliasName,
  //     shipperMethod: this.shippingMethodForm.value.shippingMethod,
  //     shippingPrice: shippingPrice,
  //     vatRate: 20,
  //     cartEmail: this.contactDetailsForm.value.email,
  //     cartPhone: this.contactDetailsForm.value.phone,
  //     cartNotes: this.contactDetailsForm.value.note,
  //     paymentMethod: this.paymentMethodForm.value.paymentMethod,
  //     AccoutNo: this.paymentMethodForm.value.accountNumber,
  //     subtotal: subtotal,
  //     vat: vat,
  //     grandTotal: grandTotal,
  //     userId: userId,
  //   };
  // }

  public navigateToOrder(): any {
    this.router.navigate(['/cart/checkout']);
  }

  //Function to get cart items
  public getCart(): any {
    this.addToCartService.getCartItemsByUserId(this.idAccount).subscribe(
      (data) => {
        this.cartProducts = data;
        this.cartProducts.forEach((product: any) => {
          //product.sellPrice += this.upliftCharge; 
          const upliftAmount = product.sellPrice * (this.upliftCharge / 100);
          //product.sellPrice = product.sellPrice + upliftAmount;
          product.sellPrice = +(product.sellPrice + upliftAmount).toFixed(2);
          product.total = Math.round((product.quantity * product.sellPrice) * 100) / 100;
        });
        this.vatRate = this.cartProducts[0].vatRate;
      },
      (error) => {
        console.error('Error fetching cart items:', error);
      }
    );
    this.getTotalOfAllItems();
  }

  public openOrderDialog(): any {
    if (this.confirmOrder.length != 0) {
      for (let i = 0; i < this.confirmOrder.length; i++) {
        let dataToEdit = [];
        this.confirmOrder[i].placeOrder = true;
        dataToEdit.push(this.confirmOrder[i]);
        this.addToCartService.editCartDetails(dataToEdit).subscribe((data) => {
          this.confirmOrder = data;
        });
      }

      this.dialogService.openDialog(CheckoutCompleteComponent, {
        width: '600px',
      });
    }
  }

  //Function to create order lines
  public createOrderLines(cartProducts: any): any {
    const linesItems: any = [];
    (this.cartProducts as any[]).forEach((cartProducts) => {
      var newOrder: ILines = {
        cartItemId: 0,
        productRef: cartProducts.productID || '',
        aliasId: cartProducts.productID || '',
        reference: '',
        desc: '',
        DiscCode: '',
        average: cartProducts.average || '',
        quantity: cartProducts.quantity || '',
        totalLine: cartProducts.total || '',
        cartId: this.cartProducts[0].cartId || '',
        costprice: cartProducts.sellPrice || '',
        lineNumber: this.totalOfAllItems,
        text: cartProducts.desc || '',
        UnitPrice: cartProducts.sellPrice || '',
        sellPrice: cartProducts.sellPrice || '',
      };
      linesItems.push(newOrder);
    });
    this.cartId = this.cartProducts[0].cartId;
    return linesItems;
  }

  public formatDate(): any {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(now.getDate()).padStart(2, '0');

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const milliseconds = '000'; // As per the requirement

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  //Function to submit paymentMethod form data
  public submitPaymentMethodForm(): any {
    this.formSubmitted = true;
    if (this.paymentMethodForm.valid) {
      if (Array.isArray(this.cartProducts) && this.cartProducts.length > 0) {
        const todayDate = new Date().toISOString().split('T')[0];
        const formattedDate = this.formatDate();
        const newOrder: IOrder = {
          idAccount: this.idAccount,
          custName:
            (this.billingDetails[0]?.forenames || '') +
            (this.billingDetails[0]?.surname || ''),
          date: todayDate,
          lastchanged: formattedDate,
          notes:
            (
              document.querySelector(
                'textarea[name="note"]'
              ) as HTMLTextAreaElement
            )?.value || '',
          custRef: 'a',
          idAddress: 0,
          Status: '0',
          //OrderNo: this.newOrderNo,
          Lines: this.createOrderLines(this.cartProducts),
        };
        // localStorage.setItem('cartId', this.cartId);
        // this.confirmOrderdata(this.idAccount, newOrder);
        this.checkoutService.submitPaymentData(this.cartProducts).subscribe(
          (data) => {
            // Store the session id, cartId and new order in local storage
            localStorage.setItem('sessionId', data.sessionId);
            localStorage.setItem('newOrder', JSON.stringify(newOrder));
            localStorage.setItem('cartId', this.cartId);

            //Redirect to Stripe for payment
            window.location.href = data.redirectUrl;
          },
          (error) => {
            console.error('Error creating checkout session:', error);
            this.toasterService.error(
              'An error occurred while processing the payment'
            );
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        );
      } else {
        this.toasterService.error('No products found', 'Error');
      }
    } else {
      this.paymentMethodForm.markAllAsTouched();
    }
  }

  // This method should be called after the user returns from the Stripe payment gateway, indicating a successful payment
  public handleStripePaymentSuccess(): any {
    const sessionId = localStorage.getItem('sessionId');
    const newOrderString = localStorage.getItem('newOrder');

    if (sessionId && newOrderString) {
      const newOrder: IOrder = JSON.parse(newOrderString);
      const idAccount = newOrder.idAccount;
      this.confirmOrderdata(idAccount, newOrder);
    } else {
      console.error('Error: newOrder or sessionId is not available.');
    }
  }

  //Function to display error message when payment gets failed.
  public displayTransactionFailedMessage(): any {
    this.toasterService.error(
      'Your transaction has failed. Please try again.',
      'Transaction Failed'
    );
  }

  //Function to confirm order
  public confirmOrderdata(idAccount: number, newOrder: IOrder): any {
    const cartId = localStorage.getItem('cartId');

    // This method is called after successful payment and will handle saving order details
    this.checkoutService.submitOrderFormData(idAccount, newOrder).subscribe(
      (response: any) => {
        this.toasterService.success('Order confirmed successfully', 'Success');
        this.emptyCart(cartId);
        //this.openCheckoutCompleteDialog(newOrder.OrderNo);
        this.openCheckoutCompleteDialog(response.orderNo);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      (error: any) => {
        this.toasterService.error('Error while placing order', 'Error');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    );
  }

  //Function to open checkoutCompleteComponent dialog
  public openCheckoutCompleteDialog(orderNo: string): void {
    setTimeout(() => {
      const dialogRef = this.dialog.open(CheckoutCompleteComponent, {
        width: '500px',
        disableClose: true,
        data: { orderNo: orderNo }, // Pass orderNo as data to the component
      });
      dialogRef.afterClosed().subscribe(() => {
        this.location.replaceState(this.location.path());
        window.location.reload();
      });
    }, 0);
  }

  //Function to empty the cart
  public emptyCart(cartId: any): void {
    this.addToCartService.emptyCart(this.idAccount, cartId).subscribe(
      (response: any) => {
        this.location.replaceState(this.location.path());
      },
      (error: any) => {
        console.error('Error emptying the cart:', error);
      }
    );
  }
}
