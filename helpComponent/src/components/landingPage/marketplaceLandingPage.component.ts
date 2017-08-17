import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MemberPage } from '../member/member.component';
import { MemberUserCreation } from '../user/memberUserCreation.component';
import { PageService } from '../pageHeader/page.service';
import { MemberAccountSendFunds } from '../memberAccount/memberAccountSendFunds.component';
import { Dashboard } from '../chart/dashboard.component';
import { Constants } from '../../utils/constans';

@Component({
    selector: 'marketplaceLandingPage',
    templateUrl: 'marketplaceLandingPage.component.html'
})

export class MarketplaceLandingPage {
    pageTitle: string = "D+H - Home";

    constructor(private nav: NavController, private pageService: PageService) {
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
}