import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {UserBasic} from '../../interfaces/UserBasic'

import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'signUpPage',
  templateUrl: 'signUpPage.html',
  styles: []
})

export class SignUpPage {
myUser: UserBasic = <UserBasic>{};
  diklaString: string;
  
  constructor(protected nav: NavController, public http: Http) { }

  submitUser() {
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');


    let body = { name: this.myUser.name, age: this.myUser.age, familyName: this.myUser.nameFamily };

    this.http.post('http://localhost:8080/user', JSON.stringify(body), { headers: headers })
      .map(res => res.json())
      .subscribe(data => { console.log(data); });


  }

}