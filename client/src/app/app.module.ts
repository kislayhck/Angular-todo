import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule} from '@angular/forms';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';

import { TaskComponent } from './task/task.component';
import { MatNativeDateModule } from '@angular/material/core';
// import { MatNativeDateModule } from '@angular/material/core/datetime';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    ProfileComponent,
    LoginComponent,
    HomeComponent,
    TaskComponent
  ],
  imports: [BrowserModule,ReactiveFormsModule,
    MatFormFieldModule,MatInputModule,MatButtonModule , MatIconModule, MatCheckboxModule, MatNativeDateModule, MatSelectModule,MatSnackBarModule,MatDialogModule,
     AppRoutingModule, FormsModule,MatDatepickerModule, HttpClientModule, BrowserAnimationsModule],
  providers: [MatDatepickerModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
