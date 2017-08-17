import { Component, OnInit } from '@angular/core';
import { getFormattedDate } from '../../utils/utils';
import { MemberInterface } from '../interfaces/member.interface';
import { FieldInterface } from '../interfaces/uiElements/field.interface';
import { NavController, NavParams } from 'ionic-angular';
import { StudentJobOfferInterface } from '../interfaces/jobOffer.interface';
import { ViewedTypeEnum } from '../interfaces/types.interface';
import { MessageServices } from '../../services/message.services';
import { MemberServices } from '../../services/member.services';
import { PageService } from '../pageHeader/page.service';
import { StudentJobOfferPage } from './studentJobOfferPage.component';

@Component({
    selector: 'appliedJobOffers',
    templateUrl: 'appliedJobOffers.component.html',
    styles: [`.viewed {background-color:lightgray;}`,
        `.dh-table {border-spacing: 0 0em;}`,
        `.inner-table {border-collapse: separate; border-spacing: 0 0.3em;}`,
        `td .padding-right {padding: 0px 5px 0px 0px;}`]
})

export class AppliedJobOffers implements OnInit {
    pageTitle: string;
    pageTitleCounter: number;

    organizationName: string;
    member: MemberInterface;
    appliedJobOffers: StudentJobOfferInterface[] = <[StudentJobOfferInterface]>[];

    //fields to present in the strip
    fieldsForStripRepresentation: [FieldInterface] = <[FieldInterface]>[];

    constructor(public nav: NavController, navParams: NavParams, private messageServices: MessageServices, private memberServices: MemberServices, private pageService: PageService) {
        this.organizationName = this.pageService.getMember().fullName;
        this.member = this.pageService.getMember();
        this.setPageHeaderTitle();
    }

    ionViewWillEnter() {
        //set page header each time this page is shown
        this.appliedJobOffers = this.appliedJobOffers.filter((studentJobOffer: StudentJobOfferInterface, index: number, array: StudentJobOfferInterface[]) => {
            return studentJobOffer.viewed != ViewedTypeEnum.SUBMITTED;
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

        this.memberServices.getAppliedJobOffers(this.member.shortName).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        this.appliedJobOffers = res.appliedJobOffers;
                        break;

                    default:
                        console.error('Failed to load applied Job Offer data. Error code: ' + res.code);
                }
                this.setPageHeaderTitle();
            },
            err => {
                console.error('Failed to load applied Job Offer data');
                console.error(err);
            }
        )
    }

    loadStudentJobOffer = (index: number): void => {
        this.nav.push(StudentJobOfferPage, { studentJobOffer: this.appliedJobOffers[index] }).then(() => {
            this.appliedJobOffers[index].viewed = ViewedTypeEnum.VIEWED;
        });
    }

    setPageHeaderTitle(): void {
        this.pageTitle = this.organizationName + " - Job Offer requests statuses";
        this.pageTitleCounter = this.appliedJobOffers ? this.appliedJobOffers.length : 0;
    }
}