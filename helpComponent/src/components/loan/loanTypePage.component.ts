import { Component, ViewChild } from '@angular/core';
import { LoanTypeInterface } from '../interfaces/loan.interface';
import { ViewedTypeEnum } from '../interfaces/types.interface';
import { NavController, NavParams } from 'ionic-angular';
import { PageResolver } from '../../utils/page.resolver';
import { UserType, Constants } from '../../utils/constans';
import { MemberServices } from '../../services/member.services';
import { MessageServices } from '../../services/message.services';
import { ActionsInterface, ModalMessage } from '../modalMessage/modalMessage.component';
import { PageService } from '../pageHeader/page.service';
import { ButtonsInterface } from '../interfaces/uiElements/buttons.interface';
import { LoanType } from '../loan/loanType.component';
import { isContainsNonMappingDynamicFields } from '../interfaces/offer.interface';

@Component({
    selector: 'loanTypePage',
    templateUrl: 'loanTypePage.component.html',
})
export class LoanTypePage {
    @ViewChild('loanTypeRef') loanTypeComponent: LoanType;

    pageTitle: string = "Loan Details";

    //modal message related
    actions: ActionsInterface = null;
    messageContent: string = null;
    messageModalShown: boolean = false;

    loanType: LoanTypeInterface;
    buttons: ButtonsInterface;

    isMobile: boolean;
    username: string;

    constructor(navParams: NavParams, private nav: NavController, pageResolver: PageResolver, private memberServices: MemberServices, private messageServices: MessageServices, private pageService: PageService) {
        this.isMobile = pageResolver.isMobile();
        if (this.pageService.getUsertype() == UserType.Student.toString()) {
            this.username = this.pageService.getStudent().email;
        }
        else if (this.pageService.getUsertype() == UserType.Government.toString()) {
            this.username = this.pageService.getMember().shortName;
        }
        this.loanType = navParams.get("loanType");

        this.buttons =
            [{
                caption: 'Save',
                id: 'saveBtn',
                class: 'blue',
                disabled: !isContainsNonMappingDynamicFields(this.loanType),
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
        this.memberServices.applyLoan(this.loanType.info.govId, this.loanType.info.loanCode, this.username, this.loanTypeComponent.getDynamicFieldsValues()).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        this.showModal(Constants.MESSAGE_REQUEST_SUCCESSFULLY_SENT, this.popView);
                        this.loanType.viewed = ViewedTypeEnum.SUBMITTED;
                        break;

                    case 597:
                        this.showModal(Constants.MESSAGE_STUDENT_IS_NOT_ELIGIBLE_FOR_LOAN, this.popView);
                        break;

                    //Loan type is not eligible    
                    case 593:
                        this.showModal(Constants.MESSAGE_LOANTYPE_NOT_ELIGIBLE, this.popView);
                        break;

                    //Government is not valid
                    case 594:
                        this.messageServices.getMessage(Constants.MESSAGE_GOVERNMENT, (resultMessage: string) => {
                            this.showModal(Constants.MESSAGE_IS_NOT_VALID, this.popView, [resultMessage]);
                        });
                        break;

                    //Student is not valid
                    case 595:
                        this.messageServices.getMessage(Constants.MESSAGE_STUDENT, (resultMessage: string) => {
                            this.showModal(Constants.MESSAGE_IS_NOT_VALID, this.popView, [resultMessage]);
                        });
                        break;

                    //Apply request is not valid
                    case 596:
                        this.messageServices.getMessage(Constants.MESSAGE_APPLY_REQUEST, (resultMessage: string) => {
                            this.showModal(Constants.MESSAGE_IS_NOT_VALID, this.popView, [resultMessage]);
                        });
                        break;

                    default:
                        this.showModal(Constants.MESSAGE_UNKNOWN_ERROR, this.popView);
                        console.error('Failed to get Apply Loan data. Error code: ' + res.code);
                }
            },
            err => {
                this.showModal(Constants.MESSAGE_UNKNOWN_ERROR, this.popView);
                console.error('Failed to get Apply Loan data');
                console.error(err);
            }
        )
    }


    saveDraft = (): void => {
        this.memberServices.saveStudentDrafts(this.loanType.contractAddress, this.username, this.loanTypeComponent.getDynamicFieldsValues()).subscribe(
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
                        console.error('Failed to save loan type data. Error code: ' + res.code);
                }
            },
            err => {
                this.showModal(Constants.MESSAGE_UNKNOWN_ERROR, this.popView);
                console.error('Failed save loan type data');
                console.error(err);
            }
        )
    }

}