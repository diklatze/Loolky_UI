import { Component, ViewChild } from '@angular/core';
import { JobOfferInterface } from '../interfaces/jobOffer.interface';
import { ViewedTypeEnum } from '../interfaces/types.interface';
import { NavController, NavParams } from 'ionic-angular';
import { PageResolver } from '../../utils/page.resolver';
import { Constants } from '../../utils/constans';
import { MemberServices } from '../../services/member.services';
import { MessageServices } from '../../services/message.services';
import { ActionsInterface, ModalMessage } from '../modalMessage/modalMessage.component';
import { PageService } from '../pageHeader/page.service';
import { ButtonsInterface } from '../interfaces/uiElements/buttons.interface';
import { JobOffer } from './jobOffer.component';
import { isContainsNonMappingDynamicFields } from '../interfaces/offer.interface';

@Component({
    selector: 'jobOfferPage',
    templateUrl: 'jobOfferPage.component.html',
})
export class JobOfferPage {
    pageTitle: string = "Job Offer Details";
    @ViewChild('jobOfferRef') jobOfferComponent: JobOffer;

    //modal message related
    actions: ActionsInterface = null;
    messageContent: string = null;
    messageModalShown: boolean = false;

    jobOffer: JobOfferInterface;
    buttons: ButtonsInterface;

    isMobile: boolean;
    username: string;

    constructor(navParams: NavParams, private nav: NavController, pageResolver: PageResolver, private memberServices: MemberServices, private messageServices: MessageServices, private pageService: PageService) {
        this.isMobile = pageResolver.isMobile();
        this.username = this.pageService.getStudent().email;
        this.jobOffer = navParams.get("jobOffer");

        this.buttons =
            [{
                caption: 'Save',
                id: 'saveBtn',
                class: 'blue',
                disabled: !isContainsNonMappingDynamicFields(this.jobOffer),
                onClick: this.saveDraft,
            },
            {
                caption: 'Apply',
                id: 'applyBtn',
                class: 'blue',
                onClick: this.apply,
            }];
    }

    showModal = (messageId: string, callbackFunction: Function, messageParameters?: [string]): void => {
        this.messageServices.getMessage(messageId, (resultMessage: string) => { this.messageContent = resultMessage }, undefined, messageParameters);
        this.actions = ModalMessage.getModalActionsOKPattern(callbackFunction); //get actions for modal message screen
        this.messageModalShown = true; //show the modal
    }

    popView = (): void => {
        this.messageModalShown = false;
        this.nav.pop();
    }

    apply = (): void => {
        this.memberServices.applyJobOffer(this.jobOffer.organization, this.jobOffer.info.name, this.username, this.jobOfferComponent.getDynamicFieldsValues()).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        this.showModal(Constants.MESSAGE_REQUEST_SUCCESSFULLY_SENT, this.popView);
                        this.jobOffer.viewed = ViewedTypeEnum.SUBMITTED;
                        break;

                    //Request validation failed
                    case 585:
                        this.messageServices.getMessage(Constants.MESSAGE_NO_CHANGES_WERE_DONE, (resultMessage: string) => {
                            this.showModal(Constants.MESSAGE_NO_CHANGES_WERE_DONE, this.popView, [resultMessage]);
                        });
                        break;

                    //Student is not valid
                    case 595:
                        this.messageServices.getMessage(Constants.MESSAGE_STUDENT, (resultMessage: string) => {
                            this.showModal(Constants.MESSAGE_IS_NOT_VALID, this.popView, [resultMessage]);
                        });
                        break;

                    default:
                        this.showModal(Constants.MESSAGE_UNKNOWN_ERROR, this.popView);
                        console.error('Failed to get Apply Job Offer data. Error code: ' + res.code);
                }
            },
            err => {
                this.showModal(Constants.MESSAGE_UNKNOWN_ERROR, this.popView);
                console.error('Failed to get Apply Job Offer data');
                console.error(err);
            }
        )
    }


    saveDraft = (): void => {
        this.memberServices.saveStudentDrafts(this.jobOffer.contractAddress, this.username, this.jobOfferComponent.getDynamicFieldsValues()).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        this.showModal(Constants.MESSAGE_REQUEST_SUCCESSFULLY_SENT, this.popView);
                        break;

                    //Request validation failed
                    case 585:
                        this.messageServices.getMessage(Constants.MESSAGE_NO_CHANGES_WERE_DONE, (resultMessage: string) => {
                            this.showModal(Constants.MESSAGE_NO_CHANGES_WERE_DONE, this.popView, [resultMessage]);
                        });
                        break;

                    //Student is not valid
                    case 595:
                        this.messageServices.getMessage(Constants.MESSAGE_STUDENT, (resultMessage: string) => {
                            this.showModal(Constants.MESSAGE_IS_NOT_VALID, this.popView, [resultMessage]);
                        });
                        break;

                    default:
                        this.showModal(Constants.MESSAGE_UNKNOWN_ERROR, this.popView);
                        console.error('Failed to save Job Offer data. Error code: ' + res.code);
                }
            },
            err => {
                this.showModal(Constants.MESSAGE_UNKNOWN_ERROR, this.popView);
                console.error('Failed save Job Offer data');
                console.error(err);
            }
        )
    }


































}