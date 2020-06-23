import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { InitEditableRow } from 'primeng';
declare var FB: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private userService: UserService) {

  }
  async ngOnInit() {
    await this.loadFBSDK()
    this.userService.getPages().then(res => {
      console.log("res", res)
    }).catch(err => {
      console.log("err", err)
    })
  }
  async loadFBSDK() {
    (window as any).fbAsyncInit = function () {
      FB.init({
        appId: '721943535339100',
        cookie: true,
        xfbml: true,
        version: 'v3.1'
      });
      FB.AppEvents.logPageView();
      this.init()
    };

    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  submitLogin() {
    console.log("submit login to facebook");
    this.userService.login().then(res => {
      console.log("res", res)
      this.userService.getPages().then(res => {
        console.log("res", res)
      }).catch(err => {
        console.log("err", err)
      })
    }).catch(err => {
      console.log("err", err)
    })
  }
  init() {
    this.userService.getPages().then(res => {
      console.log("res", res)
    }).catch(err => {
      console.log("err", err)
    })
  }




}
