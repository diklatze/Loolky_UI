import { HTTPServices } from './httpServices.services';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../utils/constans';

import { AggregationsResponse } from '../components/interfaces/aggregation.interface';

@Injectable()
export class AggregationsService {
    
    constructor(private httpServices: HTTPServices) { }
    
    
    getEventsOverTimeStudentLoan(): Observable<AggregationsResponse> {
        let url = Constants.BACKEND_URL_BASE + "/StudentLoanOverTime";
        return this.httpServices.get(url);
    }

    getEventsOverFacultiesStudentLoan(from: Date, to: Date): Observable<AggregationsResponse> {
        let url = Constants.BACKEND_URL_BASE + "/StudentLoanOverFaculties";
        return this.httpServices.post(url, JSON.stringify({from:from, to: to}));
    }

    getEventsOverCountriesStudentLoan(): Observable<AggregationsResponse> {
        let url = Constants.BACKEND_URL_BASE + "/StudentLoanOverCountries";
        return this.httpServices.post(url, JSON.stringify({from:new Date("2017-01-01T00:00:00Z"), to: new Date("2017-02-01T00:00:00Z")}));
    }
}