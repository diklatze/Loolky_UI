import { Component, OnInit } from '@angular/core';
import { getFormattedDate } from '../../utils/utils';
import { MemberInterface } from '../interfaces/member.interface';
import { NavController, NavParams } from 'ionic-angular';
import { StudentLoanInterface } from '../interfaces/loan.interface';
import { MessageServices } from '../../services/message.services';
import { MemberServices } from '../../services/member.services';
import { StudentLoanPage } from './studentLoanPage.component';
import { PageService } from '../pageHeader/page.service';
import { FieldInterface } from '../interfaces/uiElements/field.interface';
import { ViewedTypeEnum } from '../interfaces/types.interface';
import { StudentServices } from '../../services/student.services';
import { Constants } from '../../utils/constans';
import { StudentInterface } from '../interfaces/student.interface';

@Component({
    selector: 'appliedLoans',
    templateUrl: 'appliedLoans.component.html',
    styles: [`.viewed {background-color:lightgray;}`,
        `.dh-table {border-spacing: 0 0em;}`,
        `.inner-table {border-collapse: separate; border-spacing: 0 0.3em;}`,
        `td .padding-right {padding: 0px 5px 0px 0px;}`],
    providers: [StudentServices]
})

export class AppliedLoans implements OnInit {
    pageTitle: string;
    pageTitleCounter: number;
    hideHeader: boolean = false;

    govermentName: string;
    member: MemberInterface;
    appliedLoans: StudentLoanInterface[] = <[StudentLoanInterface]>[];

    //fields to present in the strip
    appliedLoanFields: [FieldInterface] = <[FieldInterface]>[];

    student: StudentInterface = <StudentInterface>{};

    updateMode: boolean;

    constructor(public nav: NavController, navParams: NavParams, private messageServices: MessageServices, private memberServices: MemberServices, private pageService: PageService, private studentServices: StudentServices) {
        this.govermentName = this.pageService.getMember().fullName;
        this.member = this.pageService.getMember();
        this.setPageHeaderTitle();
        this.student = navParams.get('student');
        this.updateMode = navParams.get('updateMode') === true;
        this.hideHeader = navParams.get('hideHeader') === true;
    }

    ionViewWillEnter() {
        //set page header each time this page is shown
        this.appliedLoans = this.appliedLoans.filter((studentLoan: StudentLoanInterface, index: number, array: StudentLoanInterface[]) => {
            return studentLoan.viewed != ViewedTypeEnum.SUBMITTED;
        });

        this.setPageHeaderTitle();
    }

    ngOnInit() {
        this.appliedLoanFields = [{
            name: "studentName",
            id: "studentNameTxt",
            text: "Student name"
        }, {
            name: "educationalInstitution",
            id: "educationalInstitutionTxt",
            text: "EI"
        }, {
            name: "loanApplyDate",
            id: "loanApplyDateDate",
            formatter: getFormattedDate,
            text: "Apply date"
        }];

        if (this.member && this.student && this.member.memberType == Constants.MEMBER_TYPES[1].type) {
            this.studentServices.getAppliedLoans(this.student.email).subscribe(
                res => {
                    switch (res.code) {
                        case 0:
                            this.appliedLoans = res.appliedLoans;
                            break;

                        default:
                            console.error('Failed to load applied Loan data. Error code: ' + res.code);
                    }
                    this.setPageHeaderTitle();
                },
                err => {
                    console.error('Failed to load Eligible Loan data');
                    console.error(err);
                }
            )
        }
        else {
            this.memberServices.getAppliedLoans(this.member.shortName, 0).subscribe(
                res => {
                    switch (res.code) {
                        case 0:
                            this.appliedLoans = res.appliedLoans;
                            break;

                        default:
                            console.error('Failed to load applied Loan data. Error code: ' + res.code);
                    }
                    this.setPageHeaderTitle();
                },
                err => {
                    console.error('Failed to load Eligible Loan data');
                    console.error(err);
                }
            )

        }
    }

    loadStudentLoan = (index: number): void => {
        this.nav.push(StudentLoanPage, { studentLoan: this.appliedLoans[index], updateMode: this.updateMode, hideHeader: this.hideHeader }).then(() => {
            this.appliedLoans[index].viewed = ViewedTypeEnum.VIEWED;
        });
    }

    setPageHeaderTitle(): void {
        this.pageTitle = this.govermentName + " - Loan requests statuses";
        this.pageTitleCounter = this.appliedLoans ? this.appliedLoans.length : 0;
    }
}

