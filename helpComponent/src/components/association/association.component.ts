import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MemberInterface } from '../interfaces/member.interface';
import { NavParams, NavController } from 'ionic-angular';
import { ModalMessage, ActionsInterface } from '../modalMessage/modalMessage.component';
import { MemberServices } from '../../services/member.services';
import { MessageServices } from '../../services/message.services';
import { Constants } from '../../utils/constans';
import { PageService } from '../pageHeader/page.service';

declare var $: any;

@Component({
    selector: 'association',
    templateUrl: 'association.component.html',
    styles: [`.ui.segment.partial {width: 50em;}`],
})
export class Association implements OnInit, AfterViewInit {
    pageTitle: string;

    member: MemberInterface;

    //modal message related
    actions: ActionsInterface = null;
    messageContent: string = null;
    messageModalShown: boolean = false;

    categories;
    currentCategories = [];
    originCategories = [];
    faculties;
    goverments;
    currentGovermentMemberId: string;

    ngOnInit() {
        this.loadGoverments();
        this.loadFaculties();
    }

    constructor(private nav: NavController, private navParams: NavParams, private memberServices: MemberServices, private messageServices: MessageServices, private pageService: PageService) {
        this.member = this.pageService.getMember();
        this.pageTitle = this.member.fullName + " - Faculty/GOV Category Association";
    }

    onClose() {
        this.nav.popToRoot();
    }

    onPublish() {
        if (JSON.stringify(this.originCategories) != JSON.stringify(this.currentCategories)) {
            let dataToSend: Array<{faculty: {code: string, name: string}, category: {code: string, name: string}}>= [];

            for (var i = 0; i < this.currentCategories.length; i++) {
                dataToSend.push({ faculty: this.faculties[i], category:this.currentCategories[i] == -1? {code: -1}: this.categories[this.currentCategories[i]]});
            }
            this.memberServices.publishAssociations(this.member.shortName, this.currentGovermentMemberId, dataToSend).subscribe(
                res => {
                    switch (res.code) {
                        case 0:
                            this.showModal(Constants.MESSAGE_SUCCESSFULLY_CHANGED_ASSOCIATIONS, this.navBackCallback);
                            break;

                        default:
                            console.error('Association: Error occured on publish. Error code: ' + res.code);
                            console.error(res);
                    }
                },
                err => {
                    console.error('Association: Error occured on publish');
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

    ngAfterViewInit() {
        //initialize the search dropdown list
        setTimeout(() => { $('.goverment').dropdown(); 1 });
        setTimeout(() => { $('.categories').dropdown(); 1 });
    }

    onGovChange(govMemberId: string) {
        this.loadCategories(govMemberId);
        this.loadAssociations(govMemberId);

    }

    loadGoverments() {
        this.memberServices.getEIGovorments(this.member.shortName).subscribe(
            res => {
                //console.log(res);
                switch (res.code) {
                    case 0:
                        this.goverments = res.data;
                        if (this.goverments && this.goverments.length > 0) {
                            this.currentGovermentMemberId = this.goverments[0].shortName;
                            setTimeout(() => { $('.goverment').dropdown(); });
                            this.onGovChange(this.currentGovermentMemberId);
                        }

                        break;

                    case 590:
                        //You must be registered before you can do that!
                        this.showModal(Constants.MESSAGE_MUST_BE_REGISTERED, this.navBackCallback, [this.member.fullName]);
                        break;

                    case 586:
                        //You must create an account before you can do that!
                        this.showModal(Constants.MESSAGE_MUST_CREATE_ACCT, this.navBackCallback, [this.member.fullName]);
                        break;

                    default:
                        console.error('Association: Error occured on getFaculties. Error code: ' + res.code);
                }
            },
            err => {
                console.error('Association: Error occured on getFaculties');
                console.error(err);
            });
    }

    loadFaculties() {
        this.memberServices.getFaculties(this.member.shortName).subscribe(
            res => {
                //console.log("faculties: " + res);
                switch (res.code) {
                    case 0:
                        this.faculties = res.current_data;
                        break;

                    case 590:
                        //You must be registered before you can do that!
                        this.showModal(Constants.MESSAGE_MUST_BE_REGISTERED, this.navBackCallback, [this.member.fullName]);
                        break;

                    case 586:
                        //You must create an account before you can do that!
                        this.showModal(Constants.MESSAGE_MUST_CREATE_ACCT, this.navBackCallback, [this.member.fullName]);
                        break;

                    default:
                        console.error('Association: Error occured on getFaculties. Error code: ' + res.code);
                }
            },
            err => {
                console.error('Association: Error occured on getFaculties');
                console.error(err);
            });
    }

    loadCategories(govMemberId: string) {
        this.memberServices.getCategories(govMemberId).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        //console.log(res)
                        this.categories = res.current_data;
                        setTimeout(() => { $('.categories').dropdown(); });
                        break;

                    case 590:
                        //You must be registered before you can do that!
                        this.showModal(Constants.MESSAGE_MUST_BE_REGISTERED, this.navBackCallback, [this.member.fullName]);
                        break;

                    case 586:
                        //You must create an account before you can do that!
                        this.showModal(Constants.MESSAGE_MUST_CREATE_ACCT, this.navBackCallback, [this.member.fullName]);
                        break;

                    default:
                        console.error('Assosiations: Error occured on getCategories. Error code: ' + res.code);
                }
            },
            err => {
                console.error('Assosiations: Error occured on getCategories');
                console.error(err);
            });
    }

    loadAssociations(governmentMemberId: string) {
        this.memberServices.getAssociations(this.member.shortName, governmentMemberId).subscribe(
            res => {
                //console.log(res);
                switch (res.code) {
                    case 0:
                        console.log(res);
                        for (var i = 0; i < this.faculties.length; i++) {
                            this.currentCategories[i] = res.data[i] ? res.data[i].category.code : -1;
                            this.originCategories[i] = res.data[i] ? res.data[i].category.code : -1;
                        }
                        setTimeout(() => { $('.categories').dropdown({ placeholder: false }); });
                        break;

                    case 590:
                        //You must be registered before you can do that!
                        this.showModal(Constants.MESSAGE_MUST_BE_REGISTERED, this.navBackCallback, [this.member.fullName]);
                        break;

                    case 586:
                        //You must create an account before you can do that!
                        this.showModal(Constants.MESSAGE_MUST_CREATE_ACCT, this.navBackCallback, [this.member.fullName]);
                        break;

                    default:
                        console.error('Assosiations: Error occured on getAssociations. Error code: ' + res.code);
                }
            },
            err => {
                console.error('Assosiations: Error occured on getAssociations');
                console.error(err);
            });
    }

}