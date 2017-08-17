import { Component } from '@angular/core';
import { MemberServices } from '../../services/member.services';
import { MemberInterface } from '../interfaces/member.interface';
import { MessageServices } from '../../services/message.services';
import { UserType, Constants, } from '../../utils/constans';
import { NavController, NavParams } from 'ionic-angular';
import { ModalMessage, ActionsInterface } from '../modalMessage/modalMessage.component';
import { PageResolver } from '../../utils/page.resolver';
import { PageService } from '../pageHeader/page.service'
import { ButtonsInterface } from '../interfaces/uiElements/buttons.interface';
import { StudentScholarshipInterface } from '../interfaces/scholarship.interface';
import { ViewedTypeEnum } from '../interfaces/types.interface';
import { FieldTypeEnum } from '../interfaces/fieldMetadata.interface';

@Component({
    selector: 'studentScholarshipPage',
    templateUrl: 'studentScholarshipPage.component.html',
    styles: [
        `.ui.huge.message.noshadow {margin: 0; min-height: 100%; box-shadow: none;}`,
        `.field-content {line-height: 98%;}`,
        `.grey-bar {background-color: lightgrey; font-size : 0.8em;}`,
    ]
})

export class StudentScholarshipPage {
    studentScholarship: StudentScholarshipInterface;
    member: MemberInterface;
    pageTitle: string;

    UserType = UserType;  //required in order to use it in the html template
    FieldTypeEnum = FieldTypeEnum; //required in order to use it in the html template

    //modal message related
    actions: ActionsInterface = null;
    messageContent: string = null;
    messageModalShown: boolean = false;
    header: string = null;

    isMobile: boolean;

    //comments related
    comments: string = '';
    isInvalidComments: boolean = false;

    approve: string = "approve";
    decline: string = "decline";

    requestSubmitted: boolean = false;
    userType: string;

    buttons: ButtonsInterface;
    updateMode: boolean;
    hideHeader: boolean = false;

    constructor(public nav: NavController, navParams: NavParams, private messageServices: MessageServices, private memberServices: MemberServices, pageResolver: PageResolver, private pageService: PageService) {
        this.member = this.pageService.getMember();
        this.studentScholarship = navParams.get("studentScholarship");
        this.isMobile = pageResolver.isMobile();
        this.userType = pageService.getUsertype();

        if (this.userType == UserType.Student.toString()) {
            this.pageTitle = "Scholarship Details";
            this.buttons = (this.studentScholarship.status == 'Declined') ? [{ caption: 'Re-apply', disabled: true, id: 'reApplyBtn', class: 'blue', onClick: () => {/*do nothing*/ } }] : [{ caption: 'Withdraw', disabled: true, id: 'withdrawBtn', class: 'yellow', onClick: () => {/*do nothing*/ } }];
        }
        else {
            this.pageTitle = "Student Scholarship Request";
        }

        this.updateMode = (navParams.get('updateMode') === true);
        this.hideHeader = navParams.get('hideHeader') === true;
    }

    popView = (): void => {
        this.messageModalShown = false;
        this.nav.pop();
    }

    approveDecline(action: string) {
        this.commentsChanged();

        //If invalid state of comments field - do not continue
        if (this.isInvalidComments) {
            return;
        }

        let approvedOrDeclined;
        this.messageServices.getMessage(action == this.approve ? Constants.MESSAGE_APPROVED : Constants.MESSAGE_DECLINED, (resultMessage: string) => { approvedOrDeclined = resultMessage });

        this.requestSubmitted = true;
        this.memberServices.approveDeclineStudentScholarship(this.member.shortName, this.studentScholarship.contractAddress, action, this.comments).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        this.showModal(Constants.MESSAGE_STUDENT_SCHOLARSHIP_REQUEST_APPROVED, this.popView, [approvedOrDeclined]);
                        this.studentScholarship.viewed = ViewedTypeEnum.SUBMITTED; //update the applied scholarships component
                        break;

                    default:
                        this.showModal(Constants.MESSAGE_UNKNOWN_ERROR, this.popView);
                        console.error('Failed to get Aprove/Decline student scholarship data. Error code: ' + res.code);
                }
            },
            err => {
                this.showModal(Constants.MESSAGE_UNKNOWN_ERROR, this.popView);
                console.error('Failed to get Aprove/Decline student scholarship data');
                console.error(err);
            }
        )
    }

    commentsChanged() {
        this.isInvalidComments = (this.comments.trim().length === 0 || this.comments.length > 500);
    }

    showModal(messageId: string, callbackFunction: Function, messageParameters?: [string]) {
        this.messageServices.getMessage(messageId, (resultMessage: string) => { this.messageContent = resultMessage }, undefined, messageParameters);
        this.actions = ModalMessage.getModalActionsOKPattern(callbackFunction); //get actions for modal message screen
        this.messageModalShown = true; //show the modal
    }

}