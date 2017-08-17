import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { EligibleLoans } from '../loan/eligibleLoans.component';
import { PageService } from '../pageHeader/page.service';
import { EligibleScholarships } from '../scholarship/eligibleScholarships.component';
import { EligibleJobOffers } from '../jobOffer/eligibleJobOffers.component';

@Component({
    selector: 'studentLandingPage',
    templateUrl: 'studentLandingPage.component.html'
})

export class StudentLandingPage implements OnInit {
    pageTitle: string = "Home";

    constructor(private nav: NavController, private pageService: PageService) {
         this.pageTitle = this.pageService.getStudent().givenName + " - Home";
    }

    ngOnInit() { }

    eligibleLoans() {
        this.nav.push(EligibleLoans);
    }

    eligibleScholarships() {
        this.nav.push(EligibleScholarships);
    }

     eligibleJobOffers() {
        this.nav.push(EligibleJobOffers);
    }
}