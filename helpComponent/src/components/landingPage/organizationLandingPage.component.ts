import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { PageService } from '../pageHeader/page.service';
import { AddOffer } from '../offer/addOffer.component';
import { AppliedScholarships } from '../studentScholarship/appliedScholarships.component';
import { AppliedJobOffers } from '../studentJobOffer/appliedJobOffers.component';
import { EligibleScholarships } from '../scholarship/eligibleScholarships.component';
import { EligibleJobOffers } from '../jobOffer/eligibleJobOffers.component';
import { MemberUserCreation } from '../user/memberUserCreation.component';
import { Dashboard } from '../chart/dashboard.component';
import { OfferType } from '../interfaces/offer.interface';
import { MyOffers } from '../offer/myOffers.component';

@Component({
    selector: 'organizationLandingPage',
    templateUrl: 'organizationLandingPage.component.html'
})

export class OrganizationLandingPage {
    pageTitle: string;

    constructor(private nav: NavController, private pageService: PageService) {
        this.pageTitle = this.pageService.getMember().fullName + " - Home";
    }

    addScholarship() {
        this.nav.push(AddOffer, { offerType: OfferType.scholarship });
    }

    appliedScholarships() {
        this.nav.push(AppliedScholarships);
    }

    appliedJobOffers() {
        this.nav.push(AppliedJobOffers);
    }

    viewScholarships() {
        this.nav.push(MyOffers, { offerType: OfferType.scholarship });
    }

    viewSavedScholarships() {
        this.nav.push(EligibleScholarships, { savedOnly: true });
    }

    createApplicationUser() {
        this.nav.push(MemberUserCreation, { applicationUserCreation: true });
    }

    showDashboard() {
        this.nav.push(Dashboard);
    }

    addJobOffer() {
        this.nav.push(AddOffer, { offerType: OfferType.jobOffer });
    }

    viewSavedJobOffers() {
        this.nav.push(EligibleJobOffers, { savedOnly: true });
    }

    viewJobOffers() {
        this.nav.push(MyOffers, { offerType: OfferType.jobOffer });
    }
}