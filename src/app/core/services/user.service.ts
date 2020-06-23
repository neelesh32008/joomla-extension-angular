import {
  Injectable
} from "@angular/core";
import {
  BehaviorSubject,
  Observable
} from "rxjs";
import {
  User
} from "../models/user";
import {
  HttpClient
} from "@angular/common/http";
import {
  mergeMap,
  map,
  tap
} from "rxjs/operators";
declare var FB: any;
const TOKEN = "TOKEN";
const USER = "user";

@Injectable({
  providedIn: "root"
})
export class UserService {
  public user: BehaviorSubject<User> = new BehaviorSubject<User>({} as User);
  header: {
    Authorization: string
  };

  constructor(private httpClient: HttpClient) {
    this.user.next(this.getUser());
    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: '721943535339100',
        cookie: true,
        xfbml: true,
        version: 'v3.1'
      });
      FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

  }

  public async login() {
    let res: any
    res = new Promise((resolve, reject) => {
      FB.login(function (response) {
        console.log(response);
        if (response.authResponse) {
          resolve(response)
        }
        else {
          reject(response)
        }

      }, { scope: 'user_birthday' })
    });

    return res
  }

  public async getPages() {
    let res: any
    res = new Promise(async (resolve, reject) => {
      FB.api('/me/accounts', { "access-token": "EAAKQmpP4xlwBAJPBjhwJw1EmxNqCQbktXI2ZCZB1Xb76sfTAm56b9CamVqxbj2n5ZASeGBZAU4yW8NEJxaaqEtnXMQDjRZAqYRuuUZBG3a3mXEMos68oTWXLEoVNuV1CrStLQbxAuQL82ZB98F5FBcZCGpEZASQMPHXhgDwSU2V7BR4WR5vn3Ydtsaoqja5GKARa3XxbV6BBXJgZDZD" },
        function (response) {
          // Insert your code here
          console.log(response);
          if (response.data) {
            resolve(response)
          }
          else {
            reject(response)
          }
        }, { scope: 'user_birthday' })
    });
    return res
  }

  public logout() {
    this.removeToken();
    this.removeUser();
  }

  public subscribe(token: string, plan: string): Observable<any> {
    return this.httpClient.post(`/api/users/me/subscribe`, {
      token,
      plan
    });
  }

  public setUser(user: User): void {
    localStorage.setItem(USER, JSON.stringify(user));
  }

  public removeUser() {
    localStorage.removeItem(USER);
  }

  public getUser(): User {
    try {
      const stringUser = localStorage.getItem(USER);
      return JSON.parse(stringUser) as User;
    } catch {
      return {} as User;
    }
  }

  public setToken(token: string): void {
    localStorage.setItem(TOKEN, token);
  }

  public removeToken(): void {
    localStorage.removeItem(TOKEN);
  }

  public getToken(): string {
    return localStorage.getItem(TOKEN);
  }

  public isLoggedIn() {
    return localStorage.getItem(TOKEN) != null;
  }

  public updateUser(user) {
    return this.httpClient
      .patch(`/api/users/me`, user)
      .pipe(tap((result: User) => this.setUser(result)));
  }


  public getAllUsers(): Observable<any> {
    return this.httpClient.get(`api/users`);
  }




}