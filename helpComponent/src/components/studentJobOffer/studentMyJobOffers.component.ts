import { Component, OnInit } from '@angular/core';
import { getFormattedDate } from '../../utils/utils';
import { StudentInterface } from '../interfaces/student.interface';
import { NavController, NavParams } from 'ionic-angular';
import { StudentJobOfferInterface } from '../interfaces/jobOffer.interface';
import { ViewedTypeEnum } from '../interfaces/types.interface';
import { MessageServices } from '../../services/message.services';
import { MemberServices } from '../../services/member.services';
import { PageService } from '../pageHeader/page.service';
import { FieldInterface } from '../interfaces/uiElements/field.interface';
import { SentenceByStatusInterface } from '../interfaces/sentence.interface';
import { OfferType } from '../interfaces/offer.interface';
import { StudentJobOfferPage } from './studentJobOfferPage.component';

@Component({
    selector: 'studentMyJobOffers',
    templateUrl: 'studentMyJobOffers.component.html',
    styles: [`.viewed {background-color:lightgray;}`,
        `.dh-table {border-spacing: 0 0em;}`,
        `.inner-table {border-collapse: separate; border-spacing: 0 0.3em;}`,
        `td .padding-right {padding: 0px 5px 0px 0px;}`]
})

export class StudentMyJobOffers implements OnInit {
    studentName: string;
    member: StudentInterface;
    status: string;
    pageTitle: string = '';
    myJobOffers: StudentJobOfferInterface[] = [];

    //fields to present in the strip
    myJobOfferFields: FieldInterface[] = [];

    sentences: SentenceByStatusInterface = {
        Pending: {
            titleSentenceSingle: 'pending job offer',
            titleSentencePlural: 'pending job offers',
            dateStatusSentence: 'Applied'
        },
        Approved: {
            titleSentenceSingle: 'approved job offer',
            titleSentencePlural: 'approved job offers',
            dateStatusSentence: 'Approved'
        },
        Declined: {
            titleSentenceSingle: 'declined job offer',
            titleSentencePlural: 'declined job offers',
            dateStatusSentence: 'Declined'
        }
    }

    constructor(public nav: NavController, navParams: NavParams, private messageServices: MessageServices, private memberServices: MemberServices, private pageService: PageService) {
        this.status = navParams.get("status");
        this.studentName = this.pageService.getStudent().familyName;
        this.member = this.pageService.getStudent();
    }

    ngOnInit() {
        this.myJobOfferFields = [{
            name: "jobOffer.info.name",
            id: "jobOfferNameTxt",
            text: "Name"
        },
        {
            name: "jobOffer.info.createDate",
            id: "createDateDate",
            formatter: getFormattedDate,
            text: "Creation date"
        },
        {
            name: "updateDate",
            id: "updateDateDate",
            formatter: getFormattedDate
        }];

        this.memberServices.getStudentOffersByStatus(this.member.email, this.status, OfferType.jobOffer).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        this.myJobOffers = res.appliedJobOffers;
                        break;

                    default:
                        console.error('Failed to load my Job Offers data by status. Error code: ' + res.code);
                }
            },
            err => {
                console.error('Failed to load my Job Offers data by status');
                console.error(err);
            }
        )
    }

    loadStudentJobOffer = (index: number): void => {
        this.nav.push(StudentJobOfferPage, { studentJobOffer: this.myJobOffers[index] });
    }

    ionSelected() {
        //resolves the double tap on tab issue in mobile mode
    }
}