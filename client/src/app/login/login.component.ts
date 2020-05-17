import { Component } from "@angular/core";
import { AuthenticationService, TokenPayload } from "../authentication.service";
import { Router } from "@angular/router";
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import {MatSnackBar} from '@angular/material/snack-bar';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent {

  matcher = new MyErrorStateMatcher();
  loginForm: FormGroup;

  email = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  password = new FormControl('', [
    Validators.required,
  ]);



  constructor(private auth: AuthenticationService, private _snackBar:MatSnackBar,
              private fb: FormBuilder, private router: Router) {
    this.loginForm = fb.group({
      email: this.email,
      password: this.password,
    });
  }

  public goTosignUp() {
    this.router.navigate(['/register']);
  }

  login() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe(
        (res) => {
          this._snackBar.open("Login Successfully", 'Undo', {
            duration: 2000,
          });
          this.router.navigateByUrl("/task");
        },
        err => {
          console.log(err)
          this._snackBar.open(err.error.message, 'Undo', {
            duration: 2000,
          });
        }
      );
    }
  }
}
