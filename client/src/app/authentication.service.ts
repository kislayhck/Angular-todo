import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  is_prime : boolean;
  exp: number;
  iat: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
  name?: string;
}


@Injectable({
  providedIn: "root"
})
export class AuthenticationService {
  private token: string;

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    localStorage.setItem("task-token", token);
    this.token = token;
  }

  private  getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem("task-token");
    }
    return this.token;
  }

  private request(
    method: "post" | "get",
    type: "login" | "register" | "profile" | "users" | "task" | "tasks",
    user?: TokenPayload
  ): Observable<any> {
    let base$;

    if (method === "post") {
      base$ = this.http.post(`/api/${type}`, user);
    } else {
      base$ = this.http.get(`/api/${type}`, {
        headers: { Authorization: `Bearer ${this.getToken()}` }
      },
      );
    }

    const request = base$.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          if(type == "login"){
            this.saveToken(data.token);            
          }
          // this.saveToken(data.token);
        }
        return data;
      })
    );

    return request;
  }

  private requestWithParams(
    method,
    type,
    params,
    data ?
    
  ): Observable<any> {
    let base$;
    if(method == 'get'){
      base$ = this.http.get(`/api/${type}`, {
        headers: { Authorization: `Bearer ${this.getToken()}` },
        params : { _id : params}
      },
      );
    }
    else if(method == 'delete'){
      base$ = this.http.delete(`/api/${type}`, {
        headers: { Authorization: `Bearer ${this.getToken()}` },
        params : { _id : params}
      },
      );
    }else{
      base$ = this.http.put(`/api/${type}`,data, {
        headers: { Authorization: `Bearer ${this.getToken()}` },
        params : { _id : params}
      },
      );
    }
   // }

    const request = base$.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
    return request;
  }
  public logout(): void {
    this.token = "";
    window.localStorage.removeItem("task-token");
    this.router.navigateByUrl("/");
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split(".")[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request("post", "register", user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request("post", "login", user);
  }

  public profile(): Observable<any> {
    return this.request("get", "profile");
  }

  public users(): Observable<any> {
    return this.request("get", "users");
  }

  public addTask(task): Observable<any> {
    return this.request("post", "task", task);
  }

  public getTask(id): Observable<any> {
    return this.requestWithParams("get", "tasks",id);
  }
  
  public deleteTask(id): Observable<any> {
    return this.requestWithParams("delete", "deletetask",id);
  }
  
  public updateTask(id,task): Observable<any> {
    return this.requestWithParams("update", "updatetask", id, task);
  }

  public updateStatus(id,task): Observable<any> {
    return this.requestWithParams("update", "updatetaskStatus", id, task);
  }

  public updateUserPrime(id,user): Observable<any> {
    return this.requestWithParams("update", "updatetPrime", id, user);
  }
}
