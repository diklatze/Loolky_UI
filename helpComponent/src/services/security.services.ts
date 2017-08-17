import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Constants} from'../utils/constans';

@Injectable()
export class SecurityServices {
    constructor(private http: Http) {}

    /**
     * Make a login call to server.
     * @method login
     * @param {string} Username.
     * @param {password} - User password.
     * @return {boolean} true if passed email is valid, false otherwise.
     */
    login(username:string, password:string) : Observable<any>{
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let loginURL = Constants.BACKEND_URL_BASE + "/user/login";
        return this.http.post(loginURL, JSON.stringify({ username: username, password: password }), options) 
            .map((response: Response) =>{
                console.log(JSON.stringify(response.text()));
                return  response.json();
            });
    }

    /**
     * Make a signup call to server.
     * @method signup
     * @param {string} username.
     * @param {usertype} usertype.
     * @return {boolean} true if passed email is valid, false otherwise.
     */
    signup(username:string, usertype:string) : Observable<any>{
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let signupURL = Constants.BACKEND_URL_BASE + "/user/student";
        //console.log("SECURITY.SERVICES:: username=[",username,"],usertype=[",usertype,"]");
        return this.http.put(signupURL, JSON.stringify({ userName: username, userType: usertype }), options)  
            .map((response: Response) =>{
                console.log(JSON.stringify(response.text()));
                return  response.json();
            });
    }

    getAppSetup() : Observable<any>{
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let signupURL = Constants.BACKEND_URL_BASE + "/appSetup";
        return this.http.get(signupURL, options)  
            .map((response: Response) =>{
                console.log(JSON.stringify(response.text()));
                return  response.json();
            });
    }
}