import { Component, ViewChild } from '@angular/core';
import { ScholarshipInterface } from '../interfaces/scholarship.interface';
import { ViewedTypeEnum } from '../interfaces/types.interface';
import { NavController, NavParams } from 'ionic-angular';
import { PageResolver } from '../../utils/page.resolver';
import { Constants } from '../../utils/constans';
import { MemberServices } from '../../services/member.services';
import { MessageServices } from '../../services/message.services';
import { ActionsInterface, ModalMessage } from '../modalMessage/modalMessage.component';
import { PageService } from '../pageHeader/page.service';
import { ButtonsInterface } from '../interfaces/uiElements/buttons.interface';
import { Scholarship } from './scholarship.component';
import { isContainsNonMappingDynamicFields } from '../interfaces/offer.interface';

@Component({
    selector: 'scholarshipPage',
    templateUrl: 'scholarshipPage.component.html',
})
export class ScholarshipPage {
    pageTitle: string = "Scholarship Details";
    @ViewChild('scholarshipRef') scholarshipComponent: Scholarship;

    //modal message related
    actions: ActionsInterface = null;
    messageContent: string = null;
    messageModalShown: boolean = false;

    scholarship: ScholarshipInterface;
    buttons: ButtonsInterface;

    isMobile: boolean;
    username: string;

    constructor(navParams: NavParams, private nav: NavController, pageResolver: PageResolver, private memberServices: MemberServices, private messageServices: MessageServices, private pageService: PageService) {
        this.isMobile = pageResolver.isMobile();
        this.username = this.pageService.getStudent().email;
        this.scholarship = navParams.get("scholarship");

        this.buttons =
            [{
                caption: 'Save',
                id: 'saveBtn',
                class: 'blue',
                disabled: !isContainsNonMappingDynamicFields(this.scholarship),
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
        this.memberServices.applyScholarship(this.scholarship.organization, this.scholarship.info.name, this.username, this.scholarshipComponent.getDynamicFieldsValues()).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        this.showModal(Constants.MESSAGE_REQUEST_SUCCESSFULLY_SENT, this.popView);
                        this.scholarship.viewed = ViewedTypeEnum.SUBMITTED;
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
                        console.error('Failed to get Apply Scholarship data. Error code: ' + res.code);
                }
            },
            err => {
                this.showModal(Constants.MESSAGE_UNKNOWN_ERROR, this.popView);
                console.error('Failed to get Apply Scholarship data');
                console.error(err);
            }
        )
    }

    saveDraft = (): void => {
        this.memberServices.saveStudentDrafts(this.scholarship.contractAddress, this.username, this.scholarshipComponent.getDynamicFieldsValues()).subscribe(
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
                        console.error('Failed to save Scholarship data. Error code: ' + res.code);
                }
            },
            err => {
                this.showModal(Constants.MESSAGE_UNKNOWN_ERROR, this.popView);
                console.error('Failed save Scholarship data');
                console.error(err);
            }
        )
    }





}