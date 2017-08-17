import { Component, OnInit } from '@angular/core';
import { getFormattedDate } from '../../utils/utils';
import { StudentInterface } from '../interfaces/student.interface';
import { NavController, NavParams } from 'ionic-angular';
import { ScholarshipInterface } from '../interfaces/scholarship.interface';
import { ViewedTypeEnum, StripModeEnum } from '../interfaces/types.interface';
import { MessageServices } from '../../services/message.services';
import { MemberServices } from '../../services/member.services';
import { PageService } from '../pageHeader/page.service';
import { ScholarshipPage } from '../scholarship/scholarshipPage.component';
import { FieldInterface } from '../interfaces/uiElements/field.interface';
import { SentenceInterface } from '../interfaces/sentence.interface';
import { OfferType } from '../interfaces/offer.interface';

@Component({
    selector: 'studentSavedScholarships',
    templateUrl: 'studentSavedScholarships.component.html',
    styles: [`.viewed {background-color:lightgray;}`,
        `.dh-table {border-spacing: 0 0em;}`,
        `.inner-table {border-collapse: separate; border-spacing: 0 0.3em;}`,
        `td .padding-right {padding: 0px 5px 0px 0px;}`]
})

export class StudentSavedScholarships implements OnInit {
    username: string;
    member: StudentInterface;
    pageTitle: string = '';
    pageTitleCounter: number = null;
    scholarshipStripMode: StripModeEnum = StripModeEnum.ELIGIBLE;

    scholarships: ScholarshipInterface[] = <[ScholarshipInterface]>[];

    //fields to present in the strip
    savedScholarshipsFields: [FieldInterface] = <[FieldInterface]>[];

    sentences: SentenceInterface = {
        titleSentenceSingle: 'saved draft scholarship',
        titleSentencePlural: 'saved draft scholarships',
        dateStatusSentence: 'Saved'
    }

    constructor(public nav: NavController, navParams: NavParams, private messageServices: MessageServices,
        private memberServices: MemberServices, private pageService: PageService) {

        this.member = this.pageService.getStudent();
        this.username = this.pageService.getStudent().email;
    }

    ngOnInit() {
        this.savedScholarshipsFields = [{
        //     name: "info.name",
        //     id: "info.name",
        //     text: "Name"
        // },
        // {
        //     name: "info.applicationDeadline",
        //     id: "info.deadlineDateDate",
        //     formatter: getFormattedDate,
        //     text: "Deadline"
        // },
        // {
        //     name: "saveDate",
        //     id: "saveDate",
        //     formatter: getFormattedDate
        // }];
        
          name: "organization",
          id: "organizationTxt",
          text: "Organization:"
        },
        {
          name: "maxAmount",
          id: "maxAmountTxt",
          text: "Max Amount:"
        },
        {
          name: "openDate",
          id: "openDateDate",
          formatter: getFormattedDate,
          text: "Open date:"
        },
        {
          name: "applicationDeadline",
          id: "deadlineDateDate",
          formatter: getFormattedDate,
          text: "Application Deadline:"
        }];


        this.memberServices.getSavedDrafts(this.member.email, OfferType.scholarship).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        this.scholarships = res.strips || [];
                        break;

                    default:
                        console.error('Failed to load saved scholarship data. Error code: ' + res.code);
                }
            },
            err => {
                console.error('Failed to load saved scholarship data');
                console.error(err);
            }
        )
    }

    filterAndUpdate = (scholarship?: ScholarshipInterface) => {
        var submittedLoan: ScholarshipInterface[] = <[ScholarshipInterface]>[];

        if (this.scholarships) {
            //filter submitted scholarships
            submittedLoan = this.scholarships.filter((scholarship: ScholarshipInterface, index: number, array: ScholarshipInterface[]) => {
                return scholarship.viewed == ViewedTypeEnum.SUBMITTED;
            });
        }

        if (this.scholarships) {
            //filter out not saved scholarship
            this.scholarships = this.scholarships.filter((scholarship: ScholarshipInterface, index: number, array: ScholarshipInterface[]) => {
                return scholarship.saved && scholarship.viewed != ViewedTypeEnum.SUBMITTED;
            });
        }

        this.changePageTitleCounter();
    }


    loadScholarship = (index: number): void => {
        this.nav.push(ScholarshipPage, { scholarship: this.scholarships[index] });
    }

    changePageTitleCounter(): void {
        this.pageTitleCounter = this.scholarships ? this.scholarships.length : 0;
    }

}