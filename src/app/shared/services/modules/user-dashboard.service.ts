import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserDashboardService {

  private apiURL: string;
  counter:number;

  constructor(private http: HttpClient) {
    this.apiURL = environment.apiUrl;
    this.counter=0;
   }

   //post contact data
  public sendContactData(contact : any): any {
    return this.http.post(this.apiURL + `api/Mail/sendMail`, contact);
  }

  // Fetch active customers
  getActiveCustomers(): Observable<any[]> {
    const activeCustomersUrl = this.apiURL+'api/accounts'
    return this.http.get<any[]>(activeCustomersUrl);
  }

   // Fetch user dashboard details
  getUserDashboard(): Observable<any> {
    const userDashboardUrl =this.apiURL+'/userDashboard'
    return this.http.get<any>(userDashboardUrl);
  }
  
  deleteAddressDetail(userId: any, addressDetailId: any) {
    const userDashboardUrl = this.apiURL+'/userdashboard/${userId}/addressBook/${addressDetailId}'
    return this.http.delete<any[]>(userDashboardUrl);
  }
    
   // Fetch user dashboard details
   getUserDashboardById(id : any): Observable<any> {
    const userDashboardUrl = this.apiURL+'/userDashboard/${id}'
    return this.http.get<any>(userDashboardUrl);
  }

  updateUserDashboard(userDashboard: any) {
    const userDashboardUrl = this.apiURL+'/userDashboard/${userDashboard.id}'
    return this.http.put(userDashboardUrl, userDashboard);
  }

  updateUsersDashboard(userDashboard: any) {
    const userDashboardUrl = this.apiURL+'/userDashboard'
    const userDashboardId = userDashboard.id; // Check the correct property for the ID
    const userDashboardUpdateUrl = `${userDashboardUrl}/${userDashboardId}`;
    return this.http.put(userDashboardUpdateUrl, userDashboard);
  }
  
  updateUserDetails(userId: number, updatedDetails: any): Observable<any> {
    const updateUrl = this.apiURL+'/userDashboard/${userId}'
    return this.http.put<any>(updateUrl, updatedDetails);
  }

  public getUserById(userId: any): any {
    return this.http.get(
     this.apiURL + `api/Accounts/GetAccountDetailsByIdAccount/${userId}`
    );
  }

  public getUserByIdAccount(idAccount: any): any {
    return this.http.get(
     this.apiURL + `api/Accounts/GetAccountDetailsByIdAccount/${idAccount}`
    );
  }

  public updateAccountDetails(updatedDetails: any, idAccount : any): any {
    return this.http.put(this.apiURL + `api/Accounts/update/${idAccount}`, updatedDetails);
  }

  deleteAddressesBySqlIds(sqlIds: number[]): Observable<any> {
    const url = this.apiURL +`api/Accounts/deleteAddress`; 
    return this.http.delete<any>(url, { body: { sqlIds } });
  }

  public insertAddress(idAccount: any, addressDetails: any): any {
    return this.http.post(
      this.apiURL + `api/Accounts/insert/${idAccount}`,
      addressDetails
    );
  }

  public updateAddressDetails(idAddress: number, updatedAddress: any): Observable<any> {
    return this.http.put(this.apiURL + `api/Accounts/UpdateAddressDetails/${idAddress}`, updatedAddress);
  }

  public GetCustomerByContactEmail(email: any): any {
    return this.http.get(
     this.apiURL + `api/Customers/contact/${email}`
    );
  }

  public getAddressDetailsByIdAccount(idAccount: any): any {
    return this.http.get(
      this.apiURL + `api/Accounts/addressesByIdAccount/${idAccount}`
    );
  }

  public insertCustomerAddress(addressDetails: any): any {
    return this.http.post(
      this.apiURL + `api/Customers/InsertCustomer/${addressDetails}`,
      addressDetails
    );
  }
}
