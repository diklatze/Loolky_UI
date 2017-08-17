import { Component, OnInit } from '@angular/core';
import { getFormattedDate } from '../../utils/utils';
import { MemberInterface } from '../interfaces/member.interface';
import { FieldInterface } from '../interfaces/uiElements/field.interface';
import { NavController, NavParams } from 'ionic-angular';
import { StudentScholarshipInterface } from '../interfaces/scholarship.interface';
import { ViewedTypeEnum } from '../interfaces/types.interface';
import { MessageServices } from '../../services/message.services';
import { MemberServices } from '../../services/member.services';
import { StudentServices } from '../../services/student.services';
import { PageService } from '../pageHeader/page.service';
import { StudentScholarshipPage } from './studentScholarshipPage.component';
import { Constants } from '../../utils/constans';
import { StudentInterface } from '../interfaces/student.interface';

@Component({
    selector: 'appliedScholarships',
    templateUrl: 'appliedScholarships.component.html',
    styles: [`.viewed {background-color:lightgray;}`,
        `.dh-table {border-spacing: 0 0em;}`,
        `.inner-table {border-collapse: separate; border-spacing: 0 0.3em;}`,
        `td .padding-right {padding: 0px 5px 0px 0px;}`],
    providers: [StudentServices]
})

export class AppliedScholarships implements OnInit {
    pageTitle: string;
    pageTitleCounter: number;
    hideHeader: boolean = false;

    govermentName: string;
    member: MemberInterface;
    appliedScholarships: StudentScholarshipInterface[] = <[StudentScholarshipInterface]>[];
    student: StudentInterface = <StudentInterface>{};

    //fields to present in the strip
    fieldsForStripRepresentation: [FieldInterface] = <[FieldInterface]>[];
    updateMode: boolean;

    constructor(public nav: NavController, navParams: NavParams, private messageServices: MessageServices, private memberServices: MemberServices,
        private studentServices: StudentServices, private pageService: PageService) {
        this.govermentName = this.pageService.getMember().fullName;
        this.member = this.pageService.getMember();
        this.setPageHeaderTitle();

        this.student = navParams.get('student');
        this.updateMode = navParams.get('updateMode') === true;
        this.hideHeader = navParams.get('hideHeader') === true;
    }

    ionViewWillEnter() {
        //set page header each time this page is shown
        this.appliedScholarships = this.appliedScholarships.filter((studentScholarship: StudentScholarshipInterface, index: number, array: StudentScholarshipInterface[]) => {
            return studentScholarship.viewed != ViewedTypeEnum.SUBMITTED;
        });

        this.setPageHeaderTitle();
    }

    ngOnInit() {
        this.fieldsForStripRepresentation =
            [
                {
                    name: "studentId",
                    id: "studentIdTxt",
                    text: "Student email"
                },
                {
                    name: "applyDate",
                    id: "applyDateDate",
                    formatter: getFormattedDate,
                    text: "Apply date"
                }
            ];

        if (this.member && this.student && this.member.memberType == Constants.MEMBER_TYPES[1].type) {

            this.studentServices.getAppliedScholarships(this.student.email).subscribe(
                res => {
                    switch (res.code) {
                        case 0:

                            this.appliedScholarships = res.appliedScholarships;
                            break;

                        default:
                            console.error('Failed to load applied Scholarship data. Error code: ' + res.code);
                    }
                    this.setPageHeaderTitle();
                },
                err => {
                    console.error('Failed to load applied scholarship data');
                    console.error(err);
                }
            )
        }
        else {
            this.memberServices.getAppliedScholarships(this.member.shortName).subscribe(
                res => {
                    switch (res.code) {
                        case 0:
                            this.appliedScholarships = res.appliedScholarships;
                            break;

                        default:
                            console.error('Failed to load applied Scholarship data. Error code: ' + res.code);
                    }
                    this.setPageHeaderTitle();
                },
                err => {
                    console.error('Failed to load applied scholarship data');
                    console.error(err);
                }
            )
        }

    }

    loadStudentScholarship = (index: number): void => {
        this.nav.push(StudentScholarshipPage, { studentScholarship: this.appliedScholarships[index], updateMode: this.updateMode ,hideHeader: this.hideHeader }).then(() => {
            this.appliedScholarships[index].viewed = ViewedTypeEnum.VIEWED;
        });
    }

    setPageHeaderTitle(): void {
        this.pageTitle = this.govermentName + " - Scholarship requests statuses";
        this.pageTitleCounter = this.appliedScholarships ? this.appliedScholarships.length : 0;
    }
}

