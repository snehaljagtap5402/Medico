import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Stripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private apiURL: string;
  billingDetails: any;
  shippingDetails: any;
  shippingMethodDetails: any;
  selectedContact: any;
  selectedPaymentMethod: any;

  stripePromise: Promise<Stripe>;
  //private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    this.apiURL = environment.apiUrl;

    this.stripePromise = new Promise((resolve) => {
      // Load Stripe asynchronously
      const stripeScript = document.createElement('script');
      stripeScript.src = 'https://js.stripe.com/v3/';
      stripeScript.onload = () => {
        resolve(
          (window as any).Stripe(
            'pk_test_51OrDBlSFRq2BQEPOuC29c7mstGsknpOvchhxFro8juQYexSQk5aWk7KVikRXnqOTG5V7X2tkmgxb5ro704OWzrCW00riQALwLd'
          )
        ); // Initialize Stripe with your publishable key
      };
      document.body.appendChild(stripeScript);
    });
  }

  getCheckoutDetail(): Observable<any> {
    const checkOutUrl = `${this.apiURL}/checkOutDetails`;
    return this.http.get<any[]>(checkOutUrl);
  }

  addCheckoutDetails(data: any): any {
    const checkOutUrl = `${this.apiURL}/checkOutDetails`;
    return this.http.post<any[]>(checkOutUrl, data);
  }

  editCheckoutDetails(data: any): any {
    const checkOutUrl = `${this.apiURL}/checkOutDetails/${data.id}`;
    return this.http.put<any[]>(checkOutUrl, data);
  }

  getCheckoutDetails(userId: number): any {
    const checkOutUrl = `${this.apiURL}/checkOutDetails?userId=${userId}`;
    return this.http.get<any[]>(checkOutUrl);
  }

  submitOrderFormData(idAccount: number, formData: any): Observable<any> {
    // Assuming formData is an object containing all the necessary data for the order
    return this.http.post<any>(
      this.apiURL + `api/Customers/insertOrder/${idAccount}`,
      formData
    );
  }

  // submitPaymentData(amount: any): Observable<any> {
  //   const payload = { amount: amount };
  //   return this.http.post<any>(this.apiURL + `api/Customers/paymentMethod`, payload);
  // }

  submitPaymentData(cartProducts: any): Observable<any> {
    return this.http.post<any>(
      this.apiURL + `api/Customers/paymentMethod`,
      cartProducts
    );
  }

  async redirectToCheckout(sessionId: string): Promise<void> {
    const stripe = await this.stripePromise;
    const result = await stripe.redirectToCheckout({
      sessionId: sessionId,
    });
    if (result.error) {
      console.error(result.error.message);
      // Handle any errors that occurred during redirection
    }
  }

  submitOrderForm(idAccount: number, formData: any): Observable<any> {
    return this.http.post<any>(
      this.apiURL + `api/Customers/${idAccount}`,
      formData
    );
  }
}
