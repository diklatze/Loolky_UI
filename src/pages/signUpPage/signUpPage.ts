import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Http, Headers, Response, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'signUpPage',
  templateUrl: 'signUpPage.html',
  styles: []
})

export class SignUpPage {
  
  constructor(protected nav: NavController, public http: Http) { }

}