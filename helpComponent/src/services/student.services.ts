import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Constants } from '../utils/constans';
import { StudentInterface } from '../components/interfaces/student.interface';
import { HTTPServices } from './httpServices.services';
import { OfferType } from '../components/interfaces/offer.interface';

@Injectable()
export class StudentServices {
    constructor(private http: Http, private httpServices: HTTPServices) { }

    /**
     * Register student call.
     * @method login
     * @param {StudentInterface} student
     * @return {Observable<any>} response
     */
    register(student: StudentInterface): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let loginURL = Constants.BACKEND_URL_BASE + "/student";

        return this.http.put(loginURL, JSON.stringify(student), options)
            .map((response: Response) => {
                console.log(JSON.stringify(response.text()));
                return response.json();
            });
    }

    saveUnsaveOffer(studentId: string, memberId: string, offerCode: string, isUnsave: boolean, offerType: OfferType): Observable<any> {
        let urlPartByOfferType: { [index: string]: string } = {
            [OfferType.scholarship]: "savedscholarship",
            [OfferType.loanType]: "savedloantypes",
            [OfferType.jobOffer]: "savedjoboffers"
        }

        let url = Constants.BACKEND_URL_BASE + `/students/${studentId}/${urlPartByOfferType[offerType]}/${memberId}/${offerCode}`;
        return isUnsave ? this.httpServices.delete(url) : this.httpServices.put(url, "");
    }

    updateStudentInfo(student: StudentInterface): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let loginURL = Constants.BACKEND_URL_BASE + "/members/" + student.universityName + "/student/update";
        console.log("loginURL=",loginURL);
        return this.http.put(loginURL, JSON.stringify(student), options)
            .map((response: Response) => {
                console.log(JSON.stringify(response.text()));
                return response.json();
            });
    }

    saveStudentInfoDraft(student: StudentInterface): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        let loginURL = Constants.BACKEND_URL_BASE + "/members/" + student.universityName + "/student/save";

        return this.http.put(loginURL, JSON.stringify(student), options)
            .map((response: Response) => {
                console.log(JSON.stringify(response.text()));
                return response.json();
            });
    }

    rollbackStudentInfo(student: StudentInterface): Observable<any> {
        const url = Constants.BACKEND_URL_BASE + "/members/" + student.universityName + "/students/" + student.email + "/rollback";
        return this.httpServices.get(url);
    }

    getAppliedScholarships(studentid: string): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/students/" + studentid + "/scholarships/";
        return this.httpServices.post(url, JSON.stringify({studentScholarshipStatus:"Pending"}));
    }

    getAppliedLoans(studentid: string): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/students/" + studentid + "/loans/";
        return this.httpServices.post(url, JSON.stringify({studentLoanStatus:"Pending"}));
    }
}