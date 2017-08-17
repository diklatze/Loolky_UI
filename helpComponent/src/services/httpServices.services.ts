import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';

@Injectable()
export class HTTPServices {
    constructor(private http: Http) { }

    put = (url: string, body: any, headers?: Headers, options?: RequestOptions): Observable<any> => {
        if (!options) {
            options = this.getRequestOptions(headers);
        }

        return this.http.put(url, body, options)
            .map((response: Response) => {
                //console.log(JSON.stringify(response.text()));
                return response.json();
            });
    }

    get = (url: string, headers?: Headers, options?: RequestOptions): Observable<any> => {
        if (!options) {
            options = this.getRequestOptions(headers);
        }

        return this.http.get(url, options)
            .map((response: Response) => {
                //console.log(JSON.stringify(response.text()));
                return response.json();
            });
    }

    post = (url: string, body: any, headers?: Headers, options?: RequestOptions): Observable<any> => {
        if (!options) {
            options = this.getRequestOptions(headers);
        }

        return this.http.post(url, body, options)
            .map((response: Response) => {
                //console.log(JSON.stringify(response.text()));
                return response.json();
            });
    }

    delete = (url: string, headers?: Headers, options?: RequestOptions): Observable<any> => {
        if (!options) {
            options = this.getRequestOptions(headers);
        }

        return this.http.delete(url, options)
            .map((response: Response) => {
                //console.log(JSON.stringify(response.text()));
                return response.json();
            });
    }


    getHeaders = (): Headers => {
        return new Headers({ 'Content-Type': 'application/json' });
    }

    getRequestOptions = (headers?: Headers): RequestOptions => {
        if (!headers) {
            headers = this.getHeaders();
        }

        return new RequestOptions({ headers: headers });
    }
}