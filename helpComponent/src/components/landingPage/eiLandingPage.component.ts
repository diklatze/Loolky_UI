import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { StudentRegistrationPage } from '../studentRegistration/studentRegistration.component';
import { Faculties } from '../faculties/faculties.component';
import { Association } from '../association/association.component';
import { PageService } from '../pageHeader/page.service';
import { MemberPage } from '../member/member.component';
import { MemberUserCreation } from '../user/memberUserCreation.component';
import { MemberAccountSendFunds } from '../memberAccount/memberAccountSendFunds.component';
import { Dashboard } from '../chart/dashboard.component';
import { MyRegisteredStudents } from '../myRegisteredStudents/myRegisteredStudents.component';
import { StudentLoanAggregations } from '../Aggregations/studentLoanAggregations.component';

@Component({
    selector: 'eiLandingPage',
    templateUrl: 'eiLandingPage.component.html'
})

export class EiLandingPage {
    pageTitle: string;

    constructor(private nav: NavController, private pageService: PageService) {
        this.pageTitle = this.pageService.getMember().fullName + " - Home";
    }

    registerStudent() {
        this.nav.push(StudentRegistrationPage, { readOnlyMode: false });
    }

    faculties() {
        this.nav.push(Faculties);
    }

    association() {
        this.nav.push(Association);
    }

    createMember() {
        this.nav.push(MemberPage);
    }

    createUser() {
        this.nav.push(MemberUserCreation);
    }

    sendFunds() {
        this.nav.push(MemberAccountSendFunds);
    }

    showDashboard() {
        this.nav.push(Dashboard);
    }

    createApplicationUser() {
        this.nav.push(MemberUserCreation, { applicationUserCreation: true });
    }

    myRegisteredStudents() {
        this.nav.push(MyRegisteredStudents);
    }

    aggregations(){
        this.nav.push(StudentLoanAggregations);
    }
}