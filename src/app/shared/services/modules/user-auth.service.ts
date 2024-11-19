import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private apiURL: string;
  private isAuthenticatedSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private loggedInUserId: number | null = null;

  constructor(private http: HttpClient) {
    this.apiURL = environment.apiUrl;
  }

  public login(user: any): any {
    return this.http.post(this.apiURL+'api/Authentication/UserLoginNew',user)
  }

  // Fetch the login details from the JSON data URL
  getLoginDetails(userId : any): Observable<any[]> {
    const loginDetailsUrl = this.apiURL+'api/Accounts/accountBY/${userId}';
    return this.http.get<any[]>(loginDetailsUrl);
  }

  // Method to set the authentication status and notify subscribers
  setAuthenticated(isAuthenticated: boolean): void {
    this.isAuthenticatedSubject.next(isAuthenticated);
  }

  // Observable to check authentication status
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  // Add a method to set the logged-in user's ID
  setLoggedInUserId(userId: number | null): void {
    this.loggedInUserId = userId;
  }

  

  // Add a method to get the logged-in user's ID
  getLoggedInUserId(): number | null {
    return this.loggedInUserId;
  }

  // Method to log the user out
  logout(): void {
    // Remove the token from localStorage
    localStorage.removeItem('id');
    this.setAuthenticated(false);
    this.setLoggedInUserId(null);
  }

  
  /**
   * This function checks if the user is logged in to the system.
   * It does so by checking if a token exists in the localStorage.
   * @returns Returns true if the token exists, indicating that the user is logged in, otherwise false
   */
  isLoggedIn() {
    return localStorage.getItem('id') != null;
  }

  getUserId(): string {
    // You can retrieve the user ID from wherever it is stored in your application
    // For example, if it is stored in local storage:
    const userId = localStorage.getItem('userId');
    return userId ? userId : '';
  }

  /**
   * To logout the system
   * Check if the 'token' value in the localStorage is null
   * If the token is null, it means the user is logged out
   * If the token is not null, it means the user is still logged in
   */
  isLogOut() {
    (localStorage.getItem('token') == null) ? true : false
  }

}

