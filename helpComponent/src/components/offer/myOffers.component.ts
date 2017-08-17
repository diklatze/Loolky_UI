import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { PageService } from '../pageHeader/page.service';
import { ScholarshipInterface } from '../interfaces/scholarship.interface';
import { LoanTypeInterface } from '../interfaces/loan.interface';
import { JobOfferInterface } from '../interfaces/jobOffer.interface';
import { AddOffer } from '../offer/addOffer.component';
import { MemberServices } from '../../services/member.services';
import { OfferType, OfferTransactionState } from '../interfaces/offer.interface';
import { ColumnInterface, PageInterface, FilterInterface, MultiSelectionItemInterface } from '../interfaces/uiElements/dataGrid.interface';
import { getDefaultLoadinOptions } from '../../utils/utils';

@Component({
    selector: 'myOffers',
    templateUrl: 'myOffers.component.html'
})
export class MyOffers {
    pageTitle: string;
    offerType: OfferType;

    errMessages: any[] = null;
    offers: ScholarshipInterface[] | LoanTypeInterface[] | JobOfferInterface[];

    multiSelectionTransactionState: MultiSelectionItemInterface[] = [
        { value: '' + OfferTransactionState.failed, desc: '' + OfferTransactionState.failed },
        { value: '' + OfferTransactionState.new, desc: '' + OfferTransactionState.new },
        { value: '' + OfferTransactionState.published, desc: '' + OfferTransactionState.published }
    ];

    commonColumns: ColumnInterface[] = [
        {
            title: 'Transaction state',
            fieldName: 'transactionState.state',
            fieldType: 'multiSelection',
            multiSelectionList: this.multiSelectionTransactionState
        },
        {
            title: 'Name',
            fieldName: 'info.name',
            fieldType: 'string'
        }
    ];

    columnsByOfferType: { [index: string]: ColumnInterface[] } = {
        [OfferType.loanType]: this.commonColumns.concat([
            {
                title: 'Open date',
                fieldName: 'info.openDate',
                fieldType: 'Date'
            },
            {
                title: 'Deadline',
                fieldName: 'info.deadlineDate',
                fieldType: 'Date'
            }
        ]),
        [OfferType.scholarship]: this.commonColumns.concat([
            {
                title: 'Open date',
                fieldName: 'info.openDate',
                fieldType: 'Date'
            },
            {
                title: 'Application deadline',
                fieldName: 'info.applicationDeadline',
                fieldType: 'Date'
            }
        ]),
        [OfferType.jobOffer]: this.commonColumns.concat([
            {
                title: 'Job brief',
                fieldName: 'info.jobBrief',
                fieldType: 'string',
                customFormatter: this.max50characters
            },
            {
                title: 'Requirements',
                fieldName: 'info.requirements',
                fieldType: 'string',
                customFormatter: this.max50characters
            }
        ])
    }

    pageInfo: PageInterface = {
        number: 1,
        size: 10
    }

    constructor(private nav: NavController, private pageService: PageService, private memberServices: MemberServices, private navParams: NavParams, private loadingCtrl: LoadingController) {
        this.offerType = navParams.get("offerType");
        this.setPageTitle();
    }

    max50characters(value: string): string {
        const maxLength: number = 50;

        if (!value || value.length <= maxLength) {
            return value;
        }

        return value.substr(0, maxLength) + '...';
    }

    setPageTitle() {
        let pageTitleByOfferType: { [index: string]: string } = {
            [OfferType.scholarship]: " - Scholarships",
            [OfferType.loanType]: " - Loans",
            [OfferType.jobOffer]: " - Job Offers"
        };
        this.pageTitle = this.pageService.getMember().fullName + pageTitleByOfferType[this.offerType];
    }

    ionViewWillEnter() {
        this.getOffers();
    }

    getOffers() {
        this.errMessages = null;

        let loading = this.loadingCtrl.create(getDefaultLoadinOptions());

        loading.present();

        let repoByOfferType: { [index: string]: string } = {
            [OfferType.loanType]: 'loantypes',
            [OfferType.scholarship]: 'scholarships',
            [OfferType.jobOffer]: 'joboffers'
        }

        this.memberServices.getMemberPageableData(this.pageService.getMember().shortName, repoByOfferType[this.offerType], this.pageInfo).subscribe(
            res => {
                if (res.code == 0) {
                    this.offers = res.page.content;
                    this.pageInfo = res.page;
                }
                else {
                    this.errMessages = res.errors;
                }

                loading.dismiss();
            },
            err => {
                this.errMessages = [{ "fieldName": "non_field", "errorCode": "", "errorDescription": err }];
                loading.dismiss();
            });
    }

    onPagingEvent(pageInfo: PageInterface) {
        this.pageInfo.number = pageInfo.number;
        this.pageInfo.filter = pageInfo.filter;
        this.pageInfo.sort = pageInfo.sort;
        this.pageInfo.size = pageInfo.size;
        this.getOffers();
    }

    onRefresh(pageInfo: PageInterface) {
        this.pageInfo.filter = pageInfo.filter;
        this.pageInfo.sort = pageInfo.sort;
        this.pageInfo.size = pageInfo.size;
        this.pageInfo.number = 1;
        this.getOffers();
    }

    onRowDoubleClick(row: ScholarshipInterface | LoanTypeInterface | JobOfferInterface) {
        let readOnly: boolean = (row.transactionState.state == OfferTransactionState.failed || row.transactionState.state == OfferTransactionState.published);
        this.nav.push(AddOffer, { offer: row, offerType: this.offerType, readOnly: readOnly });
    }

    cellMarkFunction(row: ScholarshipInterface | LoanTypeInterface | JobOfferInterface, fieldName: string): '' | 'warning' | 'positive' | 'negative' {
        if (!row.transactionState) {
            return '';
        }

        let markClassByOfferStatus: { [index: string]: '' | 'warning' | 'positive' | 'negative' } = {
            [OfferTransactionState.new]: 'warning',
            [OfferTransactionState.published]: '',
            [OfferTransactionState.failed]: 'negative'
        }

        let markClass: '' | 'warning' | 'positive' | 'negative' = markClassByOfferStatus[row.transactionState.state];
        return markClass === undefined ? '' : markClass;
    }
}
