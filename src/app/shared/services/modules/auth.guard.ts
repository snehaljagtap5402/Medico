import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserAuthService } from 'src/app/shared/services/modules/user-auth.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: UserAuthService, private router: Router, private _authService: AuthService,) {}

  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
  //   if (localStorage.getItem('id')) {    
  //     return true;
  //   } else {
  //     this.router.navigate(['/']); // Redirect to the login page if not logged in
  //     return false;
  //   }
  // }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    // Check if the user is logged in
    const isLoggedIn = await this._authService.isLoggedIn();
    if (isLoggedIn) {    
      return true; // Allow access if logged in
    } else {
      this.router.navigate(['/']); // Redirect to the login page if not logged in
      return false;
    }
  }
}
