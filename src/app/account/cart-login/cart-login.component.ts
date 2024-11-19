import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { UserAuthService } from 'src/app/shared/services/modules/user-auth.service';

@Component({
  selector: 'app-cart-login',
  templateUrl: './cart-login.component.html',
  styleUrls: ['./cart-login.component.scss']
})
export class CartLoginComponent {
  public loginForm = new FormGroup({
    username: new FormControl(''),
    passwordHash: new FormControl(''),
  });
  public passwordHash: any;
  public userId: any;
  
  ngOnInit() {
    localStorage.removeItem('username');
  }
  
  constructor(
    private userService: UserAuthService,
    private dialogRef: MatDialogRef<CartLoginComponent>,
    private toastrService: ToastrService,
    private router: Router
  ) {}
  
  logindata() {
    const user = {
      username: this.loginForm.get('username')?.value,
      passwordHash: this.loginForm.get('passwordHash')?.value,
    };
  
    this.userService.login(user).subscribe(
      (users: any) => {
        let userName: any = this.loginForm.get('User')?.value;
        localStorage.setItem('username', users.username);
        localStorage.setItem('id', users.userId);
        this.userService.setAuthenticated(true);
        this.router.navigate(['product-detail/:id/:refcode']);
  
        if (user) {
          const toastrConfig = {
            timeOut: 3000,
            progressBar: true,
            positionClass: 'toast-top-center',
            closeButton: true,
            enableHtml: true,
            tapToDismiss: true,
            newestOnTop: true,
            extendedTimeOut: 0,
            progressAnimation: 'decreasing',
            easeTime: 500,
            animate: 'zoomOutUp',
          } as Partial<IndividualConfig<any>>;
  
          // @ts-ignore
          toastrConfig.enableDuplicates = false;
  
          // this.toastrService.success(
          //   'You are successfully logged in',
          //   'Success',
          //   toastrConfig
          // );
  
          this.toastrService.success('You are successfully logged in', 'Success', toastrConfig);
  
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          this.toastrService.error('User Not Found', 'Error');
        }
      },
      (error: any) => {
        this.toastrService.error('Incorrect user name and pasword', 'Error');
        console.error(error);
      }
    );
  }
  
  closePopup() {
    this.dialogRef.close();
  }
  }