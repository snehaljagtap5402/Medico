import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './modules/auth.service';

@Component({
  selector: 'app-changepassword-callback',
  template: `<div></div>`
})

export class ChangepasswordCallbackComponent {
  constructor(private authService: AuthService,
    private router: Router) { }

    ngOnInit() {
      this.authService.completeLogout().then(_ => {
        this.router.navigate(['/'], { replaceUrl: true });
      })
    }
}
