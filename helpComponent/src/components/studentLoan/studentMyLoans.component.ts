import { Component, OnInit } from '@angular/core';
import { getFormattedDate } from '../../utils/utils';
import { StudentInterface } from '../interfaces/student.interface';
import { NavController, NavParams } from 'ionic-angular';
import { StudentLoanInterface } from '../interfaces/loan.interface';
import { ViewedTypeEnum } from '../interfaces/types.interface';
import { MessageServices } from '../../services/message.services';
import { MemberServices } from '../../services/member.services';
import { StudentLoanPage } from './studentLoanPage.component';
import { PageService } from '../pageHeader/page.service';
import { FieldInterface } from '../interfaces/uiElements/field.interface';
import { SentenceByStatusInterface } from '../interfaces/sentence.interface';
import { OfferType } from '../interfaces/offer.interface';

@Component({
    selector: 'studentMyLoans',
    templateUrl: 'studentMyLoans.component.html',
    styles: [`.viewed {background-color:lightgray;}`,
        `.dh-table {border-spacing: 0 0em;}`,
        `.inner-table {border-collapse: separate; border-spacing: 0 0.3em;}`,
        `td .padding-right {padding: 0px 5px 0px 0px;}`]
})

export class StudentMyLoans implements OnInit {
    studentName: string;
    member: StudentInterface;
    status: string;
    pageTitle: string = '';
    myLoans: StudentLoanInterface[] = [];

    //fields to present in the strip
    myLoanFields: FieldInterface[] = [];

    sentences: SentenceByStatusInterface = {
        Pending: {
            titleSentenceSingle: 'published loan',
            titleSentencePlural: 'published loans',
            dateStatusSentence: 'Applied'
        },
        Approved: {
            titleSentenceSingle: 'approved loan',
            titleSentencePlural: 'approved loans',
            dateStatusSentence: 'Approved'
        },
        Declined: {
            titleSentenceSingle: 'declined loan',
            titleSentencePlural: 'declined loans',
            dateStatusSentence: 'Declined'
        }
    }

    constructor(public nav: NavController, navParams: NavParams, private messageServices: MessageServices, private memberServices: MemberServices, private pageService: PageService) {
        this.status = navParams.get("status");
        this.studentName = this.pageService.getStudent().familyName;
        this.member = this.pageService.getStudent();
    }

    ngOnInit() {
        this.myLoanFields = [{
            name: "loanType.info.name",
            id: "loanNameTxt",
            text: "Name"
        },
        {
            name: "loanType.info.deadlineDate",
            id: "deadlineDateDate",
            formatter: getFormattedDate,
            text: "Deadline"
        },
        {
            name: "updateDate",
            id: "updateDateDate",
            formatter: getFormattedDate
        }];

        this.memberServices.getStudentOffersByStatus(this.member.email, this.status, OfferType.loanType).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        this.myLoans = res.appliedLoans;
                        break;

                    default:
                        console.error('Failed to load my Loans data by status. Error code: ' + res.code);
                }
            },
            err => {
                console.error('Failed to load my Loans data by status');
                console.error(err);
            }
        )
    }

    loadStudentLoan = (index: number): void => {
        this.nav.push(StudentLoanPage, { studentLoan: this.myLoans[index] });
    }

    ionSelected() {
        //resolves the double tap on tab issue in mobile mode
    }
}