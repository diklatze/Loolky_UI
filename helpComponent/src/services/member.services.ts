import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Constants } from '../utils/constans';
import { MemberInterface } from '../components/interfaces/member.interface';
import { UserType } from '../utils/constans';
import { OutputListDataInterface } from '../components/interfaces/listManage.interface';
import { HTTPServices } from './httpServices.services';
import { LoanTypeInterface } from '../components/interfaces/loan.interface';
import { ScholarshipInterface } from '../components/interfaces/scholarship.interface';
import { JobOfferInterface } from '../components/interfaces/jobOffer.interface';
import { DynamicFieldsValuesInterface } from '../components/interfaces/fieldMetadata.interface';
import { OfferType, idFieldNameByOfferType } from '../components/interfaces/offer.interface';
import { PublishCertifiedEiInterface } from '../components/certifiedEI/certifiedEI.component';
import { PageInterface } from '../components/interfaces/uiElements/dataGrid.interface';
import { isNullOrUndefined } from '../components/../utils/utils';
import { FindEligibleResponse } from '../components/interfaces/domain.interface';

@Injectable()
export class MemberServices {
    constructor(private httpServices: HTTPServices) { }

    addMember(member: MemberInterface): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/member";
        return this.httpServices.put(url, JSON.stringify(member));
    }

    createMemberAccount(memberShortName: string, request: any): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + memberShortName + "/account";
        return this.httpServices.put(url, JSON.stringify(request));
    }

    getMemberAccountDetails(memberShortName: string) {
        let url = Constants.BACKEND_URL_BASE + "/members/" + memberShortName + "/account";
        return this.httpServices.get(url);
    }

    getMemberDetailsAndContractValidation(memberShortName: string, contractName: string) {
        let url = Constants.BACKEND_URL_BASE + "/contractValidations?" + "memberShortName=" + memberShortName + "&contract=" + contractName;
        return this.httpServices.get(url);
    }

    getSendFundsDetails(memberShortName: string) {
        let url = Constants.BACKEND_URL_BASE + "/members/" + memberShortName + "/sendfunddetails/";
        return this.httpServices.get(url);
    }

    getAllMembers(memberType: string, memberId: string): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + memberId + "/certifiedmembers/" + memberType;
        return this.httpServices.get(url);
    }

    getMemberTypes(memberId: string): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + memberId + "/membertypes";
        return this.httpServices.get(url);
    }

    publishCertifiedEIs(govID: string, listCertifiedEis: PublishCertifiedEiInterface): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + govID + "/certified";
        return this.httpServices.put(url, JSON.stringify(listCertifiedEis));
    }

    publishFaculties(eiID: string, outputListDataInterface: OutputListDataInterface): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + eiID + "/faculties";
        return this.httpServices.put(url, JSON.stringify(outputListDataInterface));
    }

    publishLoanCategories(govID: string, outputListDataInterface: OutputListDataInterface): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + govID + "/categories";
        return this.httpServices.put(url, JSON.stringify(outputListDataInterface));
    }

    getFaculties(eiID: string): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + eiID + "/faculties";
        return this.httpServices.get(url);
    }

    getCertifiedEIs(govID: string): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + govID + "/certified";
        return this.httpServices.get(url);
    }

    getCategories(govID: string): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + govID + "/categories";
        return this.httpServices.get(url);
    }

    getAssociations(eiShortName: string, governmentMemberId: string): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + eiShortName + "/associations/" + governmentMemberId;
        return this.httpServices.get(url);
    }

    getEIGovorments(eiID: string): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/member/" + eiID + "/governments";
        return this.httpServices.get(url);
    }

    publishAssociations(eiShortName: string, governmentMemberId: string, associations: any) {
        let url = Constants.BACKEND_URL_BASE + "/members/" + eiShortName + "/associations/" + governmentMemberId
        let data = { data: associations };
        return this.httpServices.put(url, JSON.stringify(data));
    }

    getLoanTypeMetadata(govId: string): Observable<any> {
        const url = Constants.BACKEND_URL_BASE + "/members/" + govId + "/loantypes/0";
        return this.httpServices.get(url);

        // let data = { "code": 0, "errors": null, "body": { "currency": "USD", "categories": [{ "code": "0", "name": "categorya" }, { "code": "1", "name": "categoryb" }, { "code": "2", "name": "categoryc" }], "residencies": [{ "code": "0", "name": "Citizen" }, { "code": "1", "name": "Permanent resident" }, { "code": "2", "name": "Designated as a protected person" }], "types": [{ "code": "0", "name": "Federal - Canada Student Loans Program" }, { "code": "1", "name": "Provincial and territorial programs" }] } }

        // return new Observable(observer => {
        //     setTimeout(() => {
        //         observer.next(data);
        //         observer.complete();
        //     }, 1000);
        // });
    }

    getEligibleLoans(userType: UserType, id: string): Observable<FindEligibleResponse> {
        let requestData: any = (userType == UserType.Student) ? { studentId: id } : { memberId: id };
        let url = Constants.BACKEND_URL_BASE + "/members/0/loantypes";
        return this.httpServices.post(url, JSON.stringify(requestData));

        // let resp =
        //    {"code":0,"errors":null,"strips":[{"saveDate":null,"saved":false,"eligibility":{"studiesType":null},"info":{"creationTime":"1970-01-18T07:18:09Z","daysToExpiration":3535,"loanCode":"hadar","description":"description","type":0,"openDate":"2017-05-18T06:29:23Z","deadlineDate":"2017-05-25T21:00:00Z","amount":1111,"currency":"USD","categories":[{"code":"0","name":"categorya"}],"residencies":[{"code":"0","name":"Citizen"}],"percentOfStudiesFrom":1,"percentOfStudiesTo":100,"name":"hadar","govId":"autoGov","loanTypeDesc":null,"loanType":0,"loanTypeName":"hadar"},"tc":{"dynamicFields":[{"index":0,"name":"hadartest","description":"hadar","maxLength":3,"constraints":{"minValue":1,"maxValue":100,"type":"numeric"},"isMandatory":true,"isPredefined":false}],"mappingFields":[]}}]}

        // return new Observable(observer => {
        //     setTimeout(() => {
        //         observer.next(resp);
        //         observer.complete();
        //     }, 700);
        // });
    }

    getGovernmentLoans(memberId: string, isSavedOnlyScholarship: boolean): Observable<any> {
        let requestData: any;
        let url = Constants.BACKEND_URL_BASE;

        if (isSavedOnlyScholarship) {
            url += `/members/${memberId}/loantypes/saved`;
            return this.httpServices.get(url);
        }
        else {
            requestData = { memberId: memberId };
            url += "/members/0/governmentLoantypes";
            return this.httpServices.post(url, JSON.stringify(requestData));
        }

        // let resp = {
        //     "code": 0,
        //     "errors": null,
        //     "body": [
        //         {
        //             "info": {
        //                 "saveDate": null,
        //                 "saved": false,
        //                 "currency": "USD",
        //                 "createDate": 1485855574000,
        //                 "description": "Description of new loan type",
        //                 "loanCode": "loanCode",
        //                 "openDate": 1493845200000,
        //                 "deadlineDate": 1495573200000,
        //                 "amount": 1000,
        //                 "categories": [
        //                     {
        //                         "code": "0",
        //                         "name": "categorya"
        //                     }
        //                 ],
        //                 "residencies": [
        //                     {
        //                         "code": "2",
        //                         "name": "Designated as a protected person"
        //                     }
        //                 ],
        //                 "percentOfStudiesTo": 100,
        //                 "govId": "autoGov",
        //                 "percentOfStudiesFrom": 0,
        //                 "type": 0,
        //                 "name": "loanName"
        //             },
        //             tc: {},
        //             eligibility: {}
        //         },
        //         {
        //             "info": {
        //                 "saveDate": null,
        //                 "saved": false,
        //                 "currency": "CAD",
        //                 "createDate": 1485855574000,
        //                 "description": "Description 111 of new loan type",
        //                 "loanCode": "loanCode1",
        //                 "openDate": 1493845200000,
        //                 "deadlineDate": 1495573200000,
        //                 "amount": 1000,
        //                 "categories": [
        //                     {
        //                         "code": "0",
        //                         "name": "categorya"
        //                     },
        //                     {
        //                         "code": "1",
        //                         "name": "categoryb"
        //                     }
        //                 ],
        //                 "residencies": [
        //                     {
        //                         "code": "2",
        //                         "name": "Designated as a protected person"
        //                     }
        //                 ],
        //                 "percentOfStudiesTo": 100,
        //                 "govId": "autoGov",
        //                 "percentOfStudiesFrom": 0,
        //                 "type": 0,
        //                 "name": "loanName111"
        //             },
        //             tc: {},
        //             eligibility: {}
        //         }
        //     ]
        // }

        // return new Observable(observer => {
        //     setTimeout(() => {
        //         observer.next(resp);
        //         observer.complete();
        //     }, 700);
        // });
    }


    getEligibleJobOffer(studentId: string): Observable<FindEligibleResponse> {

        let url = Constants.BACKEND_URL_BASE + "/members/0/jobOffers/eligible";
        return this.httpServices.post(url, JSON.stringify({ studentId: studentId }));

        //    let resp =
        //         {
        //             "code": 0, "errors": null, "strips": [
        //                 {
        //                     "info": {
        //                         "status": "NEW",
        //                         "createDate": 1485855574000,
        //                         "name": "job offer 1",
        //                         "jobBrief": "job brief test",
        //                         "requirements": "Requirements test",
        //                         "responsibilities": "Responsibilities test",
        //                         "isPartial":true,
        //                         "weeklyWorkingHours":40,
        //                         "workingHoursFrom": {
        //                             "hh":"09",
        //                             "mm":"00"
        //                         },
        //                          "workingHoursTo": {
        //                             "hh":"16",
        //                             "mm":"01"
        //                         },
        //                         "workPlace":"Herlziya"
        //                     },
        //                     "tc": {
        //                         "dynamicFields": [
        //                             {
        //                                 "index": 1,
        //                                 "name": "list text test",
        //                                 "description": "list text description",
        //                                 "maxLength": 30,
        //                                 "constraints": {
        //                                     "listOfValues": [
        //                                         "male",
        //                                         "female"
        //                                     ],
        //                                     "type": "list"
        //                                 },
        //                                 "mandatory": false,
        //                                 "predefined": false
        //                             },
        //                             {
        //                                 "index": 2,
        //                                 "name": "numeric test",
        //                                 "description": "numeric test description",
        //                                 "maxLength": 3,
        //                                 "constraints": {
        //                                     "minValue": 5,
        //                                     "maxValue": 100,
        //                                     "type": "numeric"
        //                                 },
        //                                 "mandatory": true,
        //                                 "predefined": true
        //                             },
        //                             {
        //                                 "index": 3,
        //                                 "name": "date Constraint test",
        //                                 "description": "date Constraint test description",
        //                                 "maxLength": 0,
        //                                 "constraints": {
        //                                     "minDate": "2017-03-15T09:33:21Z",
        //                                     "maxDate": "2017-03-16T09:33:21Z",
        //                                     "type": "date"
        //                                 },
        //                                 "mandatory": true,
        //                                 "predefined": false
        //                             },
        //                             {
        //                                 "index": 4,
        //                                 "name": "numeric test",
        //                                 "description": "numeric test description",
        //                                 "maxLength": 2,
        //                                 "constraints": {
        //                                     "minValue": 7,
        //                                     "maxValue": 19,
        //                                     "type": "numeric"
        //                                 },
        //                                 "mandatory": true,
        //                                 "predefined": true
        //                             },
        //                             {
        //                                 "index": 5,
        //                                 "name": "free text test",
        //                                 "description": "free text test description",
        //                                 "maxLength": 25,
        //                                 "constraints": {
        //                                     "type": "free_text"
        //                                 },
        //                                 "mandatory": true,
        //                                 "predefined": true
        //                             }
        //                         ]
        //                     }
        //                 }]
        //         }
        //         return new Observable(observer => {
        //         setTimeout(() => {
        //             observer.next(resp);
        //             observer.complete();
        //         }, 700);
        //     });
    }

    getEligibleScholarships(studentId: string): Observable<FindEligibleResponse> {
        let url = Constants.BACKEND_URL_BASE + "/members/scholarships/eligible";
        return this.httpServices.post(url, JSON.stringify({ studentId: studentId }));

        // let resp =
        //     {
        //         "code": 0, "errors": null, "strips": [
        //             {
        //                 "info": {
        //                     "status": "NEW",
        //                     "createDate": 1485855574000,
        //                     "name": "scholarship1",
        //                     "description": "This is scholarship1 description",
        //                     "openDate": 1485855574000,
        //                     "publishResultDate": 1485855574000,
        //                     "applicationDeadline": 1485855574000,
        //                     "maxAmount": 50,
        //                     "ccy": "USD",
        //                     "numberOfAwards": 30
        //                 },
        //                 "eligibility": {
        //                     "studiesType": "BSC"
        //                 },
        //                 "tc": {
        //                     "dynamicFields": [
        //                         {
        //                             "index": 1,
        //                             "name": "list text test",
        //                             "description": "list text description",
        //                             "maxLength": 30,
        //                             "constraints": {
        //                                 "listOfValues": [
        //                                     "male",
        //                                     "female"
        //                                 ],
        //                                 "type": "list"
        //                             },
        //                             "mandatory": false,
        //                             "predefined": false
        //                         },
        //                         {
        //                             "index": 2,
        //                             "name": "numeric test",
        //                             "description": "numeric test description",
        //                             "maxLength": 3,
        //                             "constraints": {
        //                                 "minValue": 5,
        //                                 "maxValue": 100,
        //                                 "type": "numeric"
        //                             },
        //                             "mandatory": true,
        //                             "predefined": true
        //                         },
        //                         {
        //                             "index": 3,
        //                             "name": "date Constraint test",
        //                             "description": "date Constraint test description",
        //                             "maxLength": 0,
        //                             "constraints": {
        //                                 "minDate": "2017-03-15T09:33:21Z",
        //                                 "maxDate": "2017-03-16T09:33:21Z",
        //                                 "type": "date"
        //                             },
        //                             "mandatory": true,
        //                             "predefined": false
        //                         },
        //                         {
        //                             "index": 4,
        //                             "name": "numeric test",
        //                             "description": "numeric test description",
        //                             "maxLength": 2,
        //                             "constraints": {
        //                                 "minValue": 7,
        //                                 "maxValue": 19,
        //                                 "type": "numeric"
        //                             },
        //                             "mandatory": true,
        //                             "predefined": true
        //                         },
        //                         {
        //                             "index": 5,
        //                             "name": "free text test",
        //                             "description": "free text test description",
        //                             "maxLength": 25,
        //                             "constraints": {
        //                                 "type": "free_text"
        //                             },
        //                             "mandatory": true,
        //                             "predefined": true
        //                         }
        //                     ]
        //                 }
        //             },
        //             {
        //                 "info": {
        //                     "status": "NEW",
        //                     "createDate": 1485855574000,
        //                     "name": "scholarship2",
        //                     "description": "This is scholarship2 description",
        //                     "openDate": 1485855574000,
        //                     "publishResultDate": 1485855574000,
        //                     "applicationDeadline": 1485855574000,
        //                     "maxAmount": 350,
        //                     "ccy": "USD",
        //                     "numberOfAwards": 300
        //                 },
        //                 "eligibility": {
        //                     "studiesType": "BSC"
        //                 },
        //                 "tc": {
        //                     "dynamicFields": [
        //                         {
        //                             "index": 1,
        //                             "name": "list text test",
        //                             "description": "list text description",
        //                             "maxLength": 30,
        //                             "constraints": {
        //                                 "listOfValues": [
        //                                     "male",
        //                                     "female"
        //                                 ],
        //                                 "type": "list"
        //                             },
        //                             "mandatory": false,
        //                             "predefined": false
        //                         },
        //                         {
        //                             "index": 2,
        //                             "name": "numeric test",
        //                             "description": "numeric test description",
        //                             "maxLength": 3,
        //                             "constraints": {
        //                                 "minValue": 5,
        //                                 "maxValue": 100,
        //                                 "type": "numeric"
        //                             },
        //                             "mandatory": true,
        //                             "predefined": true
        //                         },
        //                         {
        //                             "index": 3,
        //                             "name": "date Constraint test",
        //                             "description": "date Constraint test description",
        //                             "maxLength": 0,
        //                             "constraints": {
        //                                 "minDate": "2017-03-15T09:33:21Z",
        //                                 "maxDate": "2017-03-16T09:33:21Z",
        //                                 "type": "date"
        //                             },
        //                             "mandatory": true,
        //                             "predefined": false
        //                         },
        //                         {
        //                             "index": 4,
        //                             "name": "numeric test",
        //                             "description": "numeric test description",
        //                             "maxLength": 2,
        //                             "constraints": {
        //                                 "minValue": 7,
        //                                 "maxValue": 19,
        //                                 "type": "numeric"
        //                             },
        //                             "mandatory": true,
        //                             "predefined": true
        //                         }
        //                     ]
        //                 }
        //             }
        //         ]
        //     }

        // return new Observable(observer => {
        //     setTimeout(() => {
        //         observer.next(resp);
        //         observer.complete();
        //     }, 700);
        // });
    }

    getAppliedLoans(memberId: string, loanType: number): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + memberId + "/loantypes/" + loanType + "/applied";
        return this.httpServices.get(url);

        // let resp = {
        //     "code": 0,
        //     "errors": null,
        //     "body": [
        //         {
        //             "loanCode": "loancode1",
        //             "status": "new",
        //             "name": "name loan1",
        //             "description": "desc loan  1",
        //             "type": [{ value: "1", desc: "loan Type test1" }, { value: "2", desc: "loan Type test2" }],
        //             "deadlineDate": 1483142400000,
        //             "loanApplyDate": 1483142400000,
        //             "studentId": "studentId",
        //             "studentName": "studentName",
        //             "educationalInstitution": "educationalInstitution",
        //             "faculty": "faculty",
        //             "categories": [{ value: "1", desc: "Computer science1" }, { value: "2", desc: "Computer science2" }, { value: "3", desc: "Computer science3" }],
        //             "loanType": {
        //                 "govId": "gov123",
        //                 "name": "name loan Cat3",
        //                 "description": "descloan Cat 3",
        //                 "currency": "NIS",
        //                 "percentOfStudiesFrom": 22,
        //                 "percentOfStudiesTo": 77,
        //                 "amount": 1300,
        //                 "openDate": 1482969600000,
        //                 "deadlineDate": 1483142400000,
        //                 "categories": [
        //                     {
        //                         "value": "2",
        //                         "desc": "categoryLast"
        //                     }
        //                 ],
        //                 "residencies": [
        //                     {
        //                         "value": "2",
        //                         "desc": "Designated as a protected person"
        //                     }
        //                 ],
        //                 "loanCode": "loanCat3",
        //                 "createDate": 1482994654,
        //                 "type": [
        //                     {
        //                         "value": "0",
        //                         "desc": "Federal - Canada Student Loans Program"
        //                     }
        //                 ]
        //             }
        //         },
        //         {
        //             "loanCode": "loancode2",
        //             "status": "new",
        //             "name": "name loan2",
        //             "description": "desc loan  2",
        //             "type": [{ value: "1", desc: "loan Type test11" }, { value: "2", desc: "loan Type test22" }],
        //             "deadlineDate": 1483142400000,
        //             "loanApplyDate": 1483142400000,
        //             "studentId": "studentId 2",
        //             "studentName": "studentName 2",
        //             "educationalInstitution": "educationalInstitution 2",
        //             "faculty": "faculty 2",
        //             "categories": [{ value: "1", desc: "Biology1" }, { value: "2", desc: "Biology2" }, { value: "3", desc: "Biology3" }],
        //             "loanType": {
        //                 "govId": "gov123",
        //                 "name": "name loan Cat3",
        //                 "description": "descloan Cat 3",
        //                 "currency": "NIS",
        //                 "percentOfStudiesFrom": 22,
        //                 "percentOfStudiesTo": 77,
        //                 "amount": 1300,
        //                 "openDate": 1482969600000,
        //                 "deadlineDate": 1483142400000,
        //                 "categories": [
        //                     {
        //                         "value": "2",
        //                         "desc": "categoryLast"
        //                     }
        //                 ],
        //                 "residencies": [
        //                     {
        //                         "value": "2",
        //                         "desc": "Designated as a protected person"
        //                     }
        //                 ],
        //                 "loanCode": "loanCat3",
        //                 "createDate": 1482994654,
        //                 "type": [
        //                     {
        //                         "value": "0",
        //                         "desc": "Federal - Canada Student Loans Program"
        //                     }
        //                 ]
        //             }
        //         }
        //     ]
        // }

        // return new Observable(observer => {
        //     setTimeout(() => {
        //         observer.next(resp);
        //         observer.complete();
        //     }, 700);
        // });
    }

    getAppliedScholarships(memberId: string): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + memberId + "/scholarships/applied";
        return this.httpServices.get(url);

        // let resp =
        //     {
        //         "code": 0,
        //         "errors": null,
        //         "appliedScholarships": [
        //             {
        //                 "scholarshipName": "Mock1",
        //                 "studentId": "lll@email.com",
        //                 "organizationName": "OrgShortOn",
        //                 "applyDate": 1491137782000,
        //                 "status": "Pending",
        //                 "scholarship": {
        //                     "valid": false,
        //                     "info": {
        //                         "status": "New",
        //                         "createDate": "2017-04-02T12:30:50Z",
        //                         "name": "Ffff",
        //                         "description": "Dddd",
        //                         "openDate": "2017-03-31T21:00:00Z",
        //                         "publishResultDate": "2017-04-11T21:00:00Z",
        //                         "applicationDeadline": "2017-04-05T21:00:00Z",
        //                         "maxAmount": 34,
        //                         "ccy": "ARS",
        //                         "numberOfAwards": 1
        //                     },
        //                     "tc": {
        //                         "dynamicFields": [
        //                             {
        //                                 "index": 0,
        //                                 "name": "Attr1",
        //                                 "description": "Desc1",
        //                                 "maxLength": 120,
        //                                 "constraints": {
        //                                     "type": "free_text"
        //                                 },
        //                                 "isMandatory": true,
        //                                 "isPredefined": false
        //                             },
        //                             {
        //                                 "index": 1,
        //                                 "name": "Attr2",
        //                                 "description": "Desc2",
        //                                 "maxLength": 150,
        //                                 "constraints": {
        //                                     "minValue": 0,
        //                                     "maxValue": 6000,
        //                                     "type": "numeric"
        //                                 },
        //                                 "isMandatory": true,
        //                                 "isPredefined": false
        //                             }
        //                         ]
        //                     },
        //                     "eligibility": {
        //                         "studiesType": null
        //                     }
        //                 },
        //                 "dynamicFields": [
        //                     {
        //                         "index": 1,
        //                         "name": "Attr2",
        //                         "description": "Desc2",
        //                         "maxLength": 0,
        //                         "constraints": {
        //                             "minValue": 0,
        //                             "maxValue": 6000,
        //                             "type": "numeric"
        //                         },
        //                         "value": "9000000000",
        //                         "isMandatory": true,
        //                         "isPredefined": false
        //                     },
        //                     {
        //                         "index": 0,
        //                         "name": "Attr1",
        //                         "description": "Desc1",
        //                         "maxLength": 0,
        //                         "constraints": {
        //                             "type": "free_text"
        //                         },
        //                         "value": "Boris",
        //                         "isMandatory": true,
        //                         "isPredefined": false
        //                     }
        //                 ]
        //             },
        //             {
        //                 "scholarshipName": "Mock2",
        //                 "studentId": "lll@email.com",
        //                 "organizationName": "OrgShortOn",
        //                 "applyDate": 1491138816000,
        //                 "status": "Pending",
        //                 "scholarship": {
        //                     "valid": false,
        //                     "info": {
        //                         "status": "New",
        //                         "createDate": "2017-04-02T13:08:30Z",
        //                         "name": "Scholarship2",
        //                         "description": "description22222222",
        //                         "openDate": "2017-04-01T21:00:00Z",
        //                         "publishResultDate": "2017-04-07T21:00:00Z",
        //                         "applicationDeadline": "2017-04-15T21:00:00Z",
        //                         "maxAmount": 342,
        //                         "ccy": "AZN",
        //                         "numberOfAwards": 1
        //                     },
        //                     "tc": {
        //                         "dynamicFields": [
        //                             {
        //                                 "index": 0,
        //                                 "name": "Age",
        //                                 "description": "Age",
        //                                 "maxLength": 222,
        //                                 "constraints": {
        //                                     "type": "free_text"
        //                                 },
        //                                 "isMandatory": true,
        //                                 "isPredefined": false
        //                             },
        //                             {
        //                                 "index": 1,
        //                                 "name": "Date",
        //                                 "description": "Date",
        //                                 "maxLength": 100,
        //                                 "constraints": {
        //                                     "minDate": "2017-03-31T15:00:00.000Z",
        //                                     "maxDate": "2017-04-28T15:00:00.000Z",
        //                                     "type": "date"
        //                                 },
        //                                 "isMandatory": true,
        //                                 "isPredefined": false
        //                             }
        //                         ],
        //                     },
        //                     "eligibility": {
        //                         "studiesType": null
        //                     }
        //                 },
        //                 "dynamicFields": [
        //                     {
        //                         "index": 0,
        //                         "name": "Age",
        //                         "description": "Age",
        //                         "maxLength": 0,
        //                         "constraints": {
        //                             "type": "free_text"
        //                         },
        //                         "value": "35",
        //                         "isMandatory": true,
        //                         "isPredefined": false
        //                     },
        //                     {
        //                         "index": 1,
        //                         "name": "Date",
        //                         "description": "Date",
        //                         "maxLength": 0,
        //                         "constraints": {
        //                             "minDate": "2017-03-31T15:00:00.000Z",
        //                             "maxDate": "2017-04-28T15:00:00.000Z",
        //                             "type": "date"
        //                         },
        //                         "value": "2017-04-07T21:00:00.000Z",
        //                         "isMandatory": true,
        //                         "isPredefined": false
        //                     }
        //                 ]
        //             }
        //         ]
        //     }

        // return new Observable(observer => {
        //     setTimeout(() => {
        //         observer.next(resp);
        //         observer.complete();
        //     }, 700);
        // });
    }

    applyLoan(govId: string, loanCode: string, studentId: string, dynamicFieldsValues: DynamicFieldsValuesInterface): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + govId + "/loantypes/" + loanCode + "/apply";
        return this.httpServices.put(url, JSON.stringify({ studentId: studentId, dynamicFields: dynamicFieldsValues.dynamicFields }));

        // return new Observable(observer => {
        //     setTimeout(() => {
        //         observer.next({ code: 0 });
        //         observer.complete();
        //     }, 1000);
        // });
    }

    applyScholarship(organizationId: string, scholarshipId: string, studentId: string, dynamicFieldsValues: DynamicFieldsValuesInterface): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + organizationId + "/scholarships/" + scholarshipId + "/apply";
        return this.httpServices.put(url, JSON.stringify({ studentId: studentId, dynamicFields: dynamicFieldsValues.dynamicFields }));

        // return new Observable(observer => {
        //     setTimeout(() => {
        //         observer.next({ code: 0 });
        //         observer.complete();
        //     }, 1000);
        // });
    }

    applyJobOffer(organizationId: string, jobOfferName: string, studentId: string, dynamicFieldsValues: DynamicFieldsValuesInterface): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + organizationId + "/joboffers/" + jobOfferName + "/apply";


        return this.httpServices.put(url, JSON.stringify({ studentId: studentId, dynamicFields: dynamicFieldsValues.dynamicFields }));




        // return new Observable(observer => {
        //     setTimeout(() => {
        //         observer.next({ code: 0 });
        //         observer.complete();
        //     }, 1000);
        // });
    }

    saveStudentDrafts(contractAddress: string, studentId: string, dynamicFieldsValues: DynamicFieldsValuesInterface): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/students/" + studentId + "/drafts";


        return this.httpServices.put(url, JSON.stringify(
            {
                contractAddress: contractAddress,
                studentId: studentId,
                dynamicFields: dynamicFieldsValues.dynamicFields
            }
        ));
    }



    approveDeclineStudentLoan(govId: string, loanCode: string, action: string, comment: string): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + govId + "/studentloan/" + loanCode + "/" + action;
        return this.httpServices.post(url, JSON.stringify({ comment: comment }));

        // return new Observable(observer => {
        //     setTimeout(() => {
        //         observer.next({ code: 0 });
        //         observer.complete();
        //     }, 1000);
        // });
    }

    getStudentOffersByStatus(memberId: string, status: string, offerType: OfferType): Observable<any> {
        let urlPartsByOfferType: { [index: string]: { urlPart: string, statusPart: string } } = {
            [OfferType.loanType]: { urlPart: "loans", statusPart: "studentLoanStatus" },
            [OfferType.scholarship]: { urlPart: "scholarships", statusPart: "studentScholarshipStatus" },
            [OfferType.jobOffer]: { urlPart: "joboffers", statusPart: "studentJobOfferStatus" }
        }
        let url = Constants.BACKEND_URL_BASE + `/students/${memberId}/${urlPartsByOfferType[offerType].urlPart}/`;

        let domainObject = {};
        domainObject[urlPartsByOfferType[offerType].statusPart] = status;

        return this.httpServices.post(url, JSON.stringify(domainObject));

        // let resp = {
        //     "code": 0,
        //     "errors": null,
        //     "studentLoans": [
        //         {
        //             "status": status,
        //             "updateDate": 1400855977000,
        //             "studentLoanId": "0x874cf5805ad88ca28bf5f65cf4d27c4b28df21fd",
        //             "studentName": "familyNameT givenNameT",
        //             "faculty": "facultya",
        //             "loanType": {
        //                 "info": {
        //                     "currency": "USD",
        //                     "name": "LoanTypeName1",
        //                     "description": "loanTypeDesc",
        //                     "loanCode": "Loan1",
        //                     "openDate": 1485855574000,
        //                     "deadlineDate": 1485900000000,
        //                     "amount": 50,
        //                     "categories": [
        //                         {
        //                             "desc": "0",
        //                             "value": "categoryOne"
        //                         },
        //                         {
        //                             "desc": "1",
        //                             "value": "categoryTwo"
        //                         }
        //                     ],
        //                     "residencies": [
        //                         {
        //                             "value": "0",
        //                             "desc": "Citizen"
        //                         }
        //                     ],
        //                     "percentOfStudiesFrom": 0,
        //                     "percentOfStudiesTo": 100,
        //                     "govId": "govMyLoan",
        //                     "createDate": 1485855574000,
        //                     "type": "Federal - Canada Student Loans Program"
        //                 },
        //                 "tc": {
        //                     "dynamicFields": [
        //                         {
        //                             "index": 0,
        //                             "name": "Attr1",
        //                             "description": "Desc1",
        //                             "maxLength": 120,
        //                             "constraints": {
        //                                 "type": "free_text"
        //                             },
        //                             "isMandatory": true,
        //                             "isPredefined": false
        //                         },
        //                         {
        //                             "index": 1,
        //                             "name": "Attr2",
        //                             "description": "Desc2",
        //                             "maxLength": 150,
        //                             "constraints": {
        //                                 "minValue": 0,
        //                                 "maxValue": 6000,
        //                                 "type": "numeric"
        //                             },
        //                             "isMandatory": true,
        //                             "isPredefined": false
        //                         }
        //                     ]
        //                 }
        //             },
        //             "dynamicFields": [
        //                 {
        //                     "index": 1,
        //                     "name": "Attr1",
        //                     "description": "Desc2",
        //                     "maxLength": 0,
        //                     "constraints": {
        //                         "minValue": 0,
        //                         "maxValue": 6000,
        //                         "type": "numeric"
        //                     },
        //                     "value": "9000000000",
        //                     "isMandatory": true,
        //                     "isPredefined": false
        //                 },
        //                 {
        //                     "index": 0,
        //                     "name": "Attr2",
        //                     "description": "Desc1",
        //                     "maxLength": 0,
        //                     "constraints": {
        //                         "type": "free_text"
        //                     },
        //                     "value": "Boris",
        //                     "isMandatory": true,
        //                     "isPredefined": false
        //                 }
        //             ]
        //             ,
        //             "studentId": "mobilestd@email.com",
        //             "loanApplyDate": 1485855681000,
        //             "educationalInstitution": "eiMyLoan"
        //         }
        //     ]
        // }

        //--------------------------------------------------------------

        // if (offerType != OfferType.jobOffer) {
        //     return this.httpServices.post(url, JSON.stringify(domainObject));
        // }

        // let resp = {
        //     "code": 0,
        //     "errors": null,
        //     "studentJobOffers": [
        //         {
        //             "status": status,
        //             "updateDate": 1400855977000,
        //             "applyDate": 1485855681000,
        //             "contractAddress": "0x6c99eb8294e5591093b700478fcd9f50aa227827",
        //             "owner": "0xdd633864fe7c8a7a7bfe55e3d43036884108aaeb",
        //             "jobOfferName": null,
        //             jobOffer: {
        //                 "info": {
        //                     "status": "New",
        //                     "createDate": "2017-06-13T08:09:24Z",
        //                     "name": "smokeJobOffer",
        //                     "jobBrief": "QhRTmJDDKpakQKEfFMrqrTmqvbmncxMukHpJptjybvXjDjEeMu",
        //                     "responsibilities": "ZiTYNWSdlygXkTlrtEHJLrAqrLbemgOVtPUoIcQfDNEQzcidnYMIFaTlgemCSdZOBBraFU",
        //                     "requirements": "LFlUMwWcuPPDpzzwOiNqPZpiZUJRYVCRAnYKawbVSzvQEKfgTf",
        //                     "isPartial": false,
        //                     "weeklyWorkingHours": 83,
        //                     "workingHoursFrom": {
        //                         "hh": 7,
        //                         "mm": 3,
        //                         "date": "2017-06-13T04:03:40Z"
        //                     },
        //                     "workingHoursTo": {
        //                         "hh": 16,
        //                         "mm": 2,
        //                         "date": "2017-06-13T13:02:40Z"
        //                     },
        //                     "limitedPeriodFromDate": "2017-07-12T21:00:00Z",
        //                     "limitedPeriodToDate": "2017-09-20T21:00:00Z",
        //                     "workPlace": "qNkaLeabtV"
        //                 },
        //                 "eligibility": {
        //                     "studiesType": null
        //                 },
        //                 "publicKey": null,
        //                 "privateKey": null,
        //                 "txId": null,
        //                 "saveDate": null,
        //                 "organization": "autoOrg",
        //                 "saved": false,
        //                 "tc": {
        //                     "dynamicFields": [
        //                         {
        //                             "index": 1,
        //                             "name": "Attr1",
        //                             "description": "Desc2",
        //                             "maxLength": 0,
        //                             "constraints": {
        //                                 "minValue": 0,
        //                                 "maxValue": 6000,
        //                                 "type": "numeric"
        //                             },
        //                             "isMandatory": true,
        //                             "isPredefined": false
        //                         },
        //                         {
        //                             "index": 0,
        //                             "name": "Attr2",
        //                             "description": "Desc1",
        //                             "maxLength": 0,
        //                             "constraints": {
        //                                 "type": "free_text"
        //                             },
        //                             "isMandatory": true,
        //                             "isPredefined": false
        //                         }
        //                     ]
        //                 }
        //             },
        //             "dynamicFields": [
        //                 {
        //                     "index": 1,
        //                     "name": "Attr1",
        //                     "description": "Desc2",
        //                     "maxLength": 0,
        //                     "constraints": {
        //                         "minValue": 0,
        //                         "maxValue": 6000,
        //                         "type": "numeric"
        //                     },
        //                     "value": "9000000000",
        //                     "isMandatory": true,
        //                     "isPredefined": false
        //                 },
        //                 {
        //                     "index": 0,
        //                     "name": "Attr2",
        //                     "description": "Desc1",
        //                     "maxLength": 0,
        //                     "constraints": {
        //                         "type": "free_text"
        //                     },
        //                     "value": "Boris",
        //                     "isMandatory": true,
        //                     "isPredefined": false
        //                 }
        //             ]
        //         },
        //         {
        //             "status": status,
        //             "updateDate": 1400855977000,
        //             "applyDate": 1485855681000,
        //             "contractAddress": "0xdb9ee9716e261e0dd6b3a2cc29706d4d822ca741",
        //             "owner": "0xf485ed7ac23ce9c4361c2be166fd5f20ea870280",
        //             "jobOfferName": null,
        //             jobOffer: {
        //                 "info": {
        //                     "status": "New",
        //                     "createDate": "2017-06-13T08:19:03Z",
        //                     "name": "offer1",
        //                     "jobBrief": "VesvFzXBXyiDnNpoyqkkzzjARvSfdaudjddXcKeydbPXqxwYEw",
        //                     "responsibilities": "CtvjRRDwePYudmvsLqTrjXPuiCzUlXXSBBXedTiAXCmYXDATtmOnQGyNGkgVLNJMtXOSLE",
        //                     "requirements": "QHxcAPLvkncQEBURYMTgfQvpAjBdHnjObmiwfdkGLUUiTtvwmN",
        //                     "isPartial": false,
        //                     "weeklyWorkingHours": 92,
        //                     "workingHoursFrom": {
        //                         "hh": 5,
        //                         "mm": 56,
        //                         "date": "2017-06-13T02:56:40Z"
        //                     },
        //                     "workingHoursTo": {
        //                         "hh": 3,
        //                         "mm": 21,
        //                         "date": "2017-06-13T00:21:40Z"
        //                     },
        //                     "limitedPeriodFromDate": "2017-07-12T21:00:00Z",
        //                     "limitedPeriodToDate": "2017-09-20T21:00:00Z",
        //                     "workPlace": "UJZyDRcxVl"
        //                 },
        //                 "eligibility": {
        //                     "studiesType": null
        //                 },
        //                 "publicKey": null,
        //                 "privateKey": null,
        //                 "txId": null,
        //                 "saveDate": null,
        //                 "organization": "OrgApplyJob",
        //                 "saved": false,
        //                 "tc": {
        //                     "dynamicFields": []
        //                 }
        //             }
        //         },
        //         {
        //             "status": status,
        //             "updateDate": 1400855977000,
        //             "applyDate": 1485855681000,
        //             "contractAddress": "0x3b58949296032fa99fcbdd343c63404903757393",
        //             "owner": "0xf485ed7ac23ce9c4361c2be166fd5f20ea870280",
        //             "jobOfferName": null,
        //             jobOffer: {
        //                 "info": {
        //                     "status": "New",
        //                     "createDate": "2017-06-13T08:19:34Z",
        //                     "name": "offer2",
        //                     "jobBrief": "DZuEXqURpAxxwyDMiIfZEPkQnJdoyPBuubqmsiIzHjxmLeQGMm",
        //                     "responsibilities": "hfOanldhKqOEiSKsdfJomjPGGsofuxiWxNQkHPasxJchWoWvrbPKWSFooYGRHBHHEoNTwq",
        //                     "requirements": "qvbZgBdUXbgOmbQikGfUyIdBfXtprrJlqXKaLEQMTCOiUWhbUW",
        //                     "isPartial": false,
        //                     "weeklyWorkingHours": 26,
        //                     "workingHoursTo": {
        //                         "hh": 23,
        //                         "mm": 8,
        //                         "date": "2017-06-13T20:08:40Z"
        //                     },
        //                     "limitedPeriodToDate": "2017-09-20T21:00:00Z",
        //                     "workPlace": "AzXXyZVDOi"
        //                 },
        //                 "eligibility": {
        //                     "studiesType": null
        //                 },
        //                 "publicKey": null,
        //                 "privateKey": null,
        //                 "txId": null,
        //                 "saveDate": null,
        //                 "organization": "OrgApplyJob",
        //                 "saved": false,
        //                 "tc": {
        //                     "dynamicFields": []
        //                 }
        //             }
        //         }
        //     ]
        // }

        // return new Observable(observer => {
        //     setTimeout(() => {
        //         observer.next(resp);
        //         observer.complete();
        //     }, 1000);
        // });
    }

    getCertifiedMembers(memberid: string): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + memberid + "/certifiedmembers";
        return this.httpServices.get(url);

        // let resp =   {
        //     "code": 0,
        //     "errors": null,
        //     "certifiedMembers": [
        //         {
        //             "shortName": "GovForSaveLoan",
        //             "fullName" : "GovForSaveLoan full",
        //             "account": "0x9eee48ace9cd09dd67e4631d43729192d8b251f3"
        //         },
        //         {
        //             "shortName": "EiLoans",
        //             "fullName" : "EiLoans full",
        //             "account": "0x622e0a4f8d46dd8b0557f5bb8c9c8b3637a3c576"
        //         }
        //     ]
        // }

        // return new Observable(observer => {
        //     setTimeout(() => {
        //         observer.next(resp);
        //         observer.complete();
        //     }, 700);
        // });

    }

    sendfunds(memberFromShortName: string, memberToShortName: string, request: any): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + memberFromShortName + "/moveether/" + memberToShortName;
        return this.httpServices.post(url, JSON.stringify(request));
    }

    closeOffer(memberId: string, offer: ScholarshipInterface | LoanTypeInterface | JobOfferInterface, offerType: OfferType): Observable<any> {
        let urlPartByOfferType = {
            [OfferType.scholarship]: "scholarships",
            [OfferType.loanType]: "loantypes",
            [OfferType.jobOffer]: "joboffers"
        };

        let idFieldName: string = idFieldNameByOfferType[offerType].idFieldName;
        let url: string = Constants.BACKEND_URL_BASE + "/members/" + memberId + "/" + urlPartByOfferType[offerType] + "/" + offer.info[idFieldName] + "/close";
        return this.httpServices.post(url, JSON.stringify(""));
    }


    submitOffer(memberId: string, offer: ScholarshipInterface | LoanTypeInterface | JobOfferInterface, isSaveOnly: boolean, isSubmitFromSaved: boolean, offerType: OfferType): Observable<any> {
        let urlPartByOfferType = {
            [OfferType.scholarship]: "scholarships",
            [OfferType.loanType]: "loantypes",
            [OfferType.jobOffer]: "joboffers"
        };
        let idFieldName: string = idFieldNameByOfferType[offerType].idFieldName;
        let origIdFieldName: string = idFieldNameByOfferType[offerType].origIdFieldName;

        let savedUrlPart: string = isSaveOnly ? "saved/" : "";
        let url: string = Constants.BACKEND_URL_BASE + "/members/" + memberId + "/" + urlPartByOfferType[offerType] + "/" + savedUrlPart + offer.info[idFieldName];

        let methodFunction: Function = (isSubmitFromSaved && offer.info[idFieldName] == offer.info[origIdFieldName]) ? this.httpServices.post : this.httpServices.put;

        return methodFunction(url, JSON.stringify(offer));

        // let resp = {
        //     "code": 0,
        //     "errors": null,
        // }
        // return new Observable(observer => {
        //     setTimeout(() => {
        //         observer.next(resp);
        //         observer.complete();
        //     }, 1500);
        // });
    }

    getPredefinedDynamicFields(memberId: string, offerType: OfferType): Observable<any> {
        let urlPartByOfferType = {
            [OfferType.scholarship]: "scholarships",
            [OfferType.loanType]: "loantypes",
            [OfferType.jobOffer]: "joboffers"
        };
        let url = Constants.BACKEND_URL_BASE + `/members/${memberId}/${urlPartByOfferType[offerType]}/fields`;
        return this.httpServices.get(url);

        // let resp = {
        //     "code": 0,
        //     "errors": null,
        //     "predefinedFields": [
        //         {
        //             index: 0,
        //             name: "Boolean type",
        //             description: "Boolean description",
        //             isMandatory: true,
        //             isPredefined: true,
        //             maxLength: 1,
        //             constraints: {
        //                 type: "numeric",
        //                 minValue: 0,
        //                 maxValue: 1,
        //             }
        //         },
        //         {
        //             index: 1,
        //             name: "Boolean type2",
        //             description: "Boolean description2",
        //             isMandatory: true,
        //             isPredefined: true,
        //             maxLength: 1,
        //             constraints: {
        //                 type: "numeric",
        //                 minValue: 0,
        //                 maxValue: 1,
        //             }
        //         },
        //         {
        //             index: 2,
        //             name: "Birth date",
        //             description: "Birthday Birthday Birthday Birthday Birthday Birthday Birthday Birthday Birthday Birthday Birthday Birthday Birthday Birthday Birthday Birthday Birthday Birthday End",
        //             isMandatory: true,
        //             isPredefined: true,
        //             constraints: {
        //                 type: "date",
        //                 minDate: new Date("2017-03-13T12:48:08Z"),
        //                 maxDate: new Date("2017-03-14T12:48:08Z"),
        //             }
        //         },
        //         {
        //             index: 3,
        //             name: "Gender",
        //             description: "Gender Gender Gender End",
        //             isMandatory: false,
        //             isPredefined: true,
        //             constraints: {
        //                 type: "list",
        //                 listOfValues: ['Male', 'Female']
        //             }
        //         },
        //         {
        //             index: 4,
        //             name: "Fruits",
        //             description: "Fruits Fruits Fruits End",
        //             isMandatory: false,
        //             isPredefined: true,
        //             constraints: {
        //                 type: "list",
        //                 listOfValues: ['Pinapple', 'Apple', 'Pen']
        //             }
        //         }
        //     ]
        // }

        // return new Observable(observer => {
        //     setTimeout(() => {
        //         observer.next(resp);
        //         observer.complete();
        //     }, 800);
        // });
    }

    approveDeclineStudentScholarship(organizationId: string, scholarshipId: string, action: string, comment: string): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + organizationId + "/studentscholarship/" + scholarshipId + "/" + action;
        return this.httpServices.post(url, JSON.stringify({ comment: comment }));

        // return new Observable(observer => {
        //     setTimeout(() => {
        //         observer.next({ code: 0 });
        //         observer.complete();
        //     }, 1000);
        // });
    }

    approveDeclineJobOffer(organizationId: string, jobofferId: string, action: string, comment: string): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + organizationId + "/studentjoboffer/" + jobofferId + "/" + action;
        return this.httpServices.post(url, JSON.stringify({ comment: comment }));

    }

    // getSavedOffers(studentId: string, offerType: OfferType): Observable<any> {
    //     let urlPartByOfferType: { [index: string]: string } = {
    //         [OfferType.scholarship]: "savedscholarships",
    //         [OfferType.loanType]: "savedloantypes",
    //         [OfferType.jobOffer]: "savedjoboffers"
    //     }

    //     let url = Constants.BACKEND_URL_BASE + `/students/${studentId}/${urlPartByOfferType[offerType]}`;
    //     return this.httpServices.get(url);
    // }


    getSavedDrafts(studentId: string, offerType: OfferType): Observable<FindEligibleResponse> {
        let url = Constants.BACKEND_URL_BASE + "/students/" + studentId + "/drafts/" + offerType;
        return this.httpServices.get(url);
    }

    getOrganizationJobOffers(organizationId: string, isSavedOnlyJobOffer: boolean): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + organizationId + "/joboffers";
        if (isSavedOnlyJobOffer) {
            url += "/saved";
        }

        return this.httpServices.get(url);
    }

    getOrganizationScholarships(organizationId: string, isSavedOnlyScholarship: boolean): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + organizationId + "/scholarships";
        if (isSavedOnlyScholarship) {
            url += "/saved";
        }

        return this.httpServices.get(url);

        //         let resp =
        //             {
        //                 "code": 0, "errors": null, scholarships: [
        //                     {
        //                         "info": {
        //                             "status": "NEW",
        //                             "createDate": 1485855574000,
        //                             "name": "scholarship1",
        //                             "description": "This is scholarship1 description",
        //                             "openDate": 1485855574000,
        //                             "publishResultDate": 1485855574000,
        //                             "applicationDeadline": 1485855574000,
        //                             "maxAmount": 50,
        //                             "ccy": "USD",
        //                             "numberOfAwards": 30
        //                         },
        //                         "eligibility": {
        //                             "studiesType": "BSC"
        //                         },
        //                         "tc": {
        //                             "dynamicFields": [
        //                                 {
        //                                     "index": 1,
        //                                     "name": "list text test",
        //                                     "description": "list text description",
        //                                     "maxLength": 30,
        //                                     "constraints": {
        //                                         "listOfValues": [
        //                                             "male",
        //                                             "female"
        //                                         ],
        //                                         "type": "list"
        //                                     },
        //                                     "isMandatory": false,
        //                                     "isPredefined": false
        //                                 },
        //                                 {
        //                                     "index": 2,
        //                                     "name": "numeric test",
        //                                     "description": "numeric test description",
        //                                     "maxLength": 3,
        //                                     "constraints": {
        //                                         "minValue": 5,
        //                                         "maxValue": 100,
        //                                         "type": "numeric"
        //                                     },
        //                                     "isMandatory": true,
        //                                     "isPredefined": true
        //                                 },
        //                                 {
        //                                     "index": 3,
        //                                     "name": "date Constraint test",
        //                                     "description": "date Constraint test description",
        //                                     "maxLength": 0,
        //                                     "constraints": {
        //                                         "minDate": "2017-03-15T09:33:21Z",
        //                                         "maxDate": "2017-03-16T09:33:21Z",
        //                                         "type": "date"
        //                                     },
        //                                     "isMandatory": true,
        //                                     "isPredefined": false
        //                                 },
        //                                 {
        //                                     "index": 4,
        //                                     "name": "numeric test",
        //                                     "description": "numeric test description",
        //                                     "maxLength": 2,
        //                                     "constraints": {
        //                                         "minValue": 7,
        //                                         "maxValue": 19,
        //                                         "type": "numeric"
        //                                     },
        //                                     "isMandatory": true,
        //                                     "isPredefined": true
        //                                 },
        //                                 {
        //                                     "index": 5,
        //                                     "name": "free text test",
        //                                     "description": "free text test description",
        //                                     "maxLength": 25,
        //                                     "constraints": {
        //                                         "type": "free_text"
        //                                     },
        //                                     "isMandatory": true,
        //                                     "isPredefined": true
        //                                 }
        //                             ]
        //                         }
        //                     },
        //                     {
        //                         "info": {
        //                             "status": "NEW",
        //                             "createDate": 1485855574000,
        //                             "name": "scholarship2",
        //                             "description": "This is scholarship2 description",
        //                             "openDate": 1485855574000,
        //                             "publishResultDate": 1485855574000,
        //                             "applicationDeadline": 1485855574000,
        //                             "maxAmount": 350,
        //                             "ccy": "USD",
        //                             "numberOfAwards": 300
        //                         },
        //                         "eligibility": {
        //                             "studiesType": "BSC"
        //                         },
        //                         "tc": {
        //                             "dynamicFields": [
        //                                 {
        //                                     "index": 1,
        //                                     "name": "list text test",
        //                                     "description": "list text description",
        //                                     "maxLength": 30,
        //                                     "constraints": {
        //                                         "listOfValues": [
        //                                             "male",
        //                                             "female"
        //                                         ],
        //                                         "type": "list"
        //                                     },
        //                                     "isMandatory": false,
        //                                     "isPredefined": false
        //                                 },
        //                                 {
        //                                     "index": 2,
        //                                     "name": "numeric test",
        //                                     "description": "numeric test description",
        //                                     "maxLength": 3,
        //                                     "constraints": {
        //                                         "minValue": 5,
        //                                         "maxValue": 100,
        //                                         "type": "numeric"
        //                                     },
        //                                     "isMandatory": true,
        //                                     "isPredefined": true
        //                                 },
        //                                 {
        //                                     "index": 3,
        //                                     "name": "date Constraint test",
        //                                     "description": "date Constraint test description",
        //                                     "maxLength": 0,
        //                                     "constraints": {
        //                                         "minDate": "2017-03-15T09:33:21Z",
        //                                         "maxDate": "2017-03-16T09:33:21Z",
        //                                         "type": "date"
        //                                     },
        //                                     "isMandatory": true,
        //                                     "isPredefined": false
        //                                 },
        //                                 {
        //                                     "index": 4,
        //                                     "name": "numeric test",
        //                                     "description": "numeric test description",
        //                                     "maxLength": 2,
        //                                     "constraints": {
        //                                         "minValue": 7,
        //                                         "maxValue": 19,
        //                                         "type": "numeric"
        //                                     },
        //                                     "isMandatory": true,
        //                                     "isPredefined": true
        //                                 }
        //                             ]
        //                         }
        //                     }
        //                 ]
        //             }

        //     return new Observable(observer => {
        //         setTimeout(() => {
        //             observer.next(resp);
        //             observer.complete();
        //         }, 700);
        //     });
    }

    getAppliedJobOffers(memberId: string): Observable<any> {
        let url = Constants.BACKEND_URL_BASE + "/members/" + memberId + "/jobOffers/applied";
        return this.httpServices.get(url);
    }

    getMemberPageableData(memberId: string, repositoryName: string, pageInterface: PageInterface): Observable<any> {
        //In backend the first page index is 0
        let pageNumber = Math.max(pageInterface.number - 1, 0);
        let url = Constants.BACKEND_URL_BASE + `/members/${memberId}/${repositoryName}/${pageInterface.size}/${pageNumber}`;

        return this.httpServices.post(url, JSON.stringify({ filter: pageInterface.filter, sort: pageInterface.sort }))
            .map(res => {
                if (res && res.code == 0 && !isNullOrUndefined(res.page) && !isNullOrUndefined(res.page.number)) {
                    //In backend the first page index is 0
                    res.page.number++;
                }
                return res;
            });

        // let students = [{ "index": 0, "draft": false, "status": "New", "familyName": "Santos", "givenName": "Randolph", "registrationDate": "2016-08-30T02:33:23-03:00", "universityName": "MIT", "idType": "Passport", "idNumber": "595df0ac0afd9beea26f9ad1", "faculty": "Biology", "address1": "797 Gerald Court, Sedley, Guam, 8678", "address2": "690 Story Street, Smock, Vermont, 621", "levelOfStudy": 40, "semester": "Spring", "year": 2015, "percentOfStudies": 63, "city": "Gardiner", "stateOrProvince": "ipsum fugiat", "postalCode": 3019, "phoneNumber": "+1 (873) 558-2657", "email": "randolphsantos@pasturia.com", "eiId": "Dognost" }, { "index": 1, "draft": true, "status": "Pending", "familyName": "Duke", "givenName": "Bryant", "registrationDate": "2014-04-02T04:32:15-03:00", "universityName": "MIT", "idType": "Passport", "idNumber": "595df0ac3720bdb32367456b", "faculty": "Sciense", "address1": "774 Hemlock Street, Lewis, Federated States Of Micronesia, 8410", "address2": "735 Fleet Walk, Fulford, Virginia, 1110", "levelOfStudy": 99, "semester": "Autumn", "year": 2000, "percentOfStudies": 3, "city": "Clara", "stateOrProvince": "ipsum ex", "postalCode": 926, "phoneNumber": "+1 (942) 549-3483", "email": "bryantduke@dognost.com", "eiId": "Metroz" }, { "index": 2, "draft": false, "status": "Pending", "familyName": "Wiggins", "givenName": "Tillman", "registrationDate": "2015-02-20T08:28:29-02:00", "universityName": "TAU", "idType": "ID", "idNumber": "595df0ac80efe3a6f8babf31", "faculty": "Physics", "address1": "156 Colin Place, Johnsonburg, Iowa, 270", "address2": "561 Eldert Street, Loveland, Wisconsin, 5158", "levelOfStudy": 97, "semester": "Autumn", "year": 2011, "percentOfStudies": 49, "city": "Brownlee", "stateOrProvince": "mollit nisi", "postalCode": 7252, "phoneNumber": "+1 (912) 536-3365", "email": "tillmanwiggins@metroz.com", "eiId": "Arctiq" }, { "index": 3, "draft": false, "status": "New", "familyName": "Fernandez", "givenName": "Woods", "registrationDate": "2015-12-30T06:40:52-02:00", "universityName": "BGI", "idType": "Driving License", "idNumber": "595df0ac1786852f12972af0", "faculty": "Biology", "address1": "455 Oxford Street, Mappsville, Puerto Rico, 5493", "address2": "913 Thames Street, Wilsonia, New Jersey, 3996", "levelOfStudy": 34, "semester": "Autumn", "year": 2006, "percentOfStudies": 92, "city": "Bethany", "stateOrProvince": "consequat anim", "postalCode": 5605, "phoneNumber": "+1 (950) 555-3626", "email": "woodsfernandez@arctiq.com", "eiId": "Envire" }, { "index": 4, "draft": false, "status": "Pending", "familyName": "Rocha", "givenName": "Reyna", "registrationDate": "2015-12-18T11:17:36-02:00", "universityName": "TAU", "idType": "Driving License", "idNumber": "595df0acf604c457e9a7df15", "faculty": "CS", "address1": "603 Harrison Place, Homeland, North Dakota, 432", "address2": "856 Bills Place, Nord, American Samoa, 8203", "levelOfStudy": 25, "semester": "Autumn", "year": 2013, "percentOfStudies": 34, "city": "Independence", "stateOrProvince": "est amet", "postalCode": 1804, "phoneNumber": "+1 (925) 492-2786", "email": "reynarocha@envire.com", "eiId": "Nexgene" }, { "index": 5, "draft": true, "status": "Pending", "familyName": "Marquez", "givenName": "Zelma", "registrationDate": "2016-07-10T12:24:44-03:00", "universityName": "BGI", "idType": "Passport", "idNumber": "595df0ac02d80a4da312e433", "faculty": "Physics", "address1": "265 Jackson Place, Glasgow, Oklahoma, 5424", "address2": "173 Sands Street, Eggertsville, Louisiana, 5494", "levelOfStudy": 35, "semester": "Summer", "year": 1994, "percentOfStudies": 35, "city": "Websterville", "stateOrProvince": "est culpa", "postalCode": 5016, "phoneNumber": "+1 (846) 574-2853", "email": "zelmamarquez@nexgene.com", "eiId": "Xymonk" }, { "index": 6, "draft": false, "status": "Pending", "familyName": "Watkins", "givenName": "Valeria", "registrationDate": "2015-06-25T11:11:15-03:00", "universityName": "TAU", "idType": "Passport", "idNumber": "595df0acd436a00641da7c7c", "faculty": "Biology", "address1": "728 Milton Street, Hessville, Washington, 1364", "address2": "311 Polhemus Place, Northchase, Georgia, 2239", "levelOfStudy": 33, "semester": "Spring", "year": 2003, "percentOfStudies": 76, "city": "Sperryville", "stateOrProvince": "ullamco anim", "postalCode": 5112, "phoneNumber": "+1 (893) 487-3598", "email": "valeriawatkins@xymonk.com", "eiId": "Quilk" }, { "index": 7, "draft": false, "status": "Pending", "familyName": "Reynolds", "givenName": "Faith", "registrationDate": "2015-07-29T06:56:47-03:00", "universityName": "OpenU", "idType": "Passport", "idNumber": "595df0acc3b4dd267aa8a439", "faculty": "Physics", "address1": "183 Brightwater Avenue, Ernstville, Mississippi, 8303", "address2": "461 Quentin Street, Macdona, Virgin Islands, 9886", "levelOfStudy": 93, "semester": "Summer", "year": 1991, "percentOfStudies": 23, "city": "Cliff", "stateOrProvince": "fugiat veniam", "postalCode": 4234, "phoneNumber": "+1 (995) 589-3515", "email": "faithreynolds@quilk.com", "eiId": "Unia" }, { "index": 8, "draft": true, "status": "Pending", "familyName": "Blair", "givenName": "Hammond", "registrationDate": "2015-04-07T01:45:12-03:00", "universityName": "OpenU", "idType": "Passport", "idNumber": "595df0ac117b41f2319c8d10", "faculty": "CS", "address1": "742 Village Court, Bowden, Alabama, 6327", "address2": "480 Grove Street, Westwood, Utah, 3040", "levelOfStudy": 100, "semester": "Spring", "year": 2006, "percentOfStudies": 26, "city": "Bentonville", "stateOrProvince": "deserunt occaecat", "postalCode": 9123, "phoneNumber": "+1 (883) 405-3574", "email": "hammondblair@unia.com", "eiId": "Illumity" }, { "index": 9, "draft": false, "status": "Pending", "familyName": "Mckee", "givenName": "Phelps", "registrationDate": "2015-08-01T12:27:41-03:00", "universityName": "OpenU", "idType": "Driving License", "idNumber": "595df0ac21bc15dbaf56380a", "faculty": "Biology", "address1": "521 Anchorage Place, Cumberland, Minnesota, 1460", "address2": "747 Clymer Street, Cornucopia, Missouri, 4974", "levelOfStudy": 75, "semester": "Summer", "year": 2003, "percentOfStudies": 70, "city": "Rose", "stateOrProvince": "pariatur aute", "postalCode": 1801, "phoneNumber": "+1 (927) 447-2799", "email": "phelpsmckee@illumity.com", "eiId": "Daycore" }, { "index": 10, "draft": false, "status": "Pending", "familyName": "Barton", "givenName": "Barlow", "registrationDate": "2014-12-18T06:25:27-02:00", "universityName": "MIT", "idType": "Passport", "idNumber": "595df0ac243d2601ec35ba27", "faculty": "CS", "address1": "620 Vanderbilt Avenue, Interlochen, Idaho, 3993", "address2": "965 Stratford Road, Shrewsbury, Texas, 2177", "levelOfStudy": 16, "semester": "Winter", "year": 2016, "percentOfStudies": 89, "city": "Topaz", "stateOrProvince": "est ullamco", "postalCode": 6703, "phoneNumber": "+1 (851) 411-3988", "email": "barlowbarton@daycore.com", "eiId": "Kongene" }, { "index": 11, "draft": false, "status": "Pending", "familyName": "Wilkerson", "givenName": "Rosie", "registrationDate": "2014-08-27T01:45:32-03:00", "universityName": "TAU", "idType": "Driving License", "idNumber": "595df0ac5597affb8ed7dfaa", "faculty": "Physics", "address1": "767 Amity Street, Sanborn, South Carolina, 1701", "address2": "484 Liberty Avenue, Forestburg, Kansas, 5636", "levelOfStudy": 88, "semester": "Spring", "year": 2005, "percentOfStudies": 21, "city": "Snelling", "stateOrProvince": "fugiat anim", "postalCode": 8867, "phoneNumber": "+1 (834) 598-3922", "email": "rosiewilkerson@kongene.com", "eiId": "Canopoly" }, { "index": 12, "draft": true, "status": "Pending", "familyName": "Randall", "givenName": "Foreman", "registrationDate": "2014-09-06T06:35:23-03:00", "universityName": "MIT", "idType": "ID", "idNumber": "595df0ac62578e599d26d7e5", "faculty": "CS", "address1": "625 Cameron Court, Austinburg, Arizona, 8120", "address2": "961 Holly Street, Carbonville, South Dakota, 5298", "levelOfStudy": 81, "semester": "Spring", "year": 2003, "percentOfStudies": 83, "city": "Nescatunga", "stateOrProvince": "excepteur elit", "postalCode": 5538, "phoneNumber": "+1 (900) 451-2961", "email": "foremanrandall@canopoly.com", "eiId": "Koogle" }, { "index": 13, "draft": false, "status": "New", "familyName": "Cooke", "givenName": "Stout", "registrationDate": "2014-07-28T04:37:37-03:00", "universityName": "OpenU", "idType": "Passport", "idNumber": "595df0ac6d9e71252a72a140", "faculty": "Physics", "address1": "982 Grand Street, Beechmont, Northern Mariana Islands, 9727", "address2": "254 Locust Street, Drummond, Hawaii, 3187", "levelOfStudy": 57, "semester": "Summer", "year": 1992, "percentOfStudies": 32, "city": "Maplewood", "stateOrProvince": "ut laboris", "postalCode": 5713, "phoneNumber": "+1 (878) 513-3821", "email": "stoutcooke@koogle.com", "eiId": "Netur" }, { "index": 14, "draft": true, "status": "New", "familyName": "Munoz", "givenName": "Meyers", "registrationDate": "2014-06-30T05:06:20-03:00", "universityName": "BGI", "idType": "Passport", "idNumber": "595df0acbbea050f15e95dfb", "faculty": "Physics", "address1": "932 Canarsie Road, Lawrence, Kentucky, 2165", "address2": "798 Tampa Court, Tyro, Colorado, 9322", "levelOfStudy": 72, "semester": "Summer", "year": 1998, "percentOfStudies": 52, "city": "Holtville", "stateOrProvince": "voluptate ullamco", "postalCode": 8317, "phoneNumber": "+1 (953) 506-3695", "email": "meyersmunoz@netur.com", "eiId": "Polaria" }, { "index": 15, "draft": false, "status": "Pending", "familyName": "Crane", "givenName": "Gibbs", "registrationDate": "2016-07-13T06:26:49-03:00", "universityName": "BGI", "idType": "ID", "idNumber": "595df0ac7aef8879bb468398", "faculty": "Physics", "address1": "876 Kent Avenue, Spelter, California, 2144", "address2": "154 Oliver Street, Ezel, Alaska, 678", "levelOfStudy": 17, "semester": "Spring", "year": 2012, "percentOfStudies": 29, "city": "Succasunna", "stateOrProvince": "consequat labore", "postalCode": 1801, "phoneNumber": "+1 (826) 556-3135", "email": "gibbscrane@polaria.com", "eiId": "Pyramia" }, { "index": 16, "draft": false, "status": "New", "familyName": "Vang", "givenName": "Rosanne", "registrationDate": "2017-03-10T04:29:48-02:00", "universityName": "TAU", "idType": "ID", "idNumber": "595df0acb0f4c19e624c5d35", "faculty": "CS", "address1": "331 Conway Street, Mooresburg, Tennessee, 3311", "address2": "320 Throop Avenue, Wawona, West Virginia, 5569", "levelOfStudy": 71, "semester": "Winter", "year": 2003, "percentOfStudies": 52, "city": "Snyderville", "stateOrProvince": "et enim", "postalCode": 2838, "phoneNumber": "+1 (817) 407-2815", "email": "rosannevang@pyramia.com", "eiId": "Nimon" }, { "index": 17, "draft": true, "status": "New", "familyName": "Kidd", "givenName": "Clarice", "registrationDate": "2014-02-20T12:10:56-02:00", "universityName": "BGI", "idType": "ID", "idNumber": "595df0ac21a8db9f7dd7960d", "faculty": "Sciense", "address1": "314 Louisa Street, Cavalero, North Carolina, 4093", "address2": "778 Beaver Street, Osmond, Massachusetts, 8727", "levelOfStudy": 27, "semester": "Autumn", "year": 2009, "percentOfStudies": 9, "city": "Southview", "stateOrProvince": "aute aliquip", "postalCode": 8965, "phoneNumber": "+1 (815) 505-2482", "email": "claricekidd@nimon.com", "eiId": "Confrenzy" }, { "index": 18, "draft": true, "status": "Pending", "familyName": "Conway", "givenName": "Rosella", "registrationDate": "2015-03-08T03:00:46-02:00", "universityName": "OpenU", "idType": "Driving License", "idNumber": "595df0ac3193b8c36655102c", "faculty": "Biology", "address1": "119 Decatur Street, Marysville, Florida, 4749", "address2": "896 Glendale Court, Savage, Ohio, 7804", "levelOfStudy": 3, "semester": "Summer", "year": 1996, "percentOfStudies": 79, "city": "Verdi", "stateOrProvince": "est laboris", "postalCode": 6387, "phoneNumber": "+1 (901) 465-2716", "email": "rosellaconway@confrenzy.com", "eiId": "Photobin" }, { "index": 19, "draft": false, "status": "New", "familyName": "Klein", "givenName": "Glover", "registrationDate": "2017-02-08T11:41:47-02:00", "universityName": "OpenU", "idType": "Driving License", "idNumber": "595df0ace825eb876b6daa5b", "faculty": "Biology", "address1": "517 Lloyd Court, Belgreen, Marshall Islands, 7229", "address2": "961 Minna Street, Saticoy, Arkansas, 2209", "levelOfStudy": 17, "semester": "Spring", "year": 2006, "percentOfStudies": 45, "city": "Williston", "stateOrProvince": "consequat quis", "postalCode": 2517, "phoneNumber": "+1 (959) 515-3866", "email": "gloverklein@photobin.com", "eiId": "Orbaxter" }, { "index": 20, "draft": true, "status": "New", "familyName": "Johnston", "givenName": "Vega", "registrationDate": "2014-01-08T09:13:01-02:00", "universityName": "MIT", "idType": "ID", "idNumber": "595df0acea9b221b382b6d94", "faculty": "Biology", "address1": "969 Nostrand Avenue, Savannah, Delaware, 7113", "address2": "982 Frank Court, Roulette, Connecticut, 1044", "levelOfStudy": 14, "semester": "Winter", "year": 2017, "percentOfStudies": 46, "city": "Bordelonville", "stateOrProvince": "ut cupidatat", "postalCode": 4468, "phoneNumber": "+1 (995) 511-3378", "email": "vegajohnston@orbaxter.com", "eiId": "Magmina" }, { "index": 21, "draft": true, "status": "Pending", "familyName": "Heath", "givenName": "Marisa", "registrationDate": "2016-11-19T03:53:14-02:00", "universityName": "TAU", "idType": "Passport", "idNumber": "595df0acc3270d3af823f483", "faculty": "Biology", "address1": "853 Gunnison Court, Boonville, New Hampshire, 7259", "address2": "781 Wythe Place, Stagecoach, New Mexico, 3784", "levelOfStudy": 84, "semester": "Autumn", "year": 1999, "percentOfStudies": 84, "city": "Leola", "stateOrProvince": "reprehenderit commodo", "postalCode": 5697, "phoneNumber": "+1 (859) 433-2828", "email": "marisaheath@magmina.com", "eiId": "Acruex" }, { "index": 22, "draft": false, "status": "Pending", "familyName": "Banks", "givenName": "Annie", "registrationDate": "2015-07-13T01:49:42-03:00", "universityName": "BGI", "idType": "ID", "idNumber": "595df0acb6e05f049a47d0ff", "faculty": "CS", "address1": "351 Cook Street, Rehrersburg, Palau, 401", "address2": "635 Kane Place, Coldiron, Oregon, 6228", "levelOfStudy": 53, "semester": "Spring", "year": 1997, "percentOfStudies": 69, "city": "Castleton", "stateOrProvince": "anim pariatur", "postalCode": 8384, "phoneNumber": "+1 (967) 567-2476", "email": "anniebanks@acruex.com", "eiId": "Shadease" }, { "index": 23, "draft": true, "status": "Pending", "familyName": "Whitley", "givenName": "Kara", "registrationDate": "2016-03-13T06:36:27-02:00", "universityName": "OpenU", "idType": "ID", "idNumber": "595df0acb4045a6efb27141d", "faculty": "Physics", "address1": "379 Morton Street, Martell, Indiana, 8851", "address2": "333 Rodney Street, Bergoo, Montana, 5860", "levelOfStudy": 29, "semester": "Summer", "year": 2005, "percentOfStudies": 28, "city": "Kula", "stateOrProvince": "esse ex", "postalCode": 2147, "phoneNumber": "+1 (937) 415-2495", "email": "karawhitley@shadease.com", "eiId": "Oatfarm" }, { "index": 24, "draft": true, "status": "New", "familyName": "Bartlett", "givenName": "Mamie", "registrationDate": "2014-09-11T07:00:07-03:00", "universityName": "TAU", "idType": "ID", "idNumber": "595df0aca3e5a7b5fcbc79b5", "faculty": "Biology", "address1": "369 Williams Court, Grapeview, Maine, 2374", "address2": "332 Bassett Avenue, Forbestown, Pennsylvania, 938", "levelOfStudy": 44, "semester": "Summer", "year": 2012, "percentOfStudies": 11, "city": "Grahamtown", "stateOrProvince": "laborum ea", "postalCode": 1444, "phoneNumber": "+1 (933) 542-2378", "email": "mamiebartlett@oatfarm.com", "eiId": "Hawkster" }, { "index": 25, "draft": false, "status": "New", "familyName": "Hendricks", "givenName": "Wong", "registrationDate": "2016-01-09T09:04:46-02:00", "universityName": "OpenU", "idType": "Driving License", "idNumber": "595df0ac2e0d2bf4aef689cd", "faculty": "Biology", "address1": "504 Mill Street, Selma, Nevada, 2172", "address2": "788 Cobek Court, Cannondale, District Of Columbia, 7841", "levelOfStudy": 90, "semester": "Autumn", "year": 2001, "percentOfStudies": 23, "city": "Jardine", "stateOrProvince": "reprehenderit id", "postalCode": 2106, "phoneNumber": "+1 (964) 516-3638", "email": "wonghendricks@hawkster.com", "eiId": "Opportech" }, { "index": 26, "draft": true, "status": "New", "familyName": "Roth", "givenName": "Ayala", "registrationDate": "2014-03-07T10:06:27-02:00", "universityName": "OpenU", "idType": "ID", "idNumber": "595df0acf6a0bfa2abc52b30", "faculty": "Biology", "address1": "484 Commerce Street, Belmont, Michigan, 2598", "address2": "794 Gallatin Place, Tecolotito, Rhode Island, 3191", "levelOfStudy": 74, "semester": "Summer", "year": 2015, "percentOfStudies": 23, "city": "Waukeenah", "stateOrProvince": "consequat pariatur", "postalCode": 2468, "phoneNumber": "+1 (862) 561-2534", "email": "ayalaroth@opportech.com", "eiId": "Octocore" }, { "index": 27, "draft": false, "status": "Pending", "familyName": "Henderson", "givenName": "Myrtle", "registrationDate": "2017-03-28T04:54:24-03:00", "universityName": "MIT", "idType": "ID", "idNumber": "595df0ac0fe7a21a2e63b985", "faculty": "Sciense", "address1": "622 Cadman Plaza, Bowmansville, Wyoming, 2925", "address2": "449 Colonial Court, Edmund, New York, 1818", "levelOfStudy": 26, "semester": "Autumn", "year": 1993, "percentOfStudies": 11, "city": "Haena", "stateOrProvince": "consequat do", "postalCode": 5960, "phoneNumber": "+1 (931) 478-2691", "email": "myrtlehenderson@octocore.com", "eiId": "Austex" }, { "index": 28, "draft": true, "status": "Pending", "familyName": "Cantu", "givenName": "Carmen", "registrationDate": "2014-11-27T06:11:32-02:00", "universityName": "TAU", "idType": "ID", "idNumber": "595df0ac4bc1cc804c7ef761", "faculty": "Sciense", "address1": "961 Girard Street, Guilford, Maryland, 1866", "address2": "153 Utica Avenue, Southmont, Illinois, 598", "levelOfStudy": 95, "semester": "Spring", "year": 1994, "percentOfStudies": 68, "city": "Kansas", "stateOrProvince": "ea duis", "postalCode": 3947, "phoneNumber": "+1 (928) 484-3232", "email": "carmencantu@austex.com", "eiId": "Xumonk" }, { "index": 29, "draft": true, "status": "Pending", "familyName": "Erickson", "givenName": "Short", "registrationDate": "2016-09-04T05:55:50-03:00", "universityName": "TAU", "idType": "Driving License", "idNumber": "595df0aca33e32ef9595fc83", "faculty": "CS", "address1": "528 Delevan Street, Teasdale, Guam, 8597", "address2": "604 Vermont Street, Corinne, Vermont, 6935", "levelOfStudy": 96, "semester": "Spring", "year": 1996, "percentOfStudies": 8, "city": "Dubois", "stateOrProvince": "consequat culpa", "postalCode": 2907, "phoneNumber": "+1 (909) 428-2618", "email": "shorterickson@xumonk.com", "eiId": "Geekola" }, { "index": 30, "draft": true, "status": "New", "familyName": "Callahan", "givenName": "Olsen", "registrationDate": "2015-03-30T01:23:32-03:00", "universityName": "OpenU", "idType": "Driving License", "idNumber": "595df0ac1aa29719839d49fc", "faculty": "Physics", "address1": "828 Metrotech Courtr, Woodlands, Federated States Of Micronesia, 9726", "address2": "951 Stryker Street, National, Virginia, 946", "levelOfStudy": 86, "semester": "Spring", "year": 2007, "percentOfStudies": 98, "city": "Limestone", "stateOrProvince": "qui velit", "postalCode": 7497, "phoneNumber": "+1 (991) 598-2856", "email": "olsencallahan@geekola.com", "eiId": "Gleamink" }, { "index": 31, "draft": true, "status": "New", "familyName": "Hickman", "givenName": "Myra", "registrationDate": "2014-05-13T02:58:57-03:00", "universityName": "TAU", "idType": "Passport", "idNumber": "595df0ac938a36003b3fec94", "faculty": "Physics", "address1": "742 Sullivan Street, Brewster, Iowa, 4163", "address2": "417 Tompkins Avenue, Marenisco, Wisconsin, 7000", "levelOfStudy": 35, "semester": "Autumn", "year": 2001, "percentOfStudies": 50, "city": "Terlingua", "stateOrProvince": "Lorem sit", "postalCode": 6611, "phoneNumber": "+1 (847) 407-3088", "email": "myrahickman@gleamink.com", "eiId": "Keeg" }, { "index": 32, "draft": true, "status": "Pending", "familyName": "Burch", "givenName": "Knox", "registrationDate": "2017-06-03T10:38:09-03:00", "universityName": "MIT", "idType": "Passport", "idNumber": "595df0acdbb03b6a98bd2681", "faculty": "CS", "address1": "157 Buffalo Avenue, Freetown, Puerto Rico, 5110", "address2": "905 Bradford Street, Goldfield, New Jersey, 640", "levelOfStudy": 99, "semester": "Spring", "year": 2016, "percentOfStudies": 38, "city": "Caspar", "stateOrProvince": "dolore velit", "postalCode": 1293, "phoneNumber": "+1 (979) 558-3597", "email": "knoxburch@keeg.com", "eiId": "Kyaguru" }, { "index": 33, "draft": false, "status": "New", "familyName": "Adkins", "givenName": "Martina", "registrationDate": "2015-10-24T04:15:29-03:00", "universityName": "MIT", "idType": "Driving License", "idNumber": "595df0ac69b1cb17adc6a799", "faculty": "Sciense", "address1": "277 Bay Avenue, Cuylerville, North Dakota, 9395", "address2": "113 Perry Place, Caberfae, American Samoa, 5913", "levelOfStudy": 85, "semester": "Winter", "year": 1992, "percentOfStudies": 52, "city": "Freelandville", "stateOrProvince": "eu cupidatat", "postalCode": 6565, "phoneNumber": "+1 (914) 539-3190", "email": "martinaadkins@kyaguru.com", "eiId": "Entropix" }, { "index": 34, "draft": false, "status": "New", "familyName": "Serrano", "givenName": "Edwina", "registrationDate": "2016-11-28T08:50:56-02:00", "universityName": "MIT", "idType": "Passport", "idNumber": "595df0acf560135c6541db31", "faculty": "Physics", "address1": "748 Irwin Street, Loretto, Oklahoma, 4385", "address2": "340 Coyle Street, Wadsworth, Louisiana, 9872", "levelOfStudy": 62, "semester": "Spring", "year": 1991, "percentOfStudies": 72, "city": "Cucumber", "stateOrProvince": "adipisicing minim", "postalCode": 8367, "phoneNumber": "+1 (936) 535-2583", "email": "edwinaserrano@entropix.com", "eiId": "Vicon" }, { "index": 35, "draft": true, "status": "Pending", "familyName": "Mccall", "givenName": "Blair", "registrationDate": "2014-12-28T11:49:08-02:00", "universityName": "TAU", "idType": "ID", "idNumber": "595df0aca60602958f95d9c6", "faculty": "Sciense", "address1": "989 Vanderveer Street, Bloomington, Washington, 8159", "address2": "524 Louise Terrace, Foscoe, Georgia, 643", "levelOfStudy": 70, "semester": "Spring", "year": 1993, "percentOfStudies": 48, "city": "Albany", "stateOrProvince": "magna eu", "postalCode": 7986, "phoneNumber": "+1 (816) 496-3184", "email": "blairmccall@vicon.com", "eiId": "Omatom" }, { "index": 36, "draft": true, "status": "Pending", "familyName": "Bates", "givenName": "Luella", "registrationDate": "2015-06-12T01:55:49-03:00", "universityName": "OpenU", "idType": "Passport", "idNumber": "595df0ac4cf34be9d16c3906", "faculty": "CS", "address1": "440 Chestnut Street, Tolu, Mississippi, 7812", "address2": "361 Bayard Street, Garfield, Virgin Islands, 8355", "levelOfStudy": 51, "semester": "Summer", "year": 1994, "percentOfStudies": 12, "city": "Gulf", "stateOrProvince": "voluptate commodo", "postalCode": 6358, "phoneNumber": "+1 (898) 428-2604", "email": "luellabates@omatom.com", "eiId": "Flyboyz" }, { "index": 37, "draft": true, "status": "New", "familyName": "Schroeder", "givenName": "Mccray", "registrationDate": "2015-12-11T11:49:39-02:00", "universityName": "BGI", "idType": "Driving License", "idNumber": "595df0ac7c03af3b871ff913", "faculty": "Biology", "address1": "807 Jefferson Avenue, Advance, Alabama, 8203", "address2": "479 Wortman Avenue, Weedville, Utah, 9265", "levelOfStudy": 46, "semester": "Summer", "year": 2014, "percentOfStudies": 21, "city": "Ogema", "stateOrProvince": "quis deserunt", "postalCode": 8517, "phoneNumber": "+1 (826) 435-2046", "email": "mccrayschroeder@flyboyz.com", "eiId": "Escenta" }, { "index": 38, "draft": true, "status": "Pending", "familyName": "Terry", "givenName": "Hughes", "registrationDate": "2017-01-04T08:58:30-02:00", "universityName": "BGI", "idType": "Passport", "idNumber": "595df0ace3dc7d59115ae6ca", "faculty": "Biology", "address1": "183 Bragg Street, Alleghenyville, Minnesota, 8705", "address2": "689 Kosciusko Street, Coalmont, Missouri, 7969", "levelOfStudy": 51, "semester": "Autumn", "year": 1990, "percentOfStudies": 2, "city": "Warren", "stateOrProvince": "id anim", "postalCode": 2022, "phoneNumber": "+1 (810) 466-2168", "email": "hughesterry@escenta.com", "eiId": "Affluex" }, { "index": 39, "draft": false, "status": "New", "familyName": "Page", "givenName": "Schwartz", "registrationDate": "2015-02-23T07:02:32-02:00", "universityName": "MIT", "idType": "Passport", "idNumber": "595df0ac6fb798cc42d251d2", "faculty": "Biology", "address1": "680 Lancaster Avenue, Mayfair, Idaho, 6063", "address2": "363 Humboldt Street, Chesterfield, Texas, 5613", "levelOfStudy": 75, "semester": "Spring", "year": 2017, "percentOfStudies": 74, "city": "Rivera", "stateOrProvince": "et ea", "postalCode": 761, "phoneNumber": "+1 (814) 413-3199", "email": "schwartzpage@affluex.com", "eiId": "Quantalia" }, { "index": 40, "draft": false, "status": "New", "familyName": "Vaughan", "givenName": "Lawson", "registrationDate": "2016-01-06T01:52:52-02:00", "universityName": "OpenU", "idType": "Passport", "idNumber": "595df0acfeac1954cf247013", "faculty": "Biology", "address1": "112 Elm Avenue, Witmer, South Carolina, 3206", "address2": "530 Stoddard Place, Aberdeen, Kansas, 6011", "levelOfStudy": 5, "semester": "Autumn", "year": 2000, "percentOfStudies": 6, "city": "Coloma", "stateOrProvince": "sit reprehenderit", "postalCode": 7711, "phoneNumber": "+1 (889) 599-3995", "email": "lawsonvaughan@quantalia.com", "eiId": "Katakana" }, { "index": 41, "draft": false, "status": "Pending", "familyName": "Barber", "givenName": "Compton", "registrationDate": "2016-01-29T07:56:14-02:00", "universityName": "MIT", "idType": "Driving License", "idNumber": "595df0ac7ee4111bce211e98", "faculty": "Physics", "address1": "238 Lott Avenue, Moquino, Arizona, 2114", "address2": "441 Herkimer Court, Benson, South Dakota, 6009", "levelOfStudy": 98, "semester": "Summer", "year": 2000, "percentOfStudies": 95, "city": "Vallonia", "stateOrProvince": "incididunt et", "postalCode": 3085, "phoneNumber": "+1 (920) 435-2419", "email": "comptonbarber@katakana.com", "eiId": "Biohab" }, { "index": 42, "draft": true, "status": "Pending", "familyName": "Farley", "givenName": "Brenda", "registrationDate": "2014-07-12T01:23:51-03:00", "universityName": "TAU", "idType": "ID", "idNumber": "595df0ace54bc3170dcabfa3", "faculty": "Sciense", "address1": "499 Micieli Place, Valmy, Northern Mariana Islands, 2808", "address2": "334 Beverly Road, Groveville, Hawaii, 1602", "levelOfStudy": 55, "semester": "Winter", "year": 1993, "percentOfStudies": 97, "city": "Robbins", "stateOrProvince": "do et", "postalCode": 4064, "phoneNumber": "+1 (873) 566-2308", "email": "brendafarley@biohab.com", "eiId": "Peticular" }, { "index": 43, "draft": true, "status": "New", "familyName": "Whitfield", "givenName": "Massey", "registrationDate": "2015-07-07T05:15:49-03:00", "universityName": "BGI", "idType": "Passport", "idNumber": "595df0ac86d2d623a6755277", "faculty": "Physics", "address1": "447 Classon Avenue, Beyerville, Kentucky, 1561", "address2": "685 Ebony Court, Calvary, Colorado, 3182", "levelOfStudy": 78, "semester": "Summer", "year": 1991, "percentOfStudies": 9, "city": "Hailesboro", "stateOrProvince": "qui nostrud", "postalCode": 3423, "phoneNumber": "+1 (864) 402-2367", "email": "masseywhitfield@peticular.com", "eiId": "Grainspot" }, { "index": 44, "draft": true, "status": "Pending", "familyName": "Fischer", "givenName": "Kane", "registrationDate": "2015-06-13T07:21:43-03:00", "universityName": "MIT", "idType": "Passport", "idNumber": "595df0ac83d25dfa45fc63d3", "faculty": "Sciense", "address1": "932 Lewis Avenue, Dotsero, California, 7702", "address2": "919 Lawn Court, Beaverdale, Alaska, 7027", "levelOfStudy": 56, "semester": "Spring", "year": 2003, "percentOfStudies": 72, "city": "Dupuyer", "stateOrProvince": "sit labore", "postalCode": 613, "phoneNumber": "+1 (840) 546-3114", "email": "kanefischer@grainspot.com", "eiId": "Magnemo" }, { "index": 45, "draft": false, "status": "Pending", "familyName": "Chambers", "givenName": "Wyatt", "registrationDate": "2016-08-11T04:18:45-03:00", "universityName": "TAU", "idType": "Driving License", "idNumber": "595df0ac505612f41caf3070", "faculty": "Physics", "address1": "233 Canda Avenue, Hanover, Tennessee, 3988", "address2": "919 Forest Place, Hasty, West Virginia, 3551", "levelOfStudy": 10, "semester": "Spring", "year": 2012, "percentOfStudies": 24, "city": "Blende", "stateOrProvince": "laborum occaecat", "postalCode": 7255, "phoneNumber": "+1 (817) 406-2127", "email": "wyattchambers@magnemo.com", "eiId": "Parleynet" }, { "index": 46, "draft": false, "status": "Pending", "familyName": "Buckley", "givenName": "Dean", "registrationDate": "2015-12-09T06:36:48-02:00", "universityName": "TAU", "idType": "Passport", "idNumber": "595df0acbbd01d60ead1074e", "faculty": "Physics", "address1": "544 Dean Street, Hickory, North Carolina, 3689", "address2": "992 Howard Alley, Grimsley, Massachusetts, 8539", "levelOfStudy": 34, "semester": "Summer", "year": 2008, "percentOfStudies": 18, "city": "Wescosville", "stateOrProvince": "minim et", "postalCode": 6008, "phoneNumber": "+1 (921) 545-2054", "email": "deanbuckley@parleynet.com", "eiId": "Hivedom" }, { "index": 47, "draft": true, "status": "New", "familyName": "Mcgee", "givenName": "Maribel", "registrationDate": "2016-12-15T11:14:37-02:00", "universityName": "TAU", "idType": "ID", "idNumber": "595df0acf29ab9845f4e68be", "faculty": "Physics", "address1": "482 Kermit Place, Strong, Florida, 3299", "address2": "140 Ridge Court, Chloride, Ohio, 3155", "levelOfStudy": 64, "semester": "Winter", "year": 2005, "percentOfStudies": 11, "city": "Bluetown", "stateOrProvince": "magna Lorem", "postalCode": 3289, "phoneNumber": "+1 (819) 495-3930", "email": "maribelmcgee@hivedom.com", "eiId": "Interloo" }, { "index": 48, "draft": true, "status": "New", "familyName": "Ferrell", "givenName": "Hurst", "registrationDate": "2015-10-25T11:11:40-02:00", "universityName": "OpenU", "idType": "Passport", "idNumber": "595df0ac8605b6be57659c94", "faculty": "Biology", "address1": "305 Kay Court, Libertytown, Marshall Islands, 4347", "address2": "654 Revere Place, Ferney, Arkansas, 9017", "levelOfStudy": 3, "semester": "Autumn", "year": 1995, "percentOfStudies": 32, "city": "Whipholt", "stateOrProvince": "dolor dolor", "postalCode": 3201, "phoneNumber": "+1 (806) 503-2714", "email": "hurstferrell@interloo.com", "eiId": "Geeky" }, { "index": 49, "draft": true, "status": "Pending", "familyName": "Day", "givenName": "Carrillo", "registrationDate": "2016-10-15T04:05:02-03:00", "universityName": "OpenU", "idType": "Driving License", "idNumber": "595df0ac26e9cc3b5e9c7d51", "faculty": "CS", "address1": "670 Crescent Street, Fairforest, Delaware, 8419", "address2": "929 Richmond Street, Boyd, Connecticut, 8756", "levelOfStudy": 15, "semester": "Summer", "year": 1996, "percentOfStudies": 29, "city": "Brandywine", "stateOrProvince": "elit minim", "postalCode": 6609, "phoneNumber": "+1 (994) 568-3360", "email": "carrilloday@geeky.com", "eiId": "Zoid" }, { "index": 50, "draft": false, "status": "Pending", "familyName": "Weiss", "givenName": "Roman", "registrationDate": "2015-09-08T12:40:49-03:00", "universityName": "TAU", "idType": "Driving License", "idNumber": "595df0ac10f55d2b2e531eed", "faculty": "Physics", "address1": "709 Juliana Place, Indio, New Hampshire, 1698", "address2": "991 Colby Court, Gilmore, New Mexico, 200", "levelOfStudy": 66, "semester": "Summer", "year": 2008, "percentOfStudies": 66, "city": "Leeper", "stateOrProvince": "adipisicing eu", "postalCode": 7966, "phoneNumber": "+1 (831) 596-3525", "email": "romanweiss@zoid.com", "eiId": "Isologics" }, { "index": 51, "draft": true, "status": "New", "familyName": "Daniel", "givenName": "Leann", "registrationDate": "2016-11-24T02:35:16-02:00", "universityName": "OpenU", "idType": "Passport", "idNumber": "595df0ac131290a47c82bd09", "faculty": "Biology", "address1": "980 Plymouth Street, Sena, Palau, 169", "address2": "453 Kenilworth Place, Sugartown, Oregon, 5887", "levelOfStudy": 21, "semester": "Summer", "year": 2000, "percentOfStudies": 72, "city": "Sylvanite", "stateOrProvince": "culpa id", "postalCode": 6617, "phoneNumber": "+1 (856) 447-3115", "email": "leanndaniel@isologics.com", "eiId": "Fishland" }, { "index": 52, "draft": true, "status": "Pending", "familyName": "Benjamin", "givenName": "Rhonda", "registrationDate": "2015-11-22T03:20:39-02:00", "universityName": "OpenU", "idType": "Driving License", "idNumber": "595df0ac80e7552c7b21c9e8", "faculty": "CS", "address1": "829 Division Place, Evergreen, Indiana, 5394", "address2": "153 Ovington Court, Croom, Montana, 4946", "levelOfStudy": 32, "semester": "Summer", "year": 2002, "percentOfStudies": 24, "city": "Neahkahnie", "stateOrProvince": "cillum magna", "postalCode": 9651, "phoneNumber": "+1 (855) 405-3554", "email": "rhondabenjamin@fishland.com", "eiId": "Kog" }]

        // let filteredStudents = students;
        // if (pageInterface.filter) {
        //     for (let fieldName in pageInterface.filter) {
        //         filteredStudents = filteredStudents.filter(arrElement => {
        //             let arrFieldValue = arrElement[fieldName];
        //             let createriaValue = pageInterface.filter[fieldName];

        //             return arrFieldValue == createriaValue ||
        //                 isNullOrUndefined(arrFieldValue) || isNullOrUndefined(createriaValue) ||
        //                 ('' + arrFieldValue).toLocaleUpperCase().indexOf(('' + createriaValue).toUpperCase()) > -1;
        //         });
        //     }
        // }

        // if (pageInterface.sort && Object.keys(pageInterface.sort).length !== 0) {
        //     let sortingFieldName: string = Object.getOwnPropertyNames(pageInterface.sort)[0];
        //     let isDescending: boolean = pageInterface.sort[sortingFieldName] == 1;
        //     filteredStudents = filteredStudents.sort((a, b) => {
        //         if (a[sortingFieldName] < b[sortingFieldName]) {
        //             return isDescending ? 1 : -1;
        //         }

        //         if (a[sortingFieldName] > b[sortingFieldName]) {
        //             return isDescending ? -1 : 1;
        //         }
        //         return 0;
        //     });
        // }

        // let firstRow = (pageInterface.number - 1) * pageInterface.size;
        // let lastRow = firstRow + pageInterface.size;
        // let studentsPage = filteredStudents.slice(firstRow, lastRow);

        // let resp = {
        //     code: 0,
        //     errors: null,
        //     page: {
        //         content: studentsPage,
        //         number: pageInterface.number,
        //         size: pageInterface.size,
        //         totalElements: filteredStudents.length,
        //         filter: pageInterface.filter,
        //         sort: pageInterface.sort
        //     }
        // };

        // return new Observable(observer => {
        //     setTimeout(() => {
        //         observer.next(resp);
        //         observer.complete();
        //     }, 1000);
        // });
    }
}