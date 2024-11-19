import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiURL: string;

  constructor(private http: HttpClient) {
    this.apiURL = environment.apiUrl;
  }

  getOrders(): Observable<any> {
    const orderUrl = `${this.apiURL}api/Customers/Orders`;
    return this.http.get<any>(orderUrl);
  }

  addOrderDetails(payload: any): Promise<any> {
    const productsUrl = `${this.apiURL}api/Customers/Orders`;
    return new Promise((resolve, reject) => {
      this.http.post<any[]>(productsUrl, payload).subscribe(
        (response: any) => {
          resolve(response);
        },
        (error: any) => {
          reject(error);
        }
      );
    });
  }

  getOrdersForUser(userId: number): Observable<any> {
    const orderUrl = `${this.apiURL}api/Customers/Orders?userId=${userId}`;
    return this.http.get<any>(orderUrl);
  }

  getOrderById(orderId: number): Observable<any> {
    const orderUrl = `${this.apiURL}api/Customers/Orders?orderId=${orderId}`;
    return this.http.get<any>(orderUrl);
  }

  // private orderNoSubject = new BehaviorSubject<string>('');
  // orderNo$ = this.orderNoSubject.asObservable();

  // setorderNo(orderNo: string) {
  //   this.orderNoSubject.next(orderNo);
  // }

  private orderNoSubject = new BehaviorSubject<string>('');
  orderNo$ = this.orderNoSubject.asObservable();

  setorderNo(orderNo: string) {
    this.orderNoSubject.next(orderNo);
  }

  waitForOrderNo(): Promise<string> {
    return new Promise((resolve) => {
      this.orderNo$.subscribe((orderNo) => {
        if (orderNo) {
          resolve(orderNo);
        }
      });
    });
  }

  getOrders1(
    idCustomer: number,
    startDate: string,
    endDate: string
  ): Observable<any> {
    const url = `${this.apiURL}api/Customers/orders/${idCustomer}/${startDate}/${endDate}`;
    return this.http.get(url);
  }

  //Get idAccount by CustomerDetails
  getAccountId(userId: any) {
    const url = `${this.apiURL}api/Customers/GetCustomerDetailsByUserId/${userId}`;
    // const url = `${this.apiURL}api/Customers/GetCustomerDetailsByUserId/0`;
    return this.http.get(url);
  }

  getFilterOrders(
    idCustomer: number,
    startDate: string,
    endDate: string,
    pageNumber: number,
    pageSize: number
  ): Observable<any> {
    const params = new HttpParams()
      .set('PageNumber', pageNumber !== undefined ? pageNumber.toString() : '')
      .set('PageSize', pageSize !== undefined ? pageSize.toString() : '');

    const url = `${this.apiURL}api/Customers/filterOrders/${idCustomer}/${startDate}/${endDate}`;

    // Making the HTTP GET request
    return this.http.get(url, { params });
  }

  getShipping(orderNo: any) {
    const url = `${this.apiURL}api/Customers/GetTransportSODeliveryAddress/${orderNo}`;
    return this.http.get(url);
  }
}
