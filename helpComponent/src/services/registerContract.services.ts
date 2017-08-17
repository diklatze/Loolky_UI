import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Constants } from '../utils/constans';
import { RegisterContractInterface } from '../components/interfaces/registerContract.interface';

@Injectable()
export class RegisterContractServices {
    constructor(private http: Http) { }


    registerContract(registerEIContractDetails: RegisterContractInterface): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + registerEIContractDetails.memberShortName + "/contract";
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        console.log(JSON.stringify(JSON.stringify(registerEIContractDetails)));
        return this.http.put(url, JSON.stringify(registerEIContractDetails), options)
            .map((response: Response) => {
                console.log(JSON.stringify(response.text()));
                return response.json();
            });
    }
}