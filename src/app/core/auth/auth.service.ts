import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../../environments/environment';

type User = {
  sub: string,
  nickname: string,
  picture: string,
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  login() {
    console.log("login called")
    // extract code and call client
    this.route.queryParams.subscribe(params => {
      if (params && params["code"]) {
        this.http.post(`${environment.DB_STRING}/api/auth/login`, {"authCode": params["code"]}).subscribe(_user => {
          
        })
      }
    });
  }

  logout() {

  }

  test() {
    this.http.get(`${environment.DB_STRING}/api/auth/test`).subscribe(res => {
      console.log(res);
    })
  }
}
