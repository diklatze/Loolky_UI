import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Constants } from '../utils/constans';
import { UserOfMemberInterface } from '../components/interfaces/userOfMember.interface';


@Injectable()
export class MarketplaceServices {
    constructor(private http: Http) { }

    /**
    * Make a DH Admin member user addition server call.
    * @method addUserOfMember
    * @param {string} username.
    * @param {UserOfMemberInterface} user.
    */
addUserOfMember(user: UserOfMemberInterface): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let signupURL = Constants.BACKEND_URL_BASE + "/user/member";
        //console.log("addUserOfMember:: " + JSON.stringify(user));
        return this.http.put(signupURL, JSON.stringify(user), options)
            .map((response: Response) => {
                console.log(JSON.stringify(response.text()));
                return response.json();
            });
    }
}