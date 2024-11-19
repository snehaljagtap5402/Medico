import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class adminAuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const adminUserId = localStorage.getItem('adminUserId');

    if (adminUserId) {
      // If the user is logged in, allow access
      return true;
    } else {
      // If not logged in, redirect to admin login page
      this.router.navigate(['/admin/login']);
      return false;
    }
  }
}
