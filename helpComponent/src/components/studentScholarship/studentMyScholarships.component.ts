import { Component, OnInit } from '@angular/core';
import { getFormattedDate } from '../../utils/utils';
import { StudentInterface } from '../interfaces/student.interface';
import { NavController, NavParams } from 'ionic-angular';
import { StudentScholarshipInterface } from '../interfaces/scholarship.interface';
import { ViewedTypeEnum } from '../interfaces/types.interface';
import { MessageServices } from '../../services/message.services';
import { MemberServices } from '../../services/member.services';
import { StudentScholarshipPage } from './studentScholarshipPage.component';
import { PageService } from '../pageHeader/page.service';
import { FieldInterface } from '../interfaces/uiElements/field.interface';
import { SentenceByStatusInterface } from '../interfaces/sentence.interface';
import { OfferType } from '../interfaces/offer.interface';

@Component({
    selector: 'studentMyScholarships',
    templateUrl: 'studentMyScholarships.component.html',
    styles: [`.viewed {background-color:lightgray;}`,
        `.dh-table {border-spacing: 0 0em;}`,
        `.inner-table {border-collapse: separate; border-spacing: 0 0.3em;}`,
        `td .padding-right {padding: 0px 5px 0px 0px;}`]
})

export class StudentMyScholarships implements OnInit {
    studentName: string;
    member: StudentInterface;
    status: string;
    pageTitle: string = '';
    myScholarships: StudentScholarshipInterface[] = [];

    //fields to present in the strip
    myScholarshipFields: FieldInterface[] = [];

    sentences: SentenceByStatusInterface = {
        Pending: {
            titleSentenceSingle: 'pending scholarship',
            titleSentencePlural: 'pending scholarships',
            dateStatusSentence: 'Applied'
        },
        Approved: {
            titleSentenceSingle: 'approved scholarship',
            titleSentencePlural: 'approved scholarship',
            dateStatusSentence: 'Approved'
        },
        Declined: {
            titleSentenceSingle: 'declined scholarship',
            titleSentencePlural: 'declined scholarships',
            dateStatusSentence: 'Declined'
        }
    }

    constructor(public nav: NavController, navParams: NavParams, private messageServices: MessageServices, private memberServices: MemberServices, private pageService: PageService) {
        this.status = navParams.get("status");
        this.studentName = this.pageService.getStudent().familyName;
        this.member = this.pageService.getStudent();
    }

    ngOnInit() {
        this.myScholarshipFields = [{
            name: "scholarshipName",
            id: "scholarshipNameTxt",
            text: "Name"
        },
        {
            name: "scholarship.info.applicationDeadline",
            id: "deadlineDateDate",
            formatter: getFormattedDate,
            text: "Deadline"
        },
        {
            name: "updateDate",
            id: "updateDateDate",
            formatter: getFormattedDate
        }
        ];

        this.memberServices.getStudentOffersByStatus(this.member.email, this.status, OfferType.scholarship).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        this.myScholarships = res.appliedScholarships;
                        break;

                    default:
                        console.error('Failed to load my Scholarships data by status. Error code: ' + res.code);
                }
            },
            err => {
                console.error('Failed to load my Scholarships data by status');
                console.error(err);
            }
        )
    }

    loadStudentScholarship = (index: number): void => {
        this.nav.push(StudentScholarshipPage, { studentScholarship: this.myScholarships[index] });
    }

    ionSelected() {
        //resolves the double tap on tab issue in mobile mode
    }
}