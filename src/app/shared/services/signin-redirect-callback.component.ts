import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './modules/auth.service';

@Component({
  selector: 'app-signin-callback',
  template: `<div></div>`
})

export class SigninRedirectCallbackComponent implements OnInit {
  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
    this.authService.completeLogin().then(user => {
      this.router.navigate(['/'], { replaceUrl: true });
    })
  }
}
