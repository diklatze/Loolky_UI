import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserBasic } from './userBasic';
import {SignUpPage} from '../signUpPage/signUpPage'
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  styles: [
    `#sign{
        position: absolute;
        top: 8px;
        right: 16px;
        font-size: 18px;
        }`,

    `#menu{
        position: absolute;
        top: 0px;
        left: 0px;
        font-size: 18px;
        }`,

    `/deep/ page-home div.scroll-content{
        padding-top: 0px !important;
      }`,
  ]
})
export class HomePage {
  myUser: UserBasic = <UserBasic>{};
  diklaString: string;

  constructor(protected nav: NavController, public http: Http) { }

  postPerson() {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');


    let body = { name: this.myUser.name, age: this.myUser.age, familyName: this.myUser.nameFamily };

    this.http.post('http://localhost:8080/user', JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => { console.log(data); });


  }

  getDikla() {
    this.http.get('http://localhost:8080/userget')
      .map((res: Response) => { return res/*.json() */ })
      .subscribe(data => { debugger; this.diklaString = data['_body'] },
      err => { console.log("Oops!"); });
  }


  goToSignUp(){
    this.nav.push(SignUpPage)

  }
}
