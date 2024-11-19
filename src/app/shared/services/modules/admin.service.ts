import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl;
  }

  public adminLogin(loginData: any): Observable<any> {
    return this.http.post(
      this.apiUrl + `api/Admin/AdminLogin`,
      loginData
    );
  }

  public getAllUsers(): Observable<any> {
    return this.http.get<any>(this.apiUrl + `api/Admin/GetAllUsers`);
  }

  public deleteAdminUser(userId: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + `api/Admin/DeleteAdminUser/${userId}`);
  }

  public getAdminUserById(userId: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + `api/Admin/GetAdminUserById/${userId}`);
  }

  public addAdminUser(newUser: any): Observable<any> {
    return this.http.post(this.apiUrl + 'api/Admin/AddAdminUser', newUser);
  }

  public updateAdminUser(userId: number, updatedUser: any): Observable<any> {
    return this.http.put(this.apiUrl + `api/Admin/UpdateAdminUser/${userId}`, updatedUser);
  }

  public changePassword(userId: number, passwordData: any): Observable<any> {
    return this.http.put(this.apiUrl + `api/Admin/ChangePassword/${userId}`, passwordData);
  }

  public updateLastLoginDate(userId: number, lastLoginDate: Date): Observable<any> {
    const updatedUser = { lastLoginDate }; 
    return this.http.put(this.apiUrl + `api/admin/updateLastLoginDate/${userId}`, updatedUser);
}


}
