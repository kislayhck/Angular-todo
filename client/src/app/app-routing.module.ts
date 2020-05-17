import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ProfileComponent } from "./profile/profile.component";
import { AuthGuard } from "./auth.guard";
import { TaskComponent } from './task/task.component';

const routes: Routes = [
  { path :"" , redirectTo : 'login' ,pathMatch : 'full'},
  // { path: "home", component: HomeComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  // { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "task", component: TaskComponent,canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
