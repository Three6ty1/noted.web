import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

type User = {
  sub: string,
  nickname: string,
  picture: string,
  permissions: string[],
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private route: Router,) {}

  initUser() {
    var user = localStorage.getItem("user");

    if (user != null) {
      this.user.next(JSON.parse(user));
    }
  }

  login() {
    console.log("Login called");
    // extract code and call client
    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params["code"]) {
        this.http.post(`${environment.DB_STRING}/api/auth/login`, {"authCode": params["code"]}).subscribe(res => {
          this.route.navigate(['/']);
          console.log(res);
          var user = res as User;
          localStorage.setItem("user", JSON.stringify(user));
          this.user.next(user);
        })
      }
    });
  }

  logout() {
    console.log("Logout called");
    this.http.post(`${environment.DB_STRING}/api/auth/logout`, {headers: {'Content-Length': 0}}).subscribe(res => {
      localStorage.removeItem("user");
    });
  }

  test() {
    this.http.get(`${environment.DB_STRING}/api/auth/test`).subscribe(res => {
      console.log(res);
    })
  }
}
