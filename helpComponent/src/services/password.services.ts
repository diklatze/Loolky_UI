import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../utils/constans';
import { ChangePasswordInterface } from '../components/interfaces/changePassword.interface';
import { HTTPServices} from './httpServices.services';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class PasswordServices {
    constructor(private httpServices: HTTPServices,private http: Http) { }

    changePassword(userId: string, changePasswordDetails: ChangePasswordInterface): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + `/users/${userId}/password/change`;
        return this.httpServices.post(url, JSON.stringify(changePasswordDetails));

        // return new Observable(observer => {
        //     setTimeout(() => {
        //         observer.next({ code: 0 });
        //         observer.complete();
        //     }, 1000);
        // });
    }

    forgotPassword(userId: string): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + `/users/${userId}/password/forgot`;
        //let headers = new Headers({ 'Content-Type': 'application/json' });
       // let options = new RequestOptions({ headers: headers });
        return this.httpServices.post(url, JSON.stringify({userId})
        //, options).map((response: Response) => {
         //   console.log(JSON.stringify(response.text()));
          //  return response.json();
        );

    }


}
