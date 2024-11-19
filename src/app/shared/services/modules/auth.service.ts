import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserManager, User } from 'oidc-client';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthContext } from './auth.context';
import { UserProfile } from './user.profile';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment.development';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //#region Fields and properties
  private userManager: UserManager;
  private _user: User | any;
  private _loginChangedSubject = new Subject<boolean>();
  public loginChanged = this._loginChangedSubject.asObservable();
  public userProfile: any;
  public userName!: string;
  public authContext!: AuthContext;
  public idAccountSubject = new BehaviorSubject<number>(0);
  public idAccountAction$ = this.idAccountSubject.asObservable();
  //#endregion

  //#region Constructor
  constructor(private httpClient: HttpClient, private toastr: ToastrService, private http: HttpClient) {
    const stsSettings = {
      authority: environment.stsAuthority,
      client_id: environment.clientId,
      scope: 'openid',
      redirect_uri: `${environment.clientRoot}signin-callback`,
      response_type: 'code',
      post_logout_redirect_uri: `${environment.clientRoot}signout-callback`,
      automaticSilentRenew: true,
      silent_redirect_uri: `${environment.clientRoot}assets/silent-callback.html`,
    };

    this.userManager = new UserManager(stsSettings);
    this.userManager.events.addAccessTokenExpired((_) => {
      this._loginChangedSubject.next(false);
    });
    this.userManager.events.addUserLoaded((user) => {
      if (this._user !== user) {
        this._user = user;
        this.loadSecurityContext();
        this._loginChangedSubject.next(!!user && !user.expired);
        if (!!user && !user.expired) {
          localStorage.setItem('email', this._user?.profile?.email);
        }
      }
    });
  }
  //#endregion

  //#region Helper Methods
  // changePassword() {
  //   return this.userManager.signinRedirect();
  // }

  public signinRedirectCallback() {
    return this.userManager.signinRedirectCallback().then(() => {});
  }

  get getUser(): User | any {
    return this._user;
  }

  isLoggedIn(): Promise<boolean> {
    return this.userManager.getUser().then((user) => {
      const currentUser = !!user && !user.expired;
      if (this._user !== user) {
        this._user = user ?? undefined;
        this._loginChangedSubject.next(currentUser);
      }
      if (currentUser && !this.authContext) {
        this.loadSecurityContext();
      }
      return currentUser;
    });
  }

  login() {
    return this.userManager.signinRedirect();
  }

  completeLogin() {
    return this.userManager
      .signinRedirectCallback()
      .then((user) => {
        this._user = user;
        this._loginChangedSubject.next(!!user && !user.expired);
        localStorage.removeItem('upliftCharge');
        this.toastr.success('Logged in successfully!', 'Success');
        return user;
      })
      .catch((err) => {
        this.toastr.error('Failed to login!', 'Error');
      });
  }

  logout() {
    this.userManager.signoutRedirect();
    localStorage.removeItem('upliftCharge');
    localStorage.removeItem('idAccount');
    localStorage.removeItem('email');
    this.toastr.success('Logged out successfully!', 'Success');
  }

  completeLogout() {
    // Remove idAccount and email from localStorage
    localStorage.removeItem('idAccount');
    localStorage.removeItem('email');
    //sessionStorage.removeItem('upliftCharge');
    this._user = undefined;
    this._loginChangedSubject.next(false);
    return this.userManager.signoutRedirectCallback();
  }

  getAccessToken() {
    return this.userManager.getUser().then((user) => {
      if (!!user && !user.expired) {
        return user.access_token;
      } else {
        return null;
      }
    });
  }

  loadSecurityContext() {
    if (!this._user?.profile?.email) return;
    this.httpClient
      .get<UserProfile>(
        environment.apiUrl + `api/customers/contact/${this._user?.profile?.email}`
      )
      .subscribe(
        (context) => {
          this.authContext = new AuthContext();
          // this.authContext.claims = context.claims;
          this.authContext.userProfile = context;
          const idAccount = context?.idAccount ?? 0;
          this.idAccountSubject.next(idAccount);
          // Store idAccount in localStorage
          localStorage.setItem('idAccount', idAccount.toString());
          return idAccount;
        },
        (error) => console.error(error)
      );
  }

  changePassword(model: any) {
    //return this.http.post('https://localhost:5001/Account/changePassword', model);
   //return this.http.post('https://localhost:44379/:6020/Account/changePassword', model);
  }
  //#endregion
}
