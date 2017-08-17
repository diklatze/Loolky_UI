import { Component, OnInit, ViewChild } from '@angular/core';
import { MemberInterface } from '../interfaces/member.interface';
import { NavParams, NavController } from 'ionic-angular';
import { ListManage, } from '../listManage/listManage.component';
import { ModeType, InputListDataInterface, OutputListDataInterface, OutputItemInterface } from '../interfaces/listManage.interface';
import { ModalMessage, ActionsInterface } from '../modalMessage/modalMessage.component';
import { MemberServices } from '../../services/member.services';
import { MessageServices } from '../../services/message.services';
import { Constants } from '../../utils/constans';
import { PageService } from '../pageHeader/page.service';


export interface PublishCertifiedEiInterface {
    certifiedEis: string[];
}

@Component({
    selector: 'certifiedEIs',
    templateUrl: 'certifiedEI.component.html',
    styles: [`.ui.segment.partial {width: 50em;}`],
})
export class CertifiedEI implements OnInit {
    govermentName: string;
    member: MemberInterface;
    pageTitle: string;

    //modal message related
    actions: ActionsInterface = null;
    messageContent: string = null;
    messageModalShown: boolean = false;

    //listManage variables
    @ViewChild(ListManage)
    listManageViewChild: ListManage;
    listTitle: string;
    listNoDataMessage: string;
    listMode: ModeType = ModeType.LIST_OF_VALUES;
    listData: InputListDataInterface = { current_data: null };

    ngOnInit() {
        //"Certified Educational Institutions"
        this.messageServices.getMessage(Constants.LABEL_CERTIFIED_EI, (resultMessage: string) => { this.listTitle = resultMessage });
        //"Certified Educational Institutions have not been defined yet. Click 'Add' to start"
        this.messageServices.getMessage(Constants.MESSAGE_CERTIFIED_EI_NOT_DEFINED, (resultMessage: string) => { this.listNoDataMessage = resultMessage });

        this.memberServices.getCertifiedEIs(this.member.shortName).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        this.listData = res.body;
                        break;

                    case 590:
                        //You must be registered before you can do that!
                        this.showModal(Constants.MESSAGE_MUST_BE_REGISTERED, this.navBackCallback, [this.govermentName]);
                        break;

                    case 586:
                        //You must create an account before you can do that!
                        this.showModal(Constants.MESSAGE_MUST_CREATE_ACCT, this.navBackCallback, [this.govermentName]);
                        break;

                    default:
                        console.error('CertifiedIE: Error occured on getCertifiedEIs. Error code: ' + res.code);
                }
            },
            err => {
                console.error('CertifiedIE: Error occured on getCertifiedEIs');
                console.error(err);
            });

    }

    constructor(private nav: NavController, private navParams: NavParams, private memberServices: MemberServices, private messageServices: MessageServices, private pageService: PageService) {
        this.govermentName = this.pageService.getMember().fullName;
        this.member = this.pageService.getMember();
        this.pageTitle = this.govermentName + " - Add Certified EIs";
    }

    onClose() {
        this.nav.popToRoot();
    }

    onPublish() {
        if (this.listManageViewChild.isDirty()) {
            let listOutputFromListManage: OutputListDataInterface = this.listManageViewChild.getList();
            let listPublishCertifiedEis: PublishCertifiedEiInterface = <PublishCertifiedEiInterface>{};
            listPublishCertifiedEis.certifiedEis = [];

            //Create listPublishCertifiedEis and filter out 'DELETED' values
            listOutputFromListManage.data.forEach(element => {
                if (element.name != ListManage.DELETED) {
                    listPublishCertifiedEis.certifiedEis.push(element.name);
                }
            });

            this.memberServices.publishCertifiedEIs(this.member.shortName, listPublishCertifiedEis).subscribe(
                res => {
                    switch (res.code) {
                        case 0:
                            //Successfully changed certified educational institutions
                            this.showModal(Constants.MESSAGE_SUCCESSFULLY_CHANGED_CERTIFIED_EI, this.navBackCallback);
                            break;

                        default:
                            console.error('CertifiedIE: Error occured on publish. Error code: ' + res.code);
                            console.error(res);
                    }
                },
                err => {
                    console.error('CertifiedIE: Error occured on publish');
                    console.error(err);
                });
        }
        else {
            this.showModal(Constants.MESSAGE_NO_CHANGES_WERE_DONE, this.closeModalCallback);
        }

    }

    showModal(messageId: string, callbackFunction: Function, messageParameters?: [string]) {
        this.messageServices.getMessage(messageId, (resultMessage: string) => { this.messageContent = resultMessage }, undefined, messageParameters);
        this.actions = ModalMessage.getModalActionsOKPattern(callbackFunction); //get actions for modal message screen
        this.messageModalShown = true; //show the modal
    }

    private navBackCallback = (): void => {
        this.messageModalShown = false; //close the modal and remove from DOM
        this.nav.popToRoot();
    }

    private closeModalCallback = (): void => {
        this.messageModalShown = false; //close the modal and remove from DOM
    }

}