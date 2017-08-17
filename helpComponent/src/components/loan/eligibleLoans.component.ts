import { Component, OnInit } from '@angular/core';
import { UserType, Constants } from '../../utils/constans';
import { getFormattedDate } from '../../utils/utils';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { MessageServices } from '../../services/message.services';
import { MemberServices } from '../../services/member.services';
import { LoanTypeInterface } from '../interfaces/loan.interface';
import { ViewedTypeEnum, StripModeEnum } from '../interfaces/types.interface';
import { CacheService } from 'ionic-cache';
import { LoanTypePage } from './loanTypePage.component';
import { PageService } from '../pageHeader/page.service';
import { FieldInterface } from '../interfaces/uiElements/field.interface';
import { AddOffer } from '../offer/addOffer.component';
import { OfferType } from '../interfaces/offer.interface';

@Component({
  selector: 'eligibleLoans',
  templateUrl: 'eligibleLoans.component.html',
  styles: [
    `.viewed {background-color:lightgray;}`,
    `.dh-table {border-spacing: 0 0em;}`,
    `.inner-table {border-collapse: separate; border-spacing: 0 0.3em;}`,
    `td .padding-right {padding: 0px 5px 0px 0px;}`,
  ]
})
export class EligibleLoans implements OnInit {
  pageTitle: string;
  pageTitleCounter: number = null;

  username: string;

  isGovSavedOnlyScholarship: boolean = false;

  loans: LoanTypeInterface[] = <[LoanTypeInterface]>[];
  viewedLoans : string[] = <[string]>[];

  eligibleLoanFields: [FieldInterface] = <[FieldInterface]>[];

  loanTypeStripMode: StripModeEnum = StripModeEnum.ELIGIBLE;

  hideheart: boolean;

  constructor(public nav: NavController, navParams: NavParams, private messageServices: MessageServices, private memberServices: MemberServices, private platform: Platform, private cache: CacheService, private pageService: PageService) {
    if (this.pageService.getUsertype() == UserType.Student.toString()) {
      this.username = this.pageService.getStudent().email;
      this.pageTitle = this.pageService.getStudent().givenName + " - Eligible loans";
      this.hideheart=false;
    }
    else if (this.pageService.getUsertype() == UserType.Government.toString()) {
      this.username = this.pageService.getMember().shortName;
      this.isGovSavedOnlyScholarship = navParams.get('savedOnly') === true;
      this.pageTitle = this.pageService.getMember().fullName + " - " + (this.isGovSavedOnlyScholarship ? "Saved loans" : "Loans");
      this.hideheart=true;
    }
  }

  changePageTitleCounter(): void {
    this.pageTitleCounter = this.loans ? this.loans.length : 0;
  }

  getCacheKey() {
    return Constants.ELIGIBLE_LOANS_CACHE + '_' + this.username;
  }
  ngOnInit() {
    this.eligibleLoanFields = [{
      name: "info.openDate",
      id: "openDateDate",
      formatter: getFormattedDate,
      text: "Open date:"
    },
    {
      name: "info.deadlineDate",
      id: "deadlineDateDate",
      formatter: getFormattedDate,
      text: "Deadline:"
    }];

    this.cache.getItem(this.getCacheKey()).catch(() =>{}).then((data) => {
      if (data){
        this.viewedLoans = data;
      }
    });   
  
  }

  getEligibleLoans(){
      this.memberServices.getEligibleLoans(UserType.Student, this.username).subscribe(
              res => {
                switch (res.code) {
                  case 0:
                    this.loans = res.strips;
                     for (let loan of this.loans){
                        if (this.viewedLoans.indexOf(loan.info.name) != -1){
                          loan.viewed = ViewedTypeEnum.VIEWED;
                        }
                      }
                    this.changePageTitleCounter();
                    break;

                  default:
                    console.error('Failed to load Eligible Loan data. Error code: ' + res.code);
                }
                //Refresh counter on success in Observable
                this.changePageTitleCounter();
              },
              err => {
                console.error('Failed to load Eligible Loan data');
                console.error(err);
                //Refresh counter on error in Observable
                this.changePageTitleCounter();
              }
            )
  }
  
  getGovernmentLoans() {
    this.memberServices.getGovernmentLoans(this.username, this.isGovSavedOnlyScholarship).subscribe(
      res => {
        switch (res.code) {
          case 0:
            this.loans = res.body || res.loantypes;
          
            break;

          default:
            console.error('Failed to load Eligible Loan data. Error code: ' + res.code);
        }
        //Refresh counter on success in Observable
        this.changePageTitleCounter();
      },
      err => {
        console.error('Failed to load Eligible Loan data');
        console.error(err);
        //Refresh counter on error in Observable
        this.changePageTitleCounter();
      }
    );
  }

  loadLoan = (index: number): void => {
    let navigationPage: any;
    let navigationParams = {};

    if (this.pageService.getUsertype() == UserType.Government.toString()) {
      navigationPage = AddOffer;
      navigationParams = { offer: this.loans[index], offerType: OfferType.loanType, readOnly: !this.isGovSavedOnlyScholarship };
    }
    else {
      navigationPage = LoanTypePage;
      navigationParams = { loanType: this.loans[index] };
    }

    this.nav.push(navigationPage, navigationParams).then(() => {
      this.loans[index].viewed = ViewedTypeEnum.VIEWED;
      if (this.viewedLoans.indexOf(this.loans[index].info.name) == -1){
        this.viewedLoans.push(this.loans[index].info.name);
        this.cache.saveItem(this.getCacheKey(), this.viewedLoans);
      }
    });
  }

  ionViewWillEnter() {
    this.loans = [];

    //Reload data from backend and do not cache if Government user
    if (this.pageService.getUsertype() == UserType.Government.toString()) {
        this.getGovernmentLoans();
    }
    else if (this.pageService.getUsertype() == UserType.Student.toString()) {
        this.getEligibleLoans();
    }
    
    this.changePageTitleCounter();
  }

  ionSelected() {
    //resolves the double tap on tab issue in mobile mode
  }

}