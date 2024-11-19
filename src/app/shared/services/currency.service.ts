import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {


  private selectedCurrencySubject = new BehaviorSubject<string>('GBP');
  selectedCurrency$ = this.selectedCurrencySubject.asObservable();
  private currencies: any[] = [];

  constructor(private http: HttpClient) {}

  getExchangeRate(baseCode: string, targetCode: string, amount?: number): Observable<any> {
    const params: any = { baseCode, targetCode };
    if (amount !== undefined) {
      params.amount = amount;
    }
    return this.http.get<any>(environment.apiUrl + `api/Currency/rate`, { params });
  }

   // Update the selected currency and notify subscribers
   setSelectedCurrency(currency: string) {
    this.selectedCurrencySubject.next(currency);
  }




  /////////////old

  fetchCurrencies(): Observable<any[]> {
    return this.http.get<any[]>(environment.apiUrl + `api/Currency/FetchExternalCurrencyData`);
  }


  getSelectedCurrency(): Observable<string> {
    return this.selectedCurrencySubject.asObservable();
  }

  convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Observable<number> {
    return this.http.get<number>(environment.apiUrl + `api/Currency/ConvertCurrency`, {
      params: {
        fromCurrency: fromCurrency,
        toCurrency: toCurrency,
        amount: amount.toString()
      }
    });
  }

  getCurrencySymbol(currencyCode: string): string {
    const currency = this.currencies.find(c => c.isocode === currencyCode);
    return currency ? currency.prtcode.trim() : '';
  }
}