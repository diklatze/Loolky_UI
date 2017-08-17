import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MemberInterface, MemberSendFundsInterface } from '../interfaces/member.interface';
import { NavController } from 'ionic-angular';
import { MemberServices } from '../../services/member.services';
import { PageService } from '../pageHeader/page.service';
import { ModalMessage, ActionsInterface } from '../modalMessage/modalMessage.component';
import { MessageServices } from '../../services/message.services';
import { Constants } from '../../utils/constans';
import { markAllFormControlsAsTouched, filterDigitsOnly } from '../../utils/utils';
import { CustomValidators } from '../../utils/customValidators';

declare var $: any;

@Component({
    selector: 'memberAccountSendFunds',
    templateUrl: 'memberAccountSendFunds.component.html',
})

export class MemberAccountSendFunds implements OnInit {

    sendFundsForm: FormGroup;
    pageTitle: string;
    member: MemberInterface;
    messages = null;

    certifiedMembers: MemberSendFundsInterface[];

    toMember: string;
    toAccount: string;
    amount: string;

    //modal message related
    actions: ActionsInterface = null;
    messageContent: string = null;
    messageModalShown: boolean = false;
    validationErrorMessage: string;

    filterDigitsOnly: Function = filterDigitsOnly; //required in order to use it in html template

    constructor(private formBuilder: FormBuilder, private memberServices: MemberServices, private messageServices: MessageServices,
        private navController: NavController, private pageService: PageService) {

        this.member = this.pageService.getMember();
        this.pageTitle = this.member.fullName + " - Send Funds ";

        this.memberServices.getSendFundsDetails(this.member.shortName ).subscribe(
            res => {
                this.actions = ModalMessage.getModalActionsOKPattern(this.okButtonCallback); //get actions for modal message screen

                switch (res.code) {
                    case 0:
                        break;                    
                       
                    case 586:
                        //You must create an account before you can do that!
                        this.messageServices.getMessage(Constants.MESSAGE_MUST_CREATE_ACCT, (resultMessage: string) => { this.messageContent = resultMessage }, undefined, [this.member.fullName]);
                        this.messageModalShown = true; //show the modal  
                        break;

                     case 590:
                        //You must be registered before you can do that!
                        this.messageServices.getMessage(Constants.MESSAGE_MUST_BE_REGISTERED, (resultMessage: string) => { this.messageContent = resultMessage }, undefined, [this.member.fullName]);
                        this.messageModalShown = true; //show the modal                          
                        break;   
                    
                }
            },
            err => {
                console.error(err);
            });


        this.messageServices.getMessage(Constants.MESSAGE_PLEASE_TYPE_VALID, (resultMessage: string) => { this.validationErrorMessage = resultMessage });
    }

    ngOnInit() {
        $('#toMemberCombo').dropdown();
        this.sendFundsForm = this.formBuilder.group({
            'toMember': new FormControl({}, Validators.required),
            'toAccount': new FormControl({ disabled: true }),
            'amount': new FormControl({}, Validators.compose([Validators.required, CustomValidators.emptyOrPositiveIntegerValidator]))
        });
        this.loadCertifiedMembers();
    }

    loadCertifiedMembers() {
        this.memberServices.getCertifiedMembers(this.member.shortName).subscribe(
            res => {
                switch (res.code) {
                    case 0:
                        this.certifiedMembers = res.certifiedMembers;
                        break;
                    default:
                        console.error('Error occured on Get certified member for send funds. Error code: ' + res.code);
                }
            },
            err => {
                console.error('Error occured on Get certified member for send funds');
                console.error(err);
            });
    }


    isInvalid(fieldName: string): boolean {
        return (this.sendFundsForm.controls[fieldName].touched && !this.sendFundsForm.controls[fieldName].valid);
    }

    onMemberChange(memberId: string) {
        for (var i = 0; i < this.certifiedMembers.length; i++) {
            if (this.certifiedMembers[i].shortName == memberId) {
                this.toAccount = this.certifiedMembers[i].account;
                break;
            }
        }
    }

    private okButtonCallback = (): void => {
        this.messageModalShown = false; //close the modal and remove from DOM
        this.navController.popToRoot();
    }

    onSend(val: any) {
        this.messages = null;
        if (this.sendFundsForm.valid) {
            let req = { etherAmount: this.amount };
            this.memberServices.sendfunds(this.member.shortName, this.toMember, req).subscribe(
                res => {
                    if (res.code == "0") {
                        this.messageServices.getMessage(Constants.MESSAGE_SEND_FUND_SUCCESS, (resultMessage: string) => { this.messageContent = resultMessage });
                        this.actions = ModalMessage.getModalActionsOKPattern(this.okButtonCallback); //get actions for modal message screen
                        this.messageModalShown = true; //show the modal
                    }
                    else {
                        this.messages = res.errors;

                    }
                },
                err => {
                    this.messages = [{ "fieldName": "non_field", "errorCode": "", "errorDescription": err }];

                });
        }
        else {
            markAllFormControlsAsTouched(this.sendFundsForm);
        }
    }

}