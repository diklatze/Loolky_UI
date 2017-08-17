import { FormComponent } from './formComponent.component';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SegmentButtonInterface } from '../interfaces/uiElements/buttons.interface';
import { NavController, Content, NavParams } from 'ionic-angular';
import { PageService } from '../pageHeader/page.service';
import { ScholarshipInterface } from '../interfaces/scholarship.interface';
import { LoanTypeInterface } from '../interfaces/loan.interface';
import { JobOfferInterface } from '../interfaces/jobOffer.interface';
import { MessageServices } from '../../services/message.services';
import { ModalMessage, ActionsInterface } from '../modalMessage/modalMessage.component';
import { Constants } from '../../utils/constans';
import { EligibilityOffer } from './eligibilityOffer.component';
import { TermsAndConditionsOffer } from './termsAndConditionsOffer.component';
import { MemberServices } from '../../services/member.services';
import { OfferType, idFieldNameByOfferType } from '../interfaces/offer.interface';
import { ViewedTypeEnum } from '../interfaces/types.interface';

interface OfferSegmentButtonsInterface extends SegmentButtonInterface {
    formComponent: FormComponent
}

@Component({
    selector: 'addOffer',
    templateUrl: 'addOffer.component.html',
    styles: [
        `.segment-ios .segment-button ion-icon {font-size: 1.8rem}` //tabs font size
    ]
})
export class AddOffer implements FormComponent, OnInit, AfterViewInit {
    pageTitle: string;

    private tabs: OfferSegmentButtonsInterface[];
    selectedTabIndex: number = 0;
    isSummaryMode: boolean = false;
    isButtonsDisabled: boolean = false;

    readOnlyMode: boolean = false;
    offerType: OfferType;

    OfferType = OfferType; //required in order to use it in the html template

    //modal message related
    actions: ActionsInterface = null;
    messageContent: string = null;
    messageModalShown: boolean = false;

    errMessages: any[] = null;

    @ViewChild("infoOffer") infoOffer: FormComponent; //InfoScholarship | InfoLoanType;
    @ViewChild("eligibilityOffer") eligibilityOffer: EligibilityOffer;
    @ViewChild("requiredInfoOffer") requiredInfoOffer: TermsAndConditionsOffer;

    @ViewChild("content") content: Content;

    constructor(private nav: NavController, private pageService: PageService, private messageServices: MessageServices,
        private memberServices: MemberServices, private navParams: NavParams) {
        this.offerType = navParams.get("offerType");
    }

    setPageTitle() {
        let pageTitleByOfferType = {
            [OfferType.scholarship]: " - Add Scholarship",
            [OfferType.loanType]: " - Add Loan Type",
            [OfferType.jobOffer]: " - Add Job Offer"
        };
        this.pageTitle = this.pageService.getMember().fullName + pageTitleByOfferType[this.offerType];
    }

    ngAfterViewInit() {
        //TODO: move the this.tabs definition here from ngOnInit() since this.infoOffer is not defined yet in ngOnInit(). 
        //Then remove the line below  
        this.tabs[0].formComponent = this.infoOffer;

        let offer: ScholarshipInterface | LoanTypeInterface | JobOfferInterface = this.navParams.get("offer");

        if (offer) {
            offer.info[idFieldNameByOfferType[this.offerType].origIdFieldName] = offer.info[idFieldNameByOfferType[this.offerType].idFieldName];
            this.readOnlyMode = this.navParams.get("readOnly") === true;
            this.setData(offer, this.readOnlyMode);
        }
    }

    setData(offer: ScholarshipInterface | LoanTypeInterface | JobOfferInterface, isReadOnlyMode: boolean) {
        this.infoOffer.setData(offer.info, isReadOnlyMode, offer.transactionState);
        this.eligibilityOffer.setData(offer.eligibility, isReadOnlyMode);
        this.requiredInfoOffer.setData(offer.requiredInfo, isReadOnlyMode);
    }

