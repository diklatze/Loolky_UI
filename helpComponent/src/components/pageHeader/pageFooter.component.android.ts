import { Component, ViewChild } from '@angular/core';
import { PageFooter } from './pageFooter.component';
import { StudentLandingPageAndroid } from '../landingPage/studentLandingPage.component.android';
import { EligibleLoans } from '../loan/eligibleLoans.component';
import { EligibleScholarships } from '../scholarship/eligibleScholarships.component';
import { PageService } from '../pageHeader/page.service';
import { PageHeaderAndroid } from '../pageHeader/pageHeader.component.android';
import { UserType } from '../../utils/constans';
import { Tabs, NavController } from 'ionic-angular';
import { EligibleJobOffers } from '../jobOffer/eligibleJobOffers.component';

declare var $: any;

@Component({
    selector: 'pageFooterMobile',
    templateUrl: 'pageFooter.component.android.html',
})

export class PageFooterMobile extends PageFooter {
    @ViewChild('footerTabs') tabRef: Tabs;

    allTabs: { [userType: string]: FooterTabInterface[] } = {};
    currentTabs: FooterTabInterface[] = null;

    homeRoot = StudentLandingPageAndroid;
    loansRoot = StudentLandingPageAndroid;
    scholarshipsRoot = StudentLandingPageAndroid;

    constructor(pageService: PageService, nav: NavController) {
        super(pageService, nav);

        this.allTabs[String(UserType.Student)] = this.getStudentTabs();
        //In case we have also tabs for other user types - add them here to this.allTabs

        this.show(); //shown by default
    }

    selectHome = (tabIndex: number) => {
        if (!this.currentTabs[tabIndex].initialized) {
            this.pageService.headerMenu = PageHeaderAndroid.selectedHome(this.tabRef.getByIndex(tabIndex));
            this.currentTabs[tabIndex].initialized = true;
        }
    }

    selectLoans = (tabIndex: number) => {
        if (!this.currentTabs[tabIndex].initialized) {
            this.pageService.headerMenu = PageHeaderAndroid.selectLoans(this.tabRef.getByIndex(tabIndex));
            this.tabRef.getByIndex(tabIndex).setRoot(EligibleLoans);
            this.currentTabs[tabIndex].initialized = true;
        }
    }

    selectScholarships = (tabIndex: number) => {
        this.pageService.headerMenu = PageHeaderAndroid.selectScholarship(this.tabRef.getByIndex(tabIndex));
        this.tabRef.getByIndex(tabIndex).setRoot(EligibleScholarships);
    }

    selectJobOffers = (tabIndex: number) => {
        this.pageService.headerMenu = PageHeaderAndroid.selectJobOffer(this.tabRef.getByIndex(tabIndex));
        this.tabRef.getByIndex(tabIndex).setRoot(EligibleJobOffers);
    }


    show() {
        super.show();
        if (!this.currentTabs) {
            let userType = this.pageService.getUsertype();
            this.currentTabs = this.allTabs[userType];
        }
    }

    private getTabsReference(): Tabs {
        return this.tabRef;
    }

    private getStudentTabs(): FooterTabInterface[] {
        return [
            {
                id: "homeTab",
                tabTitle: "Home",
                tabIcon: "home",
                enabled: true,
                onSelect: this.selectHome,
                rootPage: null,
                rootPageParams: {},
                initialized: false
            },
            {
                id: "loanTab",
                tabTitle: "Loans",
                tabIcon: "cash",
                enabled: true,
                onSelect: this.selectLoans,
                rootPage: StudentLandingPageAndroid,
                rootPageParams: {},
                initialized: false
            },
            {
                id: "scholarshipTab",
                tabTitle: "Scholarships",
                tabIcon: "cash",
                enabled: true,
                onSelect: this.selectScholarships,
                rootPage: StudentLandingPageAndroid,
                rootPageParams: {},
                initialized: false
            },
            {
                id: "jobOfferTab",
                tabTitle: "Job Offers",
                tabIcon: "cash",
                enabled: true,
                onSelect: this.selectJobOffers,
                rootPage: StudentLandingPageAndroid,
                rootPageParams: {},
                initialized: false
            }
        ];
    }
}

export interface FooterTabInterface {
    id: string,
    tabTitle: string,
    tabIcon: string,
    enabled: boolean,
    onSelect: (number) => void,
    rootPage: any,
    rootPageParams: any,
    initialized: boolean
}