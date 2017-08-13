import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {SignUpPage} from '../signUpPage/signUpPage'
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  styles: [
    `body {
      background-color: #FFFFFF;
    }`,

    `.ui.menu .item img.logo {
      margin-right: 1.5em;
    }`,

    `.main.container {
      margin-top: 7em;
    }`,

   ` .wireframe {
      margin-top: 2em;
    }`,

    `.ui.footer.segment {
      margin: 5em 0em 0em;
      padding: 5em 0em;`,

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


  constructor(protected nav: NavController, public http: Http) { }

  

  // getDikla() {
  //   this.http.get('http://localhost:8080/userget')
  //     .map((res: Response) => { return res/*.json() */ })
  //     .subscribe(data => { debugger; this.diklaString = data['_body'] },
  //     err => { console.log("Oops!"); });
  // }


  goToSignUp(){
    this.nav.push(SignUpPage)

  }
}