    ngOnInit() {
        this.setPageTitle();

        this.tabs = [
            { id: 'genericInfoBtn', value: '', iconName: 'information-circle', caption: 'Generic Info', onClick: () => { this.isSummaryMode = false; }, formComponent: this.infoOffer },
            { id: 'eligibilityBtn', value: '', iconName: 'paper', caption: 'Eligibility', onClick: () => { this.isSummaryMode = false; }, formComponent: this.eligibilityOffer },
            { id: 'requiredInfoBtn', value: '', iconName: 'people', caption: 'Required Info', onClick: () => { this.isSummaryMode = false; }, formComponent: this.requiredInfoOffer },
            { id: 'confirmBtn', value: '', iconName: 'checkmark-circle', caption: 'Confirm', onClick: () => { this.isSummaryMode = true; }, formComponent: null }
        ];
    }

    //loop on all the formComponent sub component and check if dirty
    //selects the invalid tab if exists
    isValid = (): boolean => {
        for (let i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].formComponent && !this.tabs[i].formComponent.isValid()) {
                this.selectedTabIndex = i;
                this.executeOnClick(this.tabs[this.selectedTabIndex].onClick);
                return false;
            }
        }

        return true;
    }

    //loop on all the formComponent sub component and check if dirty
    isDirty = (): boolean => {
        if (this.readOnlyMode) {
            return false;
        }

        for (let i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].formComponent && this.tabs[i].formComponent.isDirty()) {
                return true;
            }
        }

        return false;
    }

    getFormData = (): ScholarshipInterface | LoanTypeInterface | JobOfferInterface => {
        let offer: ScholarshipInterface | LoanTypeInterface | JobOfferInterface = <ScholarshipInterface | LoanTypeInterface | JobOfferInterface>{};
        //TODO: find a way to not use <any> but: <InfoScholarship | InfoLoanType | JobOfferInterface>
        offer.info = <any>this.infoOffer.getFormData();
        offer.eligibility = this.eligibilityOffer.getFormData();
        offer.requiredInfo = this.requiredInfoOffer.getFormData();

        return offer;
    }

    close = (): void => {
        if (this.isDirty()) {
            this.showModal(Constants.MESSAGE_CLOSE_PAGE, () => { this.messageModalShown = false; }, this.popBack);
        }
        else {
            this.nav.pop();
        }
    }

    showModal(messageId: string, callbackFunction1: Function, callbackFunction2?: Function, messageParameters?: [string]): void {
        this.messageServices.getMessage(messageId, (resultMessage: string) => { this.messageContent = resultMessage }, undefined, messageParameters);
        this.actions = ModalMessage.getModalActionsPattern(callbackFunction1, callbackFunction2); //get actions for modal message screen
        this.messageModalShown = true; //show the modal
    }

    private popBack = (): void => {
        this.messageModalShown = false; //close the modal
        this.nav.pop();
    }

    next = (): void => {
        if (this.selectedTabIndex < this.tabs.length - 1) {
            this.selectedTabIndex++;
            this.executeOnClick(this.tabs[this.selectedTabIndex].onClick);
        }
    }

    previous = (): void => {
        if (this.selectedTabIndex > 0) {
            this.selectedTabIndex--;
            this.executeOnClick(this.tabs[this.selectedTabIndex].onClick);
        }
    }

    executeOnClick(func: Function) {
        if (func) {
            func();
        }
    }

    clearFormData = (): void => {
        this.navParams.data = {}; //clear all navParams values
        this.readOnlyMode = false;

        for (let i = 0; i < this.tabs.length; i++) {
            if (this.tabs[i].formComponent) {
                this.tabs[i].formComponent.clearFormData();
            }
        }

        this.messageModalShown = false; //close the modal
        this.isButtonsDisabled = false;
        this.errMessages = null;
        this.selectedTabIndex = 0; //switch to the Info tab
        this.executeOnClick(this.tabs[this.selectedTabIndex].onClick);
    }

    inactivate = (): void => {
        this.errMessages = null;
        let offer: ScholarshipInterface | LoanTypeInterface | JobOfferInterface = this.getFormData();

        this.memberServices.closeOffer(this.pageService.getMember().shortName, offer, this.offerType).subscribe(
            res => {
                let messagesByOfferType: { [index: string]: { close: string } } = {
                    [OfferType.scholarship]: {
                        close: Constants.MESSAGE_SCHOLARSHIP_CLOSE_FOR_SUBMITION_SUCCESSFULLY,
                    },
                    [OfferType.loanType]: {
                        close: Constants.MESSAGE_LOANTYPE_CLOSE_FOR_SUBMITION_SUCCESSFULLY
                    },
                    [OfferType.jobOffer]: {
                        close: Constants.MESSAGE_JOBOFFER_CLOSE_FOR_SUBMITION_SUCCESSFULLY
                    }
                }
                switch (res.code) {
                    case 0:
                        offer.info.status = "Closed";
                        offer.viewed = ViewedTypeEnum.NOT_VIEWED;
                        //Mark offer as submitted
                        this.showModal(messagesByOfferType[this.offerType].close, this.popBack);
                        break;
                }
            }

        );


    }

    submit = (isSaveOnly?: boolean): void => {
        this.errMessages = null;

        if (isSaveOnly || this.isValid()) {
            let offer: ScholarshipInterface | LoanTypeInterface | JobOfferInterface = this.getFormData();
            this.isButtonsDisabled = true;
            let isLoadedFromSaved: boolean = (this.navParams.get("offer") != undefined && this.navParams.get("offer") != null);

            this.memberServices.submitOffer(this.pageService.getMember().shortName, offer, isSaveOnly, isLoadedFromSaved, this.offerType).subscribe(
                res => {
                    let messagesByOfferType: { [index: string]: { save: string, create: string, duplicate: string } } = {
                        [OfferType.scholarship]: {
                            save: Constants.MESSAGE_SCHOLARSHIP_SAVED_SUCCESSFULLY,
                            create: Constants.MESSAGE_SCHOLARSHIP_CREATED_SUCCESSFULLY,
                            duplicate: Constants.MESSAGE_DUPLICATE_SCHOLARSHIP_NAME
                        },
                        [OfferType.loanType]: {
                            save: Constants.MESSAGE_LOANTYPE_SAVED_SUCCESSFULLY,
                            create: Constants.MESSAGE_LOANTYPE_CREATED_SUCCESSFULLY,
                            duplicate: Constants.MESSAGE_DUPLICATE_LOAN_CODE
                        },
                        [OfferType.jobOffer]: {
                            save: Constants.MESSAGE_JOBOFFER_SAVED_SUCCESSFULLY,
                            create: Constants.MESSAGE_JOBOFFER_CREATED_SUCCESSFULLY,
                            duplicate: Constants.MESSAGE_DUPLICATE_JOBOFFER
                        }
                    }
                    switch (res.code) {
                        case 0:
                            //Mark offer as submitted
                            if (!isSaveOnly && isLoadedFromSaved) {
                                this.navParams.get("offer").viewed = ViewedTypeEnum.SUBMITTED;
                            }

                            this.showModal(isSaveOnly ? messagesByOfferType[this.offerType].save : messagesByOfferType[this.offerType].create, this.popBack, this.clearFormData);
                            break;

                        case 600:
                        case 607:
                            this.errMessages = [{ fieldName: "", errorCode: "600", errorDescription: "" }];
                            this.messageServices.getMessage(messagesByOfferType[this.offerType].duplicate, (resultMessage: string) => { this.errMessages[0].errorDescription = resultMessage });
                            this.content.scrollToTop();
                            this.isButtonsDisabled = false;
                            break;

                        default:
                            this.errMessages = res.errors;
                            this.content.scrollToTop();
                            this.isButtonsDisabled = false;
                    }
                },
                err => {
                    this.errMessages = [{ "fieldName": "non_field", "errorCode": "", "errorDescription": err }];
                    this.content.scrollToTop();
                    this.isButtonsDisabled = false;
                });
        }
    }
}
