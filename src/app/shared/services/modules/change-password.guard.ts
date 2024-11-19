// import { CanActivateFn } from '@angular/router';

// export const changePasswordGuard: CanActivateFn = (route, state) => {
//   return true;
// };


import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class changePasswordGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const passwordChanged = localStorage.getItem('passwordChanged');
    
    if (passwordChanged === 'false') {
      this.router.navigate(['/admin/change-password']);
      return false;
    }
    return true;
  }
}
