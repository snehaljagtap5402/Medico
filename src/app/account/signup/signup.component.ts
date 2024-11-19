import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { MatDialog } from '@angular/material/dialog';
declare var $:any;

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  constructor( private _route:Router, private _http:HttpClient,  private dialog: MatDialog,) { }
  signup:FormGroup|any;
  signuser:any;
  ngOnInit(): void {
    this.signup = new FormGroup({
      'fname': new FormControl(),
      'lname':new FormControl(),
      'email':new FormControl(),
      'phone':new FormControl(),
      'password': new FormControl()
    })
  }

  signupdata(signup:FormGroup){
    this.signuser = this.signup.value.fname
    this._http.post<any>("http://localhost:3000/login", this.signup.value)
    .subscribe(res=>{
      alert('data added successfully');
      this.signup.reset();
      this._route.navigate(['login']);
    }, err=>{
      alert('Somthing went wrong');
    })

  }

  sbtn(){
   
    this._route.navigate(['/']);
    $('.form-box').css('display','block');
    $('.form-box1').css('display','none');
    this.openLoginPopup();
  }

  openLoginPopup() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
      // Adjust the width as needed
    });
  }

}
