import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MemberServices } from '../../services/member.services';
import { CertifiedEI } from '../certifiedEI/certifiedEI.component';
import { AppliedLoans } from '../studentLoan/appliedLoans.component';
import { LoanCategories } from '../loanCategories/loanCategories.component';
import { AddOffer } from '../offer/addOffer.component';
import { PageService } from '../pageHeader/page.service';
import { MemberPage } from '../member/member.component';
import { MemberUserCreation } from '../user/memberUserCreation.component';
import { MemberAccountSendFunds } from '../memberAccount/memberAccountSendFunds.component';
import { EligibleLoans } from '../loan/eligibleLoans.component';
import { MyOffers } from '../offer/myOffers.component';
import { Dashboard } from '../chart/dashboard.component';
import { OfferType } from '../interfaces/offer.interface';

@Component({
    selector: 'govermentLandingPage',
    templateUrl: 'govermentLandingPage.component.html',
    providers: [MemberServices]
})

export class GovermentLandingPage {
    pageTitle: string;

    constructor(private nav: NavController, private memberServices: MemberServices, private pageService: PageService) {
        this.pageTitle = this.pageService.getMember().fullName + " - Home";
    }

    cetifiedEIs() {
        this.nav.push(CertifiedEI);
    }

    loanCategories() {
        this.nav.push(LoanCategories);
    }

    addLoanType() {
        this.nav.push(AddOffer, { offerType: OfferType.loanType });
    }

    appliedLoans() {
        this.nav.push(AppliedLoans);
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

    viewLoans() {
        this.nav.push(MyOffers, { offerType: OfferType.loanType });
    }

    createApplicationUser() {
        this.nav.push(MemberUserCreation, { applicationUserCreation: true });
    }

    showDashboard() {
        this.nav.push(Dashboard);
    }

    viewSavedLoans() {
        this.nav.push(EligibleLoans, { savedOnly: true });
    }
}