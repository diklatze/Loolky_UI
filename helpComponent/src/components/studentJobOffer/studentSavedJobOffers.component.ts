import { Component, OnInit } from '@angular/core';
import { getFormattedDate } from '../../utils/utils';
import { StudentInterface } from '../interfaces/student.interface';
import { NavController, NavParams } from 'ionic-angular';
import { JobOfferInterface } from '../interfaces/jobOffer.interface';
import { ViewedTypeEnum, StripModeEnum } from '../interfaces/types.interface';
import { MessageServices } from '../../services/message.services';
import { MemberServices } from '../../services/member.services';
import { PageService } from '../pageHeader/page.service';
import { JobOfferPage } from '../jobOffer/jobOfferPage.component';
import { FieldInterface } from '../interfaces/uiElements/field.interface';
import { SentenceInterface } from '../interfaces/sentence.interface';
import { OfferType } from '../interfaces/offer.interface';

@Component({
    selector: 'studentSavedJobOffers',
    templateUrl: 'studentSavedJobOffers.component.html',
    styles: [`.viewed {background-color:lightgray;}`,
        `.dh-table {border-spacing: 0 0em;}`,
        `.inner-table {border-collapse: separate; border-spacing: 0 0.3em;}`,
        `td .padding-right {padding: 0px 5px 0px 0px;}`]
})

export class StudentSavedJobOffers implements OnInit {
    username: string;
    member: StudentInterface;
    pageTitle: string = '';
    pageTitleCounter: number = null;
    jobOfferStripMode: StripModeEnum = StripModeEnum.ELIGIBLE;

    jobOffers: JobOfferInterface[] = <[JobOfferInterface]>[];

    //fields to present in the strip
    savedJobOffersFields: [FieldInterface] = <[FieldInterface]>[];

    sentences: SentenceInterface = {
        titleSentenceSingle: 'saved draft job offer',
        titleSentencePlural: 'saved draft job offers',
        dateStatusSentence: 'Saved'
    }

    constructor(public nav: NavController, navParams: NavParams, private messageServices: MessageServices, private memberServices: MemberServices, private pageService: PageService) {
        this.member = this.pageService.getStudent();
        this.username = this.pageService.getStudent().email;
    }

    ngOnInit() {
         this.savedJobOffersFields = [{
        //     name: "info.name",
        //     id: "jobOfferNameTxt",
        //     text: "Name"
        // },
        // {
        //     name: "info.createDate",
        //     id: "createDateDate",
        //     formatter: getFormattedDate,
        //     text: "Creation date"
        // },
        // {
        //     name: "saveDate",
        //     id: "saveDate",
        //     formatter: getFormattedDate,
        //     text: "Save date"
        // }];
        
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
      
      
     

        this.memberServices.getSavedDrafts(this.member.email, OfferType.jobOffer).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        //this.jobOffers = res.savedJobOffers || [];
                        this.jobOffers = res.strips || [];
                        break;

                    default:
                        console.error('Failed to load saved job offer data. Error code: ' + res.code);
                }
            },
            err => {
                console.error('Failed to load saved job offer data');
                console.error(err);
            }
        )
    }

    filterAndUpdate = (jobOffer?: JobOfferInterface) => {
        var submittedJobOffer: JobOfferInterface[] = <[JobOfferInterface]>[];

        if (this.jobOffers) {
            //filter submitted job offers
            submittedJobOffer = this.jobOffers.filter((jobOffer: JobOfferInterface, index: number, array: JobOfferInterface[]) => {
                return jobOffer.viewed == ViewedTypeEnum.SUBMITTED;
            });
        }

        if (this.jobOffers) {
            //filter out not saved job offers
            this.jobOffers = this.jobOffers.filter((jobOffer: JobOfferInterface, index: number, array: JobOfferInterface[]) => {
                return jobOffer.saved && jobOffer.viewed != ViewedTypeEnum.SUBMITTED;
            });
        }

        this.changePageTitleCounter();
    }

    loadJobOffer = (index: number): void => {
        this.nav.push(JobOfferPage, { jobOffer: this.jobOffers[index] });
    }

    changePageTitleCounter(): void {
        this.pageTitleCounter = this.jobOffers ? this.jobOffers.length : 0;
    }

}