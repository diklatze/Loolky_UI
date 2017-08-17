import { Component, OnInit } from '@angular/core';
import { FieldInterface } from '../interfaces/uiElements/field.interface';
import { UserType, Constants } from '../../utils/constans';
import { ViewedTypeEnum, StripModeEnum } from '../interfaces/types.interface';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { MessageServices } from '../../services/message.services';
import { MemberServices } from '../../services/member.services';
import { PageService } from '../pageHeader/page.service';
import { StudentInterface } from '../interfaces/student.interface';
import { MemberInterface } from '../interfaces/member.interface';
import { getFormattedDate } from '../../utils/utils';
import { JobOfferInterface } from '../interfaces/jobOffer.interface';
import { JobOfferPage } from './jobOfferPage.component';
import { AddOffer } from '../offer/addOffer.component';
import { OfferType } from '../interfaces/offer.interface';
import { CacheService } from 'ionic-cache';


@Component({
  selector: 'eligibleJobOffers',
  templateUrl: 'eligibleJobOffers.component.html',
  styles: [
    `.viewed {background-color:lightgray;}`,
    `.dh-table {border-spacing: 0 0em;}`,
    `.inner-table {border-collapse: separate; border-spacing: 0 0.3em;}`,
    `td .padding-right {padding: 0px 5px 0px 0px;}`,
  ]
})

export class EligibleJobOffers implements OnInit {

  pageTitle: string;
  pageTitleCounter: number = null;
  username: string;

  member: StudentInterface | MemberInterface;
  eligibleJobOfferFields: [FieldInterface] = <[FieldInterface]>[];
  studentEligibleJobOfferFields: [FieldInterface] =
                          [{
                              name: "organization",
                              id: "organizationTxt",
                              text: "Organization:"
                            },
                            {
                              name: "info.jobBrief",
                              id: "jobBriefTxt",
                              text: "Job Brief:"
                            },
                            {
                              name: "info.requirements",
                              id: "requirementsTxt",
                              text: "Requirements:"
                            }];
  
  orgEligibleJobOfferFields: [FieldInterface] = 
                          [{
                              name: "info.jobBrief",
                              id: "jobBriefTxt",
                              text: "Job Brief:"
                            },
                            {
                              name: "info.requirements",
                              id: "requirementsTxt",
                              text: "Requirements:"
                            }];
  
  jobOffers: JobOfferInterface[] = <[JobOfferInterface]>[];
  viewedJobOffer: string[] = <[string]>[];
  viewedType = ViewedTypeEnum; //required in order to use it in the html template

  jobOfferStripMode: StripModeEnum = StripModeEnum.ELIGIBLE;
  hideheart: boolean;

  isOrganizationSavedOnlyJobOffer: boolean = false;

  constructor(public nav: NavController, navParams: NavParams, private messageServices: MessageServices, private memberServices: MemberServices, private platform: Platform, private pageService: PageService, private cache: CacheService) {
    if (this.pageService.getUsertype() == UserType.Student.toString()) {
      this.username = this.pageService.getStudent().email;
      this.member = this.pageService.getStudent();
      this.pageTitle = this.pageService.getStudent().givenName + ' - ' + "Eligible Job Offers";
      this.hideheart=false;
    }else{
      this.username = this.pageService.getUsername();
      this.member = this.pageService.getMember();
      this.isOrganizationSavedOnlyJobOffer = navParams.get('savedOnly') === true;
      this.pageTitle = this.pageService.getMember().fullName + ' - ' + (this.isOrganizationSavedOnlyJobOffer ? "Saved Job Offers" : "Job Offers")
      this.hideheart=true;
    }
  }

  getCacheKey() {
    return Constants.ELIGIBLE_JOBOFFER_CACHE + '_' + this.username;
  }

  ngOnInit() {
    this.cache.getItem(this.getCacheKey()).catch(() =>{}).then((data) => {
        if (data){
          this.viewedJobOffer = data
        }
    });    
  }

  getOrganizationJobOffers() {
    this.memberServices.getOrganizationJobOffers((<MemberInterface>this.member).shortName, this.isOrganizationSavedOnlyJobOffer).subscribe(
      res => {
        switch (res.code) {
          case 0:
            this.jobOffers = res.jobOffers || [];
            this.changePageTitleCounter();
            break;

          default:
            console.error('Failed to load job offers. Error code: ' + res.code);
        }
      },
      err => {
        console.error('Failed to load job offers');
        console.error(err);
      }
    )
  }
  
  getEligibleJobOffer(){
      this.memberServices.getEligibleJobOffer((<StudentInterface>this.member).email).subscribe(
              res => {
                switch (res.code) {
                  case 0:
                    this.jobOffers = res.strips;
                    for (let jobOffer of this.jobOffers){
                      if (this.viewedJobOffer.indexOf(jobOffer.info.name) != -1){
                        jobOffer.viewed = ViewedTypeEnum.VIEWED;
                      }
                    }

                    this.changePageTitleCounter();
                    break;

                  default:
                    console.error('Failed to load eligible scholarships. Error code: ' + res.code);
                }
              },
              err => {
                console.error('Failed to load eligible scholarships');
                console.error(err);
              }
            )

  }

  changePageTitleCounter(): void {
    this.pageTitleCounter = this.jobOffers ? this.jobOffers.length : 0;
  }

  loadJobOffer = (index: number): void => {
    let page: any = JobOfferPage;
    let navigationParams: any = {};

    if (this.pageService.getUsertype() == UserType.Organization.toString()) {
      page = AddOffer;
      navigationParams.readOnly = !this.isOrganizationSavedOnlyJobOffer;
      navigationParams.offerType = OfferType.jobOffer;
      navigationParams.offer = this.jobOffers[index];
    }
    else {
      navigationParams.jobOffer = this.jobOffers[index];
    }

    this.nav.push(page, navigationParams).then(() => {
      this.jobOffers[index].viewed = this.isOrganizationSavedOnlyJobOffer ? ViewedTypeEnum.NOT_VIEWED : ViewedTypeEnum.VIEWED;
      if (this.viewedJobOffer.indexOf(this.jobOffers[index].info.name) == -1){
        this.viewedJobOffer.push(this.jobOffers[index].info.name);
        this.cache.saveItem(this.getCacheKey(), this.viewedJobOffer);
      }
    });
  }

  ionSelected() {
    //resolves the double tap on tab issue in mobile mode
  }


  ionViewWillEnter() {
      this.jobOffers = [];

      if(this.pageService.getUsertype() == UserType.Organization.toString()){
            //load the list of saved scholarships on each page entrance
            if (this.isOrganizationSavedOnlyJobOffer) {
                this.eligibleJobOfferFields = this.orgEligibleJobOfferFields;
                this.getOrganizationJobOffers();
            }
      } else if(this.pageService.getUsertype() == UserType.Student.toString()){
          this.eligibleJobOfferFields = this.studentEligibleJobOfferFields;
          this.getEligibleJobOffer();
      }

    if (this.jobOffers) {
      //filter out all the applied scholarship which might be changed by in other components
      this.jobOffers = this.jobOffers.filter((jobOffer: JobOfferInterface, index: number, array: JobOfferInterface[]) => {
        return jobOffer.viewed != this.viewedType.SUBMITTED;
      });
    }

    this.changePageTitleCounter();
  }

}