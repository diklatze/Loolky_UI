import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../utils/constans';
import { CacheService } from "ionic-cache";

@Injectable()
export class MessageServices {
    private static CACHE_GROUP_ID = "messages_service";

    constructor(private http: Http, private cache: CacheService) { }


    /**
     * Get message by message code according to the specified in browser locale
     * @method getMessageByMessageId
     * @param {String} messageCode
     * @return {Observable<any>} response
     */
    getMessageByMessageId(messageCode: string): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });

        let options = new RequestOptions({ headers: headers });
        let uri = Constants.BACKEND_URL_BASE + "/message/" + messageCode;

        //console.log("MessageServices:: getMessageByMessageId()");

        const request = this.http.get(uri, options);
        return this.cache.loadFromObservable(messageCode, request, MessageServices.CACHE_GROUP_ID).map(res => res.json());
    }


    /**
     * Get message by message code according to the specified in browser locale with callback functions
     * @method getMessage
     * @param {String} messageCode
     * @param {CallBackFunction} successCallBack
     * @param {CallBackFunction} failureCallBack
     * @param {CallBackFunction} parameterValues - placeholders values array
     */
    getMessage(messageCode: string, successCallBack: CallBackFunction, failureCallBack?: CallBackFunction, parameterValues?: [string]): void {
        if (failureCallBack == undefined || failureCallBack == null) {
            failureCallBack = (err: any) => { console.log(err) };
        }

        this.getMessageByMessageId(messageCode).subscribe(
            result => {
                if (result.code == "0") {
                    //Replace placeholders with values for example: "{0} did not registered yet"
                    if (parameterValues && result.messageContent) {
                        for (let i = 0; i < parameterValues.length; i++) {
                            result.messageContent = result.messageContent.replace('{' + i + '}', parameterValues[i]);
                        }
                    }
                    successCallBack(result.messageContent);
                }
                else {
                    failureCallBack(result.code);
                }
            },
            err => {
                failureCallBack(err);
            }
        );
    }

}

export type CallBackFunction = (resultMessage: string) => void;