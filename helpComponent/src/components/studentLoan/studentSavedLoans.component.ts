import { Component, OnInit } from '@angular/core';
import { getFormattedDate } from '../../utils/utils';
import { StudentInterface } from '../interfaces/student.interface';
import { NavController, NavParams } from 'ionic-angular';
import { LoanTypeInterface } from '../interfaces/loan.interface';
import { ViewedTypeEnum, StripModeEnum } from '../interfaces/types.interface';
import { MessageServices } from '../../services/message.services';
import { MemberServices } from '../../services/member.services';
import { PageService } from '../pageHeader/page.service';
import { LoanTypePage } from '../loan/loanTypePage.component';
import { LoanTypeCacheUtils } from '../loan/loanTypeCacheUtils';
import { FieldInterface } from '../interfaces/uiElements/field.interface';
import { SentenceInterface } from '../interfaces/sentence.interface'
import { OfferType } from '../interfaces/offer.interface';

@Component({
    selector: 'studentSavedLoans',
    templateUrl: 'studentSavedLoans.component.html',
    providers: [LoanTypeCacheUtils],
    styles: [`.viewed {background-color:lightgray;}`,
        `.dh-table {border-spacing: 0 0em;}`,
        `.inner-table {border-collapse: separate; border-spacing: 0 0.3em;}`,
        `td .padding-right {padding: 0px 5px 0px 0px;}`]
})

export class StudentSavedLoans implements OnInit {
    username: string;
    member: StudentInterface;
    pageTitle: string = '';
    pageTitleCounter: number = null;
    loanTypeStripMode: StripModeEnum = StripModeEnum.ELIGIBLE;

    loans: LoanTypeInterface[] = <[LoanTypeInterface]>[];

    //fields to present in the strip
    savedLoanFields: [FieldInterface] = <[FieldInterface]>[];

    sentences: SentenceInterface = {
        titleSentenceSingle: 'saved draft loan',
        titleSentencePlural: 'saved draft loans',
        dateStatusSentence: 'Saved'
    }


    constructor(public nav: NavController, navParams: NavParams, private messageServices: MessageServices,
        private memberServices: MemberServices, private pageService: PageService,
        private loanTypeCacheUtils: LoanTypeCacheUtils) {

        this.member = this.pageService.getStudent();
        this.username = this.pageService.getStudent().email;
    }

    ngOnInit() {
        this.savedLoanFields = [{
            name: "info.name",
            id: "loanName",
            text: "Name"
        },
        {
            name: "info.deadlineDate",
            id: "deadlineDate",
            formatter: getFormattedDate,
            text: "Deadline"
        },
        {
            name: "saveDate",
            id: "saveDate",
            formatter: getFormattedDate
        }];

        this.memberServices.getSavedDrafts(this.member.email, OfferType.loanType).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        this.loans = res.strips || [];
                        break;

                    default:
                        console.error('Failed to load saved loan data. Error code: ' + res.code);
                }
            },
            err => {
                console.error('Failed to load saved loan data');
                console.error(err);
            }
        )
    }

    loadLoan = (index: number): void => {
        this.nav.push(LoanTypePage, { loanType: this.loans[index] });
    }

    filterAndUpdate = (loanType?: LoanTypeInterface) => {
        var submittedLoan: LoanTypeInterface[] = <[LoanTypeInterface]>[];

        if (this.loans) {
            //filter submitted loan in order to remove it from cache
            submittedLoan = this.loans.filter((loan: LoanTypeInterface, index: number, array: LoanTypeInterface[]) => {
                return loan.viewed == ViewedTypeEnum.SUBMITTED;
            });
        }

        if (this.loans) {
            //filter out not saved loans
            this.loans = this.loans.filter((loan: LoanTypeInterface, index: number, array: LoanTypeInterface[]) => {
                return loan.saved && loan.viewed != ViewedTypeEnum.SUBMITTED;
            });
        }

        this.changePageTitleCounter();

        // update eligible loans cache
        if (loanType) {
            this.loanTypeCacheUtils.update(loanType);
        }
        else if (submittedLoan.length > 0) {
            this.loanTypeCacheUtils.update(submittedLoan[0]);
        }
    }

    ionViewWillEnter() {
        this.filterAndUpdate();
    }

    changePageTitleCounter(): void {
        this.pageTitleCounter = this.loans ? this.loans.length : 0;
    }

}