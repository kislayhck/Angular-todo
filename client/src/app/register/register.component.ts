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

export class MyErrorStateMatcher2 implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    // const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);
     const invalidParent = !!(control.parent.get('password').invalid && control.parent.get('password').dirty);
    console.log(invalidCtrl ,'==',invalidParent,'==',control.parent.get('password').invalid)
    return (invalidCtrl || invalidParent);
  }
}
@Component({
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"]
})
export class RegisterComponent {
  matcher = new MyErrorStateMatcher();
  matcher2 = new MyErrorStateMatcher2();
  registerForm: FormGroup;

  name = new FormControl('', [
    Validators.required,
  ]);

  email = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  password = new FormControl('', [
    Validators.required,
  ]);

  confirmPassword = new FormControl('', [
    Validators.required,
  ]);

  primeUser = new FormControl(false, [
    Validators.required,
  ]);

  constructor(private auth: AuthenticationService, private fb: FormBuilder,
              private router: Router, private _snackBar:MatSnackBar,) {
    this.registerForm = fb.group({
      email: this.email,
      password: this.password,
      name: this.name,
      confirmPassword : this.confirmPassword,
      is_prime : this.primeUser
    });
  }

  checkPasswords() { // here we have the 'passwords' group
  console.log('come')
  let pass = this.registerForm.get('password').value;
  let confirmPass = this.registerForm.get('confirmPassword').value;
  console.log(pass === confirmPass ? null : { notSame: true })

  return pass === confirmPass ? true :  false ;   
}
  register(userType) {
    console.log(userType)
    if (this.registerForm.valid) {
      if(this.checkPasswords()){
        userType == 'prime' ? (this.registerForm.get('is_prime').setValue(true)):(this.registerForm.get('is_prime').setValue(false))
        this.registerForm.removeControl('confirmPassword');
        console.log(this.registerForm.value);
        this.auth.register(this.registerForm.value).subscribe(
          () => {
            this._snackBar.open("SignUp Successfully", 'Close', {
              duration: 2000,
            });
            this.router.navigateByUrl("/login");
          },
          err => {
            console.error(err);
            this.registerForm.addControl('confirmPassword', new FormControl('', Validators.required));
            this._snackBar.open(err.error.message, 'Close', {
              duration: 2000,
            });
          }
        );  

      }else{
        this._snackBar.open("Confirm Password not match", 'Close', {
          duration: 2500,
        });
      }
    }   
  }
}
